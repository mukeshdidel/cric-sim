
import express from 'express';
import cors from 'cors'
import {getTable,getPlayerStats,getTeams,insertMatches,exportMatches,truncateSchedule,exportMatch,getMatchPlayers,updateLeaueTable,updateSchedule} from './database.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/table',async function (req,res){
    try {
        const teams = await getTable();
        res.json(teams);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
})

app.get('/stats',async function(req,res){
    try{
        const stats = await getPlayerStats();
        res.json(stats);
    }
    catch (error){
        console.error(error);
        res.status(500).send('Server Error');
    }
});


app.get('/teams',async function (req,res){

    try {
        const teams = await getTeams();
        res.json(teams);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/matches',async function (req,res){
    try{
        const insertschedule  = req.body
        await truncateSchedule();
        for(let match of insertschedule){
            const {team1, team2} = match;       
            await insertMatches(team1,team2);
        }
        const exportschedule = await exportMatches();
        res.json(exportschedule);
    }
    catch (error){
        console.error(error);
        res.status(500).send('Server Error');
    }
})

app.post('/match',async function (req,res){
    try{
        const object = req.body;

        const exportmatch = await exportMatch(object.id);
        res.json(exportmatch);
    }
    catch (error){
        console.error(error);
        res.status(500).send('Server Error');
    }
})

app.get('/initialmatches',async function(req, res){
    try{
        const exportschedule = await exportMatches();
        res.json(exportschedule);
    }
    catch (error){
        console.error(error);
        res.status(500).send('Server Error');
    }
})

app.use('/matchplayers/:id',async function(req, res){
    try{
        const id = req.params.id;
        const matchplayers = await getMatchPlayers(id);
        res.json(matchplayers);
    }
    catch (error){
        console.error(error);
        res.status(500).send('Server Error');
    }
})

app.post('/result',async function (req,res){
    try{
        const data = req.body
        const {team1Players, team2Players, score,winningTeamId, teams} = data;

        console.log(team1Players);
        console.log(team2Players);
        console.log(score);
        console.log(winningTeamId);
        console.log(teams);

        await updateSchedule(teams.matchId)

        if(teams.team1Id === winningTeamId){
        await updateLeaueTable(teams.team1Id,1,0,0)
        await updateLeaueTable(teams.team2Id,0,1,0) 
        }
        else if(teams.team2Id === winningTeamId){
            await updateLeaueTable(teams.team2Id,1,0,0)
            await updateLeaueTable(teams.team1Id,0,1,0)
        }
        else{
            await updateLeaueTable(teams.team2Id,0,0,1)
            await updateLeaueTable(teams.team1Id,0,0,1)
        }


    }
    catch (error){
        console.error(error);
        res.status(500).send('Server Error');
    }



})

app.use((err,req,res,next) => {
    console.error(err.stack)
    res.status(500).send('something went wrong')
})

app.listen(5000, function () {
    console.log('Server is running port 5000');  // Server started on port 5000
})