/**
 * B"H
 */

export default class ShlichusActions {
    isDone = false;
    constructor() {

    }

    update(sh) {
        if(sh.isActive)
            this.setTimer(sh)
    }

    setTimer(sh) {
        if(!sh) return;
        var id = sh.id;
        var curTime = Date.now();
        

        

        // Check if at least 100 milliseconds (0.1 seconds) have passed since the last update
        if (curTime - sh.lastUpdateTime >= 100) {
            var maxTime = sh.timeLimitRaw;
            var startTime = sh.startTime;
            var diff = curTime - startTime;

            var inSeconds = Math.floor(diff/1000)
            var timeLeft = maxTime - inSeconds;
            var time = formatTime(timeLeft);
            sh.currentTimeRemaining = time;
            sh.currentTimeElapsed = diff;

            
         //   console.log("Setting time for",id,time)
            sh.olam.htmlAction({
                shaym: "shlichus time "+id,
                properties: {
                    textContent: "Time left: " + time
                }
            });

            sh.lastUpdateTime = curTime; // Update the last update time
        }
    }

    finish(sh) {
        var id = sh.id;
        sh.isActive = false;
        sh.olam.htmlAction({
            shaym: "shlichus time "+id,
            
            methods: {
                classList: {
                    remove: "active",
                    add: "hidden"
                }
            }
        });
        
        sh.olam.htmlAction({
            shaym:"shlichus progress info "+id,
           
            methods: {
                classList: {
                    remove:  "active",
                    add: "hidden"
                }
            }
        });

        console.log("FINISHED shlichus")
    }

    eventsSet = []

