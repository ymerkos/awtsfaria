/**
 * B"H
 * 
 * This is the base class for all nivrayim (creations). Each nivra (creation) has a name and a path to its
 * glTF model.
 * 
 * @class
 */

 class Nivra {
    /**
     * Constructs a new Nivra.
     * 
     * @param {string} name The name of the nivra.
     * @param {string} path The path to the glTF model for this nivra.
     */
    constructor(name, path) {
        this.name = name;
        this.path = path;
    }

    /**
     * Starts the nivra. This function can be overridden by subclasses to provide
     * nivra-specific behavior.
     * 
     * @param {Olam} olam The world in which this nivra is being started.
     */
    async heescheel(olam) {
       
        // This can be overridden by subclasses
    }
}

/**
 * Domem is a subclass of Nivra representing inanimate matter.
 * 
 * @class
 * @extends Nivra
 */
class Domem extends Nivra {
    /**
     * Constructs a new Domem.
     * 
     * @param {Object} options The options for this Domem.
     * @param {string} options.name The name of this Domem.
     * @param {string} options.path The path to the glTF model for this Domem.
     * @param {Object} options.position The initial position of this Domem.
     */
    constructor(options) {
        super(options.name, options.path);
        this.position = options.position;
        this.isSolid = !!options.isSolid;
        // Additional properties can be set here
    }

    /**
     * Starts the Domem. This function can be overridden by subclasses to provide
     * Domem-specific behavior.
     * 
     * @param {Olam} olam The world in which this Domem is being started.
     */
    async heescheel(olam) {
        await super.heescheel(olam);
        try {
            var gltf = await new Promise(async (r,j) => {
                var res = await olam.hoyseef(this);
                
            });
        } catch(e) {
            throw e;
        }
        // Implement Domem-specific behavior here
    }
}

class Tzoayach extends Domem {
    constructor(options) {
        super(options);
        // Additional properties can be set here
    }

    async heescheel(olam) {
        super.heescheel(olam);
        // Implement Tzoayach-specific behavior here
    }
}

class Chai extends Tzoayach {
    constructor(options) {
        super(optionsh);
        // Additional properties can be set here
    }

    async heescheel(olam) {
        super.heescheel(olam);
        // Implement Tzoayach-specific behavior here
    }
}

class Medabeir extends Chai {
    constructor(options) {
        super(options);
        // Additional properties can be set here
    }

    async heescheel(olam) {
        super.heescheel(olam);
        // Implement Tzoayach-specific behavior here
    }
}

/**
 * Chossid is a subclass of Medabeir representing the player's character.
 * 
 * @class
 * @extends Medabeir
 */

class Chossid extends Medabeir {
     /**
     * Constructs a new Chossid.
     * 
     * @param {Object} options The options for this Chossid.
     * @param {string} options.name The name of this Chossid.
     * @param {string} options.path The path to the glTF model for this Chossid.
     * @param {Object} options.position The initial position of this Chossid.
     * @param {Array<Object>} options.inventory The initial inventory of this Chossid.
     */
    constructor(options) {
        super(options);
        
        // Additional properties can be set here
    }

    /**
     * Starts the Chossid.
     * 
     * @param {Olam} olam The world in which this Chossid is being started.
     */
     async heescheel(olam) {
        super.heescheel(olam);
        // Implement Chossid-specific behavior here
    }
}
