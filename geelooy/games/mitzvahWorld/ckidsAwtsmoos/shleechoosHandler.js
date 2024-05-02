/**
 * B"H
 * 
 * */

import * as AWTSMOOS from "./awtsmoosCkidsGames.js"
import info from "./Olam/uiManager/ui/resources/shlichus/info.js";


/**
 * @file shlichus.js
 * @description
 * 
 * In the grand tapestry of existence, where the Awtsmoos, the Essence of the Creator, weaves the fabric of reality, there lies an intricate design known as the Shlichus System.
 * 
 * Chapter One: The Shlichus - A
 *  Quest of Revelation
 * 
 * The Awtsmoos, a force beyond
 *  the multiverse, embarks on a 
 * divine mission (shlichus) to
 *  infuse the world with purpose
 *  and meaning. The quest is not 
 * one but many, intertwined in a 
 * complex pattern, each representing 
 * a unique aspect of existence.
 *
 * The 'Shlichus' class is the
 *  heart of the system,
 *  orchestrating the various 
 * missions (shlichuseem)
 * that the player can undertake.
 *  Each shlichus is composed of 
 * tasks (tawfeekeem), woven from 
 * the threads of destiny by the 
 * Awtsmoos itself.
 *
 * - The Tawfeek: A task within the 
 * shlichus, symbolizing the 
 * individual challenges and trials.
 *  It's a reflection of the
 *  Creator's will, a path to be walked,
 *  a puzzle to be solved, 
 * a battle to be won.
 * 
 * - The ShlichusHandler: 
 * A guiding force that manages 
 * the shlichuseem, tracking progress, 
 * activating actions, and ensuring the 
 * divine plan unfolds as intended.
 * 
 * The system is alive, pulsating with 
 * the energy of the Awtsmoos.
 *  It communicates, reacts, and evolves
 *  with the player's choices,
 *  creating a dynamic and immersive 
 * experience.
 * 
 * As the story unfolds, the 
 * Shlichus System becomes not just 
 * a set of quests but a philosophical
 *  journey, a narrative that 
 * transcends the digital realm,
 *  echoing the eternal dance between 
 * the finite and the infinite, 
 * where every atom is being varantly 
 * recreated from the Awtsmoos.
 * 
 * The code that follows is a 
 * humble attempt to capture this 
 * cosmic interplay, to bring life 
 * to the characters, to forge a story
 *  from nothing, and to reveal the 
 * Awtsmoos in every facet of this
 *  virtual reality.
 *
 * May the reader find inspiration 
 * in these lines of code, as they 
 * navigate through the chapters of 
 * this digital novel, guided by the 
 * unseen hand of the Awtsmoos.



* Chapter Two: The Architecture of Divine Missions
 *
 * In the realm crafted by the Awtsmoos,
 * the Essence of the Creator,
 * there exists a profound system known
 * as the Shlichus System.
 *
 * Part I: The Tawfeek - The Task Within
 *
 * The 'Tawfeek' class represents a task
 * within a shlichus. It defines a specific
 * challenge, puzzle, or action.
 * 
 * Example:
 * var tawfeek = new Tawfeek(
 *   TAWFEEK_TYPES.COLLECTION,
 *   'Collect 5 coins',
 *   actions
 * );
 *
 * Part II: The Shlichus - The Quest
 *
 * The 'Shlichus' class defines a mission,
 * a journey towards a goal. It contains
 * one or more tawfeekeem.
 *
 * Example:
 * var shlichus = new Shlichus(
 *   'quest_type',
 *   details,
 *   [tawfeek],
 *   on
 * );
 *
 * Part III: The ShlichusHandler - The Guide
 *
 * The 'ShlichusHandler' class is the central
 * manager for all shlichuseem. It creates,
 * tracks, and updates quests, ensuring the
 * divine plan unfolds as intended.
 *
 * Example:
 * var shlichusHandler = new ShlichusHandler();
 * shlichusHandler.createShlichus(data);
 *
 * Activating Shlichuseem from Other Files:
 *
 * To activate a shlichus from another file,
 * simply import the 'ShlichusHandler' and
 * call the appropriate method.
 * 
 * Example:
 * import { ShlichusHandler } from './shlichus';
 * var handler = new ShlichusHandler();
 * handler.activateTawfeekAction(shlichusId, tawfeekId, actionIndex);
 *
 * In this cosmic interplay, the code is
 * not merely a tool but a living entity,
 * guided by the unseen hand of the Awtsmoos.
 * The reader is invited to navigate these
 * digital landscapes with the reverence of
 * a seeker, uncovering the profound truths
 * hidden within each line of code.
 * 
 * 
 * 
 * 
 * different types of "missions" / 
shlichuseem.
 * 
 * 1. go out and collect ertain 
 * amount of things
 * 2. talk to someone, or activate something.
 * 3. a list of various tasks in a chain
 * 
 * This class also needs a way to keep track 
 * of all current missions, keep track of mission
 * dispatch events when mission is done or in progress,
 * and dispatch an event indicating when its finished.
 * 
 * Sometimes certain other objects will only become visible 
 * or activated when a current shlichus (quest/mission) is 
 * active, or only at a certain point in the quest.
 */