    setEvents(sh) {
        var id = sh.id;
        sh.olam.htmlAction({
            shaym: "shlichus progress info "+id,
            properties: {
                onclick: function(e,$,ui) {
                    /**
                     * click on it once to highlight it 
                     * and show minimenu options,
                     * 
                     click on it twice
                     */
                    var tar = e.target;

                    var inf = $(
                        "shlichus information"
                    );

                    var shl = searchForProperty(
                        e,
                        "shlichusID", 
                        true
                    );

                    var id = shl.shlichusID;

                    var isInfo = searchForProperty(e, "isInfo");
                    var selected = shl.classList.contains("selected");

                    if(isInfo) {
                        
                        if(id) {
                            ui.peula(inf, {
                                shlichusInfo: id
                            })
                        } else {
                            console.log("ISSUE!",e,id)
                        }
                    } else
                    if(!selected) {
                        var allClasses = Array.from(document
                            .querySelectorAll(
                                ".shlichusProgress"
                            )
                        );
                        allClasses.forEach(f=> {
                            var shID = f.shlichusID;
                            f.classList.remove("selected");
                            ui.peula(f, {
                                setSelected: {
                                    id: shID,
                                    selected: false
                                }
                            });
                        });


                        shl.classList.add("selected")

                        ui.peula(shl, {
                            setSelected: {
                                id,
                                selected: true
                            }
                        });


                    } else {
                        var allClasses = Array.from(document
                            .querySelectorAll(
                                ".shlichusProgress"
                            )
                        );
                        allClasses.forEach(f=> {
                            f.classList.remove("selected")
                        })
                        ui.peula(shl, {
                            setSelected: {
                                id,
                                selected: false
                            }
                        });
                    }

                }
            }
        });

        async function setSelected({id, selected}) {
         //   console.log(id,sh)
            if(id !== sh.id) return;
            sh.on?.setActive(sh, selected);
            console.log("Set active!",sh);
        }



        if(this.eventsSet.includes(sh)) {
            sh.olam.clear("htmlPeula resetShlichus", resetShlichus);
            
            sh.olam.clear("htmlPeula shlichusInfo", shlichusInfo);

            sh.olam.clear("htmlPeula startShlichus", startShlichus);
            
            sh.olam.clear("htmlPeula returnStage", returnStage);
            sh.olam.clear("htmlPeula setSelected", setSelected);
            
            this.eventsSet.splice(this.eventsSet.indexOf(sh), 1)
        }

        this.eventsSet.push(sh);

        sh.olam.on(
            "htmlPeula shlichusInfo",
            shlichusInfo
        )

        sh.olam.on("htmlPeula setSelected", setSelected)

        sh.olam.on("htmlPeula dropShlichus", ({id})=>{
            console.log(id,sh,"dropping")
            if(id !== sh.id) return;

            var nm = sh.shaym
            var msg = `You have officially dropped the Shlichus ${nm}`
            showFail({
                sh,
                msg
            });
            console.log("DROPT?",id,msg,sh)


            sh.olam.showingImportantMessage = false;

        });

        sh.olam.on(
            "htmlPeula returnStage",
            returnStage
        )
        

        async function shlichusInfo(shlichusID) {
            if(shlichusID != sh.id) {
                console.log("No match")
                return;
            }

            
            sh.olam.htmlAction({
                shaym: "shlichus information",
                properties: {
                    currentShlichusID: shlichusID
                },
                methods: {
                    classList: {
                        remove: "hidden"
                    }
                }
    
            });

            sh.olam.htmlAction({
                shaym: "sa shlichus info name",
                properties: {
                    textContent: 
                    sh.shaym
                }
            });
    
                
    
            //
            sh.olam.htmlAction({
                shaym: "sa info details",
                properties: {
                    textContent: 
                    sh.objective
                }
            });

        }
        async function resetShlichus(shlichusName) {
            sh.olam.showingImportantMessage = false;
            if(shlichusName != sh.shaym) {
                console.log(sh,shlichusName,"That's not a real shlichus to start! ")
                return;
            }

            sh.olam.htmlAction({
                shaym: "failed alert shlichus",
                methods: {
                    classList: {
                        add: "hidden"
                    }
                }
    
            });

            await sh.reset(sh)
        }

        async function startShlichus(shlichusName) {
            sh.olam.showingImportantMessage = false;//prevents player from moving if true
        
            if(shlichusName != sh.shaym) {
                console.log(sh,shlichusName)
                return alert("That's not a real shlichus to start! ")
            }
            sh.startTime = Date.now();
            var id = sh.id;

            //shlichus sidebar
            sh.olam.htmlAction({
                shaym: "shlichus sidebar",
                methods: {
                    classList: {
                        remove: "hidden"
                    }
                }
            });

            sh.olam.htmlAction({
                shaym: "shlichus progress info "+id,
                methods: {
                    classList: {
                        remove: "hidden"
                    }
                }
            });

            

            sh.olam.htmlAction({
                shaym: "shlichus description "+id,
                properties: {
                    textContent: 
                    sh.progressDescription
                }
            });

            sh.olam.htmlAction({
                shaym: "si num "+id,
                properties: {
                    textContent: sh.collected + 
                        "/"
                    + sh.totalCollectedObjects
                }
            })

            sh.olam.htmlAction({
                shaym: "si frnt "+id,
                properties: {
                    style: {
                        width: (
                            0
                        ) + "%"
                    }
                }
            });
          
            sh.olam.htmlAction({
                shaym: "shlichus progress info "+id,
                methods: {
                    click: true
                }
            })
            sh.start();
        }

        async function returnStage(id) {
      
            if(id == sh.id)
                sh.on?.returnStage(sh);
        }

        sh.olam.on(
            "htmlPeula resetShlichus",
            resetShlichus,
            true
        )

        

        sh.olam.on(
            "htmlPeula startShlichus",
            startShlichus,
            true//one time only
        )
        
    }

    creation(sh) {
        var id = sh.id;
        sh.lastUpdateTime = 0;
        
        sh.olam.showingImportantMessage = true;//prevents player from moving
        sh.olam.htmlAction({
            shaym:"shlichus progress info "+id,
           
            methods: {
                classList: {
                    add:  "active"
                }
            }
        });

        //timer
        sh.olam.htmlAction({
            shaym: "shlichus time "+id,
            
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
            shaym: "shlichus title "+id,
            properties: {
                textContent: sh.shaym
            }
        });

        this.setEvents(sh);
    }

