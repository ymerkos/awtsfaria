/**
 * B"H

 */

/**
 * import data for world
 */

import style from "../tochen/ui/style.js";

import gameUI from "../tochen/ui/gameUI.js";

//import starting level

import UI from "../../../scripts/awtsmoos/ui.js";
import mainMenu from "../tochen/ui/mainMenu.js";
import ManagerOfAllWorlds from "./worldManager.js";

console.log("B\"H");



var ui = new UI();
var h = ui.html({
    shaym: "ikar",
    children: [
        
        style,
        ...mainMenu
    ]
});

var m = new ManagerOfAllWorlds({
    ui
});
window.mana =  m;

if ('serviceWorker' in navigator) {
	// First, try to unregister any existing service worker
	navigator.serviceWorker.getRegistrations().then(function(registrations) {
		for(let registration of registrations) {
			registration.unregister().then(function(boolean) {
				console.log('Service Worker Unregistered', boolean);
			});
		}

		// Then, register the new service worker
		registerServiceWorker();
	}).catch(function(error) {
		console.log('Service Worker Unregistration Failed', error);
	});
} else {
	console.log('Service Workers not supported');
	
	m.initializeForFirstTime(e)
}
	
	
function start() {
				console.log("Loading it now !!!",e)
	m.initializeForFirstTime(e, {
		onerror(e) {
		   
	
			window.aa = ui;
			ui
			.htmlAction({
				shaym: "loading",
				properties: {
					innerHTML: "There was an error. Check console, contact Coby."
				}
			})
			console.log("wow", e)
	
		}
	})

}



async function registerServiceWorker() {
try {
	const registration = await navigator.serviceWorker.register('/oyvedEdom.js');
	console.log('Service Worker Registered', registration);
} catch (e) {
	console.log('Service Worker Registration Failed', e);
}
}

var first = false
h.addEventListener("start", async e => {
    
    if(!first) {
		first = true;
		start()
	}else {
        m.initializeForFirstTime(e)
    }
})




async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('/oyvedEdom.js');
        console.log('Service Worker Registered', registration);
    } catch (e) {
        console.log('Service Worker Registration Failed', e);
    }
}

document.body.appendChild(h)











