
import express from 'express';
import cors from 'cors'
import {getSeasons,getTable,getPlayerStats,getTeams,insertMatches,exportMatches,truncateSchedule,exportMatch,getMatchPlayers,updateLeaueTable,updateSchedule,updatePlayerStats,insertLeague,  getPlayers, draftPlayer, getPlayersByTeam} from './database.js'

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
        /* console.log(table); */
        res.json(table);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
})

app.post('/stats',async function(req,res){
    try{
        const season = req.body;
        const stats = await getPlayerStats(season.season);
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


app.get('/matchplayers/:id',async function(req, res){
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


/*         console.log(team1Players)
        console.log(team2Players)
        console.log(score)
        console.log(winningTeamId)
        console.log(teams) */

        await updateSchedule(teams.matchId) // updates match to 'played' state  



        if(teams.team1Id === winningTeamId){
            await updateLeaueTable(teams.team1Id,1,0,0,teams.season,score.team1TotalRuns,score.team1TotalBalls,score.totalRuns,score.totalBalls)
            await updateLeaueTable(teams.team2Id,0,1,0,teams.season,score.totalRuns,score.totalBalls,score.team1TotalRuns,score.team1TotalBalls) 
        }
        else if(teams.team2Id === winningTeamId){
            await updateLeaueTable(teams.team1Id,0,1,0,teams.season,score.team1TotalRuns,score.team1TotalBalls,score.totalRuns,score.totalBalls)
            await updateLeaueTable(teams.team2Id,1,0,0,teams.season,score.totalRuns,score.totalBalls,score.team1TotalRuns,score.team1TotalBalls)
        }
        else{
            await updateLeaueTable(teams.team1Id,0,0,1,teams.season,score.team1TotalRuns,score.team1TotalBalls,score.totalRuns,score.totalBalls)
            await updateLeaueTable(teams.team2Id,0,0,1,teams.season,score.totalRuns,score.totalBalls,score.team1TotalRuns,score.team1TotalBalls)
        }

        for (let player of team1Players) {
            await updatePlayerStats(
                player.player_id, teams.season, player.team_id, 
                player.runs, player.balls_f, player.sixes, player.fours, player.ones, player.twos, player.threes, player.dots, 
                player.runs_c, player.balls_b, player.sixes_c, player.fours_c, player.ones_c, player.twos_c, player.threes_c, player.dots_b, player.extras, player.wickets
            ); 
        }


        for (let player of team2Players) {
            await updatePlayerStats(
                player.player_id, teams.season, player.team_id, 
                player.runs, player.balls_f, player.sixes, player.fours, player.ones, player.twos, player.threes, player.dots, 
                player.runs_c, player.balls_b, player.sixes_c, player.fours_c, player.ones_c, player.twos_c, player.threes_c, player.dots_b, player.extras, player.wickets
            ); 
        }

        res.status(200).json({ message: 'Match result processed successfully' });
    }
    catch (error){
        console.error(error);
        res.status(500).send('Server Error');
    }
})

app.get('/players', async function(req, res){
    try{
        const players = await getPlayers();        
        res.json(players); 
    }
    catch(error){
        console.log(error);
        res.status(500).send('server error');
    }
})

app.post('/draft', async function(req, res){
    
    try{
        const players = req.body;

        players.forEach(async function(player){
            await draftPlayer(player.player_id, player.team_id);
        });
        res.status(200).json({ message: 'Draft post processed successfully' });
    }
    catch(error){
        console.log(error);
        res.status(500).send('server error');
    }    
})

app.get('/teams-info/:id', async (req, res) => {
    
    try{
        const team_id = req.params.id;
        console.log(team_id);
        
        const players = await getPlayersByTeam(team_id);
    
        res.json(players);
    }
    catch(error){
        console.log(error);
        res.status(500).send('server error');
    }   

})

app.use((err,req,res,next) => {
    console.error(err.stack)
    res.status(500).send('something went wrong')
})

app.listen(5000, function () {
    console.log('Server is running port 5000');  // Server started on port 5000
})