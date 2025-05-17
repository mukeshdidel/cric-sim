import { useState, useEffect} from 'react';
import { useParams,NavLink, useNavigate } from "react-router-dom";
import './teams.css'

export default function Team(){
    const {id} = useParams();
    const  [AllSeasons, setAllSeasons] = useState([]);
    const [players, setPlayers] = useState([]);

    useEffect(()=>{
        async function getTeamData(){
            try {
            const newSeason = await fetch(`http://localhost:5000/seasons`);
            const seasons = await newSeason.json();
/*             console.log(seasons[0].season); */
            setAllSeasons(seasons);

                const response = await fetch(`http://localhost:5000/teams-info/${id}`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    }, 
                    body: JSON.stringify({season: seasons[0].season})  
                });
                const data = await response.json();

                setPlayers(data);



            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        }
        getTeamData();
    },[])

    async function handleOnChangeSeason(e){
        try{ 
           const newSeason = e.target.value;
           const response = await fetch(`http://localhost:5000/teams-info/${id}`, {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({season : newSeason})
            }); 
           
           const stats = await response.json(); 
           setPlayers(stats);

        }catch (error) {
           console.error('Error fetching teams:', error);
        } 
    } 

    return (
        <>
        <h1>{}</h1>
        <select name="" onChange={(e)=>handleOnChangeSeason(e)}>
            {AllSeasons.map((season) =>{
                return <option key={season.season} value={season.season}>season {season.season}</option>
            })}
        </select>
        <div className='team'>
            <table className='team-player-stats'>
                <thead className='table-head'>
                    <tr>
                        
                        <th>player</th>
                        <th>runs</th>
                        <th>strike rate</th>
                        <th>sixes</th>
                        <th>fours</th>                            
                        <th>wickets</th>
                        <th>economy</th>
                        <th>MVP points</th>

                    </tr>
                </thead>
                <tbody className='table-body'>
                    {players.map((stat, index)=> (
                        <tr key={index}>
                            <td >{stat.player_name}
                            </td>
                            <td>{stat.runs}</td>
                            <td>
                                {isNaN(Math.floor((stat.runs/stat.balls_f)*100)) ? 0 : Math.floor((stat.runs/stat.balls_f)*100) }
                            </td>
                            <td>{stat.sixes}</td>
                            <td>{stat.fours}</td>
                            <td>{stat.wickets}</td>
                            <td>{isNaN(((stat.runs_c)/(stat.balls_b/6)).toFixed(2)) ? 0 : ((stat.runs_c)/(stat.balls_b/6)).toFixed(2) }</td>
                            <td>{stat.mvp_points}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
}