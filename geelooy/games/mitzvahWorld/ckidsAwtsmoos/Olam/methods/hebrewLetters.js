/**
 * B"H
 * 
 * methods related to making hebrew letters
 */

import {TextGeometry} from "/games/scripts/jsm/utils/TextGeometry.js";
import {FontLoader} from "/games/scripts/jsm/loaders/FontLoader.js";
import * as THREE from '/games/scripts/build/three.module.js';
export default class {

      
    async loadHebrewFonts() {
        var loader = new FontLoader();
		loader.load('/resources/fonts/Tinos_Bold.json', (font) => {
			this.hebrewLetters = 
				"קראטוןןםפףךלחיעכגדשזסבהנמצתץ"
				.split("");

			this.font = font;
        });
    }
    randomLetter() {
        if(this.hebrewLetters) {
            var r = Math.floor(
                Math.random() * (
                    this.hebrewLetters.length
                )
            );
            var l = this.hebrewLetters[r];
            if(l) return l;
            return this.hebrewLetters[0]
        }
        return "כ"
    }
    randomColor() {
        return new THREE.Color(Math.random(), Math.random(), Math.random());
    }
    colors = {};
    letters = {};
    makeNewHebrewLetter(letter, options={}) {
        if(!this.font) {
            return null;
        }
        var  {colors, letters} = this;
        try {
            if(!options) {
                options = {};
            }
            var color = options.color || "blue";
            var mat;
            var strC = JSON.stringify(color)
            if(!colors[strC]) {
                mat = new THREE.MeshLambertMaterial({
                    color: color,
                   // specular: 0xFFFFFF
                });
                colors[strC] = mat;
            } else {
                mat = colors[strC];
            }
         //   console.log("COLOR",color,strC,mat)
            
            var textGeo;
            if(!letters[letter]) {
                textGeo = new TextGeometry(letter, {
                    font: this.font,
                    size: 0.5,
                    height: 0.1,
                    curveSegments: 12,
                });
                letters[letter] = textGeo;
            } else {
                textGeo = letters[letter]
            }
            
            var textMesh = new THREE.Mesh(textGeo, mat);
            if(options.add) {
                this.nivrayimGroup.add(textMesh)
            }
            if(options.position) {
                try {
                    textMesh.position.copy(options.position);
                } catch(e) {
                    console.log(e)
                }
            }
            return textMesh;
        } catch(e) {
            console.log("ISsue",e)
            return null;
        }
    }
}