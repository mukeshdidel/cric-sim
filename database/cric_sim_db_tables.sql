CREATE DATABASE  cric_sim_db;
use cric_sim_db;

select * from players where team_id = 1;
select * from player_stat;
select * from league_table;
select * from schedule;

truncate league_table;
truncate player_stat;
select player_name, mvp_points from players join player_stat on player_stat.player_id = players.player_id where players.team_id = 4;
select count(*) from players  where bat_posi = 'finisher' and bowl_rating <= 60;

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
																							



update players set bowl_rating = 83 where player_id = 186;

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
        (sixes * 3.5) +
        (wickets * 3.5) +
        (dots_b * 1)         
    ),
    
    UNIQUE (player_id, s_season, team_id),
    
    foreign key(player_id) references players(player_id),
    foreign key(team_id) references teams(team_id)
);

ALTER TABLE player_stat
modify mvp_points DECIMAL(10,2) generated always AS (
    (fours * 2.5) +
    (sixes * 3.5) +
    (wickets * 3.5) +
    (dots_b * 1) 
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

insert into players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating) values ( 'Ruturaj Gaikwad',1,'balanced','opener',78,'none',32),
																														( 'Devon Conway',1,'balanced','opener',84,'none',30 ),
																														( 'Rachin Ravindra',1,'balanced','top order',81,'spin',64),
																														( 'Rahul Tripathi',1,'aggressive','top order',71,'none',26),
																														( 'Shivam Dube',1,'aggressive','middleorder',78,'fast',52),
																														( 'Ravindra Jadeja',1,'aggressive','middleorder',74,'spin',79),
																														( 'MS Dhoni',1,'aggressive','finisher',83,'none',20),
																														( 'Sam Curran',1,'aggressive','finisher',71,'fast',74),
																														( 'Ravichandran Ashwin',1,'defensive','lowerorder',62,'spin',87),
																														( 'Khaleel Ahmed',1,'defensive','lowerorder',43,'fast',73),
																														( 'Matheesha Pathirana',1,'defensive','lowerorder',46,'fast',85);
insert into players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_order, bowl_rating) values ( 'Yashasvi Jaiswal',2,'aggressive','opener',84,'none',43),
																														( 'Sanju Samson',2,'aggressive','top order',87,'none',21),
																														( 'Nitish Rana',2,'balanced','top order',76,'spin',49),
																														( 'Riyan Parag',2,'aggressive','middleorder',78,'spin',54),
																														( 'Dhruv Jurel',2,'aggressive','finisher',74,'none',21),
																														( 'Shimron Hetmyer',2,'aggressive','finisher',79,'none',21),
																														( 'Jofra Archer',2,'aggressive','lowerorder',63,'fast',94),
																														( 'Wanindu Hasaranga',2,'aggressive','lowerorder',61,'spin',83),
																														( 'Maheesh Theekshana',2,'defensive','lowerorder',43,'fast',72),
																														( 'Tushar Deshpande',2,'defensive','lowerorder',45,'spin',71),
																														( 'Sandeep Sharma',2,'defensive','lowerorder',39,'fast',82);
INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating) VALUES
('Rohit Sharma', 3, 'aggressive', 'opener', 87, 'none', 12),
('Will Jacks', 3, 'balanced', 'opener', 81, 'fast', 56),
('Tilak Varma', 3, 'balanced', 'middleorder', 82, 'none', 21),
('Suryakumar Yadav', 3, 'aggressive', 'middleorder', 87, 'none', 18),
('Hardik Pandya', 3, 'aggressive', 'finisher', 79, 'fast', 84),
('Robin Minz', 3, 'balanced', 'middleorder', 71, 'none', 12),
('Naman Dhir', 3, 'aggressive', 'finisher', 62, 'none', 21),
('Deepak Chahar', 3, 'defensive', 'lowerorder', 43, 'fast', 82),
('Mitchell Santner', 3, 'defensive', 'lowerorder', 46, 'spin', 78),
('Jasprit Bumrah', 3, 'defensive', 'lowerorder', 38, 'fast', 95),
('Trent Boult', 3, 'defensive', 'lowerorder', 41, 'fast', 91);

                                                                                        
INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating) VALUES
('Prabhsimran Singh', 4, 'balanced', 'opener', 68, 'none', 21),
('Josh Inglis', 4, 'balanced', 'opener', 71, 'none', 24),
('Shreyas Iyer', 4, 'balanced', 'top order', 86, 'none', 21),
('Glenn Maxwell', 4,'aggressive', 'middleorder', 84, 'spin', 57),
('Marcus Stoinis', 4, 'aggressive', 'finisher', 79, 'fast', 68),
('Shashank Singh', 4,'aggressive', 'middleorder', 69, 'none', 43),
('Marco Jansen', 4, 'aggressive', 'finisher', 71, 'fast', 45),
('Harpreet Brar', 4, 'defensive', 'lowerorder', 43, 'spin', 72),
('Lockie Ferguson', 4, 'defensive', 'lowerorder', 46, 'fast', 78),
('Arshdeep Singh', 4, 'defensive', 'lowerorder', 46, 'fast', 82),
('Yuzvendra Chahal', 4, 'defensive', 'lowerorder', 35, 'spin', 86);


INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating) VALUES
('Travis Head', 5, 'aggressive', 'opener', 89, 'spin', 56),
('Abhishek Sharma', 5, 'aggressive', 'opener', 82, 'none', 43),
('Ishan Kishan', 5, 'aggressive', 'opener', 78, 'none', 21),
('Nitish Kumar Reddy', 5, 'balanced', 'middleorder', 71, 'none', 43),
('Heinrich Klaasen', 5, 'balanced', 'middleorder', 82, 'none', 34),
('Abhinav Manohar', 5, 'balanced', 'middleorder', 67, 'none', 45),
('Pat Cummins', 5, 'balanced', 'lowerorder', 61, 'fast', 89),
('Harshal Patel', 5, 'defensive', 'lowerorder', 55, 'fast', 79),
('Mohammad Shami', 5, 'defensive', 'lowerorder', 49, 'fast', 90),
('Rahul Chahar', 5, 'defensive', 'lowerorder', 42, 'spin', 68),
('Jaydev Unadkat', 5, 'defensive', 'lowerorder', 48, 'fast', 67);

                                                                                        
INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating) VALUES
('Sunil Narine', 6, 'aggressive', 'opener', 79, 'spin', 86),
('Quinton de Kock', 6, 'balanced', 'opener', 83, 'none', 21),
('Venkatesh Iyer', 6, 'balanced', 'top order', 72, 'fast', 56),
('Moeen Ali', 6, 'balanced', 'middleorder', 73, 'spin', 68),
('Rinku Singh', 6, 'aggressive', 'finisher', 79, 'none', 34),
('Andre Russell', 6, 'aggressive', 'finisher', 82, 'fast', 61),
('Rovman Powell', 6, 'aggressive', 'finisher', 73, 'none', 51),
('Anrich Nortje', 6, 'defensive', 'lowerorder', 36, 'fast', 79),
('Umran Malik', 6, 'defensive', 'lowerorder', 41, 'fast', 75),
('Harshit Rana', 6, 'defensive', 'lowerorder', 35, 'fast', 76),
('Varun Chakaravarthy', 6, 'defensive', 'lowerorder', 35, 'spin', 81);

                                                                                        
INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating) VALUES
('KL Rahul', 7, 'balanced', 'opener', 87, 'none', 12),
('Faf du Plessis', 7, 'balanced', 'opener', 83, 'none', 12),
('Harry Brook', 7, 'aggressive', 'top order', 78, 'none', 32),
('Jake Fraser-McGurk', 7, 'balanced', 'middleorder', 75, 'none', 23),
('Karun Nair', 7, 'balanced', 'middleorder', 68, 'none', 21),
('Tristan Stubbs', 7, 'aggressive', 'finisher', 74, 'none', 43),
('Axar Patel', 7, 'balanced', 'lowerorder', 65, 'spin', 79),
('Mitchell Starc', 7, 'defensive', 'lowerorder', 54, 'fast', 88),
('T Natarajan', 7, 'defensive', 'lowerorder', 34, 'fast', 79),
('Mukesh Kumar', 7, 'defensive', 'lowerorder', 32, 'fast', 68),
('Kuldeep Yadav', 7, 'defensive', 'lowerorder', 34, 'spin', 81);

																					
INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating) VALUES
('Aiden Markram', 8, 'balanced', 'opener', 76, 'none', 34),
('Mitchell Marsh', 8, 'balanced', 'opener', 79, 'none', 32),
('Nicholas Pooran', 8, 'aggressive', 'middleorder', 75, 'none', 21),
('Rishabh Pant', 8, 'aggressive', 'middleorder', 86, 'none', 12),
('David Miller', 8, 'aggressive', 'middleorder', 82, 'none', 32),
('Ayush Badoni', 8, 'aggressive', 'finisher', 71, 'none', 55),
('Shahbaz Ahmed', 8, 'aggressive', 'finisher', 67, 'spin', 68),
('Shardhul Thakur', 8, 'defensive', 'lowerorder', 54, 'fast', 82),
('Ravi Bishnoi', 8, 'defensive', 'lowerorder', 35, 'spin', 71),
('Avesh Khan', 8, 'defensive', 'lowerorder', 45, 'fast', 73),
('Mayank Yadav', 8, 'defensive', 'lowerorder', 43, 'fast', 67);


                                                                                        
                                                                                        
