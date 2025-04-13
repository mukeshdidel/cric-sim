import { useState, useEffect } from 'react'

export default function Stats(){

    const [stats, setStats] = useState([]);
    const  [AllSeasons, setAllSeasons] = useState([]);

    useEffect(() => {
            async function getPlayerStats() {

            const newSeason = await fetch(`http://localhost:5000/seasons`);
            const seasons = await newSeason.json();
/*             console.log(seasons[0].season); */
            setAllSeasons(seasons);

            const response = await fetch('http://localhost:5000/stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({season: seasons[0].season})
            });
            
            const stats = await response.json();
            
            /* console.log(stats); */  // Teams fetched from server are logged to console for debugging.
            setStats(stats);
        }
        getPlayerStats();
    },[])


    async function handleOnChangeSeason(e){
        try{ 
           const newSeason = e.target.value;
           const response = await fetch('http://localhost:5000/stats', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({season : newSeason})
           }); 
           
           const stats = await response.json();

           /* console.log(stats);  */ 
           setStats(stats);
      }catch (error) {
           console.error('Error fetching teams:', error);
       } 
   } 

    function handleOrderBy(orderBY) {
        setStats(prevStats => {
            const sortedStats = [...prevStats].sort((a, b) => {
                if (orderBY === 'strike_rate') {
                    const srA = a.balls_f === 0 ? 0 : (a.runs / a.balls_f) * 100;
                    const srB = b.balls_f === 0 ? 0 : (b.runs / b.balls_f) * 100;
                    return srB - srA; 
                }
                else if(orderBY === 'economy'){
                    const ecoA = a.balls_b === 0 ? 0 : (a.runs_c)/(a.balls_b/6)
                    const ecoB = b.balls_b === 0 ? 0 : (b.runs_c)/(b.balls_b/6)
                    return ecoB - ecoA;
                } else {
                    return b[orderBY] - a[orderBY]; 
                }
            });


            if (JSON.stringify(sortedStats) === JSON.stringify(prevStats)) {
                sortedStats.reverse();
            }
    
            return sortedStats;
        });
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
                            
                            <th>player</th>
                            <th onClick={()=>handleOrderBy('runs')}>runs</th>
                            <th onClick={()=>handleOrderBy('balls_f')}>bowls played</th>
                            <th onClick={()=>handleOrderBy('strike_rate')}>strike rate</th>
                            <th onClick={()=>handleOrderBy('sixes')}>sixes</th>
                            <th onClick={()=>handleOrderBy('fours')}>fours</th>
                            <th onClick={()=>handleOrderBy('wickets')}>wickets</th>
                            <th onClick={()=>handleOrderBy('balls_b')}>bowls bowled</th>
                            <th onClick={()=>handleOrderBy('runs_c')}>conceded</th>
                            <th onClick={()=>handleOrderBy('dots_b')}>dots</th>
                            <th onClick={()=>handleOrderBy('mvp_points')}>MVP points</th>
                            <th onClick={()=>handleOrderBy('economy')}>economy</th>
                        </tr>
                    </thead>
                    <tbody className='table-body'>
                        {stats.map(stat=> (
                            <tr key={stat.stat_id}>
                                <td >{stat.player_name} <br />    
                                <span>{stat.team_name}</span> 
                                </td>

                                <td>{stat.runs}</td>
                                <td>{stat.balls_f}</td>
                                <td>
                                    {isNaN(Math.floor((stat.runs/stat.balls_f)*100)) ? 0 : Math.floor((stat.runs/stat.balls_f)*100) }
                                </td>
                                <td>{stat.sixes}</td>
                                <td>{stat.fours}</td>
                                <td>{stat.wickets}</td>
                                <td>{stat.balls_b}</td>
                                <td>{stat.runs_c}</td>
                                <td>{stat.dots_b}</td>
                                <td>{stat.mvp_points}</td>
                                <td>{isNaN(((stat.runs_c)/(stat.balls_b/6)).toFixed(2)) ? 0 : ((stat.runs_c)/(stat.balls_b/6)).toFixed(2) }</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}