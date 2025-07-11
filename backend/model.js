class User {
    constructor(username, email, age, password, is_admin) {
        this.username = username;
        this.email = email;
        this.age = age;
        this.id = "";
        this.password = password;
        this.is_admin = is_admin;
    }

    async save(db_con) {
        // execute will internally call prepare and query
        const [results, fields] = await db_con.execute(
            'INSERT INTO Users(email, username, age, password, is_admin) VALUES(?, ?, ?, ?, ?)',
            [this.email, this.username, this.age, this.password, this.is_admin]
        );
        console.log(results)
    }
    static async getUserByEmail(db_con, email) {
        const [results, fields] = await db_con.execute(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );
        if (results.length == 0) {
            console.log("no email found");
            throw new Error(`email ${email} doesn't exist`);
        }
        return Object.assign(new User(), results[0]);
    }

    static async getUserById(db_con, id) {
        const [results, fields] = await db_con.execute(
            'SELECT * FROM Users WHERE id = ?',
            [id]
        );
        if (results.length == 0) {
            throw new Error(`id ${id} doesn't exist`);
        }
        return Object.assign(new User(), results[0]);

    }
}

class UserAttendance {
    constructor(user_id, time, photo_proof) {
        this.user_id = user_id;
        this.id = "";
        this.time = time;
        this.photo_proof = photo_proof;
    }
}

class UserSession {
    constructor(user_id, token) {
        this.user_id = user_id;
        this.id = "";
        this.token = token;
    }

    async save(db_con) {
        const [results, fields] = await db_con.execute(
            'INSERT INTO UserSessions(user_id, token) VALUES(?, ?)',
            [this.user_id, this.token]
        );
        console.log(results)
    }

    static async get_user(db_con, token) {
        const [results, fields] = await db_con.execute(
            'SELECT user_id FROM UserSessions WHERE token = ?',
            [this.token]
        );
        if (results.length == 0){
            throw new Error(`Token not valid`);
        }
        let user_id = results[0].user_id;
        User.getUserByEmail
        console.log()
    }
}

module.exports = { User, UserAttendance };
