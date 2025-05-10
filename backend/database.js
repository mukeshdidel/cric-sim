
import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mukesh@7976',
    database: 'cric_sim_db'

}).promise();

async function getSeasons(){
    try {
        const [seasons] = await pool.query('select distinct season from league_table order by season desc;');
        return seasons;
    } catch (error) {
        console.error(error);
    }
}
async function getTable(season){
    try {
        const [teams] = await pool.query(`select team_id, team_name, matches, wins, losses, draws, points, nrr, isChampion from teams natural join league_table where season = ? 
        order by points desc, nrr desc ;`,[season]);
        return teams;
    } catch (error) {
        console.error(error);
    }
}


async function getPlayerStats(season){
    try{

        const [stats] = await pool.query(`select * from player_stat join players on player_stat.player_id = players.player_id join teams on teams.team_id = players.team_id where s_season = ?;`,[season]);
        return stats;

    }
    catch (error){
        console.error(error);
    }
}


async function getTeams(){
    try {
        const [teams] = await pool.query('SELECT * FROM teams;');
        return teams;
    } catch (error) {
        console.error(error);
    }
}

async function insertMatches(team1_id, team2_id , season){
    try {
        await pool.query('INSERT INTO schedule (team1_id, team2_id , season) VALUES (?,?,?)', [team1_id, team2_id,season]);
    }
    catch (error) {
        console.error(error);
    }
}

async function exportMatches(){
    try {
        const [matches] = await pool.query(`SELECT 
                                                s.season,
                                                s.match_id, 
                                                s.team1_id, 
                                                t1.team_name AS team1_name, 
                                                s.team2_id, 
                                                t2.team_name AS team2_name
                                            FROM schedule s
                                            JOIN teams t1 ON s.team1_id = t1.team_id
                                            JOIN teams t2 ON s.team2_id = t2.team_id
                                            where s.isPlayed = 0
                                            order by s.match_id
                                            limit 5;
                                            `);
        return matches;
    } catch (error) {
        console.error(error);
    }
}

async function insertLeague(season){
    try{
        const [teams] = await pool.query(`select team_id from teams`);

        for(let team of teams){
            await pool.query(`INSERT INTO league_table (team_id, season, matches, wins, losses, draws ) VALUES (?,?,0,0,0,0)`, [team.team_id, season]);
        }
        
    }
    catch (error){
        console.error(error);
    }
    

}

async function exportMatch(match_id){
    try{
        const [Match]=await pool.query(`SELECT  s.season,
                                                s.match_id, 
                                                s.team1_id, 
                                                t1.team_name AS team1_name, 
                                                s.team2_id, 
                                                t2.team_name AS team2_name,
                                                s.match_type
                                            FROM schedule s
                                            JOIN teams t1 ON s.team1_id = t1.team_id
                                            JOIN teams t2 ON s.team2_id = t2.team_id
                                            where s.match_id = ?;`,[match_id]);
        return Match;
    }
    catch (error){
        console.error(error);
    }
}

async function getMatchPlayers(team_id){
    try{
        const [players] = await pool.query(`select * from players where team_id = ? order by bat_posi, bat_rating desc;`,[team_id]);
        return players;
    }
    catch (error){
        console.error(error);
    }
}

async function updateSchedule(winningTeamId,match_id){
    try{
        const [rows] = await pool.query(`update schedule set isPlayed = 1, winner_id = ? where match_id = ?`,[winningTeamId, match_id]);
        return rows;
    }
    catch (error){
        console.error(error);
    }
}

async function updatePlayOffMatch(teams, winningTeamId){
    try{
        await pool.query(`update schedule set isPlayed = 1, winner_id = ? where match_id = ?`,[winningTeamId, teams.matchId])
        
        if(teams.match_type === 'Qualifier1'){
            const loosingTeamId = teams.team1Id === winningTeamId ? teams.team2Id : teams.team1Id;
            await pool.query(`INSERT INTO schedule (season, team1_id, match_type)
                VALUES (? ,?, 'Qualifier2');`,[teams.season, loosingTeamId])
            await pool.query(`INSERT INTO schedule (season, team1_id, match_type)
                VALUES (? ,?, 'Final');`,[teams.season,winningTeamId])
        }
        else if(teams.match_type === 'Eliminator'){
            await pool.query(`update schedule set team2_id = ? where season = ? and match_type = 'Qualifier2'`,[winningTeamId, teams.season])
        }
        else if(teams.match_type === 'Qualifier2'){
            await pool.query(`update schedule set team2_id = ? where season = ? and match_type = 'Final'`,[winningTeamId, teams.season])
        }
        else if(teams.match_type === 'Final'){
            await pool.query(`update league_table set isChampion = 1 where team_id = ? and season = ?`,[winningTeamId, teams.season])
        }
    }
    catch(error)
    {
        console.log(error)
    }
}

