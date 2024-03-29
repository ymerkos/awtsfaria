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
    
    "/mail/get/:mailId/":async (v) => {
        return await getMail({
            $i,
            userid,
            mailId:v.mailId
        })
    },
    "/mail/get/:mailId/read":async (v) => {
        return await setEmailAsRead({
            $i,
            userid,
            mailId:v.mailId
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
    "/mail/get": async () => {
        return await getMail({
            $i,
            userid,
        })
    },


});