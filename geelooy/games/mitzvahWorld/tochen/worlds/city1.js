/**
 * B"H
 * Starting world for the player, containers
 * components to load and nivrayim.
 */

/**
 * resources
 */


export default {
	shaym: "Yeeshoov",
	components: {
		
		pushka:
		"https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/models%2Fcomponents%2Fpushka.glb?alt=media",

		desertFile:"https://firebasestorage.googleapis.com/v0/b/ckids-games.appspot.com/o/chawfawtseem%2Findexes%2Fworlds%2Fdesert1%2Fdesert1.js?alt=media",
		portalGLB: "https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/models%2Fcomponents%2Fportal.1.glb?alt=media",

		awduhm: "https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/models%2Fawdum_2.6.glb?alt=media",

		dingSound: "https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/sound%2Feffects%2Fding.ogg?alt=media",
		new_awduhm:
			/// isLocal?localPath
			//  +"new_awduhm_new_blender_camera.glb":
			/**
			 * @version 3 that uses blender version
			 * 3.6.2 GLB exporter - works better.
			 */
			"https://firebasestorage.googleapis.com/v0/b/ckids-assets-2.appspot.com/o/models%2Fnew_awduhm_new_blender_camera.glb?alt=media",
		

		world: "https://firebasestorage.googleapis.com/v0/b/ckids-games.appspot.com/o/chawfawtseem%2Fenvironments%2Fcity%2Fcities%2Fcity16.glb?alt=media",

	},
	modules: {
		shlichuseem: {
			redemptionDestitute: 
			"https://firebasestorage.googleapis.com/v0/b/ckids-games.appspot.com/o/chawfawtseem%2Findexes%2Fshleechooseem%2FredemptionOfDestitute.js?alt=media"
			,
			redemptionDestitute2:
			"https://firebasestorage.googleapis.com/v0/b/ckids-games.appspot.com/o/chawfawtseem%2Findexes%2Fshleechooseem%2FredemptionOfDestitute2.js?alt=media",
			rod3:
			"https://firebasestorage.googleapis.com/v0/b/ckids-games.appspot.com/o/chawfawtseem%2Findexes%2Fshleechooseem%2Frod3.js?alt=media"
			,
			shabbos:"https://firebasestorage.googleapis.com/v0/b/ckids-games.appspot.com/o/chawfawtseem%2Findexes%2Fshleechooseem%2FshabbosFood.js?alt=media"
		}
	},

	nivrayim: {
		Domem: {

			world: {
				name: "me",
				path: "awtsmoos://world",
				isSolid: true,
				heesHawveh: true,
				entities: {
					gate2: {
						name: "The Gate of Sustainance",
						shlichusLinked: [
							3, 
						],
						dialogue: {
							default: [
								{
									message: "B\"H\nShalom! Welcome to our community. Do you know about the beauty and significance of Shabbat?",
									responses: [
										{
											text: "Yes, I'm familiar with Shabbat.",
											nextMessageIndex: 1
										},
										{
											text: "I'd like to learn more about it.",
											nextMessageIndex: 2
										},
										{
											text: "I'm just passing through.",
											close: "Well, see ya soon!" 
										}
									]
								},
								{
									message: "B\"H\nThat's wonderful. In our community, we strive to connect with the Awtsmoos through our Shabbat observances, elevating both body and soul.",
									responses: [
										{
											text: "Cool story.",
											close: "Well, see ya soon!" 
										}
									]
								},
								{
									message: "B\"H\nShabbat is a day of rest and spiritual enrichment. We abstain from work to focus on higher pursuits, reconnecting with our Creator and the essence of creation.",
									responses: [
										{
											text: "How does this relate to Chassidus?",
											nextMessageIndex: 3
										},
										{
											text: "Thank you for sharing.",
											close: "Well, see ya soon!" 
										}
									]
								},
								{
									message: "B\"H\nIn Chassidus, Shabbat is seen as a time when the spiritual and physical worlds intersect. It's an opportunity to elevate the material world by dedicating our actions to holiness.",
									responses: [
										{
											text: "That's a profound concept.",
											close: "Well, see ya soon!" 
										},
										{
											text: "Can I participate in this elevation?",
											nextMessageIndex: 4
										}
									]
								},
								{
									message: "B\"H\nAbsolutely. Each person can contribute to this elevation. Keep this in mind, and soon you may find a unique way to participate in our community's preparations for Shabbat.",
									responses: [
										{
											text: "Nice! Well, got to go",
											close: "Well, see ya soon! There may be a mission coming" 
										}
									]
								}
							]
							,
							shlichuseem: [
								4/*the id of the (third?) shlichus
								
								about shabbos*/
							],
							completed(me) {
								me.olam.sealayk(me);
								me.olam.sealayk(me.av);
							}
						},
						type: "Medabeir",
						interactable: true,
						proximity:3
					},
					gate1: {
						name: "50th Gate of Understanding",
						shlichusLinked: [
							1
						],
						messageTree: [
							
								{
									message: "B\"H\n"+
									"In Chassidus, what does the concept of 'Dirah Betachtonim' (a dwelling in the lower realms) primarily refer to?",
									responses: [
										{
											
											text: "Building physical houses.",
											nextMessageIndex: 3
										
										},
										{
											text: "Making the physical world a dwelling place for Hashem through Torah and Mitzvot.",
											
											nextMessageIndex: 1
										},
										{
											text: "Studying only the parts of Torah that discuss earthly matters.",
											nextMessageIndex: 3
										},
										{
											text: "Living on the ground floor of a building.",
											nextMessageIndex: 3
										}
									]
								},
								{
									message: "Yes! That is correct. Now: "
									+
									"What is the unique purpose of a Neshama (soul) coming down into this world according to Chabad philosophy?",
									responses: [
										{
											text: "To learn as much Torah as possible.",
											nextMessageIndex: 3
										},
										{
											text: "To escape the spiritual realms.",
											nextMessageIndex: 3
										},
										{
											text: "To elevate the physical world through performing Mitzvot and learning Torah.",
											nextMessageIndex: 2
										},
										{
											text: "To have a human experience.",
											nextMessageIndex: 3
										}
									]
								},
								{
									message: "Again! You got it. One more: "
									+
									"In Jewish tradition, who is considered the highest level giver of Tzedakah?",
									responses: [
										{
											text: "Someone who gives a large amount of money.",
											nextMessageIndex: 3
										},
										{
											text: "Someone who gives anonymously to an unknown recipient.",
											nextMessageIndex: 3
										},
										{
											text: "Someone who helps someone else get a job",
											nextMessageIndex: 4
										}

									]
								},
								{
									message: "That is FALSE. Try again later.",
									responses: [
										{
											text: "Harsh.",
											action(me) {
												me.ayshPeula("close dialogue", "Bye");
											}
										}
									]
								},
								{
									message:"YES you got all of the questions right! "
									+"Come on in",
									responses: [
										{
											text: "I'm ready when you are",
											action(me) {
												me.ayshPeula("close dialogue", "Come in");
												me.olam.sealayk(me);
												me.olam.sealayk(me.av)
												
											}
										}
									]
									
								}
						],
						type: "Medabeir",
						interactable: true,
						proximity:3
					}
				}


			}
			
		},
		
		Medabeir: {
			pushka: {
				on: {
					ready(w) {
						console.log("HI!!",w)
					}
				},
				path: "awtsmoos://pushka",
				placeholderName: "h",
				proximity: 3,
				dialogue: {
					default: [
						{
							message: "Just another day, receiving coins for the redemption. Am I right?",
							responses: [
								{
									text: "Yes, as always.",
									action(d) {
										d.ayshPeula("close dialogue", "See ya sooner")
									}
								}
							]
						}
					],
					shlichuseem: [
						1/*the id of the (first?) shlichus*/
					]
				}
			}
		},
		Chossid: {
			me: {
				height: 1.5,
				name: "player",
				placeholderName: "player",
				speed: 126,
				interactable: true,
				path: "awtsmoos://awduhm",
				position: {
					x: 25
				},
				
			}
		}
	}
};