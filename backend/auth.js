const { User, UserAttendance, UserSession } = require('./model');
async function requireLogin(db_con, req, is_admin_required) {
    let token = req.headers["authorization"];
    if (token == null){
        throw new Error("Auth token not provided in authorization");
    }
    let user = await UserSession.getUser(db_con, token)
    if (is_admin_required && !user.is_admin){
        throw new Error("user must be an admin");
    }
    return user;

}

module.exports = { requireLogin };
