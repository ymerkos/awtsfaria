//B"H
// ==UserScript==
// @name         Awts
// @namespace    http://tampermonkey.net/
// @version      2023-12-19
// @description  try to take over the world!
// @author       You
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// ==/UserScript==
"B\"H";


if(!this.GM_addStyle) {
    window.GM_addStyle = function(str) {
        var sty = document.createElement("style")
        sty.innerText = str;
        document.head.appendChild(sty)
    }
}
//B"H
function setup(contentEditableElement, mode) {
    /**
     * make parent and sibling
     */

    var par = document.createElement("div");
    var curPar = contentEditableElement.parentNode;

    // Create a sibling div to be inserted
    var sib = document.createElement("div");
    sib.className = "colorCode";

    // Insert the new 'par' element at the position of the original contentEditableElement
    curPar.insertBefore(par, contentEditableElement);

    // Now, append the contentEditableElement and the sibling div to 'par'
    par.appendChild(sib);
    par.appendChild(contentEditableElement);

    par.className="editorParent"
    var style = document.createElement("style");

    style.textContent=/**css*/`
        .html-bracket {
                color: green;
        }
            .html-tag {
                color: blue;
        }
            .html-attribute {
                color: brown;
        }
            .html-attributeValue {
                color: red;
        }
            .comment {
                color: orange;
        }
            .css-selector {
                color: blue;
        }
            .css-delimiter {
                color: purple;
        }
            .css-property {
                color: brown;
        }
            .css-propertyValue {
                color: red;
        }
            .css-important {
                color: red;
                font-weight: bold;
        }
            .javascript {
                color: black;
        }
            .javascript-string {
                color: blue;
        }
            .javascript-keyword {
                color: green;
        }
            .javascript-number {
                color: red;
        }
            .javascript-property {
                color: purple;
        }
        .colorCode, .code {
            white-space: pre-wrap;
            font-family: monospace;
            font-size: 15px;
            caret-color:black;
            max-height: 500px;
            overflow: auto;
            border: 1px solid black;
            word-wrap: break-word;

            padding:8px;
        }
        .colorCode {
            user-select: none;
        }
    `;

    curPar.appendChild(style);
    contentEditableElement.className="code";


    //setup logistics
    /*
    in format:
     oninput="syntaxHighlight(this, 'html'); syncScroll(this, this.previousElementSibling);" onscroll="syncScroll(this, this.previousElementSibling)" contentEditable="plaintext-only" spellcheck="false"

     */
    contentEditableElement.addEventListener("input", e => {
        if(contentEditableElement.spellcheck)
            contentEditableElement.spellcheck=false;
        syntaxHighlight(contentEditableElement, mode)
        syncScroll(contentEditableElement, sib)
    });

    contentEditableElement.addEventListener("keydown", async function(e) {
        if (e.key === 'Tab') {
            e.preventDefault(); // Prevent the default tab behavior (focus change)
            insertTabAtCaret(contentEditableElement);
        } else if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default enter behavior
            insertNewLineWithTabs(contentEditableElement);
        } else if (e.key.toLowerCase() === 's' && e.ctrlKey) {
            e.preventDefault(); // Prevent the default Ctrl+S behavior
            customSaveFunction(); // Call your custom save function
        } else if(e.key.toLowerCase() == "r" && e.ctrlKey) {
            e.preventDefault();
            await customRunFunction();
        }
    });

    contentEditableElement.addEventListener("scroll", e => {
        syncScroll(contentEditableElement, sib)
    });

    contentEditableElement.contentEditable=true
    contentEditableElement.spellcheck=false;
    syntaxHighlight(contentEditableElement, mode)
}

function insertNewLineWithTabs(element) {
    var sel = window.getSelection();
    if (sel.rangeCount > 0) {
        var range = sel.getRangeAt(0);
        var startNode = range.startContainer;

        // Ensure we're working with a text node
        if (startNode.nodeType !== Node.TEXT_NODE) {
            if (startNode.childNodes.length > 0 && startNode.childNodes[0].nodeType === Node.TEXT_NODE) {
                startNode = startNode.childNodes[0];
            } else {
                // Create and insert a text node if necessary
                startNode = document.createTextNode('');
                range.insertNode(startNode);
                range.selectNode(startNode);
            }
        }

        var lineContent = startNode.textContent;
        var lineStart = range.startOffset;

        // Find the start of the current line
        while (lineStart > 0 && lineContent[lineStart - 1] !== '\n') {
            lineStart--;
        }

        // Count the tabs or spaces at the start of the line
        var indentation = '';
        while (lineContent[lineStart] === '\t' || lineContent[lineStart] === ' ') {
            indentation += lineContent[lineStart];
            lineStart++;
        }

        // Insert new line and indentation
        var newLineAndIndentation = document.createTextNode('\n' + indentation);
        range.insertNode(newLineAndIndentation);

        // Set the caret position to after the new line and indentation
        range.setStartAfter(newLineAndIndentation);
        range.setEndAfter(newLineAndIndentation);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    // Call syntaxHighlight function if it's defined
    if (typeof syntaxHighlight === 'function') {
        syntaxHighlight(element, "javascript");
    }
}




function insertTabAtCaret(element) {
    // First, we need to focus on the element to ensure that we can get the correct selection
    element.focus();

    // Get the current selection
    var sel = window.getSelection();
    if (sel.rangeCount > 0) {
        // Get the first range of the selection
        var range = sel.getRangeAt(0);

        // Create a new text node containing a tab character
        var tabNode = document.createTextNode('\t');

        // Delete the contents of the range (if there is a selection)
        range.deleteContents();

        // Insert the tab character at the caret position
        range.insertNode(tabNode);

        // Move the caret after the newly inserted tab character
        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode);

        // Update the selection with the new range
        sel.removeAllRanges();
        sel.addRange(range);
    }


    syntaxHighlight(element, "javascript")
}



