import {useState,useEffect} from 'react'
import './teams.css'
import { NavLink } from 'react-router-dom';

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
                    <NavLink to={`/team/${team.team_id}`} key={team.team_id}><li>{team.team_name}</li></NavLink>
                ))}
            </ul>
        </div>

        </>
    );
}