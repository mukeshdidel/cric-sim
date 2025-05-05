const waitFor = async (conditionFn, checkInterval = 50) => {
    while (!conditionFn()) {
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
  };

 export default async function SimInning(battingTeam,bowlingTeam,setBattingTeamPlayers,setbowlingTeamPlayers, score , setScore, matchSpeedRef, setBallData, isAnimationDone , ballEvent) {


    

    let s = 0; // striker's index
    let ns = 1; // non strikers's index
    let np = 2; // next player's index
    let b = -1; // bowler's index
    let totalRuns = 0;
    let totalWickets = 0;
    let totalBalls = 1;



    battingTeam = battingTeam.map(player => ({ ...player }));
    bowlingTeam = bowlingTeam.map(player => ({ ...player }));
 
    battingTeam[s].batStatus = 1;
    battingTeam[ns].batStatus = 2;

    let newScore = {
        ...score,
        batsMan1: battingTeam[s],
        batsMan2: battingTeam[ns],
        bowler: bowlingTeam[b],
        batsMan1Runs: 0,
        batsMan2Runs: 0
    };

    let noOfbowlers = 0;

    for (let i = 0 ; i < bowlingTeam.length; i++ ){
        if(bowlingTeam[i].bowl_rating>=60){
            noOfbowlers++;
        }
    }

    const sleep = async () => {
        let speed = matchSpeedRef.current; 
        await new Promise(resolve => setTimeout(resolve, speed*100)); 
    };


    for(let i =0 ; i<20;i++){
        b = selectBaller(bowlingTeam , b, i, noOfbowlers); 
        bowlingTeam[b]= {
            ...bowlingTeam[b],
            overs: bowlingTeam[b].overs + 1,
        }

        
        for(let j = 0 ; j<6;j++){
            

            setBallData(Date.now())
            setScore(newScore);

            await waitFor(() => isAnimationDone.current === true);
            isAnimationDone.current = false;


            battingTeam[s].batStatus = 1;
            battingTeam[ns].batStatus = 2;
            setBattingTeamPlayers(battingTeam);
            

            let x;
/*             do{
                x = BallEventCalculator(battingTeam[s],bowlingTeam[b])  // a random number for next ball event
                if(x===5){ // 5 for wide
                    totalRuns++;
                    bowlingTeam[b] ={
                        ...bowlingTeam[b],
                        runs_c : bowlingTeam[b].runs_c + 1,
                        extras : bowlingTeam[b].extras + 1
                    }
                    setbowlingTeamPlayers(bowlingTeam); 
                }   
            }while(x===5); */

            x = ballEvent.current

            if(x===0 || x===1|| x===2|| x===3 || x===4 || x===6){
                totalRuns += x;                
                totalBalls = 6*i + (j+1);
                battingTeam[s]= {
                    ...battingTeam[s],
                    runs: battingTeam[s].runs + x,
                    balls_f: battingTeam[s].balls_f + 1,
                    sixes: x === 6 ? battingTeam[s].sixes + 1 : battingTeam[s].sixes,
                    fours: x === 4 ? battingTeam[s].fours + 1 : battingTeam[s].fours,
                    ones: x === 1 ? battingTeam[s].ones + 1 : battingTeam[s].ones,
                    twos: x === 2 ? battingTeam[s].twos + 1 : battingTeam[s].twos,
                    threes: x === 3 ? battingTeam[s].threes + 1 : battingTeam[s].threes,
                    dots: x === 0 ? battingTeam[s].dots + 1 : battingTeam[s].dots,
                }
                bowlingTeam[b]= {
                    ...bowlingTeam[b],
                    balls_b: bowlingTeam[b].balls_b+ 1,
                    runs_c : bowlingTeam[b].runs_c + x,
                    sixes_c: x === 6 ? bowlingTeam[b].sixes_c + 1 : bowlingTeam[b].sixes_c,
                    fours_c: x === 4 ? bowlingTeam[b].fours_c + 1 : bowlingTeam[b].fours_c,
                    ones_c: x === 1 ? bowlingTeam[b].ones_c + 1 : bowlingTeam[b].ones_c,
                    twos_c: x === 2 ? bowlingTeam[b].twos_c + 1 : bowlingTeam[b].twos_c,
                    threes_c: x === 3 ? bowlingTeam[b].threes_c + 1 : bowlingTeam[b].threes_c,
                    dots_b: x === 0 ? bowlingTeam[b].dots_b + 1 : bowlingTeam[b].dots_b,

                }


                if(x===1||x===3){
                    [s,ns] = [ns,s]
                }

                if(score.isFirstInning === false && totalRuns>= newScore.target){
                    newScore = {
                        ...newScore,
                        totalRuns: totalRuns,
                        totalWickets: totalWickets,
                        totalBalls: totalBalls,
                        batsMan1: battingTeam[s],
                        batsMan2: battingTeam[ns],
                        bowler: bowlingTeam[b]
                    }
                    setScore(newScore);
                    setBattingTeamPlayers(battingTeam);
                    setbowlingTeamPlayers(bowlingTeam); 
                    return [battingTeam, bowlingTeam, newScore] ;
                }
            }
            else if(x===-1){
                battingTeam[s] = { 
                    ...battingTeam[s],
                    balls_f: battingTeam[s].balls_f + 1,
                    batStatus: 3 
                };
                
                bowlingTeam[b]= {
                    ...bowlingTeam[b],
                    balls_b: bowlingTeam[b].balls_b + 1,
                    wickets: bowlingTeam[b].wickets + 1
                }
                
                totalWickets++;
                totalBalls = 6*i + (j+1);
                newScore = {
                    ...newScore,
                    totalRuns: totalRuns,
                    totalWickets: totalWickets,
                    totalBalls: totalBalls,
                    batsMan1: battingTeam[s],
                    batsMan2: battingTeam[ns],
                    bowler: bowlingTeam[b]
                }
                    
                setScore(newScore);                            
                    
                if(totalWickets === 10){              
                    setScore(newScore);               
                    setBattingTeamPlayers(battingTeam);
                    setbowlingTeamPlayers(bowlingTeam); 
                    return [battingTeam, bowlingTeam, newScore] ;   // End innings if 4 wickets fall
                }
                s = np;// Next player in
                np++;
            }
                


            setBattingTeamPlayers(battingTeam);
            setbowlingTeamPlayers(bowlingTeam);
                
            newScore = {
                ...newScore,
                totalBalls: totalBalls,
                totalRuns: totalRuns,
                totalWickets: totalWickets,
                batsMan1: battingTeam[s],
                batsMan2: battingTeam[ns],
                bowler: bowlingTeam[b]
            }
            setScore(newScore); 
            await sleep();
        }

    }

    return [battingTeam, bowlingTeam, newScore]
}


function selectBaller(bowlingTeam, prevBowler, oversDone, noOfbowlers){
    let bowlers = [];


    for(let i = 0 ; i< bowlingTeam.length ; i++){

        if(noOfbowlers === 5 && (4-bowlingTeam[i].overs) > (20 - oversDone)/2 && i!=prevBowler && bowlingTeam[i].overs < 4 && bowlingTeam[i].bowl_rating >= 60 ){
            bowlers = [];
            bowlers.push(i);
            break;
        }

        if(bowlingTeam[i].bowl_rating >= 60 && bowlingTeam[i].overs < 4 && i!= prevBowler){
            bowlers.push(i);
        }
    }   
   



    let randomIndex = Math.floor(Math.random()*bowlers.length);
    return bowlers[randomIndex];
}

function BallEventCalculator(batsman,bowler){
    const ratingDiff = batsman.bat_rating - bowler.bowl_rating



    let outcomes = [
        {result: 0 , weight: 35},
        {result: 1 , weight: 23},
        {result: 2 , weight: 12},
        {result: 3 , weight: 1},
        {result: 4 , weight: 13},
        {result: 5 , weight: 5}, // wide 
        {result: 6 , weight: 8},
        {result: 7 , weight: 5}, // out
    ];

    outcomes = outcomes.map(outcome => {
        let newWeight = outcome.weight;

        if(ratingDiff > 0){
            if(outcome.result === 7)
                newWeight -= Math.sqrt(ratingDiff)*0.8;
            if(outcome.result === 4 || outcomes.result===6)
                newWeight += Math.sqrt(ratingDiff)*1.2;
        }
        else{
            if(outcome.result === 4 || outcome.result===6)
                newWeight -= Math.sqrt(-ratingDiff)*1.5;
        }
    
        switch (batsman.bat_style) {
            case "aggressive":
                if (outcome.result === 7) newWeight += 3;
                if (outcome.result === 4) newWeight += 2;
                if (outcome.result === 6) newWeight += 4;
                if (outcome.result === 1) newWeight -= 5;
                if (outcome.result === 2) newWeight -= 2;
                break;
      
            case "defensive":
                if (outcome.result === 7) newWeight -= 2;
                if (outcome.result === 6 ) newWeight -= 4;
                if (outcome.result === 4) newWeight -= 6;
                if (outcome.result === 1) newWeight += 4;
                if (outcome.result === 2) newWeight += 3;
                break;
        }

        if(newWeight < 0)
            newWeight = 0;

        return {...outcome, weight: newWeight}

    });

    let totalWeight = 0;
    
    outcomes.forEach(outcome => {
        totalWeight += outcome.weight;
    });

    const random = Math.random()*totalWeight;

    let event = 0;

    for(let outcome of outcomes){
        event += outcome.weight;
        if(random<= event)
            return outcome.result;
    }
}