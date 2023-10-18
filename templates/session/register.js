// B"H
//<?Awtsmoos
/**
 * This script is responsible for registering new users in our system.
 * It uses a custom database object, `DosDB`, for storing user data,
 * and includes logic to limit the number of new accounts that can be
 * created from a single IP address.
 *
 * @fileoverview User registration script.
 * @requires sodos
 * @requires DosDB
 * @requires crypto
 */

const crypto = require("crypto");
// Import the password hashing functions from sodos.js.
const sodos = require("../sodos.js");
// Import the DosDB database object.
const DosDB = require("../DosDB/index.js");
// Create a new DosDB instance, pointing it to our user database.
const db = new DosDB(process.awtsmoosDbPath + '/users');

/**
 * This function handles new user registration requests.
 * It expects a POST request with a username and password.
 * It checks if the user has exceeded the limit of new accounts,
 * then hashes the password and stores the new user in the database.
 *
 * @function
 * @name handleRegistration
 * @param {Object} $_POST - The incoming HTTP $_POST params
 *   taken automatically from request.
 */
async function handleRegistration(request,$_POST,secret) {
    // Get the client's IP address.
    // We use 'x-forwarded-for' to get the original IP if our app is behind a proxy (like Nginx or Heroku).
    var ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
ip = ip.replace(/:/g, '-');


const  username  = $_POST.username;
const password = $_POST.password;

if (username && password) {
    console.log("userN?",username)
    // Get current time
    const now = Date.now();

    // Get the info for this IP address
    let ipInfo = await db.get("../ipAddresses/" + ip + "/register") || { registerAttempts: 0, nextRegisterTime: 0 };

    // Check if the current time is before the next allowed registration time
    if (now < ipInfo.nextRegisterTime) {
        // If it is, inform the user when they can register next
        const nextRegisterDate = new Date(ipInfo.nextRegisterTime).toISOString();
        return { status: "error", message: `Sorry, you've exceeded the limit for new accounts. Please try again at ${nextRegisterDate}.`};
    }

    // Check if the user has exhausted their attempts
    if (ipInfo.registerAttempts >= 5) {
        // If so, set next registration time to 24 hours (or any other period) from now
        const registerPeriodMillis = 24 * 60 * 60 * 1000; // 24 hours
        ipInfo.nextRegisterTime = now + registerPeriodMillis;
        ipInfo.registerAttempts = 0; // reset register attempts
    } else {
        // If not, increment register attempts
        ipInfo.registerAttempts += 1;
    }
        
        // Hash the user's password using our custom password hashing function.
        const salt = sodos.generateSalt(16);

        const hashedPassword = sodos.hashPassword(password, salt);
        console.log("Getting",username)
        var exists = await db.get(username+"/account");
        if(exists) {
            return { attempts:ipInfo.registerAttempts, nextRegisterTime:ipInfo.nextRegisterTime,
                status: "error", message: "That username already exists! Choose another one, if u dare."};
        }
        console.log("Got",exists)
        
        
        // Increment the user count for this IP address.
       //await db.update(ip+"_info/register", userCount + 1);

        const token = sodos.createToken(username,secret);

        console.log("Trying",username)
        // Add the new user to the database, storing the hashed password and the salt.
        var res = await db.create(username+"/account", { password: hashedPassword, salt });
        console.log("did",res)
        // Increment the user count for this IP address.
        ipInfo.registerCount++;
        await db.write("../ipAddresses/"+ip+"/register", ipInfo);


        return { status: "success", message: "Successfully created new user!", token: token,
        attempts:ipInfo.registerAttempts, nextRegisterTime:ipInfo.nextRegisterTime};
    } else {
        return { status: "neutral", message: "Please fill out the form to register."};
    }
}

module.exports.handleRegistration = handleRegistration;
//?>