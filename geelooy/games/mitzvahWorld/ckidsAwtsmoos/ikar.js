/**
 * B"H

 */

/**
 * import data for world
 */



//import starting level

console.log("B\"H",
"\n","Starting the Ikar JS!")

import ManagerOfAllWorlds from "./Olam/worldManager.js";

try {


    ///alert("Loaded")
    if(!window.invalid) {
        var m = new ManagerOfAllWorlds('/oyvedEdom.js');
        window.mana =  m;
        console.log("Loaded!",m)
    }
} catch(e) {
    console.log("Issue!", e)
}




















