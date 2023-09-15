/**
 * B"H
 * @description HTML UI class
 * for overlay HTML elements.
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

    setHtml(el, opts={}) {
        var exclude = [
            "tag", 
            "style", 
            "shaym", 
            "ready",
            "children"
        ];

        if(typeof(opts) == "object") {
            Object.keys(opts).forEach(w => {
                if(!exclude.includes(w)) {
                    
                    el[w] = opts[w]
                }
            });
        }


        if(typeof(opts.style) == "string") {
            el.style.cssStyle = opts.style;
        } else if(typeof(opts.style) == "object") {
            Object.keys(opts.style)
            .forEach(w=> {
                el.style[w] = opts.style[w];
            });
        }

        if(typeof(opts.shaym) == "string") {
            elements[opts.shaym] = el;
        }

        var findOthersFunction = (shaym) => 
            elements[shaym] || null;

        
        el.awtsmoosFind = el.af = findOthersFunction;
        el.getElements = () => elements;
        var ch = opts.children ||
            opts.toldos;
        if(typeof(ch) == "function") {
            ch = ch(findOthersFunction, this);
        }

        if(
            ch && 
            typeof(ch) == "object" &&
            typeof(ch.forEach) == "function"
        ) {
            Array.from(el.children)
            .forEach(w => {
                w.parentNode.removeChild(w);
            });
            ch.forEach(q=> {
                var ch = this.html(q);
                el.appendChild(ch);
            });
        }

        if(typeof(opts.ready) == "function") {
            opts.ready(el, findOthersFunction, this);
        }

        return el;
    }


    htmlAction({
        shaym, 
        properties = {
        //properties to set
        }, 
        methods = {
        /**
         * format:
         * [methodName]: [args],
         * 
         * like
         * 
         * 
         * click: [] (or true)
         * 
         * setAttribute: ["hi", "there"]
         */
        }
    }) {
        
        var html = this.getHtml(shaym);
        if(!html) return null;

        
        var propertiesSet = {};
        var methodsCalled = {};

        
        if(typeof(
            properties
        ) == "object") {
            this.setHtml(html, properties);
        }

        

        
        
        // Call methods
        for (let method in methods) {
            if (typeof html[method] === "function") {
                let args = Array
                .isArray(methods[method]) ? methods[method] : [
                    methods[method]
                ];
                methodsCalled[method] = 
                html[method](...args);
            } else if (
                typeof html[method] === "object" 
                && html[method] !== null
            ) {
                for (let subMethod in methods[method]) {
                    if (typeof html[method][subMethod] === "function") {
                        let args = Array
                        .isArray(methods[method][subMethod]) 
                        ? methods[method][subMethod] : [
                            methods[method][subMethod]
                        ];
                        methodsCalled[subMethod] 
                        = html[method][subMethod](...args);
                    }
                }
            }
        }

        
        
        return {
            shaym, 
            methodsCalled,
            propertiesSet
        }
    }
}
