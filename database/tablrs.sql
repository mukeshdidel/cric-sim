create database cric_sim;
use cric_sim;

select * from teams;
select * from players where team_id = 8;

insert into league_table ( team_id, wins, losses, draws, matches, season) values ( 1, 0 , 0, 0, 0,0 ),
																				 ( 2, 0 , 0, 0, 0,0 ),
                                                                                 ( 3, 0 , 0, 0, 0,0 ),
                                                                                 ( 4, 0 , 0, 0, 0,0 ),
                                                                                 ( 5, 0 , 0, 0, 0,0 ),
                                                                                 ( 6, 0 , 0, 0, 0,0 ),
                                                                                 ( 7, 0 , 0, 0, 0,0 ),
                                                                                 ( 8, 0 , 0, 0, 0,0 ),
                                                                                 ( 9, 0 , 0, 0, 0,0 ),
                                                                                 ( 10, 0 , 0, 0, 0,0 );

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


								