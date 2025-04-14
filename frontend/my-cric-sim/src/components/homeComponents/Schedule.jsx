import {useState,useEffect} from 'react'
import { Link, NavLink, useNavigate } from "react-router-dom";
import './Schedule.css'

export default function Schedule(){
    const [matches ,setMatches] = useState([]);
    const [isloading, setisLoading ] = useState(false);
    const [IsError , setIsError] = useState(false);

    const navigate = useNavigate();
    
    useEffect(() => {
        async function getMatches(){

            try {
                setisLoading(true);
                const response = await fetch('http://localhost:5000/initialmatches');
                const data = await response.json();
                setMatches(data);
                setisLoading(false);
            } catch (error) {
                console.error('Error fetching matches:', error);
                setIsError(true);
                setisLoading(false);
            }
        }
        getMatches();
    },[]);

    async function sched(){
        const userChoice = confirm("Do you want to proceed?");
        if (userChoice) {
            const data = await getTeams_id();
            const newSchedule = createSchedule(data);
            const newSchedule2 = await insertSchedule(newSchedule);
            setMatches(newSchedule2);

            if(newSchedule2[0].season - 1 != 0)
                navigate("/draft");
            
        } else {
            console.log("User clicked Cancel");
        }
    }


    return (
        <>
            <div className="schedule-div">
                <h2>Schedule</h2>
                {isloading && <h1>loading...</h1>}
                {IsError && <h1>Error fetching matches</h1>} 
                {
                    matches.length === 0 ? <button className="schedule-button" onClick={sched}>Start New Season</button> : null
                }

                <ul className='matches-list'>
                    {matches.map(match => (
                        <li key={match.match_id}>
                            <Link to={`/match/${match.match_id}`}>                            
                            {match.team1_name} vs {match.team2_name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}


async function getTeams_id(){
    try {
        const response = await fetch('http://localhost:5000/teams');
        const data = await response.json();
        const teamIds = data.map(team => team.team_id);
        return teamIds;
    } catch (error) {
        console.error('Error fetching teams:', error);
    }
}


function createSchedule(teamIds){
    const schedule = [];
    for(let i = 0; i < teamIds.length; i++){
        for(let j = 0; j < teamIds.length; j++){
            if(i!=j){
                schedule.push({
                    team1: teamIds[i],
                    team2: teamIds[j],
                });
            }
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const random = Math.floor(Math.random() * (i + 1));
            [array[i], array[random]] = [array[random], array[i]];
        }
    }
    shuffleArray(schedule);

    return schedule;
}

async function insertSchedule(schedule){    
    try {

            const response = await fetch('http://localhost:5000/matches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(schedule)
            });
            const data = await response.json();
            return data;
        
    }
    catch (error) {
        console.error('Error inserting schedule:', error);
    }
}

