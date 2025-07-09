USE db;

CREATE TABLE Users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	username VARCHAR(50) NOT NULL UNIQUE,
	age INT,
	password VARCHAR(255) NOT NULL,
	is_admin BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE UserAttendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, 
    time DATETIME NOT NULL,
    photo_proof BLOB NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

INSERT INTO Users(email, username, age, password, is_admin) VALUES("admin@gmail.com", "admin", 30, "adminpassword", TRUE);
