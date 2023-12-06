/**
 * B"H
 * 
 * */


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
 * where every atom is being constantly 
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
 * const tawfeek = new Tawfeek(
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
 * const shlichus = new Shlichus(
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
 * const shlichusHandler = new ShlichusHandler();
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
 * const handler = new ShlichusHandler();
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
// Constants and Enums
const SHLICHUS_STATUS = Object.freeze({
    INCOMPLETE: 'incomplete',
    IN_PROGRESS: 'in-progress',
    COMPLETE: 'complete'
  });
  
  // Constants and Enums
const TAWFEEK_TYPES = Object.freeze({
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
 * const actions = [{ activate: () => console.log('Action activated!') }];
 * const tawfeek = new Tawfeek('collection', 'Collect 5 coins', actions);
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
      const action = this.actions[index];
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
 * const details = { location: 'Awtsmoos Temple' };
 * const tawfeekData = [{ type: 'collection', description: 'Collect 5 coins', actions: [] }];
 * const on = { activation: () => console.log('Activated!') };
 * const shlichus = new Shlichus('quest_type', details, tawfeekData, on);
 * shlichus.activate(); // Output: 'Activated!'
 */
  class Shlichus {
    constructor(data) {
      if(!data || typeof(data) != "object") {
        data = {}
      }
      var {
        type, 
        details, 
        tawfeekeemData, 
        collected,
        on,
        totalCollectedObjects,
        shaym, description, objective,
        completeText,
        progressDescription,
        timeLimit,
        giver,
        olam
    } = data;
      if(!(
        type && details && tawfeekeemData
      )) {
      //  return false;
      }
      this.progressDescription = progressDescription;
      this.timeLimit = timeLimit;
      this.shaym = shaym;
      this.type = type;
      this.details = details;
      this.tawfeekeem = tawfeekeemData?.map(data => new Tawfeek(data.type, data.description, data.actions));
      this.on = on;
      this.isActive = false;
      this.progress = 0;
      this.description = description;
      this.objective = objective;
      this.completeText = completeText;
      //represents the NPC or source where the shlichus is from
      this.giver = giver;
      this.totalCollectedObjects = totalCollectedObjects || 0;
      this.collected = collected;
      this.olam = olam;
      this.id = Utils.generateID();
    }


    start() {
      this.on?.creation?.(this);
      if(this.timeLimit) {
        this.startTime = Date.now();
        setTimeout(() => {
          this.on?.timeUp?.(this)
        }, this.timeLimit* 1000)
      }

      this.on?.accept?.(this)
    }

    collectItem() {
      if(!this.totalCollectedObjects) {
        return;
      }

      if(!typeof(this.collected) == "number") {
        return;
      }

      if(this.collected < this.totalCollectedObjects) {
        this.collected += 1;
      }

      this.progress = this.collected / this.totalCollectedObjects;

      this.on?.progress?.(this);
      this.on?.collected?.(this.collected, this.totalCollectedObjects);

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
      const totalProgress = this.tawfeekeem.reduce((sum, tawfeek) => sum + tawfeek.progress, 0);
      this.progress = totalProgress / this.tawfeekeem.length;
      this.on?.progressUpdate?.(this.progress);
    }
  
    /**
     * Check if the shlichus is complete.
     * Custom instruction: Call this method to determine if all tawfeekeem are complete.
     */
    isComplete() {
      return this.tawfeekeem.every(tawfeek => tawfeek.status === SHLICHUS_STATUS.COMPLETE);
    }
  
    /**
     * Complete the shlichus.
     * Custom instruction: Call this method when the shlichus is fully completed.
     */
    complete() {
      this.progress = 100;
      this.isActive = false;
      this.on?.completion?.();
    }
  
    // ... Rest of the class ...
  }
  import {ShlichusActions} from "../ckidsAwtsmoos/awtsmoosCkidsGames.js";

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
 * const handler = new ShlichusHandler();
 * const data = { type: 'quest_type', details: {}, tawfeekeemData: [], on: {} };
 * handler.createShlichus(data);
 */
export default class ShlichusHandler {
    constructor(olam) {
      this.olam = olam;
      this.activeShlichuseem = [];
    }
  
    /**
     * Create a new shlichus and add it to the active list.
     * Custom instruction: Use this method to define a new shlichus.
     */
    createShlichus(data) {
      data.olam = this.olam;
      
      var actions = new ShlichusActions();
      console.log("Got actions,actions",actions)
      var on = data.on;
      if(typeof(on) != "object") {
        on = {};
      }
      on = {
        ...on,
        ...{
          progress:actions.progress,
          creation: actions.creation,
          timeUp: actions.timeUp
        }
      }
      data.on = on;
      console.log("ON?",data.on,data)
      const newShlichus = new Shlichus(data);
      this.activeShlichuseem.push(newShlichus);
      newShlichus.isActive = true;


      newShlichus.start();
      return newShlichus;
    }

    getShlichusByShaym(shaym) {
      if(typeof(shaym) != "string")
        return null;
      var sh = this.activeShlichuseem.find(q=>q.shaym == shaym);
      return sh;
    }
  
    /**
     * Update progress of a specific shlichus.
     * Custom instruction: Use this method to manually update the progress of a shlichus.
     */
    updateShlichusProgress(id, progress) {
      const shlichus = activeShlichuseem?.find(q=>q.id==id);
      if(!shlichus) return false;
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
      const shlichus = this.activeShlichuseem[shlichusId];
      const tawfeek = shlichus.tawfeekeem[tawfeekId];
      tawfeek.activateAction(actionIndex);
    }
  
    /**
     * Collect a specific item for a shlichus (e.g., collecting coins).
     * Custom instruction: Use this method when a player collects an item related to a tawfeek.
     */
    collectItemForShlichus(id, item, amount) {
      const shlichus = this.activeShlichuseem[id];
      shlichus.tawfeekeem[item].progress += amount;
      shlichus.updateOverallProgress();
      shlichus.on?.itemCollected?.(item, amount);
    }
  
    // ... Rest of the class ...
  }
  