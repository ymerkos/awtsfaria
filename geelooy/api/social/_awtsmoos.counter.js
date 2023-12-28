/**
 * B"H
 */

var {
    getCounters,
    getCounter,
    makeCounter,
    deleteCounter,
    increaseCount
} = require("./helper/counter.js")
module.exports = ({
    $i,
    userid,
} = {}) => {

    return ({ 
        "/counters": async v => {
            console.log($i.request.method)
            if($i.request.method == "GET") {
                var f = await getCounters({
                    $i,
                    userid
                });
                
                return f
            }

            if($i.request.method == "POST") {
                return await makeCounter({
                    $i,
                    
                    userid
                })
            }
        },
        "/counters/:counter": async v => {
            if($i.request.method == "GET") {
                return await getCounter({
                    counterID: v.counter,
                    $i,
                    userid
                });
            }
            
            if($i.request.method == "DELETE") {
                return await deleteCounter({
                    $i,
                    counterID: v.counter,
                    userid
                })
            }
        },
        "/counters/:counter/increaseCount": async v => {
            if($i.request.method == "GET") {
                return await increaseCount({
                    counterID: v.counter,
                    $i,
                    userid
                });
            }
            
        }
        
    })
};