function syntaxHighlight(contentEditableElement, mode) {




	contentEditableElement.style.left = contentEditableElement.previousElementSibling.style.left = 0;
	contentEditableElement.style.top = contentEditableElement.previousElementSibling.style.top = 0;
	contentEditableElement.style.right = contentEditableElement.previousElementSibling.style.right = 0;
	contentEditableElement.style.bottom = contentEditableElement.previousElementSibling.style.bottom = 0;
	contentEditableElement.style.position = "relative";
	contentEditableElement.previousElementSibling.style.position = "absolute";
	contentEditableElement.style.webkitTextFillColor = "transparent";
	contentEditableElement.parentElement.style.position = "relative";

	if (mode == "html") {
		contentEditableElement.previousElementSibling.innerHTML = htmlMode(contentEditableElement.innerHTML);
	}
	if (mode == "css") {
		contentEditableElement.previousElementSibling.innerHTML = cssMode(contentEditableElement.innerHTML);
	}
	if (mode == "javascript") {
		contentEditableElement.previousElementSibling.innerHTML = jsMode(contentEditableElement.innerHTML.split("<br>").join("\n"));
	}

	function extract(str, start, end, func, repl) {
		var s, e, d = "",
			a = [];
		while (str.search(start) > -1) {
			s = str.search(start);
			e = str.indexOf(end, s);
			if (e == -1) {
				e = str.length;
			}
			if (repl) {
				a.push(func(str.substring(s, e + (end.length))));
				str = str.substring(0, s) + repl + str.substr(e + (end.length));
			} else {
				d += str.substring(0, s);
				d += func(str.substring(s, e + (end.length)));
				str = str.substr(e + (end.length));
			}
		}
		this.rest = d + str;
		this.arr = a;
	}

	function htmlMode(txt) {
		var rest = txt,
			done = "",
			php, comment, angular, startpos, endpos, note, i;
		comment = new extract(rest, "&lt;!--", "--&gt;", commentMode, "W3HTMLCOMMENTPOS");
		rest = comment.rest;
		while (rest.indexOf("&lt;") > -1) {
			note = "";
			startpos = rest.indexOf("&lt;");
			if (rest.substr(startpos, 9).toUpperCase() == "&LT;STYLE") {
				note = "css";
			}
			if (rest.substr(startpos, 10).toUpperCase() == "&LT;SCRIPT") {
				note = "javascript";
			}
			endpos = rest.indexOf("&gt;", startpos);
			if (endpos == -1) {
				endpos = rest.length;
			}
			done += rest.substring(0, startpos);
			done += tagMode(rest.substring(startpos, endpos + 4));
			rest = rest.substr(endpos + 4);
			if (note == "css") {
				endpos = rest.indexOf("&lt;/style&gt;");
				if (endpos > -1) {
					done += cssMode(rest.substring(0, endpos));
					rest = rest.substr(endpos);
				}
			}
			if (note == "javascript") {
				endpos = rest.indexOf("&lt;/script&gt;");
				if (endpos > -1) {
					done += jsMode(rest.substring(0, endpos));
					rest = rest.substr(endpos);
				}
			}
		}
		rest = done + rest;
		for (i = 0; i < comment.arr.length; i++) {
			rest = rest.replace("W3HTMLCOMMENTPOS", comment.arr[i]);
		}
		return rest;
	}

	function tagMode(txt) {
		var rest = txt,
			done = "",
			startpos, endpos, result;
		while (rest.search(/(\s|\n)/) > -1) {
			startpos = rest.search(/(\s|\n)/);
			endpos = rest.indexOf("&gt;");
			if (endpos == -1) {
				endpos = rest.length;
			}
			done += rest.substring(0, startpos);
			done += attributeMode(rest.substring(startpos, endpos));
			rest = rest.substr(endpos);
		}
		result = done + rest;
		result = "<span class='html-bracket'>&lt;</span>" + result.substring(4);
		if (result.substr(result.length - 4, 4) == "&gt;") {
			result = result.substring(0, result.length - 4) + "<span class='html-bracket'>&gt;</span>";
		}
		return "<span class='html-tag'>" + result + "</span>";
	}

	function attributeMode(txt) {
		var rest = txt,
			done = "",
			startpos, endpos, singlefnuttpos, doublefnuttpos, spacepos;
		while (rest.indexOf("=") > -1) {
			endpos = -1;
			startpos = rest.indexOf("=");
			singlefnuttpos = rest.indexOf("'", startpos);
			doublefnuttpos = rest.indexOf('"', startpos);
			spacepos = rest.indexOf(" ", startpos + 2);
			if (spacepos > -1 && (spacepos < singlefnuttpos || singlefnuttpos == -1) && (spacepos < doublefnuttpos || doublefnuttpos == -1)) {
				endpos = rest.indexOf(" ", startpos);
			} else if (doublefnuttpos > -1 && (doublefnuttpos < singlefnuttpos || singlefnuttpos == -1) && (doublefnuttpos < spacepos || spacepos == -1)) {
				endpos = rest.indexOf('"', rest.indexOf('"', startpos) + 1);
			} else if (singlefnuttpos > -1 && (singlefnuttpos < doublefnuttpos || doublefnuttpos == -1) && (singlefnuttpos < spacepos || spacepos == -1)) {
				endpos = rest.indexOf("'", rest.indexOf("'", startpos) + 1);
			}
			if (!endpos || endpos == -1 || endpos < startpos) {
				endpos = rest.length;
			}
			done += rest.substring(0, startpos);
			done += attributeValueMode(rest.substring(startpos, endpos + 1));
			rest = rest.substr(endpos + 1);
		}
		return "<span class='html-attribute'>" + done + rest + "</span>";
	}

	function attributeValueMode(txt) {
		return "<span class='html-attributeValue'>" + txt + "</span>";
	}

	function commentMode(txt) {
		return "<span class='comment'>" + txt + "</span>";
	}

	function cssMode(txt) {
		var rest = txt,
			done = "",
			s, e, comment, i, midz, c, cc;
		comment = new extract(rest, /\/\*/, "*/", commentMode, "W3CSSCOMMENTPOS");
		rest = comment.rest;
		while (rest.search("{") > -1) {
			s = rest.search("{");
			midz = rest.substr(s + 1);
			cc = 1;
			c = 0;
			for (i = 0; i < midz.length; i++) {
				if (midz.substr(i, 1) == "{") {
					cc++;
					c++
				}
				if (midz.substr(i, 1) == "}") {
					cc--;
				}
				if (cc == 0) {
					break;
				}
			}
			if (cc != 0) {
				c = 0;
			}
			e = s;
			for (i = 0; i <= c; i++) {
				e = rest.indexOf("}", e + 1);
			}
			if (e == -1) {
				e = rest.length;
			}
			done += rest.substring(0, s + 1);
			done += cssPropertyMode(rest.substring(s + 1, e));
			rest = rest.substr(e);
		}
		rest = done + rest;
		rest = rest.replace(/{/g, "<span class='css-delimiter'>{</span>");
		rest = rest.replace(/}/g, "<span class='css-delimiter'>}</span>");
		for (i = 0; i < comment.arr.length; i++) {
			rest = rest.replace("W3CSSCOMMENTPOS", comment.arr[i]);
		}
		return "<span class='css-selector'>" + rest + "</span>";
	}

	function cssPropertyMode(txt) {
		var rest = txt,
			done = "",
			s, e, n, loop;
		if (rest.indexOf("{") > -1) {
			return cssMode(rest);
		}
		while (rest.search(":") > -1) {
			s = rest.search(":");
			loop = true;
			n = s;
			while (loop == true) {
				loop = false;
				e = rest.indexOf(";", n);
				if (rest.substring(e - 5, e + 1) == "&nbsp;") {
					loop = true;
					n = e + 1;
				}
			}
			if (e == -1) {
				e = rest.length;
			}
			done += rest.substring(0, s);
			done += cssPropertyValueMode(rest.substring(s, e + 1));
			rest = rest.substr(e + 1);
		}
		return "<span class='css-property'>" + done + rest + "</span>";
	}

	function cssPropertyValueMode(txt) {
		var rest = txt,
			done = "",
			s;
		rest = "<span class='css-delimeter'>:</span>" + rest.substring(1);
		while (rest.search(/!important/i) > -1) {
			s = rest.search(/!important/i);
			done += rest.substring(0, s);
			done += cssImportantMode(rest.substring(s, s + 10));
			rest = rest.substr(s + 10);
		}
		result = done + rest;
		if (result.substr(result.length - 1, 1) == ";" && result.substr(result.length - 6, 6) != "&nbsp;" && result.substr(result.length - 4, 4) != "&lt;" && result.substr(result.length - 4, 4) != "&gt;" && result.substr(result.length - 5, 5) != "&amp;") {
			result = result.substring(0, result.length - 1) + "<span class='css-delimiter'>;</span>";
		}
		return "<span class='css-propertyValue'>" + result + "</span>";
	}

	function cssImportantMode(txt) {
		return "<span class='css-important'>" + txt + "</span>";
	}
    function jsMode(txt) {
        var rest = txt,
            done = "",
            esc = [],
            i, cc, tt = "",
            sfnuttpos, dfnuttpos, backtickpos,
            compos, comlinepos, keywordpos, numpos, mypos, dotpos, y;

        for (i = 0; i < rest.length; i++) {
            cc = rest.substr(i, 1);
            if (cc == "\\") {
                esc.push(rest.substr(i, 2));
                cc = "W3JSESCAPE";
                i++;
            }
            tt += cc;
        }
        rest = tt;
        y = 1;

        while (y == 1) {
            sfnuttpos = getPos(rest, "'", "'", jsStringMode);
            dfnuttpos = getPos(rest, '"', '"', jsStringMode);
            backtickpos = getBacktickPos(rest, jsTemplateLiteralMode); // Get the position of template literals
            compos = getPos(rest, /\/\*/, "*/", commentMode);
            comlinepos = getPos(rest, /\/\//, "\n", commentMode);

            numpos = getNumPos(rest, jsNumberMode);
            keywordpos = getKeywordPos("js", rest, jsKeywordMode);
            dotpos = getDotPos(rest, jsPropertyMode);

            mypos = getMinPos(numpos, sfnuttpos, dfnuttpos, backtickpos, compos, comlinepos, keywordpos, dotpos);
            if (mypos[0] == -1) {
                y = 0; // Exit the loop if no more syntax elements are found
            } else {
                done += rest.substring(0, mypos[0]);
                done += mypos[2](rest.substring(mypos[0], mypos[1]));
                rest = rest.substr(mypos[1]);
            }
        }

        rest = done + rest;
        for (i = 0; i < esc.length; i++) {
            rest = rest.replace("W3JSESCAPE", esc[i]);
        }
        return "<span class='javascript'>" + rest + "</span>";
    }

    function getBacktickPos(txt, func) {
        var start = txt.indexOf('`');
        if (start === -1) return [-1, -1, null]; // No opening backtick found

        var end = start + 1;
        while (end < txt.length) {
            if (txt[end] === '`' && txt[end - 1] !== '\\') {
                // Found closing backtick not preceded by an escape character
                return [start, end + 1, func]; // Include the closing backtick and the formatting function
            }
            end++;
        }
        // No closing backtick found
        return [start, txt.length, func]; // Return up to the end of the string with the formatting function
    }

    function jsTemplateLiteralMode(txt, precedingText) {
        // Return text as a string, considering it as a template literal
        return "<span class='javascript-string'>" + txt + "</span>";
    }

	function jsStringMode(txt) {
		return "<span class='javascript-string'>" + txt + "</span>";
	}

	function jsKeywordMode(txt) {
		return "<span class='javascript-keyword'>" + txt + "</span>";
	}

	function jsNumberMode(txt) {
		return "<span class='javascript-number'>" + txt + "</span>";
	}

	function jsPropertyMode(txt) {
		return "<span class='javascript-property'>" + txt + "</span>";
	}

	function getDotPos(txt, func) {
		var x, i, j, s, e, arr = [".", "<", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "/", "-", "*", "|", "%"];
		s = txt.indexOf(".");
		if (s > -1) {
			x = txt.substr(s + 1);
			for (j = 0; j < x.length; j++) {
				cc = x[j];
				for (i = 0; i < arr.length; i++) {
					if (cc.indexOf(arr[i]) > -1) {
						e = j;
						return [s + 1, e + s + 1, func];
					}
				}
			}
		}
		return [-1, -1, func];
	}

	function getMinPos() {
        var i, arr = [];
        for (i = 0; i < arguments.length; i++) {
            if (arguments[i][0] > -1) {
                if (arr.length == 0 || arguments[i][0] < arr[0]) {
                    arr = arguments[i];
                }
            }
        }
        if (arr.length == 0) {
            return [-1, -1, null]; // Return a default value if no elements are found
        }
        return arr;
    }

	function getKeywordPos(typ, txt, func) {
		var words, i, pos, rpos = -1,
			rpos2 = -1,
			patt;
		if (typ == "js") {
			words = ["abstract", "arguments", "boolean", "break", "byte", "case", "catch", "char", "class", "var", "continue", "debugger", "default", "delete",
				"do", "double", "else", "enum", "eval", "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import",
				"in", "instanceof", "int", "interface", "let", "long", "NaN", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static",
				"super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield", "async", "await"
			];
		}
		for (i = 0; i < words.length; i++) {
			pos = txt.indexOf(words[i]);
			if (pos > -1) {
				patt = /\W/g;
				if (txt.substr(pos + words[i].length, 1).match(patt) && txt.substr(pos - 1, 1).match(patt)) {
					if (pos > -1 && (rpos == -1 || pos < rpos)) {
						rpos = pos;
						rpos2 = rpos + words[i].length;
					}
				}
			}
		}
		return [rpos, rpos2, func];
	}

	function getPos(txt, start, end, func) {
		var s, e;
		s = txt.search(start);
		e = txt.indexOf(end, s + (end.length));
		if (e == -1) {
			e = txt.length;
		}
		return [s, e + (end.length), func];
	}

	function getNumPos(txt, func) {
		var arr = ["\n", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "/", "-", "*", "|", "%", "="],
			i, j, c, startpos = 0,
			endpos, word;
		for (i = 0; i < txt.length; i++) {
			for (j = 0; j < arr.length; j++) {
				c = txt.substr(i, arr[j].length);
				if (c == arr[j]) {
					if (c == "-" && (txt.substr(i - 1, 1) == "e" || txt.substr(i - 1, 1) == "E")) {
						continue;
					}
					endpos = i;
					if (startpos < endpos) {
						word = txt.substring(startpos, endpos);
						if (!isNaN(word)) {
							return [startpos, endpos, func];
						}
					}
					i += arr[j].length;
					startpos = i;
					i -= 1;
					break;
				}
			}
		}
		return [-1, -1, func];
	}
}

function syncScroll(element1, element2) {
	element2.scrollLeft = element1.scrollLeft;
	element2.scrollTop = element1.scrollTop;
}


/**
 * useage:

window.onload = function() {
	var code = document.getElementById("code");
	setup(code, "html");
}
 */







function defineIt() {
    "B\"H";

//B"H
/**
 * @fileOverview A Kabbalistically inspired wrapper for GPTify
 *
 * @name awtsmoos-gptify.js
 * @copyright OpenAI (2023)
 * @license MIT
 *
 * @param {Object} config - The configuration object
 * @param {string} config.prompt - The initial prompt to feed the GPT model
 * @param {Function} config.onstream - Callback function executed every time a message comes from the server
 * @param {Function} config.ondone - Callback function executed when the server sends done message
 * @param {string} [config.action="next"] - The action to be taken, defaults to 'next'
 * @param {string} [config.messageContent=""] - The content of the message, defaults to empty string
 * @param {string} [config.conversationId=Math.random().toString(36).substring(2)] - The ID of the conversation, defaults to random string
 * @param {string} [config.parentMessageId=Math.random().toString(36).substring(2)] - The ID of the parent message, defaults to random string
 * @param {string} [config.model="gpt-4"] - The model to be used, defaults to 'gpt-4'
 * @param {number} [config.timezoneOffsetMin=240] - Timezone offset in minutes, defaults to 240
 * @param {boolean} [config.historyAndTrainingDisabled=false] - Whether to disable history and training, defaults to false
 * @param {string} [config.arkoseToken=""] - Arkose token, defaults to empty string
 * @param {string} [config.authorizationToken=""] - Authorization token, defaults to empty string
 * @returns {void}
 *
 * @example
 * var a = new AwtsmoosGPTify();
 * await a.go({
    prompt:"B\"H\ntell me about the essence of reality from the perspective of the Atzmus in every thing, rhyming ntensely thorugh a metaphorical series of events time 5",

    onstream(a){
        console.log(a.message.content.parts[0])
    },ondone(s){
        console.log(s.message.content.parts[0])
    }
})
 */

/**
 * TODO implement something for max hour when status code is 429
 */


	//B"H
class AwtsmoosGPTify {
    _lastMessageId = null;
    _conversationId = null;
    sessionName = null;
    constructor() {

    }
    async go({
        prompt,
        onstream,
        ondone,
        action = "next",
        parentMessageId = this._lastMessageId,
        model ="auto",
        conversationId = this._conversationId,
        timezoneOffsetMin = 240,
        historyAndTrainingDisabled = false,
        arkoseToken = "",
        authorizationToken = "",
        more = {},
        print=true,
        customFetch=fetch,
        customTextEncoder=TextDecoder,
        customHeaders = {},
        }) {
        var self = this;
        var headers = null;

        if(!authorizationToken) {
                var token = await getAuthToken();
                if(token) {
                    authorizationToken = token
                } else {
                    console.log("problem getting token")
                }
        }
        var awtsmoosToikens = await awtsmoosifyTokens();
        var nameURL = convoId =>
        `https://chatgpt.com/backend-api/conversation/gen_title/${convoId}`
	if(!parentMessageId) {
		var co=await getConversation(
			conversationId,
			authorizationToken

		)
		parentMessageId=co?.currentNode;

	}
        if(!parentMessageId && !conversationId) {
            parentMessageId = generateUUID();
        }

        



        if(print)
            console.log("par",parentMessageId)
        /**
         * @function generateMessageJson
         * @description - Generates the JSON structure to be sent to the server
         * @returns {Object} - The request options object
         */
        async function generateMessageJson() {

            var messageJson = {
                action: action,
                messages: [
                    {
                        id: generateUUID(),
                        author: {
                            role: "user"
                        },
                        content: {
                            content_type: "text",
                            parts: [prompt]
                        },
                        metadata: {}
                    }
                ],
                parent_message_id: parentMessageId,
                model: model || 'text-davinci-002-render',
                conversation_id: conversationId??undefined
                ,
                ...more
            };

            

            headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authorizationToken,
                ...customHeaders,
		        ...(awtsmoosToikens)
            }

            var requestOptions = {
                method: 'POST',
                headers,
                body: JSON.stringify(messageJson)
            };

            return requestOptions;
        }

        // This is the URL to which we send our JSON data.
        // Like the tree of life in Kabbalah, it's the central point from which all creation flows.
        var URL = "https://chatgpt.com/backend-api/conversation";

        var json = await generateMessageJson()
        console.log("Sending: ",json)
        // Fetch API sends the request to the URL with our generated JSON data.
        // Like casting a spell in Kabbalah, we're asking the universe (or at least the server) to do something.
        var response = await customFetch(URL, json);
        // We're creating a reader and a decoder to read and decode the incoming stream of data.
       var res =  await logStream(response, async (c)=>{
		console.log(c)

	});

	if(typeof(ondone) == "function") {
                            ondone(res);
                            
	}
	return res;

    /*
        if(!self.sessionName) {
            var newTitleFetch = await customFetch(nameURL(convo), {
                headers,
                body: JSON.stringify({
                    message_id: messageID
                }),
                method: "POST"
            });
            var newTitle = await newTitleFetch.text();
            self.sessionName = newTitle;
            console.log("New name!",self.sessionName);
        }

        var messageID = jsonData.message.id
        self._lastMessageId = messageID;
        var convo = jsonData.conversation_id;
        self._conversationId = convo;
    */
	



    }
}

async function logStream(response, callback) {
   var hasCallback = typeof(callback) == "function";
   var myCallback =  hasCallback ? callback : () => {};
    var result = []
    // Check if the response is okay
    if (!response.ok) {
        console.error('Network response was not ok:', response.statusText);
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = '';
    var curEvent = null;
    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            console.log('Stream finished');
            break;
        }

        // Decode the current chunk and add to the buffer
        buffer += decoder.decode(value, { stream: true });

        // Split buffer into lines
        const lines = buffer.split('\n');

        // Process each line
        for (let line of lines) {
            line = line.trim(); // Remove whitespace

            // Check if the line starts with "event:" or "data:"
            if (line.startsWith('event:')) {
                const event = line.substring(6).trim(); // Extract event type
                curEvent = event;

            } else if (line.startsWith('data:')) {
                const data = line.substring(5).trim(); // Extract data


                // Attempt to parse the data as JSON
                try {
                    const jsonData = JSON.parse(data);
                    if(!hasCallback)
                        console.log('Parsed JSON Data:', jsonData);
        var k={data:jsonData, event: curEvent}
        result. push(k)
                    myCallback?.(k)
                } catch (e) {
                    if(!hasCallback)
                        console.warn('Data is not valid JSON:', data);
        var k=({dataNoJSON: data,  event: curEvent, error:e})
        result.push(k);
                    myCallback?.(k)
                }
            }
        }

        // Clear the buffer if the last line was complete
        if (lines[lines.length - 1].trim() === '') {
            buffer = '';
        } else {
            // Retain incomplete line for next iteration
            buffer = lines[lines.length - 1];
        }
    }
}



