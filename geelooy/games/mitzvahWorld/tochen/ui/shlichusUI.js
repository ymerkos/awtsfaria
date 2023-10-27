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
import coin from "../../tochen/ui/resources/coin.js";
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
                shaym: "congrats shlichus",
                className: "congratsScreen",
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
                                awtsmoosOnChange: {
                                    textContent(e, me) {
                                        var txt = me.getElementsByClassName
                                        ("awtsmoosTxt")[0];
                                        
                                        console.log("Hi!",e,window.hh=me,txt)
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
                        className: "csSuccessMessage",
                        shaym: "congrats message",
                        textContent: "You have done everything you need to do!!!",
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
                        ,children: [
                            mitzvahBtn({
                                text: "Continue",
                                onclick(e, $) {
                                    var cs = $(
                                        "congrats shlichus"
                                    );
                                    if(!cs) return;
                                    cs.classList.add("hidden")
                                }
                            })
                        ]
                    }
                ]
            }
			
		]
	},
	{
		/**
		 * general container for
		 * keeping track of individual
		 * shlichus 
		 */
		shaym: "shlichus progress info",
		
		className: "shlichusProgress hidden",
		style: {
			top: 60
		},
		children: [
			{
				shaym: "shlichus title",
                className: "shlichusTitleProgress",
				textContent: "Redfemptionasd"
			},
			{
				shaym: "shlichus description",
                className: "shlichusDescriptionProgress",
				textContent: "aduiha8o2A  a2dh89a2d 89a2d d"
			},
			{
				shaym: "shlichus info",
				className: "shlichusProgressInfo",
				children: [
					{
						shaym:"si progress bar",
						className:"siProgress",
						children: [
							{

								/**
								 * background of the
								 * progress bar
								 * 
								 * "si" = 
								 * shlichus info
								 */
								shaym: "si bck",
								className: "bck",
								child: {
									shaym: "si frnt",
									className: "frnt"
								}
							}
							
						]
					},
					
					{
						/**
						 * icon representing item
						 * to collect
						 * (or person to talk to iy"h) 
						 * and 
						 * number of collected items
						 * (if applicable)
						 */
						shaym: "icon and num",
						className: "iconAndNum",
						
						children: [
							{
								shaym: "si icon",
								className:"icon",
								innerHTML: coin
							},
							
							{
								shaym: "si num",
								className:"num",
								textContent: "1/5"
							}
						]
						
					}
				]
			}
		],
	}
]