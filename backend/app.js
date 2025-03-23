
import express from 'express';
import cors from 'cors'
import {getSeasons,getTable,getPlayerStats,getTeams,insertMatches,exportMatches,truncateSchedule,exportMatch,getMatchPlayers,updateLeaueTable,updateSchedule,updatePlayerStats,insertLeague} from './database.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/seasons', async function (req, res) {
    try {
        const seasons = await getSeasons();
        res.json(seasons);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
})

app.post('/table',async function (req,res){
    try {
        const season = req.body;
        const table = await getTable(season.season);
        console.log(table);
        res.json(table);
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
        const seasons = await getSeasons();
        const latestSeason = seasons[0].season + 1;
        await insertLeague(latestSeason);


        for(let match of insertschedule){
            const {team1, team2} = match;   

            await insertMatches(team1,team2,latestSeason);
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

        // update schedule
        await updateSchedule(teams.matchId) // updates match to 'played' state  

        // update league table
        if(teams.team1Id === winningTeamId){
        await updateLeaueTable(teams.team1Id,1,0,0,teams.season,score.target-1,120,score.totalRuns,score.totalBalls)
        await updateLeaueTable(teams.team2Id,0,1,0,teams.season,score.totalRuns,score.totalBalls,score.target-1,120) 
        }
        else if(teams.team2Id === winningTeamId){
            await updateLeaueTable(teams.team2Id,1,0,0,teams.season,score.target-1,120,score.totalRuns,score.totalBalls)
            await updateLeaueTable(teams.team1Id,0,1,0,teams.season,score.totalRuns,score.totalBalls,score.target-1,120)
        }
        else{
            await updateLeaueTable(teams.team2Id,0,0,1,teams.season,score.target-1,120,score.totalRuns,score.totalBalls)
            await updateLeaueTable(teams.team1Id,0,0,1,teams.season,score.totalRuns,score.totalBalls,score.target-1,120)
        }

        // update player stats
        for(let player of team1Players){
            await updatePlayerStats(player.player_id,teams.season, player.runs, player.b_faced, player.six, player.four , player.wickets, player.b_bowled, player.r_conceded)
        }
        for(let player of team2Players){
            await updatePlayerStats(player.player_id,teams.season, player.runs, player.b_faced, player.six, player.four , player.wickets, player.b_bowled, player.r_conceded)
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