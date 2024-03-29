/**
 * B"H
 */

var {
	NO_LOGIN,
	sp,
    myOpts
  
  } = require("./helper/_awtsmoos.constants.js");

 var {
  getMail,
  sendMail,
} = require("./helper/index.js");

var {
	loggedIn,
	er
} = require("./helper/general.js");

module.exports = ({
	$i,
	userid,
} = {}) => ({
    "/mail/get": async () => {
        return await getMail({
            $i,
            userid,
        })
    },
    "/mail/sendTo/:toAlias/from/:fromAlias": async (v) => {
        return await sendMail({
            $i,
            userid,
            asAliasId: v.fromAlias,
            toAliasId: v.toAlias
        })
    },


});