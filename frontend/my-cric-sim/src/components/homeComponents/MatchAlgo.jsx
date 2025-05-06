const waitFor = async (conditionFn, checkInterval = 50) => {
    while (!conditionFn()) {
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
  };

 export default async function SimInning(battingTeam,bowlingTeam,setBattingTeamPlayers,setbowlingTeamPlayers, score , setScore, matchSpeedRef, setBallData, isAnimationDone , ballEvent, setBallCalc) {


    

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
            


            setScore(newScore);

            battingTeam[s].batStatus = 1;
            battingTeam[ns].batStatus = 2;
            setBattingTeamPlayers(battingTeam);
            

            let Xevent;
            do{
                Xevent = BallEventCalculator(setBallCalc, battingTeam[s], bowlingTeam[b])
                if(Xevent === 'wide'){ 
                    totalRuns++;
                    bowlingTeam[b] ={
                        ...bowlingTeam[b],
                        runs_c : bowlingTeam[b].runs_c + 1,
                        extras : bowlingTeam[b].extras + 1
                    }
                    setbowlingTeamPlayers(bowlingTeam); 
                }
            }while(Xevent === 'wide');
            
            

            let x;
            if(Xevent !== 'out'){
                setBallData(Date.now())
                await waitFor(() => isAnimationDone.current === true);
                isAnimationDone.current = false;
                x = ballEvent.current
            }
            else{
                x = - 1
            }


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

function BallEventCalculator(setBallCalc, batsman, bowler){



    let power = batsman.power; let effPower = power/100;
    let timing = batsman.timing;
    let control = batsman.control;
    let speed = bowler.speed;
    let accuracy = bowler.accuracy;

    if(Math.random()*accuracy < 5){
        return 'wide';
    }
    let velocity = Math.random()*0.8 + 1 + effPower*1.2 
    const timingDiff = Math.random()*timing - Math.random()*speed;
    if(timingDiff < -70){
        return 'out'
    }
    let timingPenalty = (Math.random()*(100-timing) + 0.3*Math.random()*speed)/100;
    velocity = velocity - timingPenalty;

    const baseAngle = Math.PI / 4; // 45°
    const maxNegDeviation = 25 * Math.PI / 180; // -25
    const maxPosDeviation = 35 * Math.PI / 180; // +35

    let deviation;
    if (timingPenalty < 0.5) {

        deviation = -Math.random() * maxNegDeviation * (timingPenalty * 2); // from 0 to -25
    } else {

        deviation = Math.random() * maxPosDeviation * ((timingPenalty - 0.5) * 2); // from 0 to +35
    }

    let VAngle = 0.00001;
    if(batsman.bat_style = 'aggressive'){
        Math.random() <= 0.334 ? VAngle = baseAngle + deviation : VAngle = 0.000001;    
    }
    else if(batsman.bat_style = 'balanced'){
        Math.random() <= 0.1667 ? VAngle = baseAngle + deviation : VAngle = 0.000001;         
    }
    else if(batsman.bat_style = 'balanced'){
        Math.random() <= 0.0667 ? VAngle = baseAngle + deviation : VAngle = 0.000001;       
    }


/* 
    // edge cases
    const clampedVAngle = Math.max(5 * Math.PI / 180, Math.min(VAngle, 80 * Math.PI / 180)); */


    setBallCalc({ velocity: velocity, VAngle: VAngle });



}