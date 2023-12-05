/**
 * B"H
 */

export default ({
    shaym: "Redemption of the Destitute",
    objective: "Go out onto the obstacle course (of life) "
    + "and collect 5 perutahs (coins), then bring them back.",
    completeText:"Mazel Tov! You have collected all of the coins. "
    +"Now go back to the person.",
    totalCollectedObjects: 5,
    collected:0,
    on: {
        creation(sh) {
            sh.olam.htmlAction({
                shaym:"shlichus progress info",
               
                methods: {
                    classList: {
                        add:  "active"
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
                            "Coins collected"
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

            

        },
        progress(p, sh) {
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
        },
        collected(c, t) {
            
        }
    }
});