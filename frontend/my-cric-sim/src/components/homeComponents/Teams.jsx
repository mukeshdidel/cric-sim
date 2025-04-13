import {useState,useEffect} from 'react'
import './teams.css'

export default function Teams(){        
        
    const [teams, setTeams] = useState([]);
    
    useEffect(() => {
        async function getTeams(){
            try {
                const response = await fetch('http://localhost:5000/teams');
                const data = await response.json();
                setTeams(data);

            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        }
        getTeams();
    },[]);
    
    return (
        <>
        <div className='teams-div'>
            <h2>Teams</h2>
            <ul className='teams-list'>
                {teams.map(team => (
                    <li key={team.team_id}>{team.team_name}</li>
                ))}
            </ul>
        </div>

        </>
    );
}