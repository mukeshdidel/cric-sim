import { useState, useEffect,useRef, useContext, createContext } from 'react';
import { useParams,NavLink, useNavigate } from "react-router-dom";
import Ground from './Ground.jsx';
import './Match.css'
import SimInning from './MatchAlgo.jsx';
import ScoreCard from './Scorecard.jsx';
import Score from './Score.jsx';


export const matchContext = createContext();

export default function Match(){
    const id = useParams();

    const [isMatchStarted, setIsMatchStarted] = useState(false);
    const [isShowCompleteMatch, setIsShowCompleteMatch] = useState(false);
    const [isResultSubmited, setIsResultSubmited] = useState(false);

    

    const [teams, setTeams] = useState({});
    const [winningTeamId, setWinningTeamId] = useState(-1);
 

    const [fields, setFields] = useState(null)
    const [fieldIndex, setFieldIndex] = useState(0)

    const [team1Players, setTeam1Players] = useState([]);
    const [team2Players, setTeam2Players] = useState([]);
    const [score , setScore] = useState({ totalRuns: 0, totalWickets: 0, totalBalls: 0, isFirstInning: true, target: 0 });


    const ballEvent = useRef(null);

    const isAnimationDone = useRef(false);

    const [matchSpeed, setMatchSpeed] = useState(0);
    const matchSpeedRef = useRef(matchSpeed);
    useEffect(() => {
        matchSpeedRef.current = matchSpeed;
    }, [matchSpeed]); // Updates ref when matchSpeed changes
    

    useEffect(() =>{
        async function fetchTeamData(){

            const newTeams = await getTeams(id);
            
            setTeams({
                team1Name: newTeams[0].team1_name, 
                team2Name: newTeams[0].team2_name, 
                team1Id: newTeams[0].team1_id, 
                team2Id: newTeams[0].team2_id, 
                matchId: newTeams[0].match_id,
                season: newTeams[0].season,
                match_type: newTeams[0].match_type
            });
            
            let [team1Players, team2Players] = await getTeamPlayers(newTeams[0].team1_id, newTeams[0].team2_id,newTeams[0].season);

            team1Players = team1Players.map(player => ({
                ...player, 

                runs: 0,
                balls_f: 0, 
                sixes: 0, 
                fours: 0,
                ones: 0,
                twos:0,
                threes:0,
                dots:0, 

                wickets: 0, 
                balls_b: 0,                 
                runs_c: 0,
                sixes_c: 0, 
                fours_c: 0,
                ones_c: 0,
                twos_c:0,
                threes_c:0,
                dots_b:0, 
                extras: 0,

                batStatus: 0,/*0 -> yet to bat, 1->striker, 2-> non-striker, 3-> out*/
                overs: 0, 
                bowlStatus: 0/* 0-> not bowling current over 1-> bowling current over   */

            }))

            team2Players = team2Players.map(player => ({
                ...player, 

                runs: 0,
                balls_f: 0, 
                sixes: 0, 
                fours: 0,
                ones: 0,
                twos:0,
                threes:0,
                dots:0, 

                wickets: 0, 
                balls_b: 0,                 
                runs_c: 0,
                sixes_c: 0, 
                fours_c: 0,
                ones_c: 0,
                twos_c:0,
                threes_c:0,
                dots_b:0, 
                extras: 0,

                batStatus: 0,/*0 -> yet to bat, 1->striker, 2-> non-striker, 3-> out*/
                overs: 0, 
                bowlStatus: 0/* 0-> not bowling current over 1-> bowling current over   */
            }))

            setTeam1Players(team1Players);
            setTeam2Players(team2Players);
        }
        fetchTeamData();

        async function fetchFileds(){
            const fetchedFields = await getFields();
            const grouped = [];

            fetchedFields.forEach(item => {
              const index = item.field_no - 1;
              if (!grouped[index]) grouped[index] = [];
              grouped[index].push(item);
            });
            setFields(grouped);
        }
        fetchFileds();
   
    },[]);


    async function handleStartClick(){

        setBallData(1);
        setIsMatchStarted(true);

        const [newTeam1Players,newTeam2Players,firstScore] = await SimInning
        (team1Players, team2Players, setTeam1Players, setTeam2Players, score, setScore, matchSpeedRef, setBallData, isAnimationDone,ballEvent, setBallCalc,setFieldIndex, fields);
        
        const newScore = {
            ...firstScore, 
            team1TotalRuns: firstScore.totalRuns,
            team1TotalBalls: firstScore.totalBalls
        };


        const [finalTeam2Players,finalTeam1Players,finalScore] = await SimInning
        (newTeam2Players, newTeam1Players ,setTeam2Players, setTeam1Players,{...newScore,target: newScore.totalRuns + 1, isFirstInning:false}, setScore,matchSpeedRef, setBallData, isAnimationDone, ballEvent, setBallCalc,setFieldIndex, fields);


        setTeam1Players(finalTeam1Players);
        setTeam2Players(finalTeam2Players); 

        if(newScore.team1TotalRuns > finalScore.totalRuns){
            setWinningTeamId(teams.team1Id);
        }else if(newScore.team1TotalRuns < finalScore.totalRuns){
            setWinningTeamId(teams.team2Id);
        }

        setIsShowCompleteMatch(true);

    }

    async function handleCompleteMatch(){

        setIsShowCompleteMatch(false);

        const data = {
            team1Players: team1Players,
            team2Players: team2Players,
            score: score,
            winningTeamId: winningTeamId,
            teams: teams
        }
        await postResult(data);

        setIsResultSubmited(true);
    }

    const handleSpeedChange = (e) => {
        let value = Number(e.target.value);

        if (value < 0) value = 0;
        if (value > 100) value = 100;
        setMatchSpeed(value);

      };

      const [ballData, setBallData] = useState(null);
      const [ballCalc, setBallCalc] = useState({velocity: 0, VAngle: 0})

    return (
        <>
            <div className='match-div'>
                <div className='match-header'>
                    <h2>{teams.team1Name} vs {teams.team2Name} </h2>
                </div>
                <div className='match-info'>

                    <label>match speed 1-100 ms</label>
                    <input type="number" className='match-speed-input' min={0} max={100} value={matchSpeed} onChange={handleSpeedChange}/>

                    <div className='button-div'> 
                        {!isMatchStarted ? 
                            <button className="match-button" onClick={handleStartClick}>Start Match</button> : null
                        }        
                        {isShowCompleteMatch ?
                            <button className="match-button" onClick={handleCompleteMatch}>complete Match</button> : null
                        }           
                        {isResultSubmited ?
                            <button className="match-button"><NavLink to='/'>Home</NavLink></button> : null
                        }    
                    </div>
                    
                    <h3>Scorecard</h3>
                    <matchContext.Provider value={{team1Players, team2Players, matchSpeedRef, score, isAnimationDone, ballEvent, ballCalc, fields , fieldIndex}}>
                        <Score />  
                        <div className='match-scorecard'>
                       {ballData && <Ground key={ballData} />}
                        <ScoreCard />
                        </div>
                    </matchContext.Provider>
                </div>
            </div>
        </>
    );
}

async function getTeams(id) {
    try{

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

async function getFields(){
    try{   
        const response = await fetch('http://localhost:5000/fields')
        const data = await response.json();
        return data;
    }
    catch(error){
        console.log(error);
    }
}

async function getTeamPlayers(team_id1, team_id2) {
    try{


        const [response1, response2] = await Promise.all([
            fetch(`http://localhost:5000/matchplayers/${team_id1}`),
            fetch(`http://localhost:5000/matchplayers/${team_id2}`)
        ]);

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
        await fetch('http://localhost:5000/result', {
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



