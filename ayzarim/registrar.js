// B"H
/**
 * This script is responsible for registering new users in our system.
 * It uses a custom database object, `DosDB`, for storing user data,
 * and includes logic to limit the number of new accounts that can be
 * created from a single IP address.
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
 * This function handles new user registration requests.
 * It expects a POST request with a username and password.
 * It checks if the user has exceeded the limit of new accounts,
 * then hashes the password and stores the new user in the database.
 *
 * @function
 * @name handleRegistration
 * @param {Object} request - The incoming HTTP request.
 */
async function handleRegistration(request) {
    // Get the client's IP address.
    // We use 'x-forwarded-for' to get the original IP if our app is behind a proxy (like Nginx or Heroku).
    // Fall back to request.connection.remoteAddress if 'x-forwarded-for' is not available.
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

    // Get the user's input from the POST request.
    // We expect the client to send a JSON body with a username and password.
    const { username, password } = request.body;

    if (username && password) {
        // Get the number of accounts already created from this IP address.
        const userCount = await db.get(ip) || 0;

        // Check if the user has exceeded the limit of 5 new accounts.
        if (userCount >= 5) {
            exports.result = "Sorry, you've exceeded the limit for new accounts today. Please try again tomorrow.";
            return;
        }

        // Hash the user's password using our custom password hashing function.
        const salt = sodos.generateSalt(16);
        const hashedPassword = sodos.hashPassword(password, salt);

        // Add the new user to the database, storing the hashed password and the salt.
        await db.create(username, { password: hashedPassword, salt });

        // Increment the user count for this IP address.
        await db.update(ip, userCount + 1);

        exports.result = "Successfully created new user!";
    } else {
        exports.result = "Please fill out the form to register.";
    }
}

handleRegistration(request);