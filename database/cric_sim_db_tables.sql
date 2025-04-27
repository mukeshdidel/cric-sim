CREATE DATABASE  cric_sim_db;
use cric_sim_db;

select * from player_stat;
select * from league_table;
select * from schedule;
select * from teams;

select * from players where team_id =9 ;

SELECT p.player_id, p.player_name, p.type, p.team_id, ps.mvp_points
FROM player_stat ps JOIN  players p ON ps.player_id = p.player_id JOIN teams t ON p.team_id = t.team_id 
WHERE ps.s_season = (SELECT MAX(s_season) FROM player_stat) and p.team_id = 2 ORDER BY ps.mvp_points DESC;




select * from players where team_id = ? order by bat_posi, bat_rating desc;

insert into league_table ( team_id, wins, losses, draws, matches, season, runs_s, balls_f, runs_c , balls_b) values (1,0,0,0,0,0,0,0,0,0),
																													(2,0,0,0,0,0,0,0,0,0),
                                                                                                                    (3,0,0,0,0,0,0,0,0,0),
                                                                                                                    (4,0,0,0,0,0,0,0,0,0),
                                                                                                                    (5,0,0,0,0,0,0,0,0,0),
                                                                                                                    (6,0,0,0,0,0,0,0,0,0),
                                                                                                                    (7,0,0,0,0,0,0,0,0,0),
                                                                                                                    (8,0,0,0,0,0,0,0,0,0),
                                                                                                                    (9,0,0,0,0,0,0,0,0,0),
                                                                                                                    (10,0,0,0,0,0,0,0,0,0);
																							

create table teams(
	team_id int primary key auto_increment, 
	team_name varchar(50)
);



CREATE TABLE players (
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    player_name VARCHAR(50),
    team_id INT,
    
    bat_style ENUM('aggressive', 'balanced', 'defensive'),
    bat_posi ENUM('opener', 'top order', 'middleorder', 'finisher', 'lowerorder'),
    bat_rating INT CHECK(bat_rating <= 100),
    
    bowl_style Enum('fast','spin','none'),
    bowl_rating INT CHECK(bowl_rating <= 100),
    
    type Enum('batsman', 'bowler', 'allrounder'),
    
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);


create table player_stat(
	stat_id int primary key auto_increment,
	player_id int,
    s_season int,
    team_id int,
    
    runs int,
    balls_f int,
    sixes int,
    fours int,
    ones int,
    twos int,
    threes int,
    dots int,
    
    runs_c int,
    balls_b int,
    sixes_c int,
    fours_c int,
    ones_c int,
    twos_c int,
    threes_c int,
    dots_b int,
    extras int,
    wickets int,
	mvp_points decimal(10,2) generated always as (
    (fours * 2.5) +
    (sixes * 3.5) -
    (dots * 0.5 ) +
    (wickets * 3.5) +
    (dots_b * 1) -
    (sixes_c*1) - 
    (fours_c*0.5)
    ),
    
    UNIQUE (player_id, s_season, team_id),
    
    foreign key(player_id) references players(player_id),
    foreign key(team_id) references teams(team_id)
);

ALTER TABLE player_stat
modify mvp_points DECIMAL(10,2) generated always AS (
    (fours * 2.5) +
    (sixes * 3.5) -
    (dots * 0.5 ) +
    (wickets * 3.5) +
    (dots_b * 1) -
    (sixes_c*1) - 
    (fours_c*0.5)
);


create table league_table(
	id int primary key auto_increment,
    season int,
	team_id int,
    matches int default 0,
    wins int default 0,
    losses int default 0, 
    draws int default 0,
    points int AS (2 * wins + 1 * draws),
    
    runs_s int default 0,
    balls_f int default 0, 
    runs_c int default 0,
    balls_b int default 0,
    
    nrr decimal (7,3) as (
		CASE 
			WHEN balls_f = 0 OR balls_b = 0 THEN 0
			ELSE ROUND((runs_s / (balls_f / 6.0)) - (runs_c / (balls_b / 6.0)), 3)
		END
    ),
    foreign key (team_id) references teams(team_id)
);


create table schedule(
	match_id int primary key auto_increment,
	team1_id int,
	team2_id int,
	isPlayed int default 0,
    season int,
	foreign key(team1_id) references teams(team_id),
	foreign key(team2_id) references teams(team_id)
);



