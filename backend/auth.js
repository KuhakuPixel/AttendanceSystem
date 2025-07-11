const { User, UserAttendance, UserSession } = require('./model');
async function requireLogin(db_con, req, is_admin_required) {
    let token = req.headers["authorization"];
    if (token == null){
        throw new Error("Auth token not provided in authorization");
    }
    console.log("token is " + token);
    let user = await UserSession.get_user(db_con, token)
    if (is_admin_required && !user.is_admin){
        throw new Error("user must be an admin");
    }
    return user;

}

module.exports = { requireLogin };