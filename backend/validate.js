var emailValidator = require("email-validator");

function validateUserJson(body) {
    let errors = []

    if (!body["email"]) {
        errors.push("email can't be empty")
    }

    if (!body["username"]) {
        errors.push("username can't be empty")
    }

    if (!body["age"]) {
        errors.push("age can't be empty")
    }

    if (!body["password"]) {
        errors.push("password can't be empty")
    }


    if (!emailValidator.validate(body["email"])) {
        errors.push("email is invalid")
    }
    return errors.join("\n");

}

function validateLoginJson(body) {
    let errors = []

    if (!body["email"]) {
        errors.push("email can't be empty")
    }
    if (!body["password"]) {
        errors.push("password can't be empty")
    }

    if (!emailValidator.validate(body["email"])) {
        errors.push("email is invalid")
    }
    return errors.join("\n");

}
module.exports = { validateUserJson, validateLoginJson }