-- Team 9 (Rajasthan Royals)
INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating) VALUES
('Shubman Gill', 9, 'balanced', 'opener', 82, 'none', 21),
('Jos Buttler', 9, 'aggressive', 'opener', 91, 'none', 21),
('Sai Sudharsan', 9, 'aggressive', 'top order', 78, 'none', 45),
('Washington Sundar', 9, 'balanced', 'middleorder', 72, 'spin', 63),
('Mahipal Lomror', 9, 'balanced', 'middleorder', 67, 'none', 45),
('Rahul Tewatia', 9, 'aggressive', 'finisher', 72, 'none', 64),
('Rashid Khan', 9, 'aggressive', 'finisher', 66, 'spin', 91),
('Sai Kishore', 9, 'aggressive', 'finisher', 68, 'spin', 72),
('Prasidh Krishna', 9, 'defensive', 'lowerorder', 39, 'fast', 81),
('Mohammed Siraj', 9, 'defensive', 'lowerorder', 46, 'fast', 88),
('Kagiso Rabada', 9, 'defensive', 'lowerorder', 34, 'fast', 86);

-- Team 10 (Royal Challengers Bangalore)
INSERT INTO players (player_name, team_id, bat_style, bat_posi, bat_rating, bowl_style, bowl_rating) VALUES
('Virat Kohli', 10, 'balanced', 'opener', 92, 'none', 12),
('Devdutt Padikkal', 10, 'balanced', 'opener', 72, 'none', 32),
('Phil Salt', 10, 'balanced', 'top order', 81, 'none', 24),
('Rajat Patidar', 10, 'aggressive', 'middleorder', 69, 'none', 21),
('Liam Livingstone', 10, 'aggressive', 'middleorder', 81, 'spin', 69),
('Tim David', 10, 'aggressive', 'finisher', 79, 'none', 45),
('Krunal Pandya', 10, 'aggressive', 'finisher', 67, 'spin', 73),
('Yash Dayal', 10, 'defensive', 'lowerorder', 49, 'fast', 67),
('Bhuvneshwar Kumar', 10, 'defensive', 'lowerorder', 45, 'fast', 88),
('Josh Hazlewood', 10, 'defensive', 'lowerorder', 47, 'fast', 81),
('Lungi Ngidi', 10, 'defensive', 'lowerorder', 45, 'fast', 72);
