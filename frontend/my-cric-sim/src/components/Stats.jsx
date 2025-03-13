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





    return(
        <div className="table-div">
            <table>
                <thead className='table-head'>
                    <tr>
                        <th>player</th>
                        <th>runs</th>
                        <th>bowls played</th>
                        <th>sixes</th>
                        <th>fours</th>
                        <th>wickets</th>
                        <th>bowls bowled</th>
                    </tr>
                </thead>
                <tbody className='table-body'>
                    {stats.map(stat=> (
                        <tr key={stat.stat_id}>
                            <td>{stat.player_name}</td>
                            <td>{stat.runs}</td>
                            <td>{stat.b_faced}</td>
                            <td>{stat.six}</td>
                            <td>{stat.four}</td>
                            <td>{stat.wicket}</td>
                            <td>{stat.b_bowled}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}