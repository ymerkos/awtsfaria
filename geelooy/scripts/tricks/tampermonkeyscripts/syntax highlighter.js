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

                overflow: auto;
                border: 1px solid black;
                word-wrap: break-word;
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

    contentEditableElement.addEventListener("keydown", function(e) {
        if (e.key === 'Tab') {
            e.preventDefault(); // Prevent the default tab behavior (focus change)
            insertTabAtCaret(contentEditableElement);
            syntaxHighlight(contentEditableElement, mode)
        }
    });

    contentEditableElement.addEventListener("scroll", e => {
        syncScroll(contentEditableElement, sib)
    });

    contentEditableElement.contentEditable="plaintext-only"
    contentEditableElement.spellcheck=false;
    syntaxHighlight(contentEditableElement, mode)
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
		contentEditableElement.previousElementSibling.innerHTML = jsMode(contentEditableElement.innerHTML);
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
			sfnuttpos, dfnuttpos, compos, comlinepos, keywordpos, numpos, mypos, dotpos, y;
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
			compos = getPos(rest, /\/\*/, "*/", commentMode);
			comlinepos = getPos(rest, /\/\//, "\n", commentMode);
			numpos = getNumPos(rest, jsNumberMode);
			keywordpos = getKeywordPos("js", rest, jsKeywordMode);
			dotpos = getDotPos(rest, jsPropertyMode);
			if (Math.max(numpos[0], sfnuttpos[0], dfnuttpos[0], compos[0], comlinepos[0], keywordpos[0], dotpos[0]) == -1) {
				break;
			}
			mypos = getMinPos(numpos, sfnuttpos, dfnuttpos, compos, comlinepos, keywordpos, dotpos);
			if (mypos[0] == -1) {
				break;
			}
			if (mypos[0] > -1) {
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
			arr = arguments[i];
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
				"super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield"
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
