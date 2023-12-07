/**
 * B"H
 */
let lastUpdateTime = 0; 
export default class ShlichusActions {
    constructor() {

    }

    update(sh) {
        this.setTimer(sh)
    }

    setTimer(sh) {
        if(!sh) return;
        
        var curTime = Date.now();
        

        

        // Check if at least 100 milliseconds (0.1 seconds) have passed since the last update
        if (curTime - lastUpdateTime >= 100) {
            var maxTime = sh.timeLimit;
            var startTime = sh.startTime;
            var diff = curTime - startTime;

            var inSeconds = Math.floor(diff/1000)
            var timeLeft = maxTime - inSeconds;
            var time = formatTime(timeLeft);
            
            sh.olam.htmlAction({
                shaym: "shlichus time",
                properties: {
                    textContent: "Time left: " + time
                }
            });

            lastUpdateTime = curTime; // Update the last update time
        }
    }
    creation(sh) {
        console.log("T timer",this)
        sh.olam.htmlAction({
            shaym:"shlichus progress info",
           
            methods: {
                classList: {
                    add:  "active"
                }
            }
        });

        //timer
        sh.olam.htmlAction({
            shaym: "shlichus time",
            
            methods: {
                classList: {
                    add: "active",
                    remove: "hidden"
                }
            }
        });

        sh.olam.htmlAction({
            shaym:"sa mainTxt",
            properties:{
                innerText: "Shlichus Accepted: "
                
                
            },
            methods:{
                classList: {
                    add:  "active"
                }
            }
        });

        sh.olam.htmlAction({
            shaym: "sa shlichus name",
            properties: {
                textContent: 
                sh.shaym
            }
        });

        sh.olam.htmlAction({
            shaym: "shlichus accept",
            methods: {
                classList: {
                    remove: "hidden"
                }
            }
        });
            

        //
        sh.olam.htmlAction({
            shaym: "sa details",
            properties: {
                textContent: 
                sh.objective
            }
        });

        sh.olam.htmlAction({
            shaym: "shlichus title",
            properties: {
                textContent: sh.shaym
            }
        });
        
        sh.olam.on(
            "htmlPeula startShlichus",
            shlichusName => {
                sh.olam.htmlAction({
                    shaym: "shlichus progress info",
                    methods: {
                        classList: {
                            remove: "hidden"
                        }
                    }
                });

                sh.olam.htmlAction({
                    shaym: "shlichus description",
                    properties: {
                        textContent: 
                        sh.progressDescription
                    }
                });

                sh.olam.htmlAction({
                    shaym: "si num",
                    properties: {
                        textContent: sh.collected + 
                            "/"
                        + sh.totalCollectedObjects
                    }
                })

                sh.olam.htmlAction({
                    shaym: "si frnt",
                    properties: {
                        style: {
                            width: (
                                0
                            ) + "%"
                        }
                    }
                });
            },
            true//one time only
        )
    }

    progress(sh) {
        var percent = sh.collected / 
            sh.totalCollectedObjects;
        if(sh.collected < sh.totalCollectedObjects) {
            sh.olam.htmlAction({
                shaym: "si num",
                properties: {
                    textContent: sh.collected + 
                        "/"
                    + sh.totalCollectedObjects
                }
            });

            sh.olam.htmlAction({
                shaym: "si frnt",
                properties: {
                    style: {
                        width: (
                            percent*100
                        ) + "%"
                    }
                }
            });
        } else {
            sh.olam.htmlAction({
                shaym: "si num",
                properties: {
                    textContent: sh.collected + 
                        "/"
                    + sh.totalCollectedObjects
                }
            })

            sh.olam.htmlAction({
                shaym: "si frnt",
                properties: {
                    style: {
                        width: (
                            100
                        ) + "%"
                    }
                }
            });
            sh.completed = true;
            //completed!
            sh.olam.htmlAction({
                shaym: "shlichus description",
                properties: {
                    textContent: 
                    sh.completeText
                }
            });

            sh.olam.htmlAction({
                shaym: "congrats message",
                properties: {
                    textContent: sh.completeText
                }
            });

            sh.olam.htmlAction({
                shaym: "ribbon text",
                properties: {
                    textContent: "Congrats!"
                }
            })

            sh.olam.htmlAction({
                shaym: "congrats shlichus",
                methods: {
                    classList: {
                        remove: "hidden"
                    }
                }

            })

        }
    }

    timeUp(sh) {
        console.log("ran out of time",sh)
    }
}

function formatTime(seconds) {
    // Calculate the number of minutes
    const minutes = Math.floor(seconds / 60);
    
    // Calculate the remaining seconds
    const remainingSeconds = seconds % 60;
    
    // Format the minutes and seconds to always have two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
}
