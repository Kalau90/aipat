require("dotenv-flow").config();
const basicAuth = require('express-basic-auth')
const ced_code = process.env.CED_CODE || "1234";

function getUnauthorizedResponse(req) {
    return req.auth
        ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
        : 'No credentials provided'
}

function myAuthorizer(username, password) {
    const userMatches = basicAuth.safeCompare(username, 'ced')
    const passwordMatches = basicAuth.safeCompare(password, ced_code)

    return userMatches & passwordMatches
}

module.exports = basicAuth({
    authorizer: myAuthorizer,
    unauthorizedResponse: getUnauthorizedResponse,
    challenge: true
})