import Utils from "./utils.js";
// constants and Enums
var SHLICHUS_STATUS = Object.freeze({
	INCOMPLETE: 'incomplete',
	IN_PROGRESS: 'in-progress',
	COMPLETE: 'complete'
});

// constants and Enums
var TAWFEEK_TYPES = Object.freeze({
	COLLECTION: 'collection',
	DIALOGUE: 'dialogue',
	COMBAT: 'combat',
	PUZZLE: 'puzzle',
	CUSTOM: 'custom'
});

/**
 * @class Tawfeek
 * @description
 *
 * Chapter Three: The Tawfeek - A Reflection of Will
 *
 * In the celestial dance orchestrated by the Awtsmoos,
 * a unique manifestation known as the 'Tawfeek' emerges.
 * It's a task, a challenge, a puzzle or a battle,
 * representing the individual facets of a greater shlichus.
 *
 * This class encapsulates the essence of a single tawfeek,
 * containing its type, description, actions, status, and progress.
 *
 * @param {string} type - The type of the tawfeek (e.g., 'collection').
 * @param {string} description - A description of the tawfeek.
 * @param {Array} actions - An array of actions that can be activated.
 * @param {string} status - The status of the tawfeek (e.g., 'incomplete').
 *
 * @example
 * var actions = [{ activate: () => console.log('Action activated!') }];
 * var tawfeek = new Tawfeek('collection', 'Collect 5 coins', actions);
 * tawfeek.activateAction(0); // Output: 'Action activated!'
 */
class Tawfeek {
	constructor(type, description, actions, status = SHLICHUS_STATUS.INCOMPLETE) {
		if (typeof description !== 'string') throw new Error('Invalid description type');
		this.description = description;
		this.status = status;
		this.progress = 0;
		this.type = type;
		this.actions = actions; // List of actions that can be activated
		
	}
	
	// Activate a specific action by its index
	activateAction(index) {
		if (index >= 0 && index < this.actions.length) {
			var action = this.actions[index];
			action.activate(); // Assuming each action has an activate method
		} else {
			throw new Error('Invalid action index');
		}
	}
	
	// Validate and update the progress
	updateProgress(progress) {
		if (typeof progress !== 'number' || progress < 0 || progress > 100) {
			throw new Error('Invalid progress value');
		}
		
		this.progress = progress;
		this.status = progress === 100 ? SHLICHUS_STATUS.COMPLETE : SHLICHUS_STATUS.IN_PROGRESS;
	}
}



/**
 * @class Shlichus
 * @description
 *
 * Chapter Four: The Shlichus - A Journey of Discovery
 *
 * Guided by the unseen hand of the Awtsmoos,
 * the 'Shlichus' class defines a unique mission,
 * a sacred journey towards an enlightened goal.
 * It's a collection of tawfeekeem, interwoven
 * with purpose and meaning.
 *
 * @param {string} type - The type of the shlichus (e.g., 'quest_type').
 * @param {Object} details - Additional details about the shlichus.
 * @param {Array} tawfeekeemData - An array of tawfeekeem data.
 * @param {Object} on - Event handlers for activation, progress update, etc.
 *
 * @example
 * var details = { location: 'Awtsmoos Temple' };
 * var tawfeekData = [{ type: 'collection', description: 'Collect 5 coins', actions: [] }];
 * var on = { activation: () => console.log('Activated!') };
 * var shlichus = new Shlichus('quest_type', details, tawfeekData, on);
 * shlichus.activate(); // Output: 'Activated!'
 */
