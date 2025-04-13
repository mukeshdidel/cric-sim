

export default function ScoreCard(props){
    const batingTeam = props.batingTeam;
    const bowlingTeam = props.bowlingTeam;

    const playingBatingTeam = batingTeam?.filter(player => player.batStatus != 0)
    const yetToBat = batingTeam?.filter(player => player.batStatus == 0);

    const playingBowlingTeam = bowlingTeam?.filter(player => player.overs > 0);

    return (
        <>
            <div className='team-scorecard'>            
                <table>
                    <thead className='scorecard-head'>
                        <tr>
                            <th>Batters</th>
                            <th>runs</th>
                            <th>balls faced</th>
                            <th>sixes</th>
                            <th>fours</th>
                            <th>Strike rate</th>
                        </tr>
                    </thead>
                    <tbody className='scorecard-body'>
                        {playingBatingTeam?.map(player => (
                            <tr key={player.player_id}>
                                <td>{player.player_name}</td>
                                <td>{player.runs}</td>
                                <td>{player.balls_f}</td>
                                <td>{player.sixes}</td>
                                <td>{player.fours}</td>  
                                <td>{isNaN(Math.floor((player.runs/player.balls_f)*100)) ? 0 : Math.floor((player.runs/player.balls_f)*100) }</td>
                            </tr>
                        ))}
                    </tbody>
                </table> 

                <div className="yet-to-bat">
                    <h3>Yet to bat</h3>
                    <p>
                        {
                            yetToBat?.map((player) => (<span> ● {player.player_name}</span>))
                        }
                    </p>
                </div>


                <table>
                    <thead className='scorecard-head'>
                        <tr>
                            <th>Bowlers</th>
                            <th>overs</th>
                            <th>runs</th>
                            <th>dots</th>
                            <th>wickets</th>
                            <th>economy</th>
                        </tr>
                    </thead>
                    <tbody className='scorecard-body'>
                        {playingBowlingTeam?.map(player => (
                            <tr key={player.player_id}>
                                <td>{player.player_name}</td>                                
                                <td>{Math.floor(player.balls_b/6)}.{player.balls_b % 6}</td>
                                <td>{player.runs_c}</td>
                                <td>{player.dots_b}</td>
                                <td>{player.wickets}</td>
                                <td>{((player.runs_c)/(player.balls_b/6)).toFixed(2)}</td>  
                            </tr>
                        ))}
                    </tbody>
                </table> 

            </div>
        </>
    );
}