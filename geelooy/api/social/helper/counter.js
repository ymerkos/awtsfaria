/**
 * B"H
 */

module.exports = {
    getCounters,
    makeCounter,
    getCounter,
    deleteCounter,
    increaseCount
};


const {
    loggedIn,
    er
} = require("./general.js");

async function deleteCounter({
    $i,
    userid
}) {
    return true;
}

async function increaseCount({
    counterID,
    userid,
    $i
}) {
    var c = await getCounter({
        counterID,
        userid,
        $i
    });

    if(c.error) {
        return c;
    }

    var count = c.count;
    try {
        if(typeof(count) == "string")
            count = parseInt(count);
        if(isNaN(count)) {
            count = 0;
        }
        if(!isNaN(count)) {
            count++;
        }
        c.count = count;
        await $i.db.write(
            `/users/${
                userid
            }/counters/${
                counterID
            }/info`, c
        );

    } catch(e) {
        return er({
            code: "PROBLEM_COUNTING",
            message: "There was a problem counting"
        });
    }
    return count;

    

}

async function getCounter({
    counterID,
    $i,
    userid
}) {
    var c = await $i.db.get(
        `/users/${
            userid
        }/counters/${
            counterID
        }/info`
    );
    if(!c) {
        return er({
            code: "NO_COUNTER",
            message: "This counter was not found!",
            details: {counterID}
        });
    }
    return c;
}
async function makeCounter({
    $i,
    userid
}) {
    if(!loggedIn($i)) {
        return er({
            code: "NO_LOGIN",
            message: "You're not logged in"
        });
    }
    var title = $i.$_POST.title;
    if(!$i.utils.verify(
        title, 50)
    ) {
        return er({
            code: "INVALID_WEBSITE_NAME",
            message: "That's not a valid website name"
        });
    }

    var existing = await getCounters({
        $i,
        userid
    });

    var newID = $i.utils.generateUniqueId(existing);

    await $i.db.write(
        `/users/${
            userid
        }/counters/${
            newID
        }/info`, {
            title,
            count: 0
        }
    );
    return {
        success: {
            made: {
                id: newID,
                title
            }
        }
    }
}

async function getCounters({
    $i,
    userid
}) {
    if(!loggedIn($i)) {
        return er({
            code: "NO_LOGIN",
            message: "You're not logged in"
        });
    }
    var counterIDs = await $i.db.get(
        `/users/${
            userid
        }/counters`
    );
    if(!counterIDs) return [];
    return counterIDs;
}