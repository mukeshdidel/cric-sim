use cric_sim;



select * from teams;
select * from league_table;
select * from schedule;
select * from players;
select * from player_stat;

truncate player_stat;

ALTER TABLE player_stat 
ADD CONSTRAINT unique_player_season 
UNIQUE (player_id, s_season);

ALTER TABLE league_table  
ADD CONSTRAINT unique_league_season  
UNIQUE (team_id, season);

select team_id, team_name,matches, wins, losses, draws, points from teams natural join league_table where season = 2 order by points desc ;


update league_table set wins = 0,losses = 0, draws = 0, matches = 0;
SET SQL_SAFE_UPDATES = 1;
select * from  player_stat natural join players natural join teams;

update players set team_id = 2 where player_id = 95;
select * from players where team_id=3;
select * from teams;
insert into players (player_name, team_id , bat_rat,bowl_rat, p_role, bat_style) values ( 'Ruturaj Gaikwad',3,78,32,'batsman','balanced' ),
																						( 'Devon Conway',3,84,30,'batsman','balanced' ),
                                                                                        ( 'Rachin Ravindra',3,81,64,'allrounder','balanced' ),
                                                                                        ( 'Rahul Tripathi',3,71,26,'batsman','attacker' ),
                                                                                        ( 'Shivam Dube',3,78,52,'allrounder','attacker' ),
                                                                                        ( 'Ravindra Jadeja',3,74,79,'allrounder','attacker'),
                                                                                        ( 'MS Dhoni',3,83,20,'batsman','attacker' ),
                                                                                        ( 'Sam Curran',3,71,74,'allrounder','attacker' ),
                                                                                        ( 'Ravichandran Ashwin',3,62,87,'allrounder','defensive' ),
                                                                                        ( 'Khaleel Ahmed',3,43,73,'baller','defensive' ),
                                                                                        ( 'Matheesha Pathirana',3,46,83,'baller','defensive');
insert into players (player_name, team_id , bat_rat,bowl_rat, p_role, bat_style) values ( 'Yashasvi Jaiswal',1,86,43,'batsman','attacker' ),
																						( 'Sanju Samson',1,87,21,'batsman','balanced' ),
                                                                                        ( 'Nitish Rana',1,76,43,'batsman','balanced' ),
                                                                                        ( 'Riyan Parag',1,78,54,'batsman','attacker' ),
                                                                                        ( 'Dhruv Jurel',1,74,21,'batsman','balanced' ),
                                                                                        ( 'Shimron Hetmyer',1,79,21,'batsman','attacker' ),
                                                                                        ( 'Jofra Archer',1,63,94,'allrounder','attacker' ),
                                                                                        ( 'Wanindu Hasaranga',1,61,83,'allrounder','balanced' ),
                                                                                        ( 'Maheesh Theekshana',1,43,72,'baller','defensive' ),
                                                                                        ( 'Tushar Deshpande',1,45,71,'baller','defensive' ),
                                                                                        ( 'Sandeep Sharma',1,39,82,'baller','defensive' );
insert into players (player_name, team_id , bat_rat,bowl_rat, p_role, bat_style) values ( 'Rohit Sharma',2,87,21,'batsman','attacker' ),
																						( 'Will Jacks',2,81,56,'batsman','balanced' ),
                                                                                        ( 'Tilak Varma',2,82,21,'batsman','balanced' ),
                                                                                        ( 'Suryakumar Yadav',2,87,23,'batsman','attacker'),
                                                                                        ( 'Hardik Pandya',2,89,79,'allrounder','attacker'),
                                                                                        ( 'Robin Minz',2,71,21,'batsman','balanced' ),
                                                                                        ( 'naman dhir',3,62,49,'batsman','attacker' ),
                                                                                        ( 'Deepak Chahar',2,43,82,'baller','defensive'),
                                                                                        ( 'Mitchell Santner',2,46,78,'baller','defensive' ),
                                                                                        ( 'Jasprit Bumrah',2,43,95,'baller','defensive' ),
                                                                                        ( 'Trent Boult',2,47,91,'baller','defensive' );
                                                                                        
