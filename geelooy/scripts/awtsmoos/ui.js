// B"H

/**
 * @description
 * Wrapped in the enchantment of codes and the melody of functionalities,
 * the UI class stands as a sentinel in the realm of HTML UI Libraries.
 * It inherits the ancient wisdom from the Heeoolee class, enabling it
 * to create, manage, and dance with HTML elements in a symphony of interaction.
 * It oversees the harmonious overlay of HTML elements, holding them
 * with unique names as keys in a private treasure chest named elements.
 *
 * @class UI
 * @extends Heeoolee
 *
 * @property {Object} elements - A clandestine collection that holds
 * the HTML elements, each whispering its unique name as keys.
 *
 * The constructor: The Awakening
 * @method constructor - Awakens the UI class, calling upon
 * the ancient constructor of the sacred Heeoolee.
 *
 * The Gatekeeper: Access to the Hidden Elements
 * @method myHTMLElements - A getter method, the key to the hidden
 * elements, unlocking the secrets within.
 *
 * The Vanishing: Deletion of the HTML Element
 * @method deleteHtml(shaym: string) - With a whisper of the unique name (shaym),
 * it vanishes the HTML element from the DOM and the elements, leaving behind
 * true if successful, false otherwise.
 *
 * The Seeker: Retrieval of the HTML Element
 * @method getHtml(shaym: string) - It seeks and retrieves the
 * HTML element with the given unique name (shaym) from the elements,
 * returning the element if found, null if lost in the awtsmoos.
 *
 * The Creator: Birth of a New HTML Element
 * @method html(original: Object) - With the ancient scrolls of options (original),
 * it breathes life into a new HTML element. It invokes setHtml to
 * imbue properties and append children, returning the newborn element to the world.
 *
 * The Modifier: Alteration of the HTML Element
 * @method setHtml(el: HTMLElement, opts: Object) - With the given
 * HTMLElement (el) and the sacred scripts of options (opts), it alters the properties,
 * styles, children, and ready callback, returning the modified element, touched by awtsmoos.
 *
 * The Actor: Performing Actions on the HTML Element
 * @method htmlAction({ shaym, properties, methods }) - It channels the energies of awtsmoos,
 * performing sacred actions on the HTML element with the given unique name (shaym).
 * It sets properties, invokes methods, and returns an object containing the echoes of its actions.
 *
 * @param {Object} opts - The sacred scripts for modifying the HTML element.
 * Includes tag, style, shaym, ready callback, events (each a whisper of callback name
 * and a dance of function), and children.
 * @param {Object} properties - The properties to be whispered to the HTML element.
 * @param {Object} methods - The sacred dances to be performed by the HTML element.
 * The format is a harmony of { methodName: args }.
 *
 * @returns {HTMLElement} - The element, touched by the breath of creation or modification.
 * @returns {Object} - An object whispering the unique name (shaym), the dances performed,
 * and the properties whispered.
 *
 * @example
 * var ui = new UI();
 * ui.html({ tag: 'div', parent:document.body, shaym: 'myDiv', children: [{ tag: 'span', textContent: 'Hello World' }] });
 * ui.htmlAction({  shaym: 'myDiv', methods: { setAttribute: ['id', 'uniqueId'] } });
 * ui.html({
 *      ready(search, this) {
 *          search("myDiv")
 *          .appendChild(this)
 *      }
 * }) OR
 * 
 * ui.html({
 *  textContent: "I am a child of the el with shaym 'myDiv'",
 * parent: ui.$g("myDiv"),
 * shaym:"child1"
 * })
 * 
 * or 
 * 
 * ui.$h({
 *  textContent:"same as .html. Also $ha is same as .htmlAction",
 * parent:ui.$g("child1")
 * })
 */

/**
 * @private {Object} elements holds 
 * elements by unique name as key(s)
 * */
var elements = {};
var parser = new DOMParser();
import Heeoolee from "/games/mitzvahWorld/ckidsAwtsmoos/chayim/heeooleey.js";
export default class UI extends Heeoolee {
    get myHTMLElements() {
        return elements;
    }
    constructor() {
        super()
    }
    
	/**
		@method peula
		used to Invoke
		custom events
		for interaction
		
		@argument obj
		and object with each
		key as the event name
		and the value as the 
		value to call on the
		callback
	**/
	peula(el, obj={}) {
		if(
			!obj ||
			typeof(obj) != "object"
		) {
			return;
		}
		
		console.log("OB",obj)
		for(
			var k 
			in obj
		) {
			el.dispatchEvent(
				new CustomEvent(k, {
					detail: obj[k]
				})
			);
			
			if(typeof(this.ayshPeula) == "function") {
				this.ayshPeula("custom peula", {
					element: el,
					key:k,
					value: obj[k]
				})
			}
		}
	}
	
    deleteHtml(shaym) {
        if(elements[shaym]) {
            try {
                var par = elements[shaym].parentNode;
                par.removeChild(
                    elements[shaym]
                );
                delete elements[shaym];
                return true;
            } catch(e) {
                return false;
            }
        }
    }

    $ha(opts) {
        return this.htmlAction(opts)
    }

