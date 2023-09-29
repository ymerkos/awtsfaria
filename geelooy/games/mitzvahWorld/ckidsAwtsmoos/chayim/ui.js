code
/**
 * B"H
 * 
 * @description
 * The UI class is a part of an HTML UI Library. It extends the Heeoolee class and provides functionalities 
 * for creating, managing, and interacting with HTML elements. It primarily deals with the overlay of HTML elements.
 * The class holds the elements by a unique name as keys in a private object called elements.
 *
 * @class UI
 * @extends Heeoolee
 *
 * @property {Object} elements - A private object that holds HTML elements with unique names as keys.
 *
 * @method constructor - Initializes the UI class by calling the constructor of the super class Heeoolee.
 * @method myHTMLElements - A getter method to access the private elements object.
 * @method deleteHtml(shaym: string) - Deletes the HTML element with the given unique name (shaym) from the DOM and the elements object. Returns true if successful, false otherwise.
 * @method getHtml(shaym: string) - Retrieves the HTML element with the given unique name (shaym) from the elements object. Returns the element if found, null otherwise.
 * @method html(original: Object) - Creates and returns a new HTML element based on the provided options (original). Calls setHtml internally to set properties and append children.
 * @method setHtml(el: HTMLElement, opts: Object) - Sets the properties, styles, children, and ready callback of the given HTMLElement (el) based on the provided options (opts). Returns the modified element.
 * @method htmlAction({ shaym, properties, methods }) - Performs actions on the HTML element with the given unique name (shaym). Sets properties, calls methods and returns an object containing the results.
 * 
 * @param {Object} original - Options for creating the HTML element. Includes tag, properties, children, and ready callback.
 * @param {Object} opts - Options for modifying the HTML element. Includes tag, style, shaym, ready callback, events (each key is callback name and value is function), and children.
 * @param {Object} properties - Properties to be set on the HTML element.
 * @param {Object} methods - Methods to be called on the HTML element. The format is { methodName: args }.
 *
 * @returns {HTMLElement} - The created or modified HTML element.
 * @returns {Object} - An object containing the unique name (shaym), the methods called, and the properties set.
 *
 * @example
 * const ui = new UI();
 * ui.html({ tag: 'div', shaym: 'myDiv', children: [{ tag: 'span', textContent: 'Hello World' }] });
 * ui.htmlAction({ shaym: 'myDiv', methods: { setAttribute: ['id', 'uniqueId'] } });
 */

import Utils from "../utils.js";
import { Heeoolee } from "./roochney.js";
/**
 * @private {Object} elements holds 
 * elements by unique name as key(s)
 * */
var elements = {};

export default class UI extends Heeoolee {
    get myHTMLElements() {
        return elements;
    }
    constructor() {
        super()
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

    getHtml(shaym) {
        return elements[shaym] || null;
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
    html(original={}) {
        
        if(
            !original || 
            typeof(original) != "object"
        )
            return null;
        
        var opts = Utils.copyObj(original);
        var tag = opts.tag || "div";
        var el = document.createElement(
            tag
        );

        return this.setHtml(el, opts);
    }

    /**
 * Method to set the HTML element properties, styles, children, and event listeners.
 * @param {HTMLElement} el - The HTML element to set properties on.
 * @param {Object} [opts={}] - Options object containing properties, styles, children, event listeners, etc.
 * @returns {HTMLElement} - The modified HTML element.
 */
setHtml(el, opts = {}) {
    // Properties that should not be directly set on the element
    const exclude = ["tag", "style", "shaym", "ready", "children", "events"];

    // Set properties on the element
    if (typeof opts === "object") {
        Object.keys(opts).forEach(prop => {
            if (!exclude.includes(prop)) {
                el[prop] = opts[prop];
            }
        });
    }

    // Set style on the element
    if (typeof opts.style === "string") {
        el.style.cssText = opts.style;
    } else if (typeof opts.style === "object") {
        Object.assign(el.style, opts.style);
    }

    // Store the element in the elements object if shaym is specified
    if (typeof opts.shaym === "string") {
        elements[opts.shaym] = el;
    }

    // Method to find other elements in the elements object
    const findOthersFunction = shaym => elements[shaym] || null;
    el.af = el.awtsmoosFind = findOthersFunction; // Alias for convenience
    el.getElements = () => elements; // Method to get all elements

    // Set children of the element
    let children = opts.children || opts.toldos;
    if (typeof children === "function") {
        children = children(findOthersFunction, this);
    }
    if (Array.isArray(children)) {
        // Remove existing children
        Array.from(el.children).forEach(child => {
            child.parentNode.removeChild(child);
        });
        // Append new children
        children.forEach(childOpts => {
            const child = this.html(childOpts);
            el.appendChild(child);
        });
    }

    // Invoke the ready callback if specified
    if (typeof opts.ready === "function") {
        opts.ready(el, findOthersFunction, this);
    }

    // Attach event listeners if the events property is specified
    if (typeof opts.events === "object") {
        Object.keys(opts.events).forEach(eventName => {
            const callback = opts.events[eventName];
            if (typeof callback === "function") {
                el.addEventListener(eventName, callback);
            }
        });
    }

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
    properties = {},
    methods = {}
}) {
    // If shaym is a string, get the corresponding HTML element,
    // if it's an HTMLElement, use it directly
    var html = typeof shaym === "string" ? this.getHtml(shaym) : shaym;
    if (!html) return null; // If the element is not found, return null

    // Initialize objects to store the properties set and methods called
    var propertiesSet = {};
    var methodsCalled = {};

    // Set properties on the HTML element
    if (typeof properties === "object") {
        this.setHtml(html, properties);
    }

    // Iterate over the methods object and call each method on the HTML element
    for (let method in methods) {
        // If the method exists and is a function on the element, call it with the provided arguments
        if (typeof html[method] === "function") {
            let args = Array.isArray(methods[method]) ? methods[method] : [methods[method]];
            methodsCalled[method] = html[method](...args);
        } else if (typeof html[method] === "object" && html[method] !== null) {
            // If the method is an object, iterate over its properties and call each as a sub-method
            for (let subMethod in methods[method]) {
                if (typeof html[method][subMethod] === "function") {
                    let args = Array.isArray(methods[method][subMethod]) ? methods[method][subMethod] : [methods[method][subMethod]];
                    methodsCalled[subMethod] = html[method][subMethod](...args);
                }
            }
        }
    }

    // Return an object containing the identifier, called methods, and set properties
    return {
        shaym,
        methodsCalled,
        propertiesSet
    }
}

}
