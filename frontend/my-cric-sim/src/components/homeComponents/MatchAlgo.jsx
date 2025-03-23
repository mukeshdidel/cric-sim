


 export default async function simInning(battingTeam,bowlingTeam,setBattingTeamPlayers,setbowlingTeamPlayers, score , setScore) {

    let s = 0; // striker's index
    let ns = 1; // non strikers's index
    let np = 2; // next player's index
    let b = 0; // bowler's index
    let totalRuns = 0;
    let totalWickets = 0;
    let totalBalls = 1;


    battingTeam = battingTeam.map(player => ({ ...player }));
    bowlingTeam = bowlingTeam.map(player => ({ ...player }));
    console.log(battingTeam);
    console.log(bowlingTeam);
    let newScore = score;

    battingTeam[s].batStatus = 1;
    battingTeam[ns].batStatus = 2;


    for(let i =0 ; i<20;i++){

        
        // randomly choosing bowler 
        b = selectBaller(bowlingTeam);
        bowlingTeam[b]= {
            ...bowlingTeam[b],
            overs: bowlingTeam[b].overs + 1,
        }

        
        for(let j = 0 ; j<6;j++){
            battingTeam[s].batStatus = 1;
            battingTeam[ns].batStatus = 2;
            setBattingTeamPlayers(battingTeam);
            

            let x;
            do{
                x = BallEventCalculator(battingTeam[s],bowlingTeam[b])  // a random number for next ball event
                if(x===5){ // 5 for wide
                    totalRuns++;
                    bowlingTeam[b] ={
                        ...bowlingTeam[b],
                        r_conceded : bowlingTeam[b].r_conceded + 1,
                    }
                    setbowlingTeamPlayers(bowlingTeam); 
                }   
            }while(x===5);

            if(x===0 || x===1|| x===2|| x===3 || x===4 || x===6){
                totalRuns += x;                
                totalBalls = 6*i + (j+1);
                battingTeam[s]= {
                    ...battingTeam[s],
                    runs: battingTeam[s].runs + x,
                    b_faced: battingTeam[s].b_faced + 1,
                    six: x === 6 ? battingTeam[s].six + 1 : battingTeam[s].six,
                    four: x === 4 ? battingTeam[s].four + 1 : battingTeam[s].four,
                }
                bowlingTeam[b]= {
                    ...bowlingTeam[b],
                    b_bowled: bowlingTeam[b].b_bowled + 1,
                    r_conceded : bowlingTeam[b].r_conceded + x
                }


                if(x===1||x===3){
                    [s,ns] = [ns,s]
                }

                if(totalRuns>= newScore.target){
                    newScore = {
                        ...newScore,
                        totalRuns: totalRuns,
                        totalWickets: totalWickets,
                        totalBalls: totalBalls 
                    }
                    setScore(newScore);
                    setBattingTeamPlayers(battingTeam);
                    setbowlingTeamPlayers(bowlingTeam); 
                    return [battingTeam, bowlingTeam, newScore] ;
                }
            }
            else if(x===7){
                battingTeam[s] = { 
                    ...battingTeam[s],
                    b_faced: battingTeam[s].b_faced + 1,
                    batStatus: 3 
                };
                
                bowlingTeam[b]= {
                    ...bowlingTeam[b],
                    b_bowled: bowlingTeam[b].b_bowled + 1,
                    wickets: bowlingTeam[b].wickets + 1
                }
                
                totalWickets++;
                totalBalls = 6*i + (j+1);
                newScore = {
                    ...newScore,
                    totalRuns: totalRuns,
                    totalWickets: totalWickets,
                    totalBalls: totalBalls
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
                totalWickets: totalWickets
            }
            setScore(newScore);

            await new Promise(resolve => setTimeout(resolve, 100));
        }

    }

    return [battingTeam, bowlingTeam, newScore]
}


function selectBaller(bowlingTeam){
    let bowlers = [];
    for(let i = 0 ; i< bowlingTeam.length ; i++){
        if(bowlingTeam[i].bowl_rat >= 60 && bowlingTeam[i].overs < 4 ){
            bowlers.push(i);
        }
    }
    let randomIndex = Math.floor(Math.random()*bowlers.length);
    console.log(bowlers[randomIndex]);
    return bowlers[randomIndex];
}

function BallEventCalculator(batsman,bowler){
    let ballEvent = 0;
    let batNumber = Math.floor(Math.random()*batsman.bat_rat)+1
    let bowlNumber = Math.floor(Math.random()*bowler.bowl_rat)+1
    let difference = batNumber - bowlNumber;

    if(batsman.bat_style === 'attacker'){
        if(difference < -50) {
            ballEvent = 7
        }
        else if(difference < -20 && difference > -50) {
        ballEvent= 0
        }
        else if(difference < 5 && difference > -5) {
            ballEvent = 1;
        }
        else if(difference < 20 && difference > 5) {
            ballEvent = 2;
        }
        else if(difference < 27 && difference > 20) {
            ballEvent = 3;
        }
        else if(difference < 40 && difference > 27) {
            ballEvent = 4;
        }
        else if(difference < 42 && difference > 40) {
            ballEvent = 5;
        }
        else if(difference > 42) {
            ballEvent = 6;
        } 
    }
    else if(batsman.bat_style === 'defensive'){
        if(difference < -40) {
            ballEvent = 7
        }
        else if(difference < -15 && difference > -40) {
            ballEvent= 0
        }
        else if(difference < 0 && difference > -15) {
            ballEvent = 1;
        }
        else if(difference < 20 && difference > 0) {
            ballEvent = 2;
        }
        else if(difference < 40 && difference > 20) {
            ballEvent = 3;
        }
        else if(difference < 60 && difference > 40) {
            ballEvent = 4;
        }
        else if(difference < 70 && difference > 60) {
            ballEvent = 5;
        }
        else if(difference > 70) {
            ballEvent = 6;
        }
    }else
    {
        if(difference < -60) {
            ballEvent = 7
        }
        else if(difference < -25 && difference > -60) {
        ballEvent= 0
        }
        else if(difference < 0 && difference > -25) {
            ballEvent = 1;
        }
        else if(difference < 22 && difference > 0) {
            ballEvent = 2;
        }
        else if(difference < 35 && difference > 22) {
            ballEvent = 3;
        }
        else if(difference < 50 && difference > 35) {
            ballEvent = 4;
        }
        else if(difference < 60 && difference > 50) {
            ballEvent = 5;
        }
        else if(difference > 60) {
            ballEvent = 6;
        } 

    }


    return ballEvent;
}