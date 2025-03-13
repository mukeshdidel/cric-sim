
import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mukesh@7976',
    database: 'cric_sim'
}).promise();


async function getTable(){
    try {
        const [teams] = await pool.query('select team_id, team_name, wins, losses, draws, points from teams natural join league_table;');
        return teams;
    } catch (error) {
        console.error(error);
    }
}


async function getPlayerStats(){
    try{
        const [stats] = await pool.query('select * from  player_stat natural join players ; ')
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
async function insertMatches(team1_id, team2_id){
    try {
        await pool.query('INSERT INTO schedule (team1_id, team2_id) VALUES (?,?)', [team1_id, team2_id]);
    }
    catch (error) {
        console.error(error);
    }
}

async function exportMatches(){
    try {
        const [matches] = await pool.query(`SELECT 
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

async function exportMatch(match_id){
    try{
        const [Match]=await pool.query(`SELECT  s.match_id, 
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

export {getTable,getPlayerStats,getTeams,insertMatches,exportMatches,truncateSchedule,exportMatch,getMatchPlayers};