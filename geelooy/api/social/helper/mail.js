/**
 * B"H
 */


module.exports = {
    getMail,
    sendMail
}
var {
    NO_LOGIN,
    sp
} = require("./_awtsmoos.constants.js");

var {
    loggedIn,
    er,
    myOpts
	
} = require("./general.js");

var {
    verifyAliasOwnership
} = require("./alias.js")
var {
    verifyHeichelAuthority
} = require("./heichel.js")

var {
    addContentToSeries,
    getSeries
} = require("./series.js");

var {
	deleteAllCommentsOfParent
} = require("./comment.js");

async function getMail({
    $i,
    userid
}) {
    var op = myOpts($i);
    var m = await $i.db.get(`${
        sp
    }/${
        userid
    }/mail/messages`, op);
    if(Array.isArray(m)) {
        var full = [];
        for(var k in m) {
            var details = await $i.db.get(`${
                sp
            }/${
                userid
            }/mail/messages/${
                k
            }`);
            details.id = k;
            full.push(details)
        }
        return full;
    }
    return [];
}

async function sendMail({
    $i,
    userid,
    asAliasId,
    toAliasId
}) {
    var ver = await verifyAliasOwnership(asAliasId,$i, userid);
    if(!ver) {
        return er({
            message: "That's not your alias",
            code: "NOT_YOUR_ALIAS",
            details: asAliasId
        })
    }
    var content = $i.$_POST.content;
    if(!content) {
        /*return er({
            message: "You need to send real content",
            code: "NO_CONTENT"
        })*/
        content = ""
    }
    var subject = $i.$_POST.subject;
    if(!subject) {
        subject = "";
    }

    var to = toAliasId || $i._POST.toAlias;
    var toAlias =  await $i.db.get(
		sp +
		`/aliases/${
            to
        }/info`);

    if(!toAlias) {
        return er({
            message: "The recipient alias doesn't exist!",
            code: "TO_ALIAS_NOT",
            details: to
        })
    }

    var userTo = toAlias.user;
    var messageID = "BH_"+Date.now()+"_"+(
        Math.floor(
            Math.random() * 770
        )
    ) + "_from_"+asAliasId;
    try {
        var wr = await $i.db.write(`${
            sp
        }/${
            userTo
        }/mail/messages/${
            messageID
        }`, {
            from: asAliasId,
            to,
            timeSent: Date.now(),
            subject,
            content,
            dayuh: {
                read: false
            }
        });
    } catch(e){
        return er({
            message: "Problem sending",
            details: e+""
        })
    }
}



