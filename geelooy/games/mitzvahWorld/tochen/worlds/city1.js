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
		

		world: "https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/models%2Fenvironemnts%2Fcity1%2Fcity7.glb?alt=media",

	},

	nivrayim: {
		Domem: {

			world: {
				name: "me",
				path: "awtsmoos://world",
				isSolid: true,
				heesHawveh: true


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
		}
	}
};