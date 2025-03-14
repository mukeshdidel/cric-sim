

export default function Score({score}){

    let ScoreComponent = <></>;

    if(score.isFirstInning === true){
        ScoreComponent = (
        <>
            <p>{score.totalRuns}/{score.totalWickets}</p>
            <p>{Math.floor(score.totalBalls/6)}.{score.totalBalls%6}</p>
        </>
        );
    }
    else{
        ScoreComponent = (
        <>
            <p>{score.totalRuns}/{score.totalWickets}</p>
            <p>{Math.floor(score.totalBalls/6)}.{score.totalBalls%6}</p>
            <p>target: {score.target}</p>                    
        </>);
    }


    return (
        <>
            <div className='match-score'>
                {ScoreComponent}
            </div>
        </>
    );
}

