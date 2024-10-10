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
        var token = request.cookies.awtsmoosKey;
        var decoded;
        try {
            decoded = decodeURIComponent(token);
        } catch(e) {
            decoded = token;
        }
        var valid;
        try {
            valid = validateToken(decoded, this.secret);
        } catch(e) {}

        if(valid) {
            var json = valid;
            try {
                json = JSON.parse(Buffer.from(
                    valid,
                    "base64"
                ).toString());
            } catch(e){}
            if(json.entry) {
                json.userId = json.entry
            }
            request.user = {
                authorized: true,
                info: json
            }
        } else request.user = null;
        return request.user;
    }
    constructor(secret) {
        this.secret = secret;
    }
}
 


module.exports = AwtsmoosAuth
