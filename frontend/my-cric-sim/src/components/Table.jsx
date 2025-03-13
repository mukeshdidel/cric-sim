import { useState, useEffect } from 'react'

export default function Table(){

    const [table, setTable] = useState([]);

    useEffect(() => {
            async function getTable() {
            const response = await fetch(`http://localhost:5000/table`);
            const teams = await response.json();
            console.log(teams);  // Teams fetched from server are logged to console for debugging.
            setTable(teams);
        }
        getTable();
    },[])





    return(
        <div className="table-div">
            <table>
                <thead className='table-head'>
                    <tr>
                        <th>Team</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>Draws</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody className='table-body'>
                    {table.map(team => (
                        <tr key={team.team_id}>
                            <td>{team.team_name}</td>
                            <td>{team.wins}</td>
                            <td>{team.losses}</td>
                            <td>{team.draws}</td>
                            <td>{team.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}