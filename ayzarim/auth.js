/**
 * B"H
 * @file auth.js
 * @module auth checks current user in session
 * @requires DosDB
 */
var {validateToken} = require("./sodos.js");


class AwtsmoosAuth {
    secret = "";
    async sessionMiddleware(request) {
        const token = request.cookies.awtsmoosKey;
        
        var valid = validateToken(token, this.secret);
        if(valid) {
            request.user = {
                authorized: true,
                username: token
            }
        } else request.user = null;
        return request.user;
    }
    constructor(secret) {
        this.secret = secret;
    }
}
 


module.exports = AwtsmoosAuth