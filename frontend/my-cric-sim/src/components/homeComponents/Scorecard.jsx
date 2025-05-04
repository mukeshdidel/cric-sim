import { useContext, useState } from "react";
import { matchContext } from "./Match";


export default function ScoreCard(){

    const [isFirstInning, setIsFirstInning] = useState(true)

    const {team1Players, team2Players} = useContext(matchContext);

    let playingBatingTeam;
    let yetToBat;
    let playingBowlingTeam;

    if(isFirstInning){
       playingBatingTeam = team1Players?.filter(player => player.batStatus != 0)
       yetToBat = team1Players?.filter(player => player.batStatus == 0);
       playingBowlingTeam = team2Players?.filter(player => player.overs > 0)
    }
    else{
        playingBatingTeam = team2Players?.filter(player => player.batStatus != 0)
        yetToBat = team2Players?.filter(player => player.batStatus == 0);  
        playingBowlingTeam = team1Players?.filter(player => player.overs > 0)
    }

    return (
        <>
            <div className='team-scorecard'>  
                <div>
                    <button onClick={()=>{setIsFirstInning(x => !x)}}>switch team</button>
                </div>          
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
                    <p >
                        {
                            yetToBat?.map((player) => (<span key={player.player_id}> ● {player.player_name}</span>))
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