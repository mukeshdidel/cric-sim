import { useState, useEffect} from 'react';
import { useParams,NavLink, useNavigate } from "react-router-dom";


export default function Team(){
    const team_id = useParams();

    const [players, setPlayers] = useState([]);

    useEffect(()=>{
        async function getTeamData(){
            try {
                const response = await fetch(`http://localhost:5000/teams-info/${team_id.id}`);
                const data = await response.json();
                console.log(data);
                
                setPlayers(data);

            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        }
        getTeamData();
    },[])

    return (
        <>
        <ul>
            {
                players.map(player => {
                    return <li key={player.player_id}>{player.player_name} ● {player.type} ● {player.mvp_points}</li>
                })
            }
        </ul>
        </>
    );
}