insert into teams (team_name) values ('Chennai Superkings'),('Rajasthan Royals'),('Mumbai Indians'),('Punjab Kings'),('Sunrisers Hydrabad'),('Kolkata Knight Riders'),('Delhi Captials'),('Lucknow Super Giants'),('Gujarat Titans'),('Royal Challengers Bengaluru');

insert into players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating, type) values ( 'Ruturaj Gaikwad',1,'balanced','opener',78,'none',32,'batsman'),
																														( 'Devon Conway',1,'balanced','opener',84,'none',30,'batsman' ),
																														( 'Rachin Ravindra',1,'balanced','top order',81,'spin',64,'allrounder'),
																														( 'Rahul Tripathi',1,'aggressive','top order',71,'none',26,'batsman'),
																														( 'Shivam Dube',1,'aggressive','middleorder',78,'fast',52,'batsman'),
																														( 'Ravindra Jadeja',1,'aggressive','middleorder',74,'spin',79,'allrounder'),
																														( 'MS Dhoni',1,'aggressive','finisher',83,'none',20,'batsman'),
																														( 'Sam Curran',1,'aggressive','finisher',71,'fast',74,'allrounder'),
																														( 'Ravichandran Ashwin',1,'defensive','lowerorder',62,'spin',87,'bowler'),
																														( 'Khaleel Ahmed',1,'defensive','lowerorder',43,'fast',73,'bowler'),
																														( 'Matheesha Pathirana',1,'defensive','lowerorder',46,'fast',85,'bowler');
insert into players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating, type) values ( 'Yashasvi Jaiswal',2,'aggressive','opener',84,'none',43,'batsman'),
																														( 'Sanju Samson',2,'aggressive','top order',87,'none',21,'batsman'),
																														( 'Nitish Rana',2,'balanced','top order',76,'spin',49,'batsman'),
																														( 'Riyan Parag',2,'aggressive','middleorder',78,'spin',54,'batsman'),
																														( 'Dhruv Jurel',2,'aggressive','finisher',74,'none',21,'batsman'),
																														( 'Shimron Hetmyer',2,'aggressive','finisher',79,'none',21,'batsman'),
																														( 'Jofra Archer',2,'aggressive','lowerorder',63,'fast',94,'bowler'),
																														( 'Wanindu Hasaranga',2,'aggressive','lowerorder',61,'spin',83,'bowler'),
																														( 'Maheesh Theekshana',2,'defensive','lowerorder',43,'fast',72,'bowler'),
																														( 'Tushar Deshpande',2,'defensive','lowerorder',45,'spin',71,'bowler'),
																														( 'Sandeep Sharma',2,'defensive','lowerorder',39,'fast',82,'bowler');
INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating , type) VALUES
('Rohit Sharma', 3, 'aggressive', 'opener', 87, 'none', 12, 'batsman'),
('Will Jacks', 3, 'balanced', 'opener', 81, 'fast', 56,'batsman'),
('Tilak Varma', 3, 'balanced', 'middleorder', 82, 'none', 21,'batsman'),
('Suryakumar Yadav', 3, 'aggressive', 'middleorder', 87, 'none', 18,'batsman'),
('Hardik Pandya', 3, 'aggressive', 'finisher', 79, 'fast', 84,'allrounder'),
('Robin Minz', 3, 'balanced', 'middleorder', 71, 'none', 12,'batsman'),
('Naman Dhir', 3, 'aggressive', 'finisher', 62, 'none', 21,'batsman'),
('Deepak Chahar', 3, 'defensive', 'lowerorder', 43, 'fast', 82,'bowler'),
('Mitchell Santner', 3, 'defensive', 'lowerorder', 46, 'spin', 78,'bowler'),
('Jasprit Bumrah', 3, 'defensive', 'lowerorder', 38, 'fast', 95,'bowler'),
('Trent Boult', 3, 'defensive', 'lowerorder', 41, 'fast', 91,'bowler');

                                                                                        
INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating, type) VALUES
('Prabhsimran Singh', 4, 'balanced', 'opener', 68, 'none', 21, 'batsman'),
('Josh Inglis', 4, 'balanced', 'opener', 71, 'none', 24, 'batsman'),
('Shreyas Iyer', 4, 'balanced', 'top order', 86, 'none', 21, 'batsman'),
('Glenn Maxwell', 4,'aggressive', 'middleorder', 84, 'spin', 57, 'batsman'),
('Marcus Stoinis', 4, 'aggressive', 'finisher', 79, 'fast', 68,'allrounder'),
('Shashank Singh', 4,'aggressive', 'middleorder', 69, 'none', 43,'batsman'),
('Marco Jansen', 4, 'aggressive', 'finisher', 71, 'fast', 45,'batsman'),
('Harpreet Brar', 4, 'defensive', 'lowerorder', 43, 'spin', 72,'bowler'),
('Lockie Ferguson', 4, 'defensive', 'lowerorder', 46, 'fast', 78,'bowler'),
('Arshdeep Singh', 4, 'defensive', 'lowerorder', 46, 'fast', 82,'bowler'),
('Yuzvendra Chahal', 4, 'defensive', 'lowerorder', 35, 'spin', 86,'bowler');


INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating, type) VALUES
('Travis Head', 5, 'aggressive', 'opener', 89, 'spin', 56, 'batsman'),
('Abhishek Sharma', 5, 'aggressive', 'opener', 82, 'none', 43,'batsman'),
('Ishan Kishan', 5, 'aggressive', 'opener', 78, 'none', 21,'batsman'),
('Nitish Kumar Reddy', 5, 'balanced', 'middleorder', 71, 'none', 43,'batsman'),
('Heinrich Klaasen', 5, 'balanced', 'middleorder', 82, 'none', 34,'batsman'),
('Abhinav Manohar', 5, 'balanced', 'middleorder', 67, 'none', 45,'batsman'),
('Pat Cummins', 5, 'balanced', 'lowerorder', 61, 'fast', 89,'bowler'),
('Harshal Patel', 5, 'defensive', 'lowerorder', 55, 'fast', 79,'bowler'),
('Mohammad Shami', 5, 'defensive', 'lowerorder', 49, 'fast', 90,'bowler'),
('Rahul Chahar', 5, 'defensive', 'lowerorder', 42, 'spin', 68,'bowler'),
('Jaydev Unadkat', 5, 'defensive', 'lowerorder', 48, 'fast', 67,'bowler');

                                                                                        
INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating, type) VALUES
('Sunil Narine', 6, 'aggressive', 'opener', 79, 'spin', 86,'allrounder'),
('Quinton de Kock', 6, 'balanced', 'opener', 83, 'none', 21,'batsman'),
('Venkatesh Iyer', 6, 'balanced', 'top order', 72, 'fast', 56,'batsman'),
('Moeen Ali', 6, 'balanced', 'middleorder', 73, 'spin', 68,'allrounder'),
('Rinku Singh', 6, 'aggressive', 'finisher', 79, 'none', 34,'batsman'),
('Andre Russell', 6, 'aggressive', 'finisher', 82, 'fast', 61,'allrounder'),
('Rovman Powell', 6, 'aggressive', 'finisher', 73, 'none', 51,'batsman'),
('Anrich Nortje', 6, 'defensive', 'lowerorder', 36, 'fast', 79,'bowler'),
('Umran Malik', 6, 'defensive', 'lowerorder', 41, 'fast', 75,'bowler'),
('Harshit Rana', 6, 'defensive', 'lowerorder', 35, 'fast', 76,'bowler'),
('Varun Chakaravarthy', 6, 'defensive', 'lowerorder', 35, 'spin', 81,'bowler');

                                                                                        
INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating , type) VALUES
('KL Rahul', 7, 'balanced', 'opener', 87, 'none', 12,'batsman'),
('Faf du Plessis', 7, 'balanced', 'opener', 83, 'none', 12,'batsman'),
('Harry Brook', 7, 'aggressive', 'top order', 78, 'none', 32,'batsman'),
('Jake Fraser-McGurk', 7, 'balanced', 'middleorder', 75, 'none', 23,'batsman'),
('Karun Nair', 7, 'balanced', 'middleorder', 68, 'none', 21,'batsman'),
('Tristan Stubbs', 7, 'aggressive', 'finisher', 74, 'none', 43,'batsman'),
('Axar Patel', 7, 'balanced', 'lowerorder', 65, 'spin', 79,'allrounder'),
('Mitchell Starc', 7, 'defensive', 'lowerorder', 54, 'fast', 88,'bowler'),
('T Natarajan', 7, 'defensive', 'lowerorder', 34, 'fast', 79,'bowler'),
('Mukesh Kumar', 7, 'defensive', 'lowerorder', 32, 'fast', 68,'bowler'),
('Kuldeep Yadav', 7, 'defensive', 'lowerorder', 34, 'spin', 81,'bowler');

																					
INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating, type) VALUES
('Aiden Markram', 8, 'balanced', 'opener', 76, 'none', 34,'batsman'),
('Mitchell Marsh', 8, 'balanced', 'opener', 79, 'none', 32,'batsman'),
('Nicholas Pooran', 8, 'aggressive', 'middleorder', 75, 'none', 21,'batsman'),
('Rishabh Pant', 8, 'aggressive', 'middleorder', 86, 'none', 12,'batsman'),
('David Miller', 8, 'aggressive', 'middleorder', 82, 'none', 32,'batsman'),
('Ayush Badoni', 8, 'aggressive', 'finisher', 71, 'none', 55,'batsman'),
('Shahbaz Ahmed', 8, 'aggressive', 'finisher', 67, 'spin', 68,'allrounder'),
('Shardhul Thakur', 8, 'defensive', 'lowerorder', 54, 'fast', 82,'bowler'),
('Ravi Bishnoi', 8, 'defensive', 'lowerorder', 35, 'spin', 71,'bowler'),
('Avesh Khan', 8, 'defensive', 'lowerorder', 45, 'fast', 73,'bowler'),
('Mayank Yadav', 8, 'defensive', 'lowerorder', 43, 'fast', 67,'bowler');


                                                                                        
                                                                                        
