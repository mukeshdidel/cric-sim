
export default async function MatchAlgo(team1Players, team2Players, setTeam1Players, setTeam2Players,score , setScore ) {
    
    console.log(team1Players);
    console.log(team2Players);
    /* const updatedTeams = await simInning(team1Players); */
    await simInning([...team1Players], setTeam1Players , score, setScore); 

    async function simInning(battingTeam,setTeamPlayers) {

        let s = 0; // striker's index
        let ns = 1; // non strikers's index
        let np = 2; // next player's index

        battingTeam = battingTeam.map(player => ({ ...player }));
        let newScore = score;

        battingTeam[s].batStatus = 1;
        battingTeam[ns].batStatus = 2;
        let totalRuns = 0;
        let totalWickets = 0;




        for(let i =0 ; i<10;i++){
            if(totalWickets===4){
                break;
            }
            for(let j = 0 ; j<6;j++){
                if(totalWickets===4){
                    break;
                }
                let x;
                do{
                    x = Math.floor(Math.random()*8);  // a random number for next ball event
                    if(x===5){ // 5 for wide
                        totalRuns++;
                        console.log(" wide");
                    }   
                }while(x===5);

                if(x===0 || x===1|| x===2|| x===3 || x===4 || x===6){
                    totalRuns += x;
                    battingTeam[s]= {
                        ...battingTeam[s],
                        runs: battingTeam[s].runs + x,
                        b_faced: battingTeam[s].b_faced + 1,
                        six: x === 6 ? battingTeam[s].six + 1 : battingTeam[s].six,
                        four: x === 4 ? battingTeam[s].four + 1 : battingTeam[s].four,
                    }
                    if(x===1||x===3){
                        [s,ns] = [ns,s]
                    }
                }
                else if(x===7){
                    battingTeam[s] = { ...battingTeam[s], b_faced: battingTeam[s].b_faced + 1,  batStatus: 3 };
                    totalWickets++;
                    newScore = {
                        totalRuns: totalRuns,
                        totalWickets: totalWickets
                    }
                    
                    setScore(newScore);
    
                            
                    
                    if(np===5){              
                        newScore = {
                            totalRuns: totalRuns,
                            totalWickets: totalWickets
                        }
                        setScore(newScore); 
                        console.log(x+" " + totalRuns + " " + battingTeam[s].player_name + " " + battingTeam[s].runs);
                        break;   // End innings if 4 wickets fall
                    }
                    s = np;// Next player in
                    np++;
                }
                
                await new Promise(resolve => setTimeout(resolve, 500));
                
                console.log(x+" " + totalRuns + " " + battingTeam[s].player_name + " " + battingTeam[s].runs);
                
                setTeamPlayers([...battingTeam])
                
                newScore = {
                    totalRuns: totalRuns,
                    totalWickets: totalWickets
                }
                
                setScore(newScore);
                /* console.log(totalWickets); */
            }

        }
    }

}