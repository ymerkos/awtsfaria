//B"H
//<?Awtsmoos
console.log(this.olam,"ol")
exports.hi = "wow";
// B"H
/**
 * This script is responsible for logging in existing users in our system.
 * It uses a custom database object, `DosDB`, for reading user data,
 * and includes logic to limit the number of new accounts that can be
 * logged in at a time from a single IP address.
 *
 * @fileoverview User registration script.
 * @requires sodos
 * @requires DosDB
 * @requires crypto
 */

// Import the crypto library for generating a token
const crypto = require('crypto');

// Import the password hashing functions from sodos.js.
const sodos = require("./sodos.js");
// Import the DosDB database object.
const DosDB = require(process.env.__awtsdir+"/ayzarim/DosDB.js");
// Create a new DosDB instance, pointing it to our user database.
const db = new DosDB(process.awtsmoosDbPath + '/users');

/**
 * This function handles existing user login requests.
 * It expects a POST request with a username and password.
 * It checks if the user has exceeded the limit of new accounts,
 * then checks the hashed password of the user in the database.
 *
 * @function
 * @name handleLogin
 * @param {Object} request - The incoming HTTP request.
 */
async function handleLogin(request,$_POST) {
    // Get the client's IP address.
    // We use 'x-forwarded-for' to get the original IP if our app is behind a proxy (like Nginx or Heroku).
    var ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    ip = ip.replace(/:/g, '-');
    // Get the user's input from the POST request.
    const { username, password } = $_POST;
    
    if (username && password) {
        // Get the login attempts from this IP address.
        let loginAttempts = await db.get("../ipAddresses/"+ip+"/login") || [];
    
        const now = Date.now();
    
        // Filter out any login attempts that are more than an hour old.
        loginAttempts = loginAttempts.filter(attempt => now - attempt < 60 * 60 * 1000);
    
        // Check if the user has exceeded the limit of 5 log in attempts.
        if (loginAttempts.length >= 5) {
            // Calculate the time when the user can attempt to login again.
            // This is one hour after their first recorded login attempt.
            const nextAttemptTime = new Date(loginAttempts[0] + 60 * 60 * 1000);
    
            return { 
                status: "error", 
                message: "Sorry, you've exceeded the limit for logins now. Please try again after " + nextAttemptTime.toLocaleString(),
                nextAttemptTime
            };
        }
    
        // Add the current login attempt to the array.
        loginAttempts.push(now);
    
        // If there are more than 5 items in the array, remove the oldest one.
        while (loginAttempts.length > 5) {
            loginAttempts.shift();
        }
        
        //determine if user exists
        const user = await db.get(username+"/account");

        if(!user) {
            return { status: "error", message: "No user with that username found!" };
        }

        //check plaintext password with hashed and salted one.
        
        const passwordsMatch = sodos.verifyPassword(
            password,
            user.password,
            user.salt
        )

        if(!passwordsMatch) {

            // Increment the user count for this IP address.
            //await db.update(ip+"_info/logins", userCount + 1);
            return { status: "error", message: "The passwords don't match. You have "+userCount +" more tries for today." };
        }

        const token = crypto.randomBytes(64).toString('hex');
        var sessionObj = {
            token,
            time: Date.now()
        }
        await db.write("sessions/"+token, sessionObj);
        
        // Store the updated array of login attempts.
        await db.write("../ipAddresses/"+ip+"info/logins", loginAttempts);

        return { status: "success", message: "Successfully logged in!", token: token };
    } else {
        return { status: "neutral", message: "Please fill out the form to login."};
    }
}

module.exports.handleLogin = handleLogin;

//?>