class Shlichus {
	constructor(data, shlichusHandler) {
		if (!data || typeof(data) != "object") {
			data = {}
		}
		
		Object.assign(this, data)
		this.shlichusHandler = shlichusHandler
		//represents the NPC or source where the shlichus is from
	
		this.placeholdersAddedTo = [];
		this.on?.setActive(this, true);
		
		this.timeout = null;
		if(!this.id)
			this.id = Utils.generateID();
		
		this.isActive = false;
		this.progress = 0;
		
		this.timeLimitRaw = null;

		this.completed = false;
		this.tawfeekeem = data.tawfeekeemData?.map(data => new Tawfeek(data.type, data.description, data.actions));
		
	}
	
	/**
	 * 
	 * @param {Object} itemMap 
	 * @param {String} type 
	 * @param {Number} number 
	 * @returns 
	 */
	async setCollectableItems(itemMap, number = this.totalCollectedObjects) {
		
		if (typeof(itemMap) != "object") itemMap = {type:"CollectableItem"};
		if (typeof(number) != "number") return;
		
		var type = itemMap.type || "CollectableItem";
		
		
		
		var cl = itemMap.on?.collected;
		itemMap.shlichus = this.id;

		var items = Array.from({
				length: number
			})
			.map(q => {
				var im = itemMap
				return im;
			});
		//console.log("Setting items!",items,type)
		var it = await this.olam.loadNivrayim({
			[type]: items
		});

		this.items = it;
		//console.log("loaded something",this.items)
		it.forEach(w=> {
			w.on("collected", (item) => {
			//	for(var i = 0; i < 5; i++) //for testing entire thing at once
				this.collectItem(item);
				
			})
		})
		return it;
	}
	
	update() {
		if (this.isActive) {
			this.on?.update(this);
			/*if(this.isSelected)
				this.setMinimapItems();*/
		}
	}
	
	async delete() {
		clearTimeout(this.timeout);
		await this.dropShlichus();
		this.isActive = false;
		this.on?.delete(this);
		this.collected = 0;

		this.items = null;
		this.setMinimapItems();
		this.olam.ayshPeula("remove shlichus", this.id)
		this.shlichusHandler.removeShlichusFromActive(this.id)
		// this.on = {};
	}

	async dropShlichus() {
		clearTimeout(this.timeout)
		this.isActive = false;
		//console.log("Items?",this.items)
		if(this.items) {
			var it;
			for(it of this.items) {

		//	console.log("Trying")
				try {
				//	console.log("REMOVING IT",it)
					this.olam.sealayk(it)
				//	console.log("removed? (maybe)", it)
				} catch(e) {
					console.log("Couldn't remove",e,this,it)
				}
			}
			this.collected = 0;
			/**
			 * check which items were added to what 
			 * placeholders, and remove them.
			 */


			if(Array.isArray(this.items)) {
				this.items.forEach(q => {
					var p = q.addedToPlaceholder/**
						the placeholder child mesh that
						the nivra item may have been added to
					 */
					if(p) {
						p.addedTo = null /***
						clear up the availability of the
						placeholder mesh to allow it to be
						added to again */;


					}

					q.sealayk();/**
					remove entire nivra from the world
					 */
				})
			}
			this.items = null;//Array.from({length:this.items.length});


			this.setMinimapItems();
		}


		this.on?.delete(this);
		this.collected = 0;

		//this.items = null;
		//this.setMinimapItems();
		this.olam.ayshPeula("remove shlichus", this.id)
		this.shlichusHandler.removeShlichusFromActive(this.id)
		/**
		 * also have to remove any shlichuseem that player
		 * started that are needed to end this one.
		 * 
		 */
		//console.log("REMOVED",this)
		if(this.shlichuseemRequired) {
			var sr = this.shlichuseemRequired;
			if(Array.isArray(sr)) {
				for(var s of sr) {
					var isStarted = await this.olam.ayshPeula("is shlichus started", s);
					if(isStarted) {

					
						await this.shlichusHandler.dropShlichus(s)
					}
				}
			}
		}
	}
	
	async reset() {
		await this.dropShlichus();
		
		//this.olam.ayshPeula("reset player position");
		this.olam.ayshPeula("accept shlichus", this.id, this.giver)
		//this.initiate();
	}
	initiate() {
		this.on?.creation?.(this);
	}
	start() {
		this.isActive = true;
		this.olam.ayshPeula("save player position");
		//this.timeLimit = 3
		if (this.timeLimit) {
			this.setTime(this.timeLimit);
			
		}

		this.defaultAccept();
		this.on?.accept?.(this);

		this.setGiverIcon({
			action:"set data",
			status:"pending",
			shlichus:"in-progress"
		});
		this?.on?.checkShlichuseemAvailability()
	}