async function getAwtsmoosAudio({
    message_id, 
    conversation_id,
    voice = "orbit",
    format = "aac"
}) {
    var session = (await (await fetch("https://chatgpt.com/api/auth/session")).json())
    var token = session.accessToken;
    var convo = await getConversation(conversation_id, token)
    if(!message_id) message_id = convo?.current_node;
    var blob = await (
        await fetch("https://chatgpt.com/backend-api/synthesize?message_id="
            + message_id  
            + "&conversation_id=" + 
              conversation_id
            + "&voice=" + voice
            + "&format=" + format, {
            headers: {
                authorization: "Bearer " + token
            }
        })
    ).blob()
    var a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "BH_awtsmoosAudio_" + Date.now() + "." + format;
    a.click()
}
	
async function getConversation(conversation_id, token) {
    return (await (await fetch("https://chatgpt.com/backend-api/conversation/" + conversation_id, {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "authorization": "Bearer "+token,

      },
      "method": "GET"
    })).json())
}
async function awtsmoosifyTokens() {
        g=await import("https://cdn.oaistatic.com/assets/i5bamk05qmvsi6c3.js")
        z = await g.bk() //chat requirements

        r =  await g.bi(z.turnstile.bx) //turnstyle token
        arkose = await g.bl.getEnforcementToken(z)
        p = await g.bm.getEnforcementToken(z) //p token

        //A = fo(e.chatReq, l ?? e.arkoseToken, e.turnstileToken, e.proofToken, null)

        return g.fX(z,arkose, r, p, null)
}