    $s(htmlNode, opts) {
        return this.setHtml(htmlNode,opts)
    }

    $h(opts) {
        return this.html(opts)
    }

    $g(shaym) {
        return this.getHtml(shaym);
    }

    getHtml(shaym) {
        return elements[shaym] || null;
    }

    parseElement(el) {
        var tag = null;
        var attributes = [];
        var children/*Parsed*/ = [];


        return {
            tag,
            attributes,
            children
        }
    }

   makeHtml(opts={}) {
        if(
            !opts || 
            typeof(opts) != "object"
        )
            return null;
        
            
        var tag = opts.tag || "div";
        var el = null;
        var atts = [];
        var toldos = [];
        
        var inh = ""
        if(typeof(
            opts.outerHTML
        ) == "string") {
            var doc = parser.parseFromString(
                opts.outerHTML,
                "text/html"
            );
            var frstEl = doc.body.children[0];
            if(frstEl) {
                tag=frstEl.tagName;
                atts = [
                    ...frstEl
                    .attributes
                ];
                var childs = Array.from(
                    frstEl.childNodes
                ).map(w=>w.cloneNode())

                inh = frstEl.innerHTML;
               toldos=(childs);
                
            }
            
        }
        el = document.createElement(
            tag
        );
        for(
            var atr of atts
        ) {
            el.setAttribute(
                atr.name,
                atr.value
            );
        }
/*
        for(
            var ch of toldos
        ) {
            el.appendChild(ch);
        }*/
        el.innerHTML = inh
        return el;
   }
    /**
     * @method html makes new
     *   html element(s) with children
     * based on format:
     * 
     * {
     *      tag: <string>,
     *      ...<other properties to set to HTML>
     *      children: <array of the same, recursive>
     *      ready(self, getOthers) {
     * 
     *      }
     * }
        
     * @param {Object} opts 
     * @returns {HTMLElement}
     */
    html(opts={}) {
        var el = this.makeHtml(opts)
        
        /**
             * If set explciitly "null",
             * then won't add it right away
             */
            var stringedParent = (par => 
                typeof(par)
                == "string" ?
                this.getHtml(par) 
                : null
            )(opts.parent);




            var parent = opts
                .parent !== undefined
            &&
            
            stringedParent  || 
            
            (
                opts.parent instanceof
                Element ||
                opts.parent instanceof
                Document ?
                opts.parent
                ||
            
                document.body : null
            ) || document.body;
          //      console.log("ASDF",stringedParent,parent,opts.parent,opts)
            if(
                parent
            ) {
                
                parent.appendChild(el)
                
            }
        return this.setHtml(el, opts);
    }

	setHtmlByShaym(shaym, opts={}) {
		console.log("Setting by shaym",shaym);
		var el = this.getHtml(shaym);
		if(!el) return null;
		return this.setHtml(el, opts);
	}
    /**
 * Method to set the HTML element properties, styles, children, and event listeners.
 * @param {HTMLElement} el - The HTML element to set properties on.
 * @param {Object} [opts={}] - Options object containing properties (automatic), 
 * with 
 * styles, children, event listeners, parent. all as keys.
 * @returns {HTMLElement} - The modified HTML element.
 */
setHtml(el, opts = {}) {
    // Properties that should not be directly set on the element
    var exclude = 
        [
            "tag", 
            "style",
            "classList", 
            "shaym", 
            "ready", 
            "children", 
            "events",
            "parent",
            "attributes",
            "child",
            "toldos",
            "awtsmoosOnChange",
            "tolda",
            "outerHTML"
        ];
    
    
    
    // Store the element in the elements object if shaym is specified
    if (typeof opts.shaym === "string") {
        elements[opts.shaym] = el;
    }

    
    if(opts.classList) {
        var cl = opts.classList
        if(Array.isArray(cl)) {
            cl.forEach(w=>{
                el.classList.add(w);
            })
        }
    }

    if(opts.text) {
       // opts.textContent = opts.text;
    }
    // Set properties on the element
    if (typeof opts === "object") {
        Object.keys(opts).forEach(prop => {
            if (!exclude.includes(prop)) {
                el[prop] = opts[prop];
                if(
                    prop.startsWith("on") &&
                    typeof(el[prop])
                    == "function"
                ) {
                    
                    var oth = (
                        arg
                    ) => {
                        opts[prop](arg, this.getHtml, this, el);
                        
                    }
                    el[prop] = oth;
                    
                }
            }
        });
    }

    // Set style on the element
    if (typeof opts.style === "string") {
        el.style.cssText = opts.style;
    } else if (typeof opts.style === "object") {
        Object.assign(el.style, opts.style);
    }

    var attr = opts.attributes;
    if(
        attr &&
        typeof(attr)
        == "object"
    ) {
        Object.keys(attr)
        .forEach(w => {
           
            el.setAttribute(
                w,
                attr[w]
            )
            
        });
    }
    

    // Method to find other elements in the elements object
    var findOthersFunction = shaym => elements[shaym] || null;
    
    var aoc = opts.awtsmoosOnChange
    if(aoc && typeof(
        aoc
    ) == "object") {
        Object.keys(aoc)
        .forEach(k => {
            if(exclude.includes(k))
                return;
            var val = aoc[k];
            if(typeof(val) != "function") {
                return;
            }

            var originalProperty 
            = Object.getOwnPropertyDescriptor(
                Node.prototype, k
            );

            if(!originalProperty) 
                return;

            Object.defineProperty(el, k, {
                set(value) {
                    var rt = val({
                        /**
                         * custom "event"
                         * object
                         */
                        data: {
                            [k]: value
                        }
                    }, el, this.getHtml, this, el)
                    if(false&&rt /*
                        if it 
                        returns true, 
                        we DO the original as well.
                        If not, we just 
                        do the preset action.
                    */)
                        originalProperty.set.call(this, value);
                    
                },
                get() {
                    return originalProperty.get.call(this);
                }
            });

        });
    }
    // Set children of the element
    let children = opts.children || opts.toldos;
    if (typeof children === "function") {
        children = children(findOthersFunction, this);
    }

    
    if (Array.isArray(children)) {
        
        //why remove existing ones?
        // Remove existing children
        Array.from(el.children).forEach(child => {
            child.parentNode.removeChild(child);
            
        });
        
        // Append new children
        children.forEach(childOpts => {
            if(childOpts) {
                var child = this.html(childOpts);
                if(child) {
                    el.appendChild(child);
                    
                }
            }
        });
    }

    var singleChild = opts.child || opts.tolda;
    if(
        singleChild
    ) {
        var child = this.html(singleChild);
        
        
        el.appendChild(child);
    }

    // Invoke the ready callback if specified
    if (typeof opts.ready === "function") {
        opts.ready(el, findOthersFunction, this);
    }

    // Attach event listeners if the events property is specified
    if (typeof opts.events === "object") {
        Object.keys(opts.events).forEach(eventName => {
            var callback = opts.events[eventName];
            if (typeof callback === "function") {
              
                el.addEventListener(eventName, callback);
            }
        });
    }

    el.af = el.awtsmoosFind = findOthersFunction; // Alias for convenience
    el.getElements = () => elements; // Method to get all elements
/*
    if(
        typeof(opts.outerHTML)
        == "string"
    ) {
        el.outerHTML = opts.outerHTML
    }*/
    return el;
}



