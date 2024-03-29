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
  deleteMail,
  setEmailAsRead
} = require("./helper/index.js");

var {
	loggedIn,
	er
} = require("./helper/general.js");

module.exports = ({
	$i,
	userid,
} = {}) => ({
    "/mail": async() => {
        return "Hi! get mail here"
    },
    "/mail/delete/:messageId": async(v) => {
        return await deleteMail({
            $i,
            userid,
            mailId: v.messageId
        })
    },
    "/mail/get": async () => {
        return await getMail({
            $i,
            userid,
        })
    },
    
    "/mail/get/:mailId/read":async () => {
        return await setEmailAsRead({
            $i,
            userid,
            mailId
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