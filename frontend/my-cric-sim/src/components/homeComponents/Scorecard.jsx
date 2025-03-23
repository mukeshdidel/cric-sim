

export default function ScoreCard({teamPlayers}){
    const onStrike = '🏏*';
    const nonStrike = '🏏'; 
    return (
        <>
            <div className='team-scorecard'>            
                <table>
                    <thead className='scorecard-head'>
                        <tr>
                            <th>player</th>
                            <th>runs</th>
                            <th>b_faced</th>
                            <th>six</th>
                            <th>four</th>
                            <th>wickets</th>
                            <th>b_bowled</th>
                            <th>conceded</th>
                        </tr>
                    </thead>
                    <tbody className='scorecard-body'>
                        {teamPlayers.map(player => (
                            <tr key={player.player_id}>
                                <td>{player.player_name} {player.batStatus===1 && onStrike }{player.batStatus===2 && nonStrike }</td>
                                <td>{player.runs}</td>
                                <td>{player.b_faced}</td>
                                <td>{player.six}</td>
                                <td>{player.four}</td>
                                <td>{player.wickets}</td>
                                <td>{player.b_bowled}</td>
                                <td>{player.r_conceded}</td>  
                            </tr>
                        ))}
                    </tbody>
                </table> 

            </div>
        </>
    );
}