    /**
     * This function modifies an HTML element by setting properties, invoking methods,
     * and returns an object containing information about the operations performed.
     * @param {Object} params - The parameters object.
     * @param {HTMLElement|string} params.shaym - The target HTML element or its identifier.
     * @param {Object} [params.properties={}] - The properties to set on the element.
     * @param {Object} [params.methods={}] - The methods to call on the element with their arguments.
     * @returns {Object} - An object containing the identifier, called methods, and set properties.
     */
    htmlAction({
        shaym,
        html,
        properties = {},
        methods = {}
    }) {
        // If shaym is a string, get the corresponding HTML element,
        // if it's an HTMLElement, use it directly
        
        
        if(!html) 
            html = typeof shaym === "string" ? 
            this.getHtml(shaym) : html;

        if (!html) {
            throw "Not found element: " + shaym;
            return null; // If the element is not found, return null
        } 


        // Initialize objects to store the properties set and methods called
        var propertiesSet = {};
        var methodsCalled = {};
        var errors = {};

        // Set properties on the HTML element
        if (typeof properties === "object") {
            this.setHtml(html, properties);
        }

    
        // Iterate over the methods object and call each method on the HTML element
        for (let method in methods) {
            // If the method exists and is a function on the element, call it with the provided arguments
            if (typeof html[method] === "function") {
                let args = Array.isArray(methods[method]) ? methods[method] : [methods[method]];
                try {
                    methodsCalled[method] = html[method](...args);
                } catch(e) {
                    if(!errors[method]) {
                        errors[method] = []
                        
                    }
                    errors[method].push(e)
                }
            } else if (typeof html[method] === "object" && html[method] !== null) {
                // If the method is an object, iterate over its properties and call each as a sub-method
                for (let subMethod in methods[method]) {
                    if (typeof html[method][subMethod] === "function") {
                        let args = Array.isArray(methods[method][subMethod]) ? methods[method][subMethod] : [methods[method][subMethod]];
                        try {
                            methodsCalled[subMethod] = html[method][subMethod](...args);
                        } catch(e) {
                            if(!errors[method]) {
                                errors[method] = [];
                            }
                            if(!errors[method][subMethod]) {
                                errors[method][subMethod] = []
                                
                            }
                            errors[method][subMethod].push(e)
                        }
                    }
                }
            }
        }
        var k = Object.keys(errors)
        if(k.length) {
            throw errors;
        }
        
        // Return an object containing the identifier, called methods, and set properties
        return {
            shaym,
            methodsCalled,
            propertiesSet,
            errors: errors || null
        }
    }

}

HTMLElement.prototype.cheepawysh = (ui, shaym) => {
    if(!ui || ui.getHtml) return null;
    if(typeof(ui.getHtml) == "function")
        return null;
    return ui.getHtml(shaym);
}