-- Team 9 (Rajasthan Royals)
INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating,type) VALUES
('Shubman Gill', 9, 'balanced', 'opener', 82, 'none', 21,'batsman'),
('Jos Buttler', 9, 'aggressive', 'opener', 91, 'none', 21,'batsman'),
('Sai Sudharsan', 9, 'aggressive', 'top order', 78, 'none', 45,'batsman'),
('Washington Sundar', 9, 'balanced', 'middleorder', 72, 'spin', 69,'allrounder'),
('Mahipal Lomror', 9, 'balanced', 'middleorder', 67, 'none', 45,'batsman'),
('Rahul Tewatia', 9, 'aggressive', 'finisher', 72, 'none', 64,'allrounder'),
('Rashid Khan', 9, 'aggressive', 'finisher', 66, 'spin', 91,'allrounder'),
('Sai Kishore', 9, 'aggressive', 'finisher', 68, 'spin', 72,'allrounder'),
('Prasidh Krishna', 9, 'defensive', 'lowerorder', 39, 'fast', 81,'bowler'),
('Mohammed Siraj', 9, 'defensive', 'lowerorder', 46, 'fast', 88,'bowler'),
('Kagiso Rabada', 9, 'defensive', 'lowerorder', 34, 'fast', 86,'bowler');

-- Team 10 (Royal Challengers Bangalore)
INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating, type) VALUES
('Virat Kohli', 10, 'balanced', 'opener', 92, 'none', 12,'batsman'),
('Devdutt Padikkal', 10, 'balanced', 'opener', 72, 'none', 32,'batsman'),
('Phil Salt', 10, 'balanced', 'top order', 81, 'none', 24,'batsman'),
('Rajat Patidar', 10, 'aggressive', 'middleorder', 69, 'none', 21,'batsman'),
('Liam Livingstone', 10, 'aggressive', 'middleorder', 81, 'spin', 69,'allrounder'),
('Tim David', 10, 'aggressive', 'finisher', 79, 'none', 45,'batsman'),
('Krunal Pandya', 10, 'aggressive', 'finisher', 67, 'spin', 73,'allrounder'),
('Yash Dayal', 10, 'defensive', 'lowerorder', 49, 'fast', 67,'bowler'),
('Bhuvneshwar Kumar', 10, 'defensive', 'lowerorder', 45, 'fast', 88,'bowler'),
('Josh Hazlewood', 10, 'defensive', 'lowerorder', 47, 'fast', 81,'bowler'),
('Lungi Ngidi', 10, 'defensive', 'lowerorder', 45, 'fast', 72,'bowler');
