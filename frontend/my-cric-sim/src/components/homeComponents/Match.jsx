import { useState, useEffect } from 'react';
import { useParams,NavLink, useNavigate } from "react-router-dom";
import './Match.css'
import simInning from './MatchAlgo.jsx';
import ScoreCard from './Scorecard.jsx';
import Score from './Score.jsx';


export default function Match(){
    const id = useParams();

    const [teams, setTeams] = useState({team1Name: "", team2Name: "",team1Id: -1, team2Id: -1, matchId: -1});
    const [winningTeamId, setWinningTeamId] = useState(-1);
 
    const [team1Players, setTeam1Players] = useState([]);
    const [team2Players, setTeam2Players] = useState([]);
    const [score , setScore] = useState({ totalRuns: 0, totalWickets: 0, totalBalls: 0, isFirstInning: true, target:99999});

    const [isMatchFinished,setIsMatchFinished] = useState(false);
    const [isResultSubmitted, setIsResultSubmitted] = useState(false);

    useEffect(() =>{
        async function fetchTeamData(){

            const newTeams = await getTeams(id);
            
            setTeams({team1Name: newTeams[0].team1_name,
                team2Name: newTeams[0].team2_name, team1Id: newTeams[0].team1_id, team2Id: newTeams[0].team2_id, matchId: newTeams[0].match_id ,season: newTeams[0].season});
            
            let [team1Players, team2Players] = await getTeamPlayers(newTeams[0].team1_id, newTeams[0].team2_id,newTeams[0].season);

            team1Players = team1Players.map(player => ({
                ...player, runs: 0, b_faced: 0, six: 0, four: 0, wickets: 0, b_bowled: 0, batStatus: 0/*0 -> yet to bat, 1->striker, 2-> non-striker, 3-> out*/,overs : 0, bowlStatus: 0/* 0-> not bowling current over 1-> bowling current over   */,r_conceded: 0
            }))

            team2Players = team2Players.map(player => ({
                ...player, runs: 0, b_faced: 0, six: 0, four: 0, wickets: 0, b_bowled: 0,batStatus: 0,overs : 0, bowlStatus: 0,r_conceded: 0
            }))

            setTeam1Players(team1Players);
            setTeam2Players(team2Players);
        }
        fetchTeamData();
   
    },[]);


    async function handleStartClick(){

        const [newTeam1Players,newTeam2Players,newScore] = await simInning
        (team1Players, team2Players,setTeam1Players, setTeam2Players,score , setScore);
        
        

        const [finalTeam2Players,finalTeam1Players,finalScore] = await simInning
        (newTeam2Players, newTeam1Players ,setTeam2Players, setTeam1Players,{...newScore,target: newScore.totalRuns + 1, isFirstInning:false,}, setScore);


        setTeam1Players(finalTeam1Players);
        setTeam2Players(finalTeam2Players); 
        setIsMatchFinished(true)

        if(newScore.totalRuns > finalScore.totalRuns){
            setWinningTeamId(teams.team1Id);
        }else if(newScore.totalRuns < finalScore.totalRuns){
            setWinningTeamId(teams.team2Id);
        }

    }

    async function handleCompleteClick(){
        if(!isMatchFinished) return;
        
        setIsResultSubmitted(true);
        const data = {
            team1Players: team1Players,
            team2Players: team2Players,
            score: score,
            winningTeamId: winningTeamId,
            teams: teams
        }
        await postResult(data);
        
    }

    return (
        <>
            <div className='match-div'>
                <div className='match-header'>
                    <h2>{teams.team1Name} vs {teams.team2Name} </h2>
                </div>
                <div className='match-info'>
                    <div className='button-div'>
                        <button className="match-button" onClick={handleStartClick}>Start Match</button>                   
                        {isResultSubmitted ? 
                            <button className="match-button"><NavLink to='/'>Home</NavLink></button>
                        :
                            <button className="match-button" onClick={handleCompleteClick}>Complete</button>
                        } 
                    </div>

                    <h3>Scorecard</h3>
                    <Score score={score}/>                    
                    <div className='match-scorecard'>
                    <ScoreCard teamPlayers={team1Players}/>
                    <ScoreCard teamPlayers={team2Players}/>
                    </div>



                </div>
            </div>
        </>
    );
}

async function getTeams(id) {
    try{
        console.log(id);
        const response = await fetch('http://localhost:5000/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        });
        const data = await response.json();
        return data;
    }
    catch(error){
        console.error('Error fetching teams:', error);
    }
}

async function getTeamPlayers(team_id1, team_id2) {
    try{
        console.log(team_id1, team_id2);

        const [response1, response2] = await Promise.all([
            fetch(`http://localhost:5000/matchplayers/${team_id1}`),
            fetch(`http://localhost:5000/matchplayers/${team_id2}`)
        ]);

        // Convert responses to JSON
        const [data1, data2] = await Promise.all([
            response1.json(),
            response2.json()
        ]);

        return [data1, data2];
    }
    catch(error){
        console.error('Error fetching team players:', error);
    }
}

async function postResult(result){
    try{
        const response = await fetch('http://localhost:5000/result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result)
        });
    }
    catch(error){
        console.error('Error posting result:', error);
    }
}