async function getAuthToken() {
    var sesh = await fetch(
        "https://chatgpt.com/api/auth/session"
    );
    var j = await sesh.json();
    var token = j.accessToken;
    if(token) {
        return token;
    } else return null;//console.log("problem getting token")
}


function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
}

try {
    defineIt()
} catch(e) {

}


//B"H
console.log("B\"H");

/**
 * Awtsmoos - A wrapper class for IndexedDB operations
 * and more
 *
 * @example
 * // To write data
 * Awtsmoos.write('testStore', 'testKey', 'testValue')
 *   .then(() => console.log('Data written successfully'))
 *   .catch((error) => console.error('Error writing data: ', error));
 *
 * // To read data
 * Awtsmoos.read('testStore', 'testKey')
 *   .then((value) => console.log('Read value: ', value))
 *   .catch((error) => console.error('Error reading data: ', error));
 *
 * // Hebrew counterparts for write and read
 * Awtsmoos.Koysayv('testStore', 'testKey', 'testValue')
 *   .then(() => console.log('Data written successfully'))
 *   .catch((error) => console.error('Error writing data: ', error));
 *
 * Awtsmoos.Laynin('testStore', 'testKey')
 *   .then((value) => console.log('Read value: ', value))
 *   .catch((error) => console.error('Error reading data: ', error));
 */