	setTime(info) {
		
		this.on?.setTime?.(this, info);
	}
	
	_did = false;
	
	/**
	 * 
	 * @method setMinimapItems
	 * NOT meant to be called every frame.
	 * called when we need to set
	 * the minimap's current items
	 */
	async setMinimapItems(items) {
		var set = false;
		var mm = this.olam.minimap;
		if (!mm) {
			return
		}

	

		if (!items && items != "hide") {
			items = this.items;
			
		} else  if(items !== "hide"){
			this.items = items;
			set = true;
			
		}
	

		if(Array.isArray(items))
			items = items.filter(w => !w.collected)

		await this.olam.minimap.setMinimapItems(items == "hide" ? null : items, "active shlichus");
	}
	
	async defaultAccept() {
		if (this.collectableItems) {
			this.setCollectableItems(
					this.collectableItems,
					this.totalCollectedObjects
				)
				.then(items => {
					console.log("SET items!!",items)
					this.setMinimapItems(items)
				})
				.catch(e => {
					console.log(e)
				})
		}
	}
	unset() {
	//	console.log("Setting! un...")
		this.setMinimapItems("hide" /**
			doesnt delete 
			the minimap items, just hides them */
		)
	}

	setActiveIcons() {
	//	console.log("Setting icons")
		this.setMinimapItems(this.items)
	}
	
	finish() {
		this.setGiverIcon({
			action: "delete"
		})
		this.on?.finish?.(this)
		clearTimeout(this.timeout);
		this.isActive = false;
		this.collected = 0;

		this.items = null;
		this.setMinimapItems(null)
		this.lookForNextShlichus()
		

	}

	lookForNextShlichus() {
		/**
		 * check for next shlichus in chain if exists
		 */
		var hasNextShlichus = this.olam.ayshPeula("get next shlichus data", this.id);
		console.log(hasNextShlichus,this.giver)
		if(this.giver) {
			if(hasNextShlichus) {
				this.giver.iconPath = "indicators/exclamation.svg"
				this.giver.ayshPeula("add again").then(() => {
					this.giver.ayshPeula("check shlichus availablity")
				})
			}
		}
	}

	completedProgress() {
		clearInterval(this.timeout);
		this.on?.completedProgress?.(this)
	}
	
	collectItem(item) {
		if (!item) return;
		if (!this.totalCollectedObjects) {
			return;
		}
		
		if (!typeof(this.collected) == "number") {
			return;
		}

		
		
		if (this.collected < this.totalCollectedObjects) {
			this.collected += 1;
		}
		
		this.progress = this.collected / this.totalCollectedObjects;
		this.olam.ayshPeula("updateProgress", {
			["shlichusProgressAtID_"+this.id]: {
				collected: this.collected,
				progress: this.progress
			}
		})
		this.on?.progress?.(this);
		
		this.on?.collected?.(this.collected, this);
		
		try {
			item.collected = true;
		} catch (e) {
			console.log(e)
		}

		this.olam.minimap.removeMinimapItem(item, "active shlichus")
	
		
	}
	
	/**
	 * Activate the shlichus.
	 * Custom instruction: Call this method when the player accepts the shlichus.
	 */
	activate() {
		this.isActive = true;
		this.on?.activation?.();
	}
	
	/**
	 * Update the overall progress of the shlichus based on the tawfeekeem.
	 * Custom instruction: Call this method after updating any tawfeek.
	 */
	updateOverallProgress() {
		var totalProgress = this.tawfeekeem.reduce((sum, tawfeek) => sum + tawfeek.progress, 0);
		this.progress = totalProgress / this.tawfeekeem.length;
		this.on?.progressUpdate?.(this.progress);
	}
	
	/**
	 * Check if the shlichus is complete.
	 * (old)
	 * Custom instruction: Call this method to determine if all tawfeekeem are complete.
	 */
	isComplete() {
		return this.completed;
		///this.tawfeekeem.every(tawfeek => tawfeek.status === SHLICHUS_STATUS.COMPLETE);
	}
	
