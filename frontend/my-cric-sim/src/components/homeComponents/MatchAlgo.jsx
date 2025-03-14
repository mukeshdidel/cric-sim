


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
    let newScore = score;

    battingTeam[s].batStatus = 1;
    battingTeam[ns].batStatus = 2;


    for(let i =0 ; i<5;i++){

        
        // randomly choosing bowler 
        b = Math.floor(Math.random()*bowlingTeam.length);
        
        for(let j = 0 ; j<6;j++){

            let x;
            do{
                x = Math.floor(Math.random()*8);  // a random number for next ball event
                if(x===5){ // 5 for wide
                    totalRuns++;
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
                    
                if(totalWickets === 4){              
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