class Awtsmoos {
    /**
     * Opens the IndexedDB and gets the object store
     *
     * @param {string} storeName - The name of the object store
     * @returns {Promise} - A promise that resolves with the object store
     */
    static getObjectStore(storeName) {
      return new Promise((resolve, reject) => {
        // Open (or create) the database
        let openRequest = indexedDB.open('myDatabase', 1);

        openRequest.onupgradeneeded = function(event) {
          // The database did not previously exist, so create object stores and indexes
          let db = event.target.result;
          db.createObjectStore(storeName);
        };

        openRequest.onsuccess = function(event) {
          // The database was successfully opened (or created)
          let db = event.target.result;

          // Start a new transaction with the object store
          let transaction = db.transaction([storeName], 'readwrite');

          // Get the object store
          let objectStore = transaction.objectStore(storeName);

          resolve(objectStore);
        };

        openRequest.onerror = function(event) {
          // There was an error opening (or creating) the database
          reject(event.target.error);
        };
      });
    }

    /**
     * Writes data to the IndexedDB
     *
     * @param {string} storeName - The name of the object store
     * @param {string} key - The key for the data
     * @param {any} value - The data to write
     * @returns {Promise} - A promise that resolves when the data is written
     */
    static write(storeName, key, value) {
      return this.getObjectStore(storeName).then((objectStore) => {
        // Write the data to the object store
        let request = objectStore.put(value, key);

        return new Promise((resolve, reject) => {
          request.onsuccess = resolve;
          request.onerror = () => reject(request.error);
        });
      });
    }