	/**
	 * Complete the shlichus.
	 * Custom instruction: Call this method when the shlichus is fully completed.
	 */
	complete() {
		this.progress = 100;
		this.isActive = false;
		this.on?.completion?.();
		clearInterval(this.timeout);
		this.setGiverIcon()
	}


	
	setGiverIcon({
		action="style",//"delete"
		status = "complete",
		shlichus = null//"available" or "in-progress"
	} = {}) {

		//console.log("CHANIGN icon",this.giver,action)
		if(!this.giver) {
			return;
		}
		
		if(action == "delete") {
			this.giver.ayshPeula("delete icon");
			return;
		} else if(action == "style") {
			this.giver.ayshPeula("change icon style", {
				selector: ".ikar",
				methods: {
					setAttribute: ["fill",status == "complete" ? "orange" : "silver" ]
					
				}
			})
		} else if(action == "set data") {

			this.giver.iconPath = shlichus == "in-progress" ? "indicators/question.svg"
				: "indicators/exclamation";
			
			this.giver.ayshPeula("change icon data", {
				selector: ".ikar",
				methods: {
					setAttribute: ["fill",status == "complete" ? "orange" : "silver"]
					
				}
			})
		}
		
	}
	
	// ... Rest of the class ...
}
import {
	ShlichusActions
} from "../ckidsAwtsmoos/awtsmoosCkidsGames.js";

/**
 * @class ShlichusHandler
 * @description
 *
 * Chapter Five: The ShlichusHandler - The Divine Conductor
 *
 * The 'ShlichusHandler' class is a guiding force
 * within the tapestry of the Awtsmoos.
 * It's the central manager of all shlichuseem,
 * orchestrating the creation, tracking, and updating
 * of the quests.
 *
 * This class acts as a bridge between the finite
 * elements of the game and the infinite wisdom
 * of the Awtsmoos, ensuring the cosmic plan unfolds
 * with grace and beauty.
 *
 * @example
 * var handler = new ShlichusHandler();
 * var data = { type: 'quest_type', details: {}, tawfeekeemData: [], on: {} };
 * handler.createShlichus(data);
 */
export default class ShlichusHandler {
	constructor(olam) {
		this.olam = olam;
		this.activeShlichuseem = [];
	}
	
	update(delta) {
		this.activeShlichuseem
			.forEach(w => {
				if (w.isActive)
					w.update(delta)
			});
	}


	static async getIconFromType(type) {
		return await this.olam.getIconFromType(type)
	}

