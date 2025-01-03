//B"H
/**

 * @fileoverview This module provides functions for hashing and verifying passwords using Node.js's built-in crypto library.
 * 
 * @module passwordHashing
 * @requires crypto
 */

 var crypto = require('crypto');

 // Function to encrypt data
// Function to encrypt data
function encrypt(text, secret) {
    var iv = crypto.randomBytes(16);
    var key = crypto.createHash('sha256').update(secret).digest(); // Derive a 256-bit key from the secret
    var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted; // Prepend the IV to the encrypted text
  }
  
  // Function to decrypt data
  function decrypt(text, secret) {
    var iv = Buffer.from(text.slice(0, 32), 'hex'); // Extract the IV from the first 32 characters
    var encryptedText = text.slice(32); // The rest is the encrypted text
    var key = crypto.createHash('sha256').update(secret).digest(); // Derive the 256-bit key
    var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }


 /**
  * Generate a random salt for password hashing.
  * 
  * @function
  * @name generateSalt
  * @param {number} length - The length of the salt string to generate.
  * @returns {string} A random salt string of the specified length.
  * 
  * @example
  * var salt = generateSalt(16);
  * // generates a 16 character hexadecimal salt
  * 
  * The salt is generated by creating random bytes (half of the desired length, because each byte is 2 hexadecimal characters)
  * and then converting them to a hexadecimal string. If the salt is longer than needed, it is sliced to the correct length.
  * 
  * The salt is used in the hashPassword and verifyPassword functions to add additional security to the hashed password.
  * Even if two users have the same password, their hashed passwords will be different because the salt is unique.
  */
 function generateSalt(length) {
     return crypto.randomBytes(Math.ceil(length/2))
         .toString('hex')  // convert to hexadecimal format
         .slice(0,length); // return required number of characters
 }
 
 /**
  * Hash a password using the HMAC-SHA256 algorithm.
  * 
  * @function
  * @name hashPassword
  * @param {string} password - The plaintext password to hash.
  * @param {string} salt - The salt to use when hashing.
  * @returns {string} The hashed password.
  * 
  * @example
  * var hashedPassword = hashPassword('password123', 'abcdefg');
  * 
  * The hashPassword function uses the crypto library's createHmac method to create an HMAC (Hash-based Message Authentication Code).
  * The HMAC algorithm combines the password and the salt in a way that is secure against certain types of attacks.
  * The output of the HMAC algorithm is then converted to a hexadecimal string to create the hashed password.
  */
 function hashPassword(password, salt) {
     return crypto.createHmac('sha256', salt)
         .update(password)
         .digest('hex');
 }
 
 /**
  * Verify a password against a hashed password.
  * 
  * @function
  * @name verifyPassword
  * @param {string} password - The plaintext password to check.
  * @param {string} hashedPassword - The hashed password to check against.
  * @param {string} salt - The salt that was used when hashing the password.
  * @returns {boolean} True if the password matches the hashed password, false otherwise.
  * 
  * @example
  * var passwordsMatch = verifyPassword('password123', hashedPassword, 'abcdefg');
  * 
  * The verifyPassword function hashes the input password using the same salt that was used when the original password was hashed.
  * It then compares the newly hashed password to the original hashed password. If they match, that means the input password is correct.
  */
 function verifyPassword(password, hashedPassword, salt) {
     var newHashedPassword = crypto.createHmac('sha256', salt)
         .update(password)
         .digest('hex');
     return newHashedPassword === hashedPassword;
 }
 

 
function createToken(entry, secret, extra={}) {
    // Combine the user's ID and the current timestamp to form the token data
    var data = Buffer.from(JSON.stringify({
     entry, 
     zman:Date.now(),
     hosuhfuh:extra 
    })).toString("base64");
  
    // Create a HMAC (hash-based message authentication code) of the data, using the secret key
    var hmac = crypto.createHmac('sha256', secret);
    hmac.update(data);
  
    // Return the token as the HMAC digest
    return "B\"H."+data+"."+hmac.digest('hex');
  }
  
  function validateToken(token, secret) {
    // To validate a token, we need to recreate it using the same data and secret,
    // then compare it to the provided token.
  
    // Split the token into the original data and the provided HMAC digest
    var [
     BH, 
     data, 
     providedHmac
    ] = token.split('.');
    
    // Recreate the HMAC from the data and secret
    var hmac = crypto.createHmac('sha256', secret);
    hmac.update(data);
    var jest = hmac.digest('hex');
    
    // If the recreated HMAC matches the provided HMAC, the token is valid
    return jest === providedHmac ? data : false;
  }


 module.exports = {
    validateToken,
    createToken,
     generateSalt,
     hashPassword,
     verifyPassword,
     encrypt,
     decrypt
 };
 
