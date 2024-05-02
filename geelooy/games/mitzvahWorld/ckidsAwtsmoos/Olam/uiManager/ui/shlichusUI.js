/**
 * B"H
 * Shlichus UI components
 * part of Game UI
 */
import mitzvahBtn from "./resources/mitzvahBtn.js";

import objective from "./resources/objective.js";
import rightRibbon from "./resources/congratsScreen/purpleRibbon/right.js";

import midRibbon from "./resources/congratsScreen/purpleRibbon/mid.js";
import leftRibbon from "./resources/congratsScreen/purpleRibbon/left.js";
import coinsCongratsScreen from "./resources/coinsCongratsScreen.js";
import lightrays from "./resources/lightrays.js"
export default [
    {
		shaym: "all inclusive gameUI",
		className: "allInclusiveParent",
		children: [
			{
				shaym: "shlichus accept",
				className: "sa shlichusAcceptBody hidden",
				children: [
					{
						shaym: "sa image",
						className: "sa image",
						child: {
							innerHTML: objective
						}
					},
					{
						shaym: "sa mainTxt",
						className: "mainTxt",
						textContent: "Awtsmoos"
					}, 
					{
						shaym: "sa shlichus name",
						className: "shlichusName",
						textContent: "Awtsmoos"
					},
					{
						shaym: "sa details",
						className: "details",
						textContent: "Awtsmoos! ".repeat(4)
					},
					{
						shaym: "sa start btn",
						child: mitzvahBtn({
							text: "Start",
							onclick(e, $, ui) {
								var sa = $("shlichus accept");
								
								sa
								.classList.add("hidden");
								
								var sn/*shlichus name*/
									= $("sa shlichus name");
								var nm = sn.textContent;
								ui.peula(sa, {
									startShlichus: nm
								})
								
							}
						})
					}
				]
			},

			{
				shaym: "shlichus information",
				className: "sa shlichusAcceptBody hidden",
				children: [
					
					{
						shaym: "sa info mainTxt",
						className: "mainTxt",
						textContent: "Information about shlichus"
					}, 
					{
						shaym: "sa shlichus info name",
						className: "shlichusName",
						textContent: "Awtsmoos"
					},
					{
						shaym: "sa info details",
						className: "details",
						textContent: "Awtsmoos! ".repeat(4)
					},
					{
						shaym: "sa ok btn",
						child: mitzvahBtn({
							text: "Ok cool story",
							onclick(e, $, ui) {
								var sa = $("shlichus information");
								
								sa
								.classList.add("hidden");
							
								
							}
						})
					},
					{
						shaym: "sa drop btn",
						child: mitzvahBtn({
							color:"red",
							text: "Drop shlichus",
							onclick(e, $, ui) {
								var sa = $("shlichus information");
								var id = sa.currentShlichusID;
								console.log("INFO!",id)
								
								ui.peula(sa, {
									dropShlichus: {
										id
										
									}
								});
								sa
								.classList.add("hidden");

								var dropF = $("drop failure")
								var standardBtns = $("standard failure");
								standardBtns.classList.add("hidden")
								dropF.classList.remove("hidden");

							}
						})
					},

				]
			},
			{
				shaym: "failed alert shlichus",
				className: "alertScreen failedScreen hidden",
				children: [
					{
						className: "csAlertMessage",
						shaym: "failed message",
						textContent: "It's okay, the first step to sucess might "
						+"sometimes be failure, like it is now."
					},
					{
						shaym: "standard failure",
                        className: "btns",
						children: [
                            /*mitzvahBtn({
                                text: "Ok ok, I'll try again iy\"H, if you insist.",
                                onclick(e, $, ui) {
                                    var cs = $(
                                        "failed alert shlichus"
                                    );
                                    if(!cs) return;
                                    cs.classList.add("hidden")
									var sn//shlichus name
										= $("sa shlichus name");
									var nm = sn.textContent;
								//	console.log("Trying to treset shlichus",sn,nm)
									var sa = $("failed alert shlichus")
									ui.peula(sa, {
										resetShlichus: nm
									});
                                }
                            }),*/
							mitzvahBtn({
                                text: "Okay, when I'm ready I'll go find the one who gave the shlichus and get it again iy\"H",
								color:"orange",
                                onclick(e, $, ui) {
                                    var cs = $(
                                        "failed alert shlichus"
                                    );
                                    if(!cs) return;
                                    cs.classList.add("hidden")
									
                                }
                            })
                        ]
                    },
					{
						shaym: "drop failure",
						className:"btns hidden",
						children: [
							mitzvahBtn({
                                text: "Okay.",
								color:"red",
                                onclick(e, $, ui) {
                                    var cs = $(
                                        "failed alert shlichus"
                                    );
                                    if(!cs) return;
                                    cs.classList.add("hidden")
									
									var dropF = $("drop failure")
									var standardBtns = $("standard failure");
									standardBtns.classList.remove("hidden")
									dropF.classList.add("hidden");
                                }
                            })
						]
					}
				]
			},
            {
                shaym: "congrats shlichus",
                className: "alertScreen congratsScreen hidden",
                children: [
                    
                    
                    
                        /*congrats screen = cs*/,
                       
                    {
                        shaym: "cs illustration",
                        className: "csIllustration",
                        children: [
                            {
                                className: "lightRays",
                                innerHTML: lightrays
                            },
                            {
                                innerHTML: coinsCongratsScreen,
                                className: "coinPile",
                                
                            }
                        ]
                    },
                    
                    {
                        className: "csCongratsRibbon"
                        ,
                        children: [
                            {
                                className: "csRibbonRight",
                                innerHTML: rightRibbon
                            },
                            {
                                className:"csMidRib",
                                shaym: "ribbon text",
								shlichusID:null,
                                awtsmoosOnChange: {
                                    textContent(e, me) {
                                        var txt = me.getElementsByClassName
                                        ("awtsmoosTxt")[0];
                                        
										
                                        if(!txt) return true/*calls
                                        default as well
                                        */
                                        txt.innerHTML = e.data.textContent;
                                        return false;
                                    }
                                },
                                /**
                                 * CSS has dynamic
                                 * arced text with
                                 * class name "awtsmoosTxt"
                                 */
                                innerHTML: midRibbon
                            },
                            {
                                className: "csRibbonLeft",
                                innerHTML: leftRibbon
                            },
                        ]
                    },
                    {
                        className: "csAlertMessage csSuccessMessage",
                        shaym: "congrats message",
                        textContent: "Welcome to the Garden of Eiden in modern times. Talk to the other person to begin your juorney. (Arrow keys to move), menu at top left corner for more info. Your journey awaits.",
                    },
                    {
                        className: "timer",
                        
                        children: [
                            {
                                className: "csTmIcon"
                            },
                            {
                                className: "csTime",
                                shaym: "congrats time"
                            }
                        ]
                    },
                    {
                        className: "btns"
                        ,
						children: [
                            mitzvahBtn({
                                text: "Continue",
                                onclick(e, $, ui) {
                                    var cs = $(
                                        "congrats shlichus"
                                    );
                                    if(!cs) return;
                                    cs.classList.add("hidden");

									var rb = $("ribbon text");
									console.log("GETTING sh",rb.shlichusID)
									ui.peula(cs, {
										returnStage: rb.shlichusID
									})
                                }
                            })
                        ]
                    }
                ]
            }
			
		]
	},
	{
		shaym: "shlichus sidebar",
		className: "shlichusSidebar hidden"
	}
]