    /**
     * Deletes data from the IndexedDB
     *
     * @param {string} storeName - The name of the object store
     * @param {string} key - The key for the data to delete
     * @returns {Promise} - A promise that resolves when the data is deleted
     */
    static delete(storeName, key) {
      return new Promise((resolve, reject) => {
          this.getObjectStore(storeName).then((objectStore) => {
              // Delete the data from the object store
              let request = objectStore.delete(key);

              request.onsuccess = () => {
                  resolve();
              };

              request.onerror = () => {
                  reject(request.error);
              };
          }).catch(reject);
      });
  }

    /**
     * Reads data from the IndexedDB
     *
     *```javascript
    * @param {string} storeName - The name of the object store
     * @param {string} key - The key for the data to read
     * @returns {Promise} - A promise that resolves with the read data
     */
    static read(storeName, key) {
      return this.getObjectStore(storeName).then((objectStore) => {
        // Read the data from the object store
        let request = objectStore.get(key);

        return new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      });
    }


    /**
     * Retrieves all keys from the specified object store in IndexedDB.
     *
     * @param {string} storeName - The name of the object store
     * @returns {Promise<string[]>} - A promise that resolves with an array of keys
     */
    static getAllKeys(storeName) {
      return new Promise((resolve, reject) => {
          this.getObjectStore(storeName).then(objectStore => {
              let request = objectStore.getAllKeys();

              request.onsuccess = () => {
                  resolve(request.result);
              };

              request.onerror = () => {
                  reject(request.error);
              };
          }).catch(reject);
      });
  }


    /**
     * Writes data to the IndexedDB (Hebrew counterpart of write)
     *
     * @param {string} storeName - The name of the object store
     * @param {string} key - The key for the data
     * @param {any} value - The data to write
     * @returns {Promise} - A promise that resolves when the data is written
     */
    static Koysayv(storeName, key, value) {
      return this.write(storeName, key, value);
    }

    /**
     * Reads data from the IndexedDB (Hebrew counterpart of read)
     *
     * @param {string} storeName - The name of the object store
     * @param {string} key - The key for the data to read
     * @returns {Promise} - A promise that resolves with the read data
     */
    static Laynin(storeName, key) {
      return this.read(storeName, key);
    }
  }


  /**
   * Awmayn.
   * Some more logic to setup page.
   */




