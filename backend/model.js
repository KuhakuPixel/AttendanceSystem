class User {
    constructor(username, email, age, password, is_admin) {
        this.username = username;
        this.email = email;
        this.age = age;
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
}

class UserAttendance {
    constructor(user_id, time, photo_proof) {
        this.user_id = user_id;
        this.time = time;
        this.photo_proof = photo_proof;
    }
}
module.exports = { User, UserAttendance };
