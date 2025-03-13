import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './Match.css'
import MatchAlgo from './MatchAlgo.jsx';
import ScoreCard from './Scorecard.jsx';


export default function Match(){
    const id = useParams();

    const [teams, setTeams] = useState({team1: "", team2: ""});
    const [team1Players, setTeam1Players] = useState([]);
    const [team2Players, setTeam2Players] = useState([]);
    const [score , setScore] = useState({ totalRuns: 0, totalWickets: 0 });
        useEffect(() =>{
        async function start(){
            const newTeams = await getTeamsName(id);
            setTeams({team1: newTeams[0].team1_name,
                team2: newTeams[0].team2_name});
            let [team1Players, team2Players] = await getTeamPlayers(newTeams[0].team1_id, newTeams[0].team2_id);

            team1Players = team1Players.map(player => ({
                ...player, runs: 0, b_faced: 0, six: 0, four: 0, wickets: 0, b_bowled: 0, batStatus: 0/*0 -> yet to bat, 1->striker, 2-> non-striker, 3-> out*/
            }))

            team2Players = team1Players.map(player => ({
                ...player, runs: 0, b_faced: 0, six: 0, four: 0, wickets: 0, b_bowled: 0,batStatus: 0
            }))

            setTeam1Players(team1Players);
            setTeam2Players(team2Players);
        }
        start();
    },[]);


    async function handleStartClick(){
        await MatchAlgo(team1Players, team2Players,setTeam1Players, setTeam2Players,score , setScore );
    }

    return (
        <>
            <div className='match-div'>
                <div className='match-header'>
                    <h2>{teams.team1} vs {teams.team2} </h2>
                </div>
                <div className='match-info'>

                    <button className="match-button" onClick={handleStartClick}>Start Match</button>

                    <div className='match-score'>
                        <p>{score.totalRuns}/{score.totalWickets}</p>
                    </div>

                    <h3>Scorecard</h3>

                    <div className='match-scorecard'>
                        <ScoreCard teamPlayers={team1Players}/>
                        <ScoreCard teamPlayers={team2Players}/>
                    </div>

                </div>
            </div>
        </>
    );
}

async function getTeamsName(id) {
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
        console.log(data);
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