insert into players (player_name, team_id , bat_rat,bowl_rat, p_role, bat_style) values ( 'Prabhsimran singh',4,68,21,'batsman','balanced' ),
																						( 'Josh Inglis',4,71,24,'batsman','balanced' ),
                                                                                        ( 'Shreyas Iyer',4,86,21,'batsman','balanced' ),
                                                                                        ( 'Glenn Maxwell',4,84,57,'allrounder','attacker' ),
                                                                                        ( 'Marcus Stonis',4,79,68,'allrounder','attacker' ),
                                                                                        ( 'Shashank Singh',4,69,43,'batsman','attacker' ),
                                                                                        ( 'Marco Jansen',4,71,45,'batsman','attacker' ),
                                                                                        ( 'Harpreet Bra',4,43,72,'baller','defensive' ),
                                                                                        ( 'Lockie Ferguson',4,46,78,'baller','defensive' ),
                                                                                        ( 'Arshdeep Singh',4,46,82,'baller','defensive' ),
                                                                                        ( 'Yuzvendra Chahal',4,35,86,'baller','defensive' );

insert into players (player_name, team_id , bat_rat,bowl_rat, p_role, bat_style) values ( 'Travis Head',5,89,56,'allrounder','attacker' ),
																						( 'Abhishek Sharma',5,82,43,'batsman','attacker' ),
                                                                                        ( 'Ishan Kishan',5,78,21,'batsman','attacker' ),
                                                                                        ( 'Nitish Kumar Reddy',5,71,43,'batsman','balanced' ),
                                                                                        ( 'Heinrich Klaasen ',5,82,34,'batsman','balanced' ),
                                                                                        ( 'Abhinav Manohar',5,67,45,'batsman','balanced' ),
                                                                                        ( 'Pat Cummins',5,61,89,'allrounder','balanced' ),
                                                                                        ( 'Harshal Patel',5,55,79,'baller','defensive' ),
                                                                                        ( 'Mohammad Shami',5,49,90,'baller','defensive' ),
																						( 'Rahul Chahar',5,42,68,'baller','defensive' ),
                                                                                        ( 'Jaydev Unadkat',5,48,67,'baller','defensive' );
                                                                                        
insert into players (player_name, team_id , bat_rat,bowl_rat, p_role, bat_style) values ( 'Sunil Narine',6,79,86,'alllrounder','attacker' ),
																						( 'Quinton de Kock',6,83,21,'batsman','balanced' ),
                                                                                        ( 'Venkatesh Iyer',6,72,56,'allrounder','balanced' ),
                                                                                        ( 'Moeen Ali',6,73,68,'allrounder','balanced' ),
                                                                                        ( 'Rinku Singh',6,79,34,'batsman','attacker' ),
                                                                                        ( 'Andre Russell',6,82,61,'allrounder','attacker' ),
                                                                                        ( 'Rovman Powell',6,73,51,'batsman','attacker' ),
                                                                                        ( 'Anrich Nortje',6,36,79,'baller','defensive' ),
                                                                                        ( 'Umran Malik',6,41,75,'baller','defensive' ),
                                                                                        ( 'Harshit Rana',6,35,76,'baller','defensive' ),
                                                                                        ( 'Varun Chakaravarthy',6,35,81,'baller','defensive' );
                                                                                        