    delete(sh) {
        var id = sh.id;
        sh.olam.htmlAction({
            shaym: "shlichus progress info " + id,
            methods: {
                remove: true
            }
        })
        console.log("removing!",sh)
    }

    async progress(sh) {
        var id = sh.id;
        var percent = sh.collected / 
            sh.totalCollectedObjects;

        if(sh.collected < sh.totalCollectedObjects) {
            /**
             * Not completed.
             */
            sh.olam.htmlAction({
                shaym: "si num "+id,
                properties: {
                    textContent: sh.collected + 
                        "/"
                    + sh.totalCollectedObjects
                }
            });

            sh.olam.htmlAction({
                shaym: "si frnt "+id,
                properties: {
                    style: {
                        width: (
                            percent*100
                        ) + "%"
                    }
                }
            });
        } else {

            /*
            Completed

            */

            sh.completed = true;
            sh.complete();
            sh.olam.showingImportantMessage = true;
            sh.olam.htmlAction({
                shaym: "si num "+id,
                properties: {
                    textContent: sh.collected + 
                        "/"
                    + sh.totalCollectedObjects
                }
            })

            sh.olam.htmlAction({
                shaym: "si frnt "+id,
                properties: {
                    style: {
                        width: (
                            100
                        ) + "%"
                    }
                }
            });
            
            //completed!
            sh.olam.htmlAction({
                shaym: "shlichus description "+id,
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
                    textContent: "Congrats!",
                    shlichusID: sh.id
                }
            })

            

            //shlichusID

            sh.olam.htmlAction({
                shaym: "congrats shlichus",
                methods: {
                    classList: {
                        remove: "hidden"
                    }
                }

            });

         

        }
    }

    returnStage(sh) {
        try {
            sh.completedProgress(sh);
            sh.olam.showingImportantMessage = false;//prevents player from moving if true
            if(sh.returnTimeLimit) {
                
                sh.setTime(sh.returnTimeLimit)
            }
        } catch(e) {

            console.log("Couldnt do event: ",e,sh)
        }
    }

    setTime(sh, info={minutes:0,seconds:0}||{}) {
        var override = null//6;
        var minutes=info.minutes||0;
        var seconds = info.seconds||0;
        sh.startTime = Date.now();
        sh.timeLimitRaw /*in seconds*/ = override || minutes*60  + seconds;
        clearInterval(sh.timeout);
        sh.timeout = setTimeout(() => {
            sh.on?.timeUp?.(sh);
        }, sh.timeLimitRaw * 1000);

       // console.log("set time",minutes,seconds,sh,sh.startTime,sh.timeLimitRaw)
    }

    timeUp(sh) {
        showFail({
            sh,
            msg: "The time ran OUT!"
            +" It's okay, the first step to sucess might "
            +"sometimes be failure, like it is now."
            +" To reset, go find the one who gave you the shlichus and get it again."
        })
     
    }
}

function showFail({
    sh, msg
}) {
    //sh.olam.showingImportantMessage = true;
        sh.olam.htmlAction({
            shaym: "failed alert shlichus",
            methods: {
                classList: {
                    remove: "hidden"
                }
            }

        })
     
        sh.dropShlichus();
        sh.olam.htmlAction({
            shaym: "failed message",
            properties: {
                
                textContent: msg
            }
        })
}

function formatTime(seconds) {
    // Calculate the number of minutes
    var minutes = Math.floor(seconds / 60);
    
    // Calculate the remaining seconds
    var remainingSeconds = seconds % 60;
    
    // Format the minutes and seconds to always have two digits
    var formattedMinutes = String(minutes).padStart(2, '0');
    var formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
}
