//B"H
import {
    AwtsmoosPrompt
} from "/scripts/awtsmoos/api/utils.js";
var mFetch = window.awtsmoosFetch;
async function checkMFetch() {
	if(!mFetch) {
		mFetch = window.awtsmoosFetch;
		if(!mFetch) {
			return await AwtsmoosPrompt.go({
	                    isAlert: true,
	                    headerTxt: "You need to <a href='https://github.com/ymerkos/awtsfaria/blob/main/geelooy/scripts/tricks/extensions/server.zip'>awtsmoos server</a> extension to run this.",
	                });
		}
	}
}
	//B"H
	class AwtsmoosGPTify {
	    _lastMessageId = null;
	    _conversationId = null;
	    sessionName = null;
	    constructor({
			conversation_id,
			parent_message_id
		}={}) {
			this._lastMessageId=parent_message_id;
			this._conversationId = conversation_id;
			this.getAwtsmoosAudio = getAwtsmoosAudio;
	    }
	    async go({
	        prompt,
	        onstream,
	        ondone,
	        action = "next",
	        parentMessageId,// = this._lastMessageId,
	        model ="auto",
	        conversationId = this._conversationId,
	        timezoneOffsetMin = 240,
	        historyAndTrainingDisabled = false,
	        arkoseToken = "",
	        authorizationToken = "",
	        more = {},
	        print=true,
	        customFetch=mFetch,
	        customTextEncoder=TextDecoder,
	        customHeaders = {},
	        }) {
		checkMFetch()
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
			console.log("got auth",authorizationToken)
	        var awtsmoosToikens = await awtsmoosifyTokens();
	        var nameURL = convoId =>
	        `https://chatgpt.com/backend-api/conversation/gen_title/${convoId}`
		if(!parentMessageId) {
			var co=await getConversation(
				conversationId,
				authorizationToken
	
			)
			var n = co?.current_node;
			var msg = co?.mapping?.[n];
			if(msg?.message?.author?.role == "assistant")
				parentMessageId=co?.current_node;
			else {
				console.log("Couldn't get parent")
				parentMessageId = null;
			}
	
		}
	        if(!parentMessageId && !conversationId) {
	            parentMessageId = generateUUID();
	        }
			console.log("GETTING",authorizationToken,parentMessageId)
	
	        
	
	
	
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
					/*"supported_encodings": [
			            "v1"
			        ],*/
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
				//console.log(c)
			   	if(c?.data?.conversation_id) {
					this._conversationId = c?.data?.conversation_id
				}
			   	if(c?.data?.message) {
				//	this._lastMessageId = c?.data?.message.id
				}
				if(typeof(onstream) == "function") {
					onstream(c.data)
				}
			   if(c?.dataNoJSON == "[DONE]") {
					
				}
			   	
			});
			/*await new Promise(r=>
				setTimeout(r, 7000)
			);

			var convo = await this.getConversation();
			var cur = convo?.current_node;
			if(cur) {
				res = convo?.mapping?.[cur];
				console.log("Got conversation data",convo,cur);
				if(typeof(ondone) == "function") {
						
					ondone(res);
					onstream(res)
				}
			}
			console.log("Finished it",res, convo, cur);
			
			res.conversation_id = this._conversationId ;*/
			
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

		async getConversation(conversationId=this._conversationId) {
			checkMFetch()
			return await getConversation(conversationId)
		}
		async getConversations(...args) {
			checkMFetch()
			return await getConversations(...args);
		}
	}

	
	
	

    async function logStream(response, callback) {
	   var hasCallback = typeof(callback) == "function";
	   var myCallback =  hasCallback ? callback : () => {};
	    var result = []
	    // Check if the response is okay
	    if (!response.ok) {
	        console.error('Network response was not ok:', window.resp = response);
	        return {message: "Something happened"};
	    }
	   // return response.text();
	    const reader = response.body.getReader();
	    const decoder = new TextDecoder("utf-8");
	    let buffer = '';
	    var curEvent = null;
		var message = null;
		var otherEvents = []
	    while (true) {
	        const { done, value } = await reader.read();
	
	        if (done) {
	            console.log('Stream finished',message);
				return message;
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
						//console.log(jsonData)
	                    if(!hasCallback)
	                        console.log('Parsed JSON Data:', jsonData);
				        var k={data:jsonData, event: curEvent}
				        result. push(k)
						if(jsonData.message?.content?.parts) {
							message = jsonData.message;	
						} else {
							otherEvents.push(jsonData)
						}
	                    myCallback?.(k)
	                } catch (e) {
						//console.log(data)
	                    if(!hasCallback)
	                        console.warn('Data is not valid JSON:', data,result);
	        var k=({dataNoJSON: data,  event: curEvent, error:e})
	   
	                    myCallback?.(k, "done")
						message.awtsmoos  = {otherEvents}
						//return {message}
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

	
	var token = null;
	async function getConversations({offset=0,limit=27}={}) {
		if(!token) {
			var session = (await (await mFetch("https://chatgpt.com/api/auth/session")).json())
			token = session.accessToken;
		}
		var convo = await (
			await mFetch(`https://chatgpt.com/backend-api/conversations?offset=${offset}&limit=${limit}&order=updated`, {
			headers: {
				 authorization: "Bearer " + token
			}
		})
		).json();
		return convo;
	}
	async function getAwtsmoosAudio({
	    message_id, 
	    conversation_id,
	    voice = "orbit",
	    format = "aac",
		download=true
	}) {
		if(!token) {
			var session = (await (await mFetch("https://chatgpt.com/api/auth/session")).json())
			token = session.accessToken;
		}
	    var convo = await getConversation(conversation_id, token)
	    if(!message_id) message_id = convo?.current_node;
	    var blob = await (
	        await mFetch("https://chatgpt.com/backend-api/synthesize?message_id="
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
		if(download) {
			var a = document.createElement("a")
			a.href = URL.createObjectURL(blob)
			a.download = "BH_awtsmoosAudio_" + Date.now() + "." + format;
			a.click()
			return {downloaded: "true"}
		} else {
			var data = await blobToDataURL(blob)
			return {url:data};
		}
	}

	function blobToDataURL(blob) {
	 return new Promise(r => {
		  var reader = new FileReader();
		  reader.onload = function() {
		    var dataUrl = reader.result;
		
		    r(dataUrl);
		  };
		  reader.readAsDataURL(blob);
		})
	}
	window.getAwtsmoosAudio=getAwtsmoosAudio;
	async function getConversation(conversation_id, token) {
		if(!token) {
			var session = (await (await mFetch("https://chatgpt.com/api/auth/session")).json())
	    	token = session.accessToken;
		}
	    return (await (await mFetch("https://chatgpt.com/backend-api/conversation/" + conversation_id, {
	      "headers": {
	        "accept": "*/*",
	        "accept-language": "en-US,en;q=0.9",
	        "authorization": "Bearer "+token,
	
	      },
	      "method": "GET"
	    })).json())
	}
	window.getConversation=getConversation;
	/**
		B"H
	**/
	async function awtsmoosifyTokens() {
			/**
				B"H
				OLD method to manually
				get the helper scripts to use those functions

				new method simply implement the methods tehmselves
			**/
	   //     g=await import("https://cdn.oaistatic.com/assets/i5bamk05qmvsi6c3.js")
			console.log("Getting tokens")
	        var z = await getChatRequirements()
	
	       console.log("Chat",z);
	        var p = await getEnforcementToken(z)//p token
			
	        //A = fo(e.chatReq, l ?? e.arkoseToken, e.turnstileToken, e.proofToken, null)
	        return {
	            "openai-sentinel-chat-requirements-token":z.token,
	            "openai-sentinel-proof-token":p
	        }
	       // return g.fX(z,"", null, p, null)
	}
	
	var authToken = null;
	async function getAuthToken() {
	    if(authToken) return authToken;
	    var sesh = await mFetch(
	        "https://chatgpt.com/api/auth/session"
	    );
		var j = await sesh.json();
	    var token = j.accessToken;
	    if(token) {
	        authToken = token;
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
	
	
	async function getChatRequirements(authToken) {
		var tok = authToken || await getAuthToken();
		console.log("Have token",tok);
		var req = await getRequirementsToken()
		console.log("Got require token",req);
	    return await (await mFetch(`https://chatgpt.com/backend-api/sentinel/chat-requirements`, {
	        method: "POST",
	        body: JSON.stringify({
	            p: req
	        }),
	        headers: {
	            "authorization":"Bearer "+tok
	        }
	    })).json()
	}
	
	async function getEnforcementToken(z) {
		var cl = getTokenClass();
		return await cl.getEnforcementToken(z)
	}
	async function getRequirementsToken() {
		var cl = getTokenClass();
		return await cl.getRequirementsToken()
	}
	//B"H
	function getTokenClass() {
	
	    var tR = {
		    exports: {}
		};
		/**
		 * [js-sha3]{@link https://github.com/emn178/js-sha3}
		 *
		 * @version 0.9.3
		 * @author Chen, Yi-Cyuan [emn178@gmail.com]
		 * @copyright Chen, Yi-Cyuan 2015-2023
		 * @license MIT
		 */
		(function(e) {
		    (function() {
		        var t = "input is invalid type"
		          , r = "finalize already called"
		          , n = typeof window == "object"
		          , i = n ? window : {};
		        i.JS_SHA3_NO_WINDOW && (n = !1);
		        var a = !n && typeof self == "object"
		          , o = !i.JS_SHA3_NO_NODE_JS && typeof process == "object" && process.versions && process.versions.node;
		        o ? i = W : a && (i = self);
		        for (var s = !i.JS_SHA3_NO_COMMON_JS && !0 && e.exports, u = !i.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer < "u", c = "0123456789abcdef".split(""), l = [31, 7936, 2031616, 520093696], f = [4, 1024, 262144, 67108864], d = [1, 256, 65536, 16777216], h = [6, 1536, 393216, 100663296], p = [0, 8, 16, 24], g = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649, 0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0, 2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771, 2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648, 2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648], v = [224, 256, 384, 512], y = [128, 256], _ = ["hex", "buffer", "arrayBuffer", "array", "digest"], b = {
		            128: 168,
		            256: 136
		        }, E = i.JS_SHA3_NO_NODE_JS || !Array.isArray ? function(w) {
		            return Object.prototype.toString.call(w) === "[object Array]"
		        }
		        : Array.isArray, C = u && (i.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView) ? function(w) {
		            return typeof w == "object" && w.buffer && w.buffer.constructor === ArrayBuffer
		        }
		        : ArrayBuffer.isView, T = function(w) {
		            var z = typeof w;
		            if (z === "string")
		                return [w, !0];
		            if (z !== "object" || w === null)
		                throw new Error(t);
		            if (u && w.constructor === ArrayBuffer)
		                return [new Uint8Array(w), !1];
		            if (!E(w) && !C(w))
		                throw new Error(t);
		            return [w, !1]
		        }, A = function(w) {
		            return T(w)[0].length === 0
		        }, S = function(w) {
		            for (var z = [], Y = 0; Y < w.length; ++Y)
		                z[Y] = w[Y];
		            return z
		        }, x = function(w, z, Y) {
		            return function(ee) {
		                return new Q(w,z,w).update(ee)[Y]()
		            }
		        }, R = function(w, z, Y) {
		            return function(ee, te) {
		                return new Q(w,z,te).update(ee)[Y]()
		            }
		        }, O = function(w, z, Y) {
		            return function(ee, te, oe, de) {
		                return k["cshake" + w].update(ee, te, oe, de)[Y]()
		            }
		        }, N = function(w, z, Y) {
		            return function(ee, te, oe, de) {
		                return k["kmac" + w].update(ee, te, oe, de)[Y]()
		            }
		        }, P = function(w, z, Y, ee) {
		            for (var te = 0; te < _.length; ++te) {
		                var oe = _[te];
		                w[oe] = z(Y, ee, oe)
		            }
		            return w
		        }, M = function(w, z) {
		            var Y = x(w, z, "hex");
		            return Y.create = function() {
		                return new Q(w,z,w)
		            }
		            ,
		            Y.update = function(ee) {
		                return Y.create().update(ee)
		            }
		            ,
		            P(Y, x, w, z)
		        }, V = function(w, z) {
		            var Y = R(w, z, "hex");
		            return Y.create = function(ee) {
		                return new Q(w,z,ee)
		            }
		            ,
		            Y.update = function(ee, te) {
		                return Y.create(te).update(ee)
		            }
		            ,
		            P(Y, R, w, z)
		        }, H = function(w, z) {
		            var Y = b[w]
		              , ee = O(w, z, "hex");
		            return ee.create = function(te, oe, de) {
		                return A(oe) && A(de) ? k["shake" + w].create(te) : new Q(w,z,te).bytepad([oe, de], Y)
		            }
		            ,
		            ee.update = function(te, oe, de, he) {
		                return ee.create(oe, de, he).update(te)
		            }
		            ,
		            P(ee, O, w, z)
		        }, K = function(w, z) {
		            var Y = b[w]
		              , ee = N(w, z, "hex");
		            return ee.create = function(te, oe, de) {
		                return new ge(w,z,oe).bytepad(["KMAC", de], Y).bytepad([te], Y)
		            }
		            ,
		            ee.update = function(te, oe, de, he) {
		                return ee.create(te, de, he).update(oe)
		            }
		            ,
		            P(ee, N, w, z)
		        }, le = [{
		            name: "keccak",
		            padding: d,
		            bits: v,
		            createMethod: M
		        }, {
		            name: "sha3",
		            padding: h,
		            bits: v,
		            createMethod: M
		        }, {
		            name: "shake",
		            padding: l,
		            bits: y,
		            createMethod: V
		        }, {
		            name: "cshake",
		            padding: f,
		            bits: y,
		            createMethod: H
		        }, {
		            name: "kmac",
		            padding: f,
		            bits: y,
		            createMethod: K
		        }], k = {}, F = [], j = 0; j < le.length; ++j)
		            for (var J = le[j], Z = J.bits, ue = 0; ue < Z.length; ++ue) {
		                var q = J.name + "_" + Z[ue];
		                if (F.push(q),
		                k[q] = J.createMethod(Z[ue], J.padding),
		                J.name !== "sha3") {
		                    var re = J.name + Z[ue];
		                    F.push(re),
		                    k[re] = k[q]
		                }
		            }
		        function Q(w, z, Y) {
		            this.blocks = [],
		            this.s = [],
		            this.padding = z,
		            this.outputBits = Y,
		            this.reset = !0,
		            this.finalized = !1,
		            this.block = 0,
		            this.start = 0,
		            this.blockCount = 1600 - (w << 1) >> 5,
		            this.byteCount = this.blockCount << 2,
		            this.outputBlocks = Y >> 5,
		            this.extraBytes = (Y & 31) >> 3;
		            for (var ee = 0; ee < 50; ++ee)
		                this.s[ee] = 0
		        }
		        Q.prototype.update = function(w) {
		            if (this.finalized)
		                throw new Error(r);
		            var z = T(w);
		            w = z[0];
		            for (var Y = z[1], ee = this.blocks, te = this.byteCount, oe = w.length, de = this.blockCount, he = 0, pe = this.s, Se, Fe; he < oe; ) {
		                if (this.reset)
		                    for (this.reset = !1,
		                    ee[0] = this.block,
		                    Se = 1; Se < de + 1; ++Se)
		                        ee[Se] = 0;
		                if (Y)
		                    for (Se = this.start; he < oe && Se < te; ++he)
		                        Fe = w.charCodeAt(he),
		                        Fe < 128 ? ee[Se >> 2] |= Fe << p[Se++ & 3] : Fe < 2048 ? (ee[Se >> 2] |= (192 | Fe >> 6) << p[Se++ & 3],
		                        ee[Se >> 2] |= (128 | Fe & 63) << p[Se++ & 3]) : Fe < 55296 || Fe >= 57344 ? (ee[Se >> 2] |= (224 | Fe >> 12) << p[Se++ & 3],
		                        ee[Se >> 2] |= (128 | Fe >> 6 & 63) << p[Se++ & 3],
		                        ee[Se >> 2] |= (128 | Fe & 63) << p[Se++ & 3]) : (Fe = 65536 + ((Fe & 1023) << 10 | w.charCodeAt(++he) & 1023),
		                        ee[Se >> 2] |= (240 | Fe >> 18) << p[Se++ & 3],
		                        ee[Se >> 2] |= (128 | Fe >> 12 & 63) << p[Se++ & 3],
		                        ee[Se >> 2] |= (128 | Fe >> 6 & 63) << p[Se++ & 3],
		                        ee[Se >> 2] |= (128 | Fe & 63) << p[Se++ & 3]);
		                else
		                    for (Se = this.start; he < oe && Se < te; ++he)
		                        ee[Se >> 2] |= w[he] << p[Se++ & 3];
		                if (this.lastByteIndex = Se,
		                Se >= te) {
		                    for (this.start = Se - te,
		                    this.block = ee[de],
		                    Se = 0; Se < de; ++Se)
		                        pe[Se] ^= ee[Se];
		                    be(pe),
		                    this.reset = !0
		                } else
		                    this.start = Se
		            }
		            return this
		        }
		        ,
		        Q.prototype.encode = function(w, z) {
		            var Y = w & 255
		              , ee = 1
		              , te = [Y];
		            for (w = w >> 8,
		            Y = w & 255; Y > 0; )
		                te.unshift(Y),
		                w = w >> 8,
		                Y = w & 255,
		                ++ee;
		            return z ? te.push(ee) : te.unshift(ee),
		            this.update(te),
		            te.length
		        }
		        ,
		        Q.prototype.encodeString = function(w) {
		            var z = T(w);
		            w = z[0];
		            var Y = z[1]
		              , ee = 0
		              , te = w.length;
		            if (Y)
		                for (var oe = 0; oe < w.length; ++oe) {
		                    var de = w.charCodeAt(oe);
		                    de < 128 ? ee += 1 : de < 2048 ? ee += 2 : de < 55296 || de >= 57344 ? ee += 3 : (de = 65536 + ((de & 1023) << 10 | w.charCodeAt(++oe) & 1023),
		                    ee += 4)
		                }
		            else
		                ee = te;
		            return ee += this.encode(ee * 8),
		            this.update(w),
		            ee
		        }
		        ,
		        Q.prototype.bytepad = function(w, z) {
		            for (var Y = this.encode(z), ee = 0; ee < w.length; ++ee)
		                Y += this.encodeString(w[ee]);
		            var te = (z - Y % z) % z
		              , oe = [];
		            return oe.length = te,
		            this.update(oe),
		            this
		        }
		        ,
		        Q.prototype.finalize = function() {
		            if (!this.finalized) {
		                this.finalized = !0;
		                var w = this.blocks
		                  , z = this.lastByteIndex
		                  , Y = this.blockCount
		                  , ee = this.s;
		                if (w[z >> 2] |= this.padding[z & 3],
		                this.lastByteIndex === this.byteCount)
		                    for (w[0] = w[Y],
		                    z = 1; z < Y + 1; ++z)
		                        w[z] = 0;
		                for (w[Y - 1] |= 2147483648,
		                z = 0; z < Y; ++z)
		                    ee[z] ^= w[z];
		                be(ee)
		            }
		        }
		        ,
		        Q.prototype.toString = Q.prototype.hex = function() {
		            this.finalize();
		            for (var w = this.blockCount, z = this.s, Y = this.outputBlocks, ee = this.extraBytes, te = 0, oe = 0, de = "", he; oe < Y; ) {
		                for (te = 0; te < w && oe < Y; ++te,
		                ++oe)
		                    he = z[te],
		                    de += c[he >> 4 & 15] + c[he & 15] + c[he >> 12 & 15] + c[he >> 8 & 15] + c[he >> 20 & 15] + c[he >> 16 & 15] + c[he >> 28 & 15] + c[he >> 24 & 15];
		                oe % w === 0 && (z = S(z),
		                be(z),
		                te = 0)
		            }
		            return ee && (he = z[te],
		            de += c[he >> 4 & 15] + c[he & 15],
		            ee > 1 && (de += c[he >> 12 & 15] + c[he >> 8 & 15]),
		            ee > 2 && (de += c[he >> 20 & 15] + c[he >> 16 & 15])),
		            de
		        }
		        ,
		        Q.prototype.arrayBuffer = function() {
		            this.finalize();
		            var w = this.blockCount, z = this.s, Y = this.outputBlocks, ee = this.extraBytes, te = 0, oe = 0, de = this.outputBits >> 3, he;
		            ee ? he = new ArrayBuffer(Y + 1 << 2) : he = new ArrayBuffer(de);
		            for (var pe = new Uint32Array(he); oe < Y; ) {
		                for (te = 0; te < w && oe < Y; ++te,
		                ++oe)
		                    pe[oe] = z[te];
		                oe % w === 0 && (z = S(z),
		                be(z))
		            }
		            return ee && (pe[oe] = z[te],
		            he = he.slice(0, de)),
		            he
		        }
		        ,
		        Q.prototype.buffer = Q.prototype.arrayBuffer,
		        Q.prototype.digest = Q.prototype.array = function() {
		            this.finalize();
		            for (var w = this.blockCount, z = this.s, Y = this.outputBlocks, ee = this.extraBytes, te = 0, oe = 0, de = [], he, pe; oe < Y; ) {
		                for (te = 0; te < w && oe < Y; ++te,
		                ++oe)
		                    he = oe << 2,
		                    pe = z[te],
		                    de[he] = pe & 255,
		                    de[he + 1] = pe >> 8 & 255,
		                    de[he + 2] = pe >> 16 & 255,
		                    de[he + 3] = pe >> 24 & 255;
		                oe % w === 0 && (z = S(z),
		                be(z))
		            }
		            return ee && (he = oe << 2,
		            pe = z[te],
		            de[he] = pe & 255,
		            ee > 1 && (de[he + 1] = pe >> 8 & 255),
		            ee > 2 && (de[he + 2] = pe >> 16 & 255)),
		            de
		        }
		        ;
		        function ge(w, z, Y) {
		            Q.call(this, w, z, Y)
		        }
		        ge.prototype = new Q,
		        ge.prototype.finalize = function() {
		            return this.encode(this.outputBits, !0),
		            Q.prototype.finalize.call(this)
		        }
		        ;
		        var be = function(w) {
		            var z, Y, ee, te, oe, de, he, pe, Se, Fe, At, yt, Vt, Lt, Ot, Ut, ne, Ke, Ti, wr, fr, ya, zn, Po, Tr, _a, ba, Ea, Lo, Sa, Wn, wa, Ci, Kn, Ai, Mo, Ta, Do, Ca, qn, Xn, Aa, ko, No, L, D, B, X, ce, me, we, ae, Ee, fe, ve, De, Ue, je, Pe, ft, Ze, gn, dr;
		            for (ee = 0; ee < 48; ee += 2)
		                te = w[0] ^ w[10] ^ w[20] ^ w[30] ^ w[40],
		                oe = w[1] ^ w[11] ^ w[21] ^ w[31] ^ w[41],
		                de = w[2] ^ w[12] ^ w[22] ^ w[32] ^ w[42],
		                he = w[3] ^ w[13] ^ w[23] ^ w[33] ^ w[43],
		                pe = w[4] ^ w[14] ^ w[24] ^ w[34] ^ w[44],
		                Se = w[5] ^ w[15] ^ w[25] ^ w[35] ^ w[45],
		                Fe = w[6] ^ w[16] ^ w[26] ^ w[36] ^ w[46],
		                At = w[7] ^ w[17] ^ w[27] ^ w[37] ^ w[47],
		                yt = w[8] ^ w[18] ^ w[28] ^ w[38] ^ w[48],
		                Vt = w[9] ^ w[19] ^ w[29] ^ w[39] ^ w[49],
		                z = yt ^ (de << 1 | he >>> 31),
		                Y = Vt ^ (he << 1 | de >>> 31),
		                w[0] ^= z,
		                w[1] ^= Y,
		                w[10] ^= z,
		                w[11] ^= Y,
		                w[20] ^= z,
		                w[21] ^= Y,
		                w[30] ^= z,
		                w[31] ^= Y,
		                w[40] ^= z,
		                w[41] ^= Y,
		                z = te ^ (pe << 1 | Se >>> 31),
		                Y = oe ^ (Se << 1 | pe >>> 31),
		                w[2] ^= z,
		                w[3] ^= Y,
		                w[12] ^= z,
		                w[13] ^= Y,
		                w[22] ^= z,
		                w[23] ^= Y,
		                w[32] ^= z,
		                w[33] ^= Y,
		                w[42] ^= z,
		                w[43] ^= Y,
		                z = de ^ (Fe << 1 | At >>> 31),
		                Y = he ^ (At << 1 | Fe >>> 31),
		                w[4] ^= z,
		                w[5] ^= Y,
		                w[14] ^= z,
		                w[15] ^= Y,
		                w[24] ^= z,
		                w[25] ^= Y,
		                w[34] ^= z,
		                w[35] ^= Y,
		                w[44] ^= z,
		                w[45] ^= Y,
		                z = pe ^ (yt << 1 | Vt >>> 31),
		                Y = Se ^ (Vt << 1 | yt >>> 31),
		                w[6] ^= z,
		                w[7] ^= Y,
		                w[16] ^= z,
		                w[17] ^= Y,
		                w[26] ^= z,
		                w[27] ^= Y,
		                w[36] ^= z,
		                w[37] ^= Y,
		                w[46] ^= z,
		                w[47] ^= Y,
		                z = Fe ^ (te << 1 | oe >>> 31),
		                Y = At ^ (oe << 1 | te >>> 31),
		                w[8] ^= z,
		                w[9] ^= Y,
		                w[18] ^= z,
		                w[19] ^= Y,
		                w[28] ^= z,
		                w[29] ^= Y,
		                w[38] ^= z,
		                w[39] ^= Y,
		                w[48] ^= z,
		                w[49] ^= Y,
		                Lt = w[0],
		                Ot = w[1],
		                D = w[11] << 4 | w[10] >>> 28,
		                B = w[10] << 4 | w[11] >>> 28,
		                Ea = w[20] << 3 | w[21] >>> 29,
		                Lo = w[21] << 3 | w[20] >>> 29,
		                ft = w[31] << 9 | w[30] >>> 23,
		                Ze = w[30] << 9 | w[31] >>> 23,
		                Aa = w[40] << 18 | w[41] >>> 14,
		                ko = w[41] << 18 | w[40] >>> 14,
		                Kn = w[2] << 1 | w[3] >>> 31,
		                Ai = w[3] << 1 | w[2] >>> 31,
		                Ut = w[13] << 12 | w[12] >>> 20,
		                ne = w[12] << 12 | w[13] >>> 20,
		                X = w[22] << 10 | w[23] >>> 22,
		                ce = w[23] << 10 | w[22] >>> 22,
		                Sa = w[33] << 13 | w[32] >>> 19,
		                Wn = w[32] << 13 | w[33] >>> 19,
		                gn = w[42] << 2 | w[43] >>> 30,
		                dr = w[43] << 2 | w[42] >>> 30,
		                fe = w[5] << 30 | w[4] >>> 2,
		                ve = w[4] << 30 | w[5] >>> 2,
		                Mo = w[14] << 6 | w[15] >>> 26,
		                Ta = w[15] << 6 | w[14] >>> 26,
		                Ke = w[25] << 11 | w[24] >>> 21,
		                Ti = w[24] << 11 | w[25] >>> 21,
		                me = w[34] << 15 | w[35] >>> 17,
		                we = w[35] << 15 | w[34] >>> 17,
		                wa = w[45] << 29 | w[44] >>> 3,
		                Ci = w[44] << 29 | w[45] >>> 3,
		                Po = w[6] << 28 | w[7] >>> 4,
		                Tr = w[7] << 28 | w[6] >>> 4,
		                De = w[17] << 23 | w[16] >>> 9,
		                Ue = w[16] << 23 | w[17] >>> 9,
		                Do = w[26] << 25 | w[27] >>> 7,
		                Ca = w[27] << 25 | w[26] >>> 7,
		                wr = w[36] << 21 | w[37] >>> 11,
		                fr = w[37] << 21 | w[36] >>> 11,
		                ae = w[47] << 24 | w[46] >>> 8,
		                Ee = w[46] << 24 | w[47] >>> 8,
		                No = w[8] << 27 | w[9] >>> 5,
		                L = w[9] << 27 | w[8] >>> 5,
		                _a = w[18] << 20 | w[19] >>> 12,
		                ba = w[19] << 20 | w[18] >>> 12,
		                je = w[29] << 7 | w[28] >>> 25,
		                Pe = w[28] << 7 | w[29] >>> 25,
		                qn = w[38] << 8 | w[39] >>> 24,
		                Xn = w[39] << 8 | w[38] >>> 24,
		                ya = w[48] << 14 | w[49] >>> 18,
		                zn = w[49] << 14 | w[48] >>> 18,
		                w[0] = Lt ^ ~Ut & Ke,
		                w[1] = Ot ^ ~ne & Ti,
		                w[10] = Po ^ ~_a & Ea,
		                w[11] = Tr ^ ~ba & Lo,
		                w[20] = Kn ^ ~Mo & Do,
		                w[21] = Ai ^ ~Ta & Ca,
		                w[30] = No ^ ~D & X,
		                w[31] = L ^ ~B & ce,
		                w[40] = fe ^ ~De & je,
		                w[41] = ve ^ ~Ue & Pe,
		                w[2] = Ut ^ ~Ke & wr,
		                w[3] = ne ^ ~Ti & fr,
		                w[12] = _a ^ ~Ea & Sa,
		                w[13] = ba ^ ~Lo & Wn,
		                w[22] = Mo ^ ~Do & qn,
		                w[23] = Ta ^ ~Ca & Xn,
		                w[32] = D ^ ~X & me,
		                w[33] = B ^ ~ce & we,
		                w[42] = De ^ ~je & ft,
		                w[43] = Ue ^ ~Pe & Ze,
		                w[4] = Ke ^ ~wr & ya,
		                w[5] = Ti ^ ~fr & zn,
		                w[14] = Ea ^ ~Sa & wa,
		                w[15] = Lo ^ ~Wn & Ci,
		                w[24] = Do ^ ~qn & Aa,
		                w[25] = Ca ^ ~Xn & ko,
		                w[34] = X ^ ~me & ae,
		                w[35] = ce ^ ~we & Ee,
		                w[44] = je ^ ~ft & gn,
		                w[45] = Pe ^ ~Ze & dr,
		                w[6] = wr ^ ~ya & Lt,
		                w[7] = fr ^ ~zn & Ot,
		                w[16] = Sa ^ ~wa & Po,
		                w[17] = Wn ^ ~Ci & Tr,
		                w[26] = qn ^ ~Aa & Kn,
		                w[27] = Xn ^ ~ko & Ai,
		                w[36] = me ^ ~ae & No,
		                w[37] = we ^ ~Ee & L,
		                w[46] = ft ^ ~gn & fe,
		                w[47] = Ze ^ ~dr & ve,
		                w[8] = ya ^ ~Lt & Ut,
		                w[9] = zn ^ ~Ot & ne,
		                w[18] = wa ^ ~Po & _a,
		                w[19] = Ci ^ ~Tr & ba,
		                w[28] = Aa ^ ~Kn & Mo,
		                w[29] = ko ^ ~Ai & Ta,
		                w[38] = ae ^ ~No & D,
		                w[39] = Ee ^ ~L & B,
		                w[48] = gn ^ ~fe & De,
		                w[49] = dr ^ ~ve & Ue,
		                w[0] ^= g[ee],
		                w[1] ^= g[ee + 1]
		        };
		        if (s)
		            e.exports = k;
		        else
		            for (j = 0; j < F.length; ++j)
		                i[F[j]] = k[F[j]]
		    }
		    )()
		}
		)(tR);
		var xz = tR.exports;
	    function xS(e) {
	        return e = JSON.stringify(e),
	        window.TextEncoder ? btoa(String.fromCharCode(...new TextEncoder().encode(e))) : btoa(unescape(encodeURIComponent(e)))
	    }
	
	    var az = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto)
	      , TS = {
	        randomUUID: az
	    };
	    function Vc(e, t, r) {
	        if (TS.randomUUID && !t && !e)
	            return TS.randomUUID();
	        e = e || {};
	        const n = e.random || (e.rng || nz)();
	        return n[6] = n[6] & 15 | 64,
	        n[8] = n[8] & 63 | 128,
	        iz(n)
	    }
	    
	
	    
	    function mf(e) {
	        return e[Math.floor(Math.random() * e.length)]
	    }
	
	    function Lz() {
	        return new Promise(e=>{
				e({
					didTimeout: false,
					timeRemaining() {
						return 12345678909876543212345678900987654321234567898765
					}
				})
	            /*(window.requestIdleCallback)(r=>{
	                e(r)
	            }
	            )*/
	        }
	        )
	    }
	    function Pz() {
	        const e = mf(Object.keys(Object.getPrototypeOf(navigator)));
	        try {
	            return `${e}−${navigator[e].toString()}`
	        } catch {
	            return `${e}`
	        }
	    }
		function Iz() {
	        return "" + Math.random()
	    }
	    class Rz {
	        answers = new Map;
	        maxAttempts = 5e5;
	        requirementsSeed = Iz();
	        sid = Vc();
	        async initializeAndGatherData(t) {
	            this._getAnswer(t)
	        }
	        async startEnforcement(t) {
	            this._getAnswer(t)
	        }
	        async getEnforcementToken(t) {
	            return this._getAnswer(t)
	        }
	        async getRequirementsToken() {
	            return this.answers.has(this.requirementsSeed) || this.answers.set(this.requirementsSeed, this._generateAnswer(this.requirementsSeed, "0")),
	            "gAAAAAC" + await this.answers.get(this.requirementsSeed)
	        }
	        async _getAnswer(t) {
	            if (!t?.proofofwork?.required)
	                return null;
	            const {seed: r, difficulty: n} = t.proofofwork;
	            return typeof r == "string" && typeof n == "string" ? (this.answers.has(r) || this.answers.set(r, this._generateAnswer(r, n)),
	            "gAAAAAB" + await this.answers.get(r)) : null
	        }
	        async _generateAnswer(t, r) {
	            let n = "e";
	            const i = performance.now();
	            try {
	                let a = null;
	                const o = this.getConfig();
	                for (let s = 600; s < /*this.maxAttempts*/800; s++) {
	                   // (!a || a.timeRemaining() <= 0) && (a = await Lz()),
	                    o[3] = s,
	                    o[9] = Math.round(performance.now() - i);
	                    var u = xS(o);
	                	if (xz.sha3_512(t + u).substring(0, r.length) <= r)
						
	                        return u
	                }
	            } catch (a) {
	                console.log(a);
	                n = xS("" + a)
	            }
	            return "wQ8Lk5FbGpA2NcR9dShT6gYjU7VxZ4D" + n
	        }
	        getConfig() {
	            return [screen?.width + screen?.height, "" + new Date, performance?.memory?.jsHeapSizeLimit, Math?.random(), navigator?.userAgent, mf(Array.from(document.scripts).map(t=>t?.src).filter(t=>t)), (Array.from(document.scripts || []).map(t=>t?.src?.match("c/[^/]*/_")).filter(t=>t?.length)[0] ?? [])[0] ?? document.documentElement.getAttribute("data-build"), navigator.language, navigator.languages?.join(","), Math?.random(), Pz(), mf(Object.keys(document)), mf(Object.keys(window)), performance.now(), this.sid, [...new URLSearchParams(window.location.search).keys()].join(","), navigator?.hardwareConcurrency]
	        }
			generateValidAnswer(config, difficulty) {
			    // Directly generate a valid answer to bypass hashing
			    let u = config.join(""); // Combine parts of the config into a string
			
			    // Add logic to make sure the first characters of 'u' are <= 'difficulty'
			    // For example, make the first few characters '0' (depending on difficulty)
			    while (u.substring(0, difficulty.length) > difficulty) {
			        u += Math.random().toString(36).substring(2); // Append random string until condition is met
			    }
			
			    return u; // Return 'u' that satisfies the condition
			}
	    }

		
	    var k=new Rz;
	    return k
	}

export default AwtsmoosGPTify;