insert into players (player_name, team_id , bat_rat,bowl_rat, p_role, bat_style) values ( 'KL Rahul',7,87,12,'batsman','balanced' ),
																						( 'Faf du Plessis',7,83,12,'batsman','balanced' ),
                                                                                        ( 'Harry Brook',7,78,32,'batsman','balanced' ),
                                                                                        ( 'Jake Fraser-McGurk',7,75,23,'batsman','balanced' ),
                                                                                        ( 'Karun Nair',7,68,21,'batsman','balanced' ),
                                                                                        ( 'Tristan Stubbs',7,74,43,'batsman','balanced' ),
                                                                                        ( 'Axar Patel',7,65,79,'allrounder','balanced' ),
                                                                                        ( 'Mitchell Starc',7,54,88,'baller','defensive' ),
                                                                                        ( 'T Natarajan',7,34,79,'baller','defensive' ),
                                                                                        ( 'Mukesh Kumar',7,32,68,'baller','defensive' ),
                                                                                        ( 'Kuldeep Yadav',7,34,81,'baller','defensive' );
																					
insert into players (player_name, team_id , bat_rat,bowl_rat, p_role, bat_style) values ( 'Rishabh Pant',8,86,12,'batsman','attacker' ),
																						( 'Mitchell Marsh',8,79,32,'batsman','balanced' ),
                                                                                        ( 'Nicholas Pooran',8,75,21,'batsman','attacker' ),
                                                                                        ( 'Aiden Markram',8,76,34,'batsman','balanced' ),
                                                                                        ( 'David Miller',8,82,32,'batsman','attacker' ),
                                                                                        ( 'Ayush Badoni',8,71,55,'allrounder','attacker' ),
                                                                                        ( 'Shahbaz Ahmed',8,67,63,'allrounder','attacker' ),
                                                                                        ( 'Ravi Bishnoi',8,35,71,'baller','defensive'  ),
                                                                                        ( 'Avesh Khan',8,45,73,'baller','defensive'  ),
                                                                                        ( 'Mayank Yadav',8,43,67,'baller','defensive'  ),
                                                                                        ( 'Mohsin Khan',8,34,69,'baller','defensive' );
                                                                                        
                                                                                        
insert into players (player_name, team_id , bat_rat,bowl_rat, p_role, bat_style) values ( 'Shubman Gill',9,82,21,'batsman','balanced' ),
																						( 'Jos Buttler',9,91,21,'batsman','attacker' ),
                                                                                        ( 'Glenn Phillips',9,78,45,'batsman','attacker' ),
                                                                                        ( 'Washington Sundar',9,72,63,'allrounder','balanced' ),
                                                                                        ( 'Mahipal Lomror',9,67,45,'batsman','balanced' ),
                                                                                        ( 'Sai Kishore',9,68,58,'allrounder','attacker' ),
                                                                                        ( 'Rahul Tewatia',9,68,67,'allrounder','attacker' ),
                                                                                        ( 'Rashid Khan',9,66,91,'allrounder','attacker' ),
                                                                                        ( 'Prasidh Krishna',9,52,81,'baller','defensive' ),
                                                                                        ( 'Mohammed Siraj',9,56,88,'baller','defensive' ),
                                                                                        ( 'Kagiso Rabada',9,34,86,'baller','defensive' );
                                                                                        
insert into players (player_name, team_id , bat_rat,bowl_rat, p_role, bat_style) values ( 'Virat Kohli',10,92,12,'batsman','balanced' ),
																						( 'Devdutt Padikkal',10,72,32,'batsman','balanced' ),
                                                                                        ( 'Phil Salt',10,81,24,'batsman','balanced' ),
                                                                                        ( 'Rajat Patidar',10,69,21,'batsman','attacker' ),
                                                                                        ( 'Liam Livingstone',10,81,61,'allrounder','attacker' ),
                                                                                        ( 'Tim David',10,79,45,'batsman','attacker' ),
                                                                                        ( 'Krunal Pandya',10,67,65,'allrounder','attacker' ),
                                                                                        ( 'Yash Dayal',10,49,67,'baller','defensive' ),
                                                                                        ( 'Bhuvneshwar Kumar',10,45,88,'baller','defensive' ),
                                                                                        ( 'Josh Hazlewood',10,47,81,'baller','defensive' ),
                                                                                        ( 'Lungi Ngidi',10,45,69,'baller','defensive' );