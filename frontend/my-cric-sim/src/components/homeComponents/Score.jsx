import { useContext } from "react";
import { matchContext } from "./Match";

export default function Score(){

    let ScoreComponent = <></>;
    const {score} = useContext(matchContext);
    if(score.isFirstInning === true){
        ScoreComponent = (
        <>
            <p className="runs-p">{score.totalRuns}-{score.totalWickets}</p>
            <p>{Math.floor(score.totalBalls/6)}.{score.totalBalls%6}</p>
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
            
        </>
        );
    }
    else{

        ScoreComponent = (
            <>
                <p className="runs-p">{score.totalRuns}/{score.totalWickets}</p>
                <p>{Math.floor(score.totalBalls/6)}.{score.totalBalls%6}</p>
                <div className='score-batsman-div'>
                    <p>{score?.batsMan1?.player_name || ""} {score?.batsMan1?.runs} - {score?.batsMan1?.balls_f}</p>
                    <p>{score?.batsMan2?.player_name || ""} {score?.batsMan2?.runs} - {score?.batsMan2?.balls_f}</p>
                </div>
                <div>
                    <p>need {score.target - score.totalRuns} from {120 - score.totalBalls} balls</p>
                    <p>target: {score.target}</p> 
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

