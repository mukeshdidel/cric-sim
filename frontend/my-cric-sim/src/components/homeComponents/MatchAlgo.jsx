const waitFor = async (conditionFn, checkInterval = 50) => {
    while (!conditionFn()) {
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
  };

 export default async function SimInning(battingTeam,bowlingTeam,setBattingTeamPlayers,setbowlingTeamPlayers, score , setScore, matchSpeedRef, setBallData, isAnimationDone , ballEvent, setBallCalc , setFieldIndex, fields) {


    let gaps = [];

    let s = 0; // striker's index
    let ns = 1; // non strikers's index
    let np = 2; // next player's index
    let b = -1; // bowler's index
    let totalRuns = 0;
    let totalWickets = 0;
    let totalBalls = 1;
    let ballsSinceLastWicket = 7;



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
        batsMan2Runs: 0,
        thisOver: []
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
        b = selectBaller(bowlingTeam , b, i, noOfbowlers, setFieldIndex, fields, gaps); 
        bowlingTeam[b]= {
            ...bowlingTeam[b],
            overs: bowlingTeam[b].overs + 1,
        }

        if(i !== 0){
            [s,ns] = [ns,s]
            newScore = {
                ...newScore,
                totalBalls: totalBalls,
                totalRuns: totalRuns,
                totalWickets: totalWickets,
                batsMan1: battingTeam[s],
                batsMan2: battingTeam[ns],
                bowler: bowlingTeam[b],
                thisOver : []
            }
            setScore(newScore); 
        }

        
        for(let j = 0 ; j<6;j++){
            


            setScore(newScore);

            battingTeam[s].batStatus = 1;
            battingTeam[ns].batStatus = 2;
            setBattingTeamPlayers(battingTeam);

            let Xevent;
            do{
                Xevent = BallEventCalculator(setBallCalc, battingTeam[s], bowlingTeam[b], gaps, ballsSinceLastWicket, newScore)
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

            if(x === -1){
                ballsSinceLastWicket = 0
            }
            else{
                ballsSinceLastWicket++;
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

                newScore = {
                    ...newScore,
                    totalBalls: totalBalls,
                    totalRuns: totalRuns,
                    totalWickets: totalWickets,
                    batsMan1: battingTeam[s],
                    batsMan2: battingTeam[ns],
                    bowler: bowlingTeam[b],
                    thisOver: [...newScore.thisOver, `${x}`]
                }
                setScore(newScore); 

                if(score.isFirstInning === false && totalRuns>= newScore.target){
                    newScore = {
                        ...newScore,
                        totalRuns: totalRuns,
                        totalWickets: totalWickets,
                        totalBalls: totalBalls,
                        batsMan1: battingTeam[s],
                        batsMan2: battingTeam[ns],
                        bowler: bowlingTeam[b],
                        thisOver: [...newScore.thisOver, `${x}`]
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
                    bowler: bowlingTeam[b],
                    thisOver : [...newScore.thisOver, 'W']
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
                bowler: bowlingTeam[b],
            }
            setScore(newScore); 
            /* await sleep(); */
        }

    }

    return [battingTeam, bowlingTeam, newScore]
}


function selectBaller(bowlingTeam, prevBowler, oversDone, noOfbowlers , setFieldIndex , fields, gaps){
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
    
    
    // selecting field
    let fieldIndex;
    if(oversDone < 6){
        fieldIndex = Math.floor(Math.random()*5);
        setFieldIndex(fieldIndex)
    }
    else{
        fieldIndex = Math.floor(Math.random()*5) + 5;
        setFieldIndex(fieldIndex)    
    }

    const center = {x: 370, y: 370 -48};

    let field = fields[fieldIndex];

    let angles = field.map((f) => {
        let dx = f.x - center.x;
        let dy = f.y - center.y;
        let angle = Math.atan2(dy, dx);
        //counterclockwise ------------> clockwise
/*         angle = (2 * Math.PI - angle) % (2 * Math.PI); */
        return angle;
    })
    angles.sort((a, b) => a - b);

    gaps.length = 0;
    let tempGaps = [];
    for (let i = 0; i < angles.length; i++) {
        let a1 = Number(angles[i].toFixed(2));
        let a2 = Number(angles[(i + 1) % angles.length].toFixed(2));
        if (a2 < a1) a2 += 2 * Math.PI;
        let gap = Number((a2 - a1).toFixed(2));
    /*     let centerAngle = (a1 + gap / 2) % (2 * Math.PI); */
        let centerAngle = Number((((a1 + a2) / 2)%(2*Math.PI)).toFixed(2));

        tempGaps.push({ from: a1, to: a2 % (2 * Math.PI), gap, center: centerAngle });
    }

    gaps.push(...tempGaps.filter(g => !(g.center >=-2.0952 && g.center <= -1.0476)));
    
    return bowlers[randomIndex];
}

function BallEventCalculator(setBallCalc, batsman, bowler, gaps, ballsSinceLastWicket, score){


    let power = batsman.power; let effPower = power/100;
    let timing = batsman.timing;
    let control = batsman.control;
    let movement = bowler.movement;
    let accuracy = bowler.accuracy;

    if(Math.random()*(timing + control) % 10 < 1 ){
        if(Math.random()*accuracy > 70) 
        {
            return 'out';
        }
        else{
            if(Math.random()*movement > 70 )
            {
                setBallCalc({ velocity: 2, VAngle: 0.1, HAngle: -Math.PI/2 });
                return;
            }
            else{
                setBallCalc({ velocity: 2, VAngle: 0.00001, HAngle: -Math.PI/2 });
                return;                
            }
        }
    }

    if(Math.random()*accuracy < 5){
        return 'wide';
    }

    // velocity calculation affected by power, timing and acccuracy
    let velocity;
    let rand = Math.random();
    let skew = Math.pow(rand, 1-power/100);
    velocity = skew * 3.6;

    rand = Math.random();
    skew = Math.pow(rand, timing/ 100)* 0.5;
    velocity = velocity - skew;

    rand = Math.random();
    skew = Math.pow(rand, 1-accuracy/100)*0.5;
    velocity = velocity - skew;

    velocity = velocity >= 0.5 ? velocity : 0.5;


    // vertical angle

    const baseAngle = Math.PI / 4; // 45°
    const maxNegDeviation = 25 * Math.PI / 180; // -25
    const maxPosDeviation = 35 * Math.PI / 180; // +35

    let skillCT = (control + timing) / 2;
    rand = Math.random();
    skew = 2 * (rand - 0.5); // -1 to +1
    let deviationFactor = (100 - skillCT) / 100;
    
    let deviation = skew * (skew < 0 ? maxNegDeviation : maxPosDeviation) * deviationFactor;
    

    let VAngle;
    let prob = 0;

    if(batsman.balls_f >= 10){
        prob += 0.5
    }
    if(batsman.bat_style === 'aggressive'){
        prob += 1.6  
    }
    else if(batsman.bat_style = 'balanced'){
        prob += 0.83       
    }
    else{
        prob += 0.45      
    }

    if(ballsSinceLastWicket < 6){
        prob -= 0.4;
    }


    if(!score.isFirstInning){
        const reqRunRate = (score.target - score.totalruns)/((120 - score.totalBalls)/6);
        if(reqRunRate >= 12){
            prob += (reqRunRate / 6) - 0.5;
        }
    }

    if(score.isFirstInning && score.totalBalls > 24 && ballsSinceLastWicket > 6){
        const runRate = (score.totalRuns / (score.totalBalls/6))
        if(runRate < 5){
            prob += 2
        }
        else if(runRate >= 5 && runRate < 7){
            prob += 1.5
        }
        else if(runRate >= 7 && runRate < 8.5)
        {
            prob += 0.5
        }
        else{
            prob += 0
        }

    }
    const oversLeft = (120 - score.totalBalls)/6;
    if(oversLeft > 5 ){
        prob += 0;
    }
    else if(oversLeft > 2 && oversLeft < 5){
        prob += 2;
    }
    else{
        prob += 3;
    }

    prob = prob/10;

    if(Math.random() < prob){
        VAngle = baseAngle - deviation
    }
    else{
        VAngle = 0.00001;
    }


    // horizontal angle 
    
    const r = Math.floor(Math.random()* gaps.length);
    const gapAngle = gaps[r]?.center;

    const maxDeviation = 36 * Math.PI / 180;
    let skillDiff = (movement - control + 100) / 200; 

    let angleSkew = (Math.random() * 2 - 1);
    deviation = angleSkew * maxDeviation * skillDiff;
    const HAngle = gapAngle + deviation;
    


    setBallCalc({ velocity: velocity, VAngle: VAngle, HAngle: HAngle });

}