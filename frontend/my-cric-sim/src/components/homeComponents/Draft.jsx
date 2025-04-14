import {useState,  useEffect} from 'react'; 
import {NavLink} from 'react-router-dom';
import './draft.css'

export default function Draft(){
    

    const [teams, setTeams] = useState([]);
    const [currTeamIndex, setCurrTeamIndex] = useState(0);

    const [lastDraft, setLastDraft] = useState({})

    const [slot1, setSlot1] = useState([]);
    const [slot2, setSlot2] = useState([]);
    const [slot3, setSlot3] = useState([]);

    const [isDraftStarted, setIsDraftStarted] = useState(false);
    const [isDraftFinished, setIsDraftFinished] = useState(false);
    const [isDataPosting, SetIsDataPosting] = useState(false);
    const [isDataPosted, setIsDataPosted ] = useState(false);
 
    const [draftedPlayers, setDraftedPlayers] = useState([]);



    useEffect(()=>{
        async function getDraftData(){
            try{
                const response = await fetch('http://localhost:5000/teams');
                let teams = await response.json();
                
                teams = teams.map(team => {
                    return {
                        ...team,
                        batsmanCount: 0,
                        bowlerCount: 0,
                        allrounderCount: 0,
                        playerCount: 0
                    }
                })

                for (let i = teams.length - 1; i > 0; i--) {
                    const random = Math.floor(Math.random() * (i + 1));
                    [teams[i], teams[random]] = [teams[random], teams[i]];
                }



                const response1 =  await fetch('http://localhost:5000/players');
                let players = await response1.json();

                players = players.map(player => ({
                        ...player,
                        isSold: false
                }));

                players.forEach(player => {
                    for(let i = 0; i< teams.length; i++ ){
                        if(player.team_id === teams[i].team_id && teams[i].playerCount < 3 ){


                            if(player.type === 'allrounder' && teams[i].allrounderCount !=1 ) {
                                teams[i].playerCount++;
                                teams[i].allrounderCount++;
                                player.isSold =  true;
                            }
                            if(player.type === 'bowler') {
                                teams[i].playerCount++;
                                teams[i].bowlerCount++;
                                player.isSold =  true;
                            }
                            if(player.type === 'batsman'){
                                teams[i].playerCount++;
                                teams[i].batsmanCount++;
                                player.isSold =  true;
                            }
                        }   
                    }
                })
                
                const slot1  = players.filter(player => (player.type === 'bowler' && !player.isSold));
                const slot2  = players.filter(player => (player.type === 'batsman' && !player.isSold));
                const slot3  = players.filter(player => (player.type === 'allrounder' && !player.isSold));
               
                setTeams(teams);
                setSlot1(slot1);
                setSlot2(slot2);
                setSlot3(slot3);
            }
            catch(error){
                console.error("error fetching teams: ",  error);
            }
        }
        getDraftData();
    },[])

    


    async function startDraft(){
        setIsDraftStarted(true);
    }

    async function DraftNext(){
        if(slot1.length === 0 && slot2.length === 0 && slot3.length === 0){
            setIsDraftFinished(true);
            return;
        }

        if(teams[currTeamIndex].playerCount === 11){
            let newCurrTeamIndex = currTeamIndex + 1;
            newCurrTeamIndex = newCurrTeamIndex % 10;
            setCurrTeamIndex(newCurrTeamIndex);
            return;
        }

        if(slot1.length != 0){

            let playerIndex = Math.floor(Math.random()*slot1.length);

            if(teams[currTeamIndex].bowlerCount === 4){
                let newCurrTeamIndex = currTeamIndex + 1;
                newCurrTeamIndex = newCurrTeamIndex % 10;
                setCurrTeamIndex(newCurrTeamIndex);
                return;
            }
            teams[currTeamIndex].bowlerCount++; 
            
            slot1[playerIndex].isSold = true;
            slot1[playerIndex].team_id = teams[currTeamIndex].team_id;
            teams[currTeamIndex].playerCount++;

            setTeams(teams);
            setLastDraft(slot1[playerIndex])

            setDraftedPlayers(players => [...players, slot1[playerIndex]])

            const newSlot1 = slot1.filter(player => !player.isSold);
            setSlot1(newSlot1);

            let newCurrTeamIndex = currTeamIndex + 1;
            newCurrTeamIndex = newCurrTeamIndex % 10;
            setCurrTeamIndex(newCurrTeamIndex);

            return;
        }
        else if(slot2.length != 0){

            let playerIndex = Math.floor(Math.random()*slot2.length);


            if(teams[currTeamIndex].batsmanCount === 6){
                let newCurrTeamIndex = currTeamIndex + 1;
                newCurrTeamIndex = newCurrTeamIndex % 10;
                setCurrTeamIndex(newCurrTeamIndex);
                return;
            }
            teams[currTeamIndex].batsmanCount++;              
            
            slot2[playerIndex].isSold = true;
            slot2[playerIndex].team_id = teams[currTeamIndex].team_id;
            teams[currTeamIndex].playerCount++;

            setTeams(teams);
            setLastDraft(slot2[playerIndex])

            setDraftedPlayers(players => [...players, slot2[playerIndex]])

            const newSlot2 = slot2.filter(player => !player.isSold);
            setSlot2(newSlot2);

            let newCurrTeamIndex = currTeamIndex + 1;
            newCurrTeamIndex = newCurrTeamIndex % 10;
            setCurrTeamIndex(newCurrTeamIndex);

            return;
        }
        else if(slot3.length != 0) {

            let playerIndex = Math.floor(Math.random()*slot3.length);
            
            teams[currTeamIndex].allrounderCount++;             
            
            slot3[playerIndex].isSold = true;
            slot3[playerIndex].team_id = teams[currTeamIndex].team_id;
            teams[currTeamIndex].playerCount++;

            setTeams(teams);
            setLastDraft(slot3[playerIndex])

            setDraftedPlayers(players => [...players, slot3[playerIndex]])

            const newSlot3 = slot3.filter(player => !player.isSold);
            setSlot3(newSlot3);

            let newCurrTeamIndex = currTeamIndex + 1;
            newCurrTeamIndex = newCurrTeamIndex % 10;
            setCurrTeamIndex(newCurrTeamIndex);

            return;
        }        
    }


    async function postData(){
            
        SetIsDataPosting(true);

        const response = await fetch('http://localhost:5000/draft', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(draftedPlayers)

        })

        setIsDataPosted(true);

    }


    return (
        <>
        <div className="draft">
            <div className="draft-teams">
                {
                    teams.map(team => {
                        return (
                            <div className="draft-team-info" key={team.team_id}>
                                <h3>{team.team_name}</h3>
                                <p>batsmans: {team.batsmanCount}</p>
                                <p>bowlers: {team.bowlerCount}</p>
                                <p>all rounders: {team.allrounderCount}</p>
                                <p>total: {team.playerCount}</p>
                            </div>
                        );
                    } )
                }
            </div>
            <div className="draft-players-div">
                <div className="last-draft">
                    <h3>{lastDraft?.player_name}</h3>
                    <p>{lastDraft?.team_id}</p>
                </div>
                {
                    !isDraftStarted ? 
                    <button onClick={startDraft}>Start Draft</button> : null
                }
                {
                    isDraftStarted && !isDraftFinished ?
                    <button onClick={DraftNext}>draft</button> : null
                }
                {
                    isDraftFinished && !isDataPosting ?
                    <button onClick={postData}>Finish Draft</button> : null
                }
                {
                    isDataPosted ? 
                    <button><NavLink to='/'>Start Season</NavLink></button> : null 
                }
                <h2>slot 1: Bowlers</h2>
                <div className='slot-players'>
                    {
                        slot1?.map(player => {
                            return (
                                <div className="draft-player" key={player.player_id}>
                                    <h4>{player.player_name}</h4>
                                </div>
                            );
                        })
                    }
                </div>
                <h2>slot 2: Batsman</h2>
                <div className='slot-players'>
                    {
                        slot2?.map(player => {
                            return (
                                <div className="draft-player" key={player.player_id}>
                                    <h4>{player.player_name}</h4>
                                </div>
                            );
                        })
                    }
                </div>
                <h2>slot 3: All Rounders</h2>
                <div className='slot-players'>
                    {
                        slot3?.map(player => {
                            return (
                                <div className="draft-player" key={player.player_id}>
                                    <h4>{player.player_name}</h4>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
        </>
    );
}