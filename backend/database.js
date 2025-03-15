
import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mukesh@7976',
    database: 'cric_sim'
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
        const [teams] = await pool.query(`select team_id, team_name,matches, wins, losses, draws, points from teams natural join league_table where season = ? 
        order by points desc ;`,[season]);
        return teams;
    } catch (error) {
        console.error(error);
    }
}


async function getPlayerStats(){
    try{

        const [stats] = await pool.query('select * from  player_stat natural join players natural join teams; ')
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

async function truncateSchedule(){
    try {
        await pool.query('TRUNCATE TABLE schedule;');
    }
    catch (error) {
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
                                                t2.team_name AS team2_name
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
        const [players] = await pool.query(`select * from players where team_id = ?`,[team_id]);
        return players;
    }
    catch (error){
        console.error(error);
    }
}

async function updateSchedule(match_id){
    try{
        await pool.query(`update schedule set isPlayed = 1 where match_id = ?`,[match_id]);
    }
    catch (error){
        console.error(error);
    }
}

async function updateLeaueTable(team_id, win,loss,draw,season){
    try{
        await pool.query(`update league_table
                          set matches = matches + 1,
                          wins = wins + ?,
                          losses = losses + ?,
                          draws = draws + ?
                          where team_id = ? and season = ?`,[win,loss,draw,team_id,season]);
    }
    catch (error){
        console.error(error);
    }
}

async function updatePlayerStats(player_id,season,runs,b_faced, six,four,wickets,b_bowled,r_conceded){
    try {
        await pool.query(`INSERT INTO player_stat (player_id, s_season, runs,b_faced,six,four,wickets,b_bowled,r_conceded)  
                        VALUES (?,?,?,?,?,?,?,?,?)  
                        ON DUPLICATE KEY UPDATE 
                            runs = runs + VALUES(runs),
                            b_faced = b_faced + VALUES(b_faced),
                            six = six + VALUES(six),
                            four = four + VALUES(four),
                            wickets = wickets + VALUES(wickets),
                            b_bowled = b_bowled + VALUES(b_bowled),
                            r_conceded = r_conceded + VALUES(r_conceded);`,
                            [player_id, season, runs, b_faced, six, four, wickets, b_bowled, r_conceded]);

    }
    catch (error) {
        console.error(error);
    }
}


export {getTable,getPlayerStats,getTeams,insertMatches,exportMatches,truncateSchedule,exportMatch,getMatchPlayers,updateLeaueTable,updateSchedule,getSeasons,updatePlayerStats,insertLeague};