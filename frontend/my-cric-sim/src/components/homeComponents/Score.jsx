import { useContext } from "react";
import { matchContext } from "./Match";

export default function Score(){

    let ScoreComponent = <></>;
    const {score} = useContext(matchContext);
    if(score.isFirstInning === true){
        ScoreComponent = (
        <>
        
            <div>
                <p className="runs-p">{score.totalRuns}-{score.totalWickets}</p>
                <p>{Math.floor(score.totalBalls/6)}.{score.totalBalls%6}</p>            
            </div>

            <div>
                <p>{score?.batsMan1?.player_name || ""} {score?.batsMan1?.runs} - {score?.batsMan1?.balls_f}</p>
                <p>{score?.batsMan2?.player_name || ""} {score?.batsMan2?.runs} - {score?.batsMan2?.balls_f}</p>
            </div>
            <div>
                <p>Run Rate</p>
                <p>
                    {
                    isNaN((score.totalRuns/score.totalBalls*6).toFixed(2)) ? 0 : (score.totalRuns/score.totalBalls*6).toFixed(2)
                    }
                </p>
            </div>
            <div>
                    <p>{score?.bowler?.player_name}</p>
                    <div className='this-over'>
                        <div>{score?.thisOver?.[0]}</div>
                        <div>{score?.thisOver?.[1]}</div>
                        <div>{score?.thisOver?.[2]}</div>
                        <div>{score?.thisOver?.[3]}</div>
                        <div>{score?.thisOver?.[4]}</div>
                        <div>{score?.thisOver?.[5]}</div>
                    </div>
                </div>
        </>
        );
    }
    else{

        ScoreComponent = (
            <>
                <div>
                    <p className="runs-p">{score.totalRuns}/{score.totalWickets}</p>
                    <p>{Math.floor(score.totalBalls/6)}.{score.totalBalls%6}</p>  
                </div>

                <div className='score-batsman-div'>
                    <p>{score?.batsMan1?.player_name || ""} {score?.batsMan1?.runs} - {score?.batsMan1?.balls_f}</p>
                    <p>{score?.batsMan2?.player_name || ""} {score?.batsMan2?.runs} - {score?.batsMan2?.balls_f}</p>
                </div>
                <div>
                    <p>{score.target - score.totalRuns} <span>off {120 - score.totalBalls} </span></p>
                    <p>target: {score.target}</p> 
                </div>
                <div>
                    <p>{score?.bowler?.player_name}</p>
                    <div className='this-over'>
                        <div>{score?.thisOver?.[0]}</div>
                        <div>{score?.thisOver?.[1]}</div>
                        <div>{score?.thisOver?.[2]}</div>
                        <div>{score?.thisOver?.[3]}</div>
                        <div>{score?.thisOver?.[4]}</div>
                        <div>{score?.thisOver?.[5]}</div>
                    </div>
                </div>

            </>
        );
    }


    return (
        <>
            <div className='match-score'>
                {ScoreComponent}
            </div>
        </>
    );
}

