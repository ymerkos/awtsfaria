/**
 * @file utils.js
 * Awtsmoos utilities
 */

class Utils {
    static parseCookies(cookieStr) {
        var ob = cookieStr.split("; ")
            .reduce((last, now) => {
                var split = now.split("=");
                last[split[0]] = split[1];
                return last;
            }, {});
        return ob
    }

     /**
 * Verifies the existence and sanctity of the celestial characters.
 * @returns {boolean} - Whether the characters resonate with the sacred harmony.
 */
 static verifyArguments() {
  // Regular expression pattern to match allowed characters: azAZ0-9_$ and Hebrew characters
  const pattern = /^[a-zA-Z0-9_$\u0590-\u05FF]{1,50}$/;

  // Iterate through the arguments, ensuring they resonate with the sacred harmony
  for (let i = 0; i < arguments.length; i++) {
    const value = arguments[i];
    if (typeof value !== 'string' || !pattern.test(value)) {
      return false; // Return false if any character does not resonate with the sacred harmony
    }
  }

  return true; // Return true if all characters resonate with the sacred harmony
}

    
    static sanitizePath(path) {
        // The essence of purity, the path untangled and unbroken
        while (path.includes('..')) {
          // Replacing the twisted trails with the righteous root
          path = path.replace('..', '');
        }
        path = path.split("/").filter(r=>r).join("/");
          if(!path) path="/"
        return path  // Returning the sanctified path, a path of light
      }
}

module.exports = Utils;