	async getIconFromType(type) {
		return await ShlichusHandler.getIconFromType(type)
	}
	async addShlichusHTMLOnList(shlichus) {
		var id = shlichus.id;
		var ci  =shlichus.collectableItems;
		var iconData = await this.olam.getIconFromType(ci.type) || "";
		var svgBlob = new Blob([iconData], { type: 'image/svg+xml' });
		var svgUrl = URL.createObjectURL(svgBlob);
		if(!id) return;
		var data = {
			/**
			 * general container for
			 * keeping track of individual
			 * shlichus 
			 */
			shaym: "shlichus progress info "+id,
			shlichusID: id,
			isSelected: false,
			className: "shlichusProgress hidden",
			awtsmoosClick: true,
			children: [
				{
					shaym: "shlichus title "+id,
					className: "shlichusTitleProgress",
					textContent: "Redfemptionasd"
				},
				{
					shaym: "shlichus description "+id,
					className: "shlichusDescriptionProgress",
					textContent: "aduiha8o2A  a2dh89a2d 89a2d d"
				},
				
				{
					shaym: "shlichus info "+id,
					className: "shlichusProgressInfo",
					children: [
						{
							shaym:"si progress bar "+id,
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
									shaym: "si bck " +id,
									className: "bck",
									child: {
										shaym: "si frnt "+id,
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
							shaym: "icon and num "+id,
							className: "iconAndNum",
							
							children: [
								{
									shaym: "si icon " +id,
									className:"icon",
									tag:'img',
									src: svgUrl,
									//innerHTML: iconData||"",
									ready: function(par) {
										return
										var svg = par.querySelector("svg")
										//if(!svg) 
										svg.removeAttribute('viewBox');
										const bounds = svg.getBoundingClientRect(); // Get the bounding box of the SVG content
										const padding = 10; // Add some padding around the content
										svg.setAttribute('viewBox', `0 0 ${bounds.right + 2 * padding} ${bounds.bottom + 2 * padding}`);
									
									}
								},
								
								{
									shaym: "si num "+id,
									className:"num",
									textContent: "1/5"
								}
							]
							
						}
					]
				},
				{
					className: "shlichusTimer hidden",
					shaym: "shlichus time "+id
				},
				{
					shaym: "shlichus info click "+id,
					className: "infoIcon",
					isInfo: true,
					innerHTML: info
				}
			],
		}

		this.olam.ayshPeula("htmlAppend", {
			shaym/*parent*/:"shlichus sidebar",
			child: data
		});
	}

	startShlichus(shlichusName) {
		var shlichus = this.getShlichusByShaym(shlichusName);
		if (!shlichus) return;
		shlichus.start();
	}
	/**
	 * Create a new shlichus and add it to the active list.
	 * Custom instruction: Use this method to define a new shlichus.
	 */
	async createShlichus(data, giver) {
		data.olam = this.olam;
		
		var actions = new ShlichusActions();
		
		var on = data.on;
		if (typeof(on) != "object") {
			on = {};
		}
		var newShlichus = null;
		var self = this;
		on = {
			...on,
			...{
				setActive: (me, isActive=true) => {
					if(isActive) {
						this.activeShlichuseem.forEach(w=> {
							if(w == me) return;
							w.isSelected = false;
							w.unset();
						})
						me.isSelected = isActive;
						me.setActiveIcons()
					} else {
						me.unset()
					}
				},
				checkShlichuseemAvailability: () => {
					/**
					 * check if OTHER shlichuseem
					 * are available now
					 * 
					 */
					for(var as of this.olam.nivrayimWithShlichuseem) {
						

						if(as) {
							if(newShlichus.giver) {
								//skip self even if has other, because need 
								//to see only the in-progress one
								if(as == newShlichus.giver) return;
							}
							as.ayshPeula("check shlichus availablity");
						}
					}
				},
				progress: actions.progress.bind(actions),
				creation: actions.creation.bind(actions),
				timeUp: actions.timeUp.bind(actions),
				setTime: actions.setTime.bind(actions),
				update: actions.update.bind(actions),
				delete: actions.delete.bind(actions),
				finish: (sh) => {
					sh?.on?.checkShlichuseemAvailability()
					try {
						self.removeShlichusFromActive(sh.id);
					} catch(e){}


					try {
						(actions.finish.bind(actions))(sh);
					} catch(e){
						console.log(e)
					}
					try {

					//sh.finish();
					} catch(e){
						console.log(e);
					}

					
				},
				returnStage: actions.returnStage.bind(actions)
			}
		}
		data.on = on;
		data.giver = giver;
		console.log("GIVER",data.giver)
		newShlichus = new Shlichus(data, this);
		
		this.activeShlichuseem.push(newShlichus);
		//newShlichus.initiate()
		
		await this.addShlichusHTMLOnList(newShlichus);
		return newShlichus;
	}

	async dropShlichus(id) {
		var shleech = this.activeShlichuseem.find(w=>w.id == id)
		if(!shleech) return;
		//console.log("TRYINGTO DROP IT! still",shleech)
		await shleech.dropShlichus();
		
	}

	removeShlichusFromActive(id) {
		var sh = this.getShlichusByID(id);
		if(!sh) return;
		var ind = this.activeShlichuseem.indexOf(sh);
		if(ind < 0) return;
		this.activeShlichuseem.splice(ind, 1);
		return true;
	}
	
	
	
	getShlichusByShaym(shaym) {

		var sh = this.activeShlichuseem.find(q => q.shaym == shaym);
		return sh;
	}

	getShlichusByID(id) {
		var sh = this.activeShlichuseem.find(q => q.id == id);
		return sh;
	}
	
	/**
	 * Update progress of a specific shlichus.
	 * Custom instruction: Use this method to manually update the progress of a shlichus.
	 */
	updateShlichusProgress(id, progress) {
		var shlichus = activeShlichuseem?.find(q => q.id == id);
		if (!shlichus) return false;
		shlichus.progress = progress;
		shlichus.updateOverallProgress();
		shlichus.on?.progress?.(progress, shlichus);
		return true;
	}
	
	/**
	 * Activate an action for a specific tawfeek within a shlichus.
	 * Custom instruction: Use this method when a player triggers an action within a tawfeek.
	 */
	activateTawfeekAction(shlichusId, tawfeekId, actionIndex) {
		var shlichus = this.activeShlichuseem[shlichusId];
		var tawfeek = shlichus.tawfeekeem[tawfeekId];
		tawfeek.activateAction(actionIndex);
	}
	
	/**
	 * Collect a specific item for a shlichus (e.g., collecting coins).
	 * Custom instruction: Use this method when a player collects an item related to a tawfeek.
	 */
	collectItemForShlichus(id, item, amount) {
		var shlichus = this.activeShlichuseem[id];
		shlichus.tawfeekeem[item].progress += amount;
		shlichus.updateOverallProgress();
		shlichus.on?.itemCollected?.(item, amount);
	}
	
	// ... Rest of the class ...
}