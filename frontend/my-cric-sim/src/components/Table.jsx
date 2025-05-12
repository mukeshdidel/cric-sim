import { useState, useEffect } from 'react'

export default function Table(){

    const [table, setTable] = useState([]);
    const  [AllSeasons, setAllSeasons] = useState([]);

    useEffect(() => {
            async function getTable() {
            const newSeason = await fetch(`http://localhost:5000/seasons`);
            const seasons = await newSeason.json();
            /* console.log(seasons[0].season); */
            setAllSeasons(seasons);

            const response = await fetch('http://localhost:5000/table', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({season: seasons[0].season})
            }); 
            
            const teams = await response.json();

            /* console.log(teams); */  // Teams fetched from server are logged to console for debugging.
            setTable(teams);
            console.log(teams);
        }
        getTable();
    },[])

    async function handleOnChangeSeason(e){
         try{ 
            const newSeason = e.target.value;
            const response = await fetch('http://localhost:5000/table', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({season : newSeason})
            }); 
            
            const teams = await response.json();
 
            /* console.log(teams); */  // Teams fetched from server are logged to console for debugging.
            setTable(teams);
       }catch (error) {
            console.error('Error fetching teams:', error);
        } 
    } 

    return(
        <>
            <select name="" onChange={(e)=>handleOnChangeSeason(e)}>
                {AllSeasons.map((season) =>{
                    return <option key={season.season} value={season.season}>season {season.season}</option>
                })}
            </select>
            <div className="table-div">
                <table>
                    <thead className='table-head'>
                        <tr>
                            <th>pos</th>
                            <th>Team</th>
                            <th>Matches</th>
                            <th>Wins</th>
                            <th>Losses</th>
                            <th>Draws</th>
                            <th>Points</th>
                            <th>NRR</th>
                        </tr>
                    </thead>
                    <tbody className='table-body'>
                        {table.map((team, index) => (
                            <>
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{team.team_name} {team.isChampion === 1 ? "🏆" : ""} </td>
                                <td>{team.matches}</td>
                                <td>{team.wins}</td>
                                <td>{team.losses}</td>
                                <td>{team.draws}</td>
                                <td>{team.points}</td>
                                <td>{team.nrr}</td>
                            </tr>
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}