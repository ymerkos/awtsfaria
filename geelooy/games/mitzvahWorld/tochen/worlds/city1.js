/**
 * B"H
 * Starting world for the player, containers
 * components to load and nivrayim.
 */

/**
 * resources
 */


export default {
	components: {
		desertFile: "https://firebasestorage.googleapis.com/v0/b/ckids-assets-2.appspot.com/o/worldData%2F2%2F2.js?alt=media",



		portalGLB: "https://firebasestorage.googleapis.com/v0/b/ckids-assets-2.appspot.com/o/models%2Fassets%2Fportal.glb?alt=media",

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
		

		world: "https://firebasestorage.googleapis.com/v0/b/ckids-games.appspot.com/o/chawfawtseem%2Fenvironments%2Fcity%2Fcities%2Fcitty1.glb?alt=media",

	},

	nivrayim: {
		Domem: {

			world: {
				name: "me",
				path: "awtsmoos://world",
				isSolid: true,
				heesHawveh: true


			},
			Portal: {
				desert: {
					path: "awtsmoos://portalGLB",


					interactable: true,
					placeholderName: "portal1",
					proximity: 1,
					worldPath: "cityFile"
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
					on: {

						ready(m) {
							var isOtherview = false;
							m.on("keypressed", k => {
								if (k.code == "KeyY") {
									if (!isOtherview) {
										if (m.asset.cameras[0]) {
											m.olam.activeCamera = m.asset.cameras[0]
										}
										isOtherview = true;
									} else {
										isOtherview = false;
										m.olam.activeCamera = null;
									}
								}
							})


						}
					}
				}
			},
			Medabeir: {
				him: {
					name: "npc_1",
					placeholderName: "npc_1",
					path: "awtsmoos://new_awduhm",
					proximity: 3,
					messageTree(myself) {
						return [{
								message: "B\"H\n" +
									"Hi! How are you today?",

								responses: [{
										text: "Tell me more about this place.",
										nextMessageIndex: 1
									},
									{
										text: "Bye",
										action(me) {

										}
									}
								]
							},
							{
								message: "Good question"
							}
						]
					},
					on: {
						ready(me) {


							me.playChayoos("stand");
						},

						nivraNeechnas(
							nivra
							/*
							   creation 
							   that entered
						   */
							,
							me
						) {

							AWTSMOOS.Dialogue.nivraNeechnas(
								nivra, me
							);
						},
						nivraYotsee(nivra, me) {
							AWTSMOOS.Dialogue.nivraYotsee(
								nivra, me
							);

						}
					}
				},

			}
		}
	}
};