window.AwtsmoosGPTify = AwtsmoosGPTify;
// Inject CSS
GM_addStyle(`
    .minMaxButton {
        display: block;
        margin-left: 5px;
        padding: 5px 10px;
        background-color: #28a745;
        color: white;
        border: none;
        float:right;
        border-radius: 3px;
        cursor: pointer;
    }
    .minMaxButton:hover {
        background-color: #218838;
    }
    #customContainer {
        position: fixed;
        top:50px;
        right: 10px;
        background-color: #f9f9f9;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        padding: 10px;
        z-index: 10000;
        overflow: hidden;
    }
    /*
    #customEditor {
        height: 200px;
        background-color: #fdfdfd;
        border: 1px solid #ccc;
        overflow: auto;
        margin-bottom: 10px;
        caret-color: black;
        color:black;
        font-family: 'Fira Code', monospace;
        padding: 5px;
    }*/
    .customButton {
        display: inline-block;
        margin-right: 5px;
        padding: 5px 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }
    .customButton:hover {
        background-color: #0056b3;
    }
    #scriptList {
        list-style: none;
        padding: 0;
        margin-bottom: 10px;
        max-height: 100px;
        overflow: auto;
    }
    #scriptList li {
        cursor: pointer;
        color:black;
        padding: 3px;
        border-bottom: 1px solid #eee;
    }
    #scriptList li:hover {
        background-color: #efefef;
    }

    #scriptList li.selected {
        background-color: #efefef;
    }



    .custom-alert-box {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        border: 2px solid black;
        background-color: white;
	color: black !important;
        z-index: 100000;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    }

    .alert-header {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 15px;
	color: black;
    }

    .alert-content {
        margin-bottom: 15px;
        white-space:pre-wrap;
        max-height:500px;
        overflow-y:scroll
    }

    .alert-close, .alert-ok {
        cursor: pointer;
        padding: 5px 10px;
        margin: 5px;
        border: none;
        border-radius: 5px;
        background-color: #f44336;
        color: white;
        font-weight: bold;
    }

    .alert-close {
        float: right;
    }

    .alert-ok {
        background-color: #4CAF50;
    }

`);

class AlertBox {
    constructor(title = "Alert") {
        this.alertBox = document.createElement("div");
        this.alertBox.className = "custom-alert-box";

        var header = document.createElement("div");
        header.className = "alert-header";
        header.textContent = title;

        var closeButton = document.createElement("button");
        closeButton.className = "alert-close";
        closeButton.textContent = "X";
        closeButton.onclick = () => this.close();

        var content = document.createElement("div");
        content.className = "alert-content";
        this.content = content; // Reference for updating text

        var okButton = document.createElement("button");
        okButton.className = "alert-ok";
        okButton.textContent = "OK";
        okButton.onclick = () => this.close();

        header.appendChild(closeButton);
        this.alertBox.appendChild(header);
        this.alertBox.appendChild(content);
        this.alertBox.appendChild(okButton);

        document.body.appendChild(this.alertBox);
    }

    update(text) {
        this.content.textContent = text;
    }

    close() {
        this.alertBox.remove();
    }
}
window.AlertBox = AlertBox;


// Your existing script logic to create and append elements...



 // Create GUI elements
    var container = document.createElement('div');
    var minimizable = document.createElement('div')
    var scriptList = document.createElement('ul');
    var editor = document.createElement('div');


    var saveButton = document.createElement('button');
    var exportBtn = document.createElement('button');
    var loadButton = document.createElement('button');
    var runButton = document.createElement('button');
    var deleteButton = document.createElement('button');


    var tabButton = document.createElement('button');
    tabButton.textContent="Tab"
var createButton = document.createElement('button');
createButton.textContent = 'Create New Script';
createButton.className = 'customButton';
exportBtn.className = 'customButton';
exportBtn.style.backgroundColor = "green"
exportBtn.textContent = "Export"


// Create Minimize and Maximize buttons
var minimizeButton = document.createElement('button');
var maximizeButton = document.createElement('button');
minimizeButton.className = 'minMaxButton';
maximizeButton.className = 'minMaxButton';
minimizeButton.textContent = '-';
maximizeButton.textContent = '+';
maximizeButton.style.display = 'none'; // Hide maximize button initially



// Append minimize and maximize buttons
container.appendChild(minimizeButton);
container.appendChild(maximizeButton);

// Add functionality to Minimize button
minimizeButton.addEventListener('click', function() {

    minimizeButton.style.display = 'none';
    maximizeButton.style.display = 'block';
    minimizable.style.display="none";
});

// Add functionality to Maximize button
maximizeButton.addEventListener('click', function() {
    minimizable.style.display="block";
    minimizeButton.style.display = 'block';
    maximizeButton.style.display = 'none';
});

scriptList.id="scriptList"
container.id="customContainer"
editor.id="customEditor"
saveButton.className="customButton"
loadButton.className="customButton"
runButton.className="customButton"
deleteButton.className="customButton"
tabButton.className="customButton"
tabButton.style.backgroundColor="red";


