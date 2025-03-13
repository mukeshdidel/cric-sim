create database cric_sim;
use cric_sim;



create table teams(team_id int primary key auto_increment, 
				   team_name varchar(50));

create table players(player_id int primary key auto_increment,
					 player_name varchar(50),
                     team_id int,
                     p_role varchar(50),                          
                     bat_rat int check(bat_rat <= 100),
					 bowl_rat int check(bowl_rat <= 100),
					 bat_style varchar(50),
                     foreign key(team_id) references teams(team_id));


                          
alter table players add (bat_rat int check(bat_rat <= 100), bowl_rat int check(bowl_rat <= 100),bat_style varchar(50));

create table player_stat(stat_id int primary key auto_increment,
						 player_id int,
                         s_year int,
                         runs int,
                         b_faced int,
                         six int,
                         four int,
                         wickets int,
                         b_bowled int
						 );
                         
                         
create table league_table(id int primary key auto_increment, 
						  team_id int,
                          wins int,
                          losses int, 
                          draws int,
                          points int AS (2 * wins + 1 * draws),
                          foreign key (team_id) references teams(team_id));
                          
create table schedule(match_id int primary key auto_increment,
					  team1_id int,
                      team2_id int,
                      isPlayed int default 0,
                      foreign key(team1_id) references teams(team_id),
                      foreign key(team2_id) references teams(team_id)
					  );
select * from schedule;
insert into teams(team_name) values ('mumbai indians'),
                                    ('team 3'),
                                    ('team 4'),
                                    ('team 5'),
                                    ('team 6'),
                                    ('team 7'),
                                    ('team 8'),
                                    ('team 9'),
                                    ('team10');
                                    
TRUNCATE TABLE schedule;
                                    
                         
SELECT 
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

update schedule set isPlayed = 1 where match_id = 3; 

select t1.team_name, t2.team_name from teams t1 join team t2; 

SELECT 
    s.match_id, 
    s.team1_id, 
    t1.team_name AS team1_name, 
    s.team2_id, 
    t2.team_name AS team2_name
FROM schedule s
JOIN teams t1 ON s.team1_id = t1.team_id
JOIN teams t2 ON s.team2_id = t2.team_id;

select * from players;
insert into players (player_name, team_id, bat_rat, bowl_rat, bat_style) values ('player1',1,90,90,'opener'),
																			     ('player2',1,90,90,'opener'),
                                                                                 ('player3',1,90,90,'opener'),
                                                                                 ('player4',1,90,90,'opener'),
                                                                                 ('player5',1,90,90,'opener'),
                                                                                 ('player6',2,90,90,'opener'),
                                                                                 ('player7',2,90,90,'opener'),
                                                                                 ('player8',2,90,90,'opener'),
                                                                                 ('player9',2,90,90,'opener'),
                                                                                 ('player10',2,90,90,'opener');
								