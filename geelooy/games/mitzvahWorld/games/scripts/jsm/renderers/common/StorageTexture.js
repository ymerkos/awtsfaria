import { Texture, LinearFilter } from '/games/scripts/build/three.module.js';

class StorageTexture extends Texture {

	constructor( width = 1, height = 1 ) {

		super();

		this.image = { width, height };

		this.magFilter = LinearFilter;
		this.minFilter = LinearFilter;

		this.isStorageTexture = true;

	}

}

export default StorageTexture;
