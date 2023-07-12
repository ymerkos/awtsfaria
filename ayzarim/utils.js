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
}

module.exports = Utils;