import { useState, useEffect } from 'react'

export default function Stats(){

    const [stats, setStats] = useState([]);

    useEffect(() => {
            async function getPlayerStats() {
            const response = await fetch(`http://localhost:5000/stats`);
            const stats = await response.json();
            
            console.log(stats);  // Teams fetched from server are logged to console for debugging.
            setStats(stats);
        }
        getPlayerStats();
    },[])

    function handleOrderBy(orderBY) {
        setStats(prevStats => {
            const sortedStats = [...prevStats].sort((b, a) => {
                return a[orderBY] - b[orderBY];  
            });

    
            // ascending and descending
            if (JSON.stringify(sortedStats) === JSON.stringify(prevStats)) {
                sortedStats.reverse();
            }
    
            return sortedStats;
        });
    }
    


    return(
        <div className="table-div">
            <table>
                <thead className='table-head'>
                    <tr>
                        
                        <th>player</th>
                        <th onClick={()=>handleOrderBy('runs')}>runs</th>
                        <th onClick={()=>handleOrderBy('b_faced')}>bowls played</th>
                        <th onClick={()=>handleOrderBy('six')}>sixes</th>
                        <th onClick={()=>handleOrderBy('four')}>fours</th>
                        <th onClick={()=>handleOrderBy('wickets')}>wickets</th>
                        <th onClick={()=>handleOrderBy('b_bowled')}>bowls bowled</th>
                        <th onClick={()=>handleOrderBy('r_conceded')}>conceded</th>
                    </tr>
                </thead>
                <tbody className='table-body'>
                    {stats.map(stat=> (
                        <tr key={stat.stat_id}>
                            <td >{stat.player_name} <br />    
                               <span>{stat.team_name}</span> 
                            </td>
                            <td>{stat.runs}</td>
                            <td>{stat.b_faced}</td>
                            <td>{stat.six}</td>
                            <td>{stat.four}</td>
                            <td>{stat.wickets}</td>
                            <td>{stat.b_bowled}</td>
                            <td>{stat.r_conceded}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}