async function updateLeaueTable(team_id, win,loss,draw,season,runs_team, balls_team, runs_opp, balls_opp){
    try{
        const [rows] = await pool.query(`update league_table
                                        set matches = matches + 1,
                                        wins = wins + ?,
                                        losses = losses + ?,
                                        draws = draws + ?,
                                        runs_s = runs_s + ?,
                                        balls_f = balls_f + ?,
                                        runs_c = runs_c + ?,
                                        balls_b = balls_b + ?
                                        where team_id = ? and season = ?`,[win,loss,draw,runs_team, balls_team, runs_opp, balls_opp,team_id,season]);
        return rows;
    }
    catch (error){
        console.error(error);
    }
}

async function updatePlayerStats(player_id, season, team_id, runs, b_faced, six, four, ones, twos, threes, dots, runs_c, b_bowled, six_c, four_c, ones_c, twos_c, threes_c, dots_b, extras, wickets) {
    try {
        const [rows] = await pool.query(`
                        INSERT INTO player_stat 
                        (player_id, s_season, team_id, runs, balls_f, sixes, fours, ones, twos, threes, dots, runs_c, balls_b, sixes_c, fours_c, ones_c, twos_c, threes_c, dots_b, extras, wickets)  
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)  
                        ON DUPLICATE KEY UPDATE 
                            runs = runs + VALUES(runs),
                            balls_f = balls_f + VALUES(balls_f),
                            sixes = sixes + VALUES(sixes),
                            fours = fours + VALUES(fours),
                            ones = ones + VALUES(ones),
                            twos = twos + VALUES(twos),
                            threes = threes + VALUES(threes),
                            dots = dots + VALUES(dots),
                            runs_c = runs_c + VALUES(runs_c),
                            balls_b = balls_b + VALUES(balls_b),
                            sixes_c = sixes_c + VALUES(sixes_c),
                            fours_c = fours_c + VALUES(fours_c),
                            ones_c = ones_c + VALUES(ones_c),
                            twos_c = twos_c + VALUES(twos_c),
                            threes_c = threes_c + VALUES(threes_c),
                            dots_b = dots_b + VALUES(dots_b),
                            extras = extras + VALUES(extras),
                            wickets = wickets + VALUES(wickets);
                    `, [player_id, season, team_id, runs, b_faced, six, four, ones, twos, threes, dots, runs_c, b_bowled, six_c, four_c, ones_c, twos_c, threes_c, dots_b, extras, wickets]);
        return rows;
    } catch (err) {
        console.error(err);
    }
}

async function getPlayers(){
    try{
    const [rows] = await pool.query(`SELECT p.player_id, p.player_name, p.type, p.team_id, ps.mvp_points
                                    FROM player_stat ps JOIN  players p ON ps.player_id = p.player_id JOIN teams t ON p.team_id = t.team_id 
                                    WHERE ps.s_season = (SELECT MAX(s_season) FROM player_stat) ORDER BY ps.mvp_points DESC;`);
    return rows;        
    }
    catch(error){
        console.error(error);
    }
}

async function draftPlayer(player_id, team_id){
   try{
     await pool.query(`update players set team_id = ? where player_id = ?`,[team_id, player_id]);
   }
   catch(error){
    console.error(error);
    }
}

async function getPlayersByTeam(team_id) {
    try{
        const [rows] = await pool.query(`SELECT p.player_id, p.player_name, p.type, p.team_id, ps.mvp_points
                                        FROM player_stat ps JOIN  players p ON ps.player_id = p.player_id JOIN teams t ON p.team_id = t.team_id 
                                        WHERE ps.s_season = (SELECT MAX(s_season) FROM player_stat) and p.team_id = ? ORDER BY ps.mvp_points DESC;`,[team_id]);
        return rows;     
    }
    catch(error){
        console.error(error);
    }
}


async function getFields(){
    try{
        const [response] = await pool.query(`select * from fields join field_points on fields.point_no = field_points.point_no;`);
        return response;
    }
    catch(error){
        console.log(error);
    }
}


async function checkAndINsertPlayOff(season){
    try{
        await pool.query(`call insert_playoffs_if_ready(?)`,[season])
    }
    catch(error)
    {
        console.log(error)
    }
}



export {getTable,getPlayerStats,getTeams,insertMatches,exportMatches,exportMatch,getMatchPlayers,updateLeaueTable,updateSchedule,getSeasons,updatePlayerStats,insertLeague,getPlayers, draftPlayer, getPlayersByTeam, getFields, checkAndINsertPlayOff, updatePlayOffMatch};