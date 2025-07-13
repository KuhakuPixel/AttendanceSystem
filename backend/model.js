class User {
    constructor(username, email, age, password, is_admin) {
        this.username = username
        this.email = email
        this.age = age
        this.id = null
        this.password = password
        this.is_admin = is_admin
    }

    async save(db_con) {
        // execute will internally call prepare and query
        if (this.id == null) {
            const [results, fields] = await db_con.execute(
                'INSERT INTO Users(email, username, age, password, is_admin) VALUES(?, ?, ?, ?, ?)',
                [this.email, this.username, this.age, this.password, this.is_admin]
            )
            console.log(results)
        }
        else {
            const [results, fields] = await db_con.execute(
                'UPDATE Users SET email = ?, username = ?, age = ?, password = ?, is_admin = ? WHERE id = ?',
                [this.email, this.username, this.age, this.password, this.is_admin, this.id]
            )

            console.log(results)
        }
    }
    async delete(db_con) {
        const [results, fields] = await db_con.execute(
            'DELETE FROM Users WHERE id = ?',
            [this.id]
        )
        console.log(results)


    }

    static async getAll(db_con) {
        const [results, fields] = await db_con.execute('SELECT * FROM Users')
        return results
    }
    static async getUserByEmail(db_con, email) {
        const [results, fields] = await db_con.execute(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        )
        if (results.length == 0) {
            console.log('no email found')
            throw new Error(`email ${email} doesn't exist`)
        }
        let user = new User()
        Object.assign(user, results[0])
        return user;
    }

    static async getUserById(db_con, id) {
        const [results, fields] = await db_con.execute(
            'SELECT * FROM Users WHERE id = ?',
            [id]
        )
        if (results.length == 0) {
            throw new Error(`id ${id} doesn't exist`)
        }
        let user = new User()
        Object.assign(user, results[0])
        return user;
    }
}

class UserAttendance {
    constructor(user_id, time, photo_proof, check_in_out_type) {
        this.user_id = user_id
        this.id = null
        this.time = time
        this.photo_proof = photo_proof
        this.check_in_out_type = check_in_out_type // checkin/checkout
    }

    async save(db_con) {
        const [results, fields] = await db_con.execute(
            'INSERT INTO UserAttendances(user_id, time, photo_proof, check_in_out_type) VALUES(?, ?, ?, ?)',
            [this.user_id, this.time, this.photo_proof, this.check_in_out_type]
        )
        console.log(results)
    }

    static async getAll(db_con) {
        const [results, fields] = await db_con.execute(
            'SELECT * FROM UserAttendances;',
        )
        return results
    }

    static async getByDate(db_con, date, user_id) {
        let date_only = date.toISOString().split('T')[0]
        const [results, fields] = await db_con.execute(
            'SELECT * FROM UserAttendances WHERE user_id = ? AND DATE(time) = ?;',
            [user_id, date_only]
        )
        return results
    }

    static async getByDateAndType(db_con, date, user_id, check_in_out_type) {
        let date_only = date.toISOString().split('T')[0]
        const [results, fields] = await db_con.execute(
            'SELECT * FROM UserAttendances WHERE user_id = ? AND DATE(time) = ? AND check_in_out_type = ?;',
            [user_id, date_only, check_in_out_type]
        )
        return results
    }

    static async getAllByUser(db_con, user_id) {
        const [results, fields] = await db_con.execute(
            'SELECT * FROM UserAttendances WHERE user_id = ?',
            [user_id]
        )
        return results
    }
}

class UserSession {
    constructor(user_id, token) {
        this.user_id = user_id
        this.id = null
        this.token = token
    }

    async save(db_con) {
        // TODO: update if id is set
        const [results, fields] = await db_con.execute(
            'INSERT INTO UserSessions(user_id, token) VALUES(?, ?)',
            [this.user_id, this.token]
        )
        console.log(results)
    }

    static async getUser(db_con, token) {
        const [results, fields] = await db_con.execute(
            'SELECT user_id FROM UserSessions WHERE token = ?',
            [token]
        )
        if (results.length == 0) {
            throw new Error(`Token not valid`)
        }
        let user_id = results[0].user_id
        return User.getUserById(db_con, user_id)
    }
}

module.exports = { User, UserAttendance, UserSession }