tabButton.onclick = () => {

    var editor=document.getElementById("customEditor")
    insertTabAtCaret(editor)
}
    // Configure editor for syntax highlighting
    editor.contentEditable = true;
    editor.classList.add('language-javascript');

    // Configure buttons
    saveButton.textContent = 'Save';
    loadButton.textContent = 'Load Exported';
    runButton.textContent = 'Run';
    deleteButton.textContent = 'Delete';


    loadButton.style.color="black"
    loadButton.style.backgroundColor="#fff800"
    // Append elements
    minimizable.appendChild(scriptList);
    minimizable.appendChild(tabButton)
    minimizable.appendChild(editor);
    minimizable.appendChild(saveButton);
    minimizable.appendChild(runButton);
    minimizable.appendChild(deleteButton);

    minimizable.appendChild(loadButton);

    minimizable.appendChild(exportBtn);

    container.appendChild(minimizable);

    document.body.appendChild(container);



    exportBtn.addEventListener("click", async e => {
        var allEntries = {};
        var allKeys = await Awtsmoos.getAllKeys('scripts')
        for(var key of allKeys) {
            var val = await Awtsmoos.read('scripts', key);
            allEntries[key] = val;
        }
        downloadFile("BH_Scripts_Of_Awtsmoos_"+Date.now(), allEntries)
    });

    function downloadFile(nm, json) {
        var b = new Blob([`//B"H
export default ${JSON.stringify(json,null,"\t")}

/*
the Awtsmoos permeates every fiber of reality and beyond.
awtsmoos.com
*/`], {
            type: "application/javascript"
        });
        var u = URL.createObjectURL(b);
        var a = document.createElement("a")
        a.href=u;
        a.download=(nm || "BH_"+Date.now()) + ".js";
        a.click();
    }

    function loadScripts() {
        var inp  = document.createElement("input")
        inp.type="file"
        inp.onchange = async () =>{
            var file = inp.files[0];
            if (!file) return alert("No file selected");

            var reader = new FileReader();
            reader.onload = async (e) => {
                console.log("Hi!",e)
                var txt = e.target.result;
                try {
                    var md = replaceExportDefault(txt);
                    var code = `(${md})`
                    console.log(window.cc=md,code )
                    var json = eval(code);
                    var def = json
                    if(!def) return alert("No default export");
                    console.log("got def",def);
                    var k = Object.keys(def);
                    for(var key of k) {
                        await Awtsmoos.write(
                            'scripts',
                            key,
                            def[key]
                        )
                    }
                    loadScriptList();
                    alert("Loaded them all")
                } catch(e) {
                    alert("Issue: "+e)
                }

            };
            reader.readAsText(file);

        }
        inp.click();
    }

    function replaceExportDefault(str) {
        // Replace the first occurrence of 'export' with '' (empty string)
        str = str.replace(/export/, '');

        // Replace the first occurrence of 'default' with '' (empty string)
        // This regex handles multiple spaces, tabs, or newlines between 'export' and 'default'
        str = str.replace(/default/, '');

        return str;
    }

var currentScriptName = null;
minimizable.appendChild(createButton);
createButton.style.backgroundColor="#1d00ff"
createButton.addEventListener('click', function() {
    var newName = newScript()
    if(!newName) {
        return alert("There's no valid new name...")
    }
    loadScript(newName)
});

function newScript() {
    var editor=document.getElementById("customEditor")
    var scriptName = prompt('Enter a name for the new script:');
    if (scriptName) {
        currentScriptName = scriptName;
        Awtsmoos.write('scripts', scriptName, '//B"H')
            .then(() => {
                alert('Script created!');
                loadScriptList();
                highlightScriptInList(scriptName);
            })
            .catch(error => console.error('Error saving script:', error));

    }
    return scriptName;
}

async function customRunFunction() {
    var editor=document.getElementById("customEditor")
        var code = editor.innerText;

        try {

            var didntHaveBefore = false;
            var scriptHolder = document.querySelector(".scriptHolder");
            if(scriptHolder) {
                scriptHolder.parentNode.removeChild(scriptHolder)
            }

            scriptHolder = document.createElement("script");
            didntHaveBefore = true;
            scriptHolder.className="scriptHolder"


            scriptHolder.type = "module";
            window.onerror = e => {
                alert("Error in script: " + e)
            }
            scriptHolder.innerHTML = code;
            if(didntHaveBefore) {
                document.head.appendChild(scriptHolder)
            }

        } catch(e) {
            alert("there was an issue running the script: "+e);
        }
}
function customSaveFunction() {
    var editor=document.getElementById("customEditor")
    if(!currentScriptName) {
        currentScriptName = newScript()
    }
    if (currentScriptName) {
        Awtsmoos.write('scripts', currentScriptName, editor.innerText)
            .then(() => {
                alert('Script saved!');
                loadScriptList();
            })
            .catch(error => console.error('Error saving script:', error));
    } else {
        alert('No script is currently loaded.');
    }
}
saveButton.addEventListener('click', function() {
    customSaveFunction();
});

deleteButton.addEventListener('click', function() {
    var editor=document.getElementById("customEditor")
    if (currentScriptName && confirm(`Are you sure you want to delete '${currentScriptName}'?`)) {
        Awtsmoos.delete('scripts', currentScriptName)
            .then(() => {
                alert('Script deleted!');
                currentScriptName = null;
                editor.innerText = '';
            syntaxHighlight(editor, "javascript");
                loadScriptList();
            })
            .catch(error => console.error('Error deleting script:', error));
    }
});


    loadButton.addEventListener('click', function() {
        loadScripts();
    });

    runButton.addEventListener('click', async function() {
        await customRunFunction()

    });

    function loadScript(key) {
        currentScriptName = key;
        Awtsmoos.read('scripts', key)
            .then(value => {
                editor.innerText = value;
            syntaxHighlight(editor, "javascript");
                highlightScriptInList(key);
            })
            .catch(error => console.error('Error loading script:', error));
    }

function loadScriptList() {
    var editor=document.getElementById("customEditor")
    scriptList.innerHTML = '';
    Awtsmoos.getAllKeys('scripts')
        .then(keys => {
            keys.forEach(key => {
                var li = document.createElement('li');
                li.textContent = key;
                li.addEventListener('click', () => {
                    loadScript(key)
                });
                scriptList.appendChild(li);
            });
            highlightScriptInList(currentScriptName);
        })
        .catch(error => console.error('Error loading script list:', error));
}

function highlightScriptInList(scriptName) {
    Array.from(scriptList.children).forEach(li => {
        if (li.textContent === scriptName) {
            li.style.backgroundColor = '#efefef';
        } else {
            li.style.backgroundColor = 'transparent';
        }
    });
}

    loadScriptList(); // Initial load of the script list

setup(editor, "javascript");
