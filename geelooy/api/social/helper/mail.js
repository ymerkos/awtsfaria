/**
 * B"H
 */


module.exports = {
    getMail,
    sendMail,
    deleteMail,
    setEmailAsRead
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
    userid,
    mailId = null
}) {
    if (!loggedIn($i)) {
        return er(NO_LOGIN);
    }
    try {
        var op = myOpts($i);
        var pth = `${
            sp
        }/users/${
            userid
        }/mail/messages`;

        if(mailId) {
            var g = await $i.db.get(pth+"/"+mailId);
            if(!g) {
                return er({
                    message: "Message not found",
                    code: "NO_MSG",
                    details: mailId
                })
            }
            return g;
        }
        var m = await $i.db.get(pth, op);
       // return m;
        if(Array.isArray(m)) {
            var full = [];
            for(var k of m) {
                var details = await $i.db.get(`${
                    sp
                }/users/${
                    userid
                }/mail/messages/${
                    k
                }`, op);
                if(details) {
                    details.id = k;
                    full.push(details)
                }
            }
            return full;
        }
        return er({
            message: "No mail",
            details: {
                path:pth
            }
        })
    } catch(E) {
        return er({
            message: "Issue",
            details: E+""
        })
    }
}

async function setEmailAsRead({
    $i,
    userid,
    mailId
}) {
    try {
        if (!loggedIn($i)) {
            return er(NO_LOGIN);
        }
        var pth = `${sp}/users/${
            userid
        }/mail/messages/${
            mailId
        }`
        var message = await $i.db.get(pth);
        if(!message) {
            return er({
                message: "Message not found",
                code: "M_NOT_FOUND",
                details: mailId+""
            })
        }

        try {
            var m = message.dayuh;
            if(!m) {
                return er({
                    message: "No metadata found",
                    code: "NO_DAYUH"
                })
            }

            m.read = true;
            console.log(m);
            var wr = await $i.db.write(pth, message)
            return {
                success: {
                    message: "Marked as read",
                    code: "read"
                }
            }
        }catch(e){
            return er({
                message: "ERROR",
                details: e+""
            })
        }
    } catch(e) {
        return er({
            message: "ERROR",
            details: e+""
        })
    }


}
async function deleteMail({
    $i,
    mailId,
    userid
}) {
    if (!loggedIn($i)) {
        return er(NO_LOGIN);
    }
    var pth = `${sp}/users/${
        userid
    }/mail/messages/${
        mailId
    }`
    var message = await $i.db.get(pth);

    if(!message) {
        return er({
            message: "Message not found",
            code: "M_NOT_FOUND",
            details: mailId+""
        })
    }

    try {
        await $i.db.delete(pth);
        return {
            success: {
                message : "Deleted it",
                code: "DELETED",
                details: {
                    mailId
                }
            }
        }
    } catch(e){
        return er({
            message :"Issue",
            details: e+""
        })
    }
}

async function sendMail({
    $i,
    userid,
    asAliasId,
    toAliasId
}) {
    if (!loggedIn($i)) {
        return er(NO_LOGIN);
    }
    var ver = await verifyAliasOwnership(asAliasId,$i, userid);
    if(!ver) {
        return er({
            message: "That's not your alias",
            code: "NOT_YOUR_ALIAS",
            details: asAliasId
        })
    }
    var content = $i.$_POST.content || $i.$_GET.content;
    if(!content) {
        /*return er({
            message: "You need to send real content",
            code: "NO_CONTENT"
        })*/
        content = ""
    }
    var subject = $i.$_POST.subject || $i.$_GET.subject;
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
    var timeSent = Date.now()
    var messageID = "BH_"+timeSent+"_"+(
        Math.floor(
            Math.random() * 770
        )
    ) + "_from_"+asAliasId;
    try {
        var wr = await $i.db.write(`${
            sp
        }/users/${
            userTo
        }/mail/messages/${
            messageID
        }`, {
            from: asAliasId,
            to,
            timeSent,
            subject,
            content,
            dayuh: {
                read: false
            }
        });
        return {
            success: {
                message: "Sent successfully",
                details: {
                    messageID,
                    to,
                    from:asAliasId,
                    timeSent
                }
            }
        }
    } catch(e){
        return er({
            message: "Problem sending",
            details: e+""
        })
    }
}



