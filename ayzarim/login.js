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
 */

// Import the password hashing functions from sodos.js.
const sodos = require("./sodos.js");
// Import the DosDB database object.
const DosDB = require("./DosDB.js");
// Create a new DosDB instance, pointing it to our user database.
const db = new DosDB('../../dayuh/users');

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
async function handleLogin(request) {
    // Get the client's IP address.
    // We use 'x-forwarded-for' to get the original IP if our app is behind a proxy (like Nginx or Heroku).
    // Fall back to request.connection.remoteAddress if 'x-forwarded-for' is not available.
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;

    // Get the user's input from the POST request.
    // We expect the client to send a JSON body with a username and password.
    const { username, password } = request.body;

    if (username && password) {
        // Get the number of accounts already logged in from this IP address.
        const userCount = await db.get(ip+"_logins") || 0;

        // Check if the user has exceeded the limit of 5 log in attempts.
        if (userCount >= 5) {
            return "Sorry, you've exceeded the limit for logins today. Please try again tomorrow.";
            
        }
        //determine if user exists
        const user = await db.get(username);
        if(!user) {
            return "No user with that username found!"
        }

        //check plaintext password with hashed and salted one.
        
        const passwordsMatch = sodos.verifyPassword(
            password,
            user.password,
            user.salt
        )

        if(!passwordsMatch) {

            // Increment the user count for this IP address.
            await db.update(ip+"_logins", userCount + 1);
            return "The passwords don't match. <br>"
            +"You have "+userCount +" more tries for today."
        }

        //reset tries if successful
        await db.update(ip+"_logins", 0);
        return "Successfully logged in!";
    } else {
        return "Please fill out the form to login.";
    }
}

module.exports.handleLogin = handleLogin;
