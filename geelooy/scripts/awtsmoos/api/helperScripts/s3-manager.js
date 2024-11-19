/**
B"H
Awtsmoos Power S3 manager
specialized to work with Cloudfare R2 currently but can work with any S3 if change host details

EXPORTS sendIt
takes in account details

accountId
accessTokenId
secretAccessKey
bucket -- your bucket name
key
content (currently text but blobs are soon as well)
**/

//B"H

 function script(url) {
	 return new Promise(r => {
var scr = document.createElement("script")
	scr.src=url;
	document.body.appendChild(scr);
		 scr.onload = r;
		 scr.onerror = (e) => r(e)
	 })
    try {
        eval(f);
    } catch (e) { console.log(e) }
}

var bucket = "awtsmoos-audio"
var key ="ok/wsdfwow8738.txt"
var contentBody = "B\"H\n\nYO ho awfww are you even";
var request = null;
var signatureVersion = "v4"

var algorithm = "AWS4-HMAC-SHA256"
		
var serviceName = "s3"

function weirdTime (t) { 
	return iso8601(t).replace(/[:\-]|\.\d{3}/g, "")
}

function sendIt({
	accessKeyId, secretAccessKey,
	bucket,
	accountId,
	key,
	content
}) {
	return new Promise(async ret => {
		if(!window.CryptoJS) {
			await script("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js");

		}
		/*content = "B\"H" 
				+"\n"+ content*/
		
		request = {
			region:"enam",
			pathname: () => 
				`/${bucket}/${key}`,
			method: "PUT",
			headers: {
				"x-amz-content-sha256": "UNSIGNED-PAYLOAD",
			
			//	"host": "a93a26b5b92d877ed1261c3a03782c27.r2.cloudflarestorage.com",
				"content-type": "application/octet-stream",
				"content-md5": generateMD5(content),
			//	"content-length": content.length,
				"x-amz-user-agent": "aws-sdk-js/2.1481.0 callback"
			},
			body: content
			
		}
		var ob = {
			request
		};
		
		addAuthorization({
		    accessKeyId,
		    secretAccessKey
		}, new Date(), ob);
		//console.log(ob);
		
		var x = new XMLHttpRequest()
		x.open("PUT", `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key}`, true)
		for(var h in ob.request.headers) {
		    try {
		        x.setRequestHeader(h,ob.request.headers[h])
		    } catch(e){console.log(e)}
		}
		x.onreadystatechange = () => {

			if(x.status == 200) {
				ret(ob)
			}
		}
		x.send(ob.request.body);	
	})
}
function stringToSign(e, H) {

	var t = [];
	t.push("AWS4-HMAC-SHA256"),
		t.push(e),
		t.push(credentialString(e));
	var con = canonicalString(H)
	t.push(hexEncodedHash(con));
	
	return t.join("\n")
}

function addAuthorization(e, t, par) {
	var r = iso8601(t).replace(/[:\-]|\.\d{3}/g, "");
	par.request.headers["X-Amz-Date"]=r;
	
	par.request.headers.Authorization = authorization(e, r, par.request)
}

function authorization(e, t, R) {
	
	var r = []
		, a = credentialString(t);
	return r.push(algorithm + " Credential=" + e.accessKeyId + "/" + a),
		r.push("SignedHeaders=" + signedHeaders(R.headers)),
		r.push("Signature=" + signature(e, t, R)),
		r.join(", ")
}
function signature(e, t, R) {
	var r = getSigningKey(e, t.substr(0, 8), request.region, serviceName, !0);

	var otherThing = stringToSign(t, Object.assign({},R.headers));

	return generateHMAC(r, otherThing , "hex")
}


function uriEscapePath(e) {
	var t = [];
	return s.arrayEach(e.split("/"), function(e) {
		t.push(s.uriEscape(e))
	}),
		t.join("/")
}

		/**

PUT
/awtsmoos-audio/ok/wow8738.txt

content-md5:3F2SHjus2f4LjMPjFLZSzA==
host:.r2.cloudflarestorage.com
x-amz-content-sha256:UNSIGNED-PAYLOAD
x-amz-date:20241119T063943Z
x-amz-user-agent:aws-sdk-js/2.1481.0 callback

content-md5;host;x-amz-content-sha256;x-amz-date;x-amz-user-agent
UNSIGNED-PAYLOAD
		**/
function canonicalString(headers) {
	var e = []
		, t = request.pathname();
	
	return "s3" !== serviceName && "s3v4" !== signatureVersion && (t = uriEscapePath(t)),
		e.push(request.method),
		e.push(t),
		e.push(""),
		e.push(canonicalHeaders(headers || request.headers) + "\n"),
		e.push(signedHeaders(headers || request.headers)),
		e.push("UNSIGNED-PAYLOAD"),
		e.join("\n")
}

function iso8601(e) {
	return void 0 === e && (e = s.date.getDate()),
		e.toISOString().replace(/\.\d{3}Z$/, "Z")
}

function getSkewCorrectedDate() {
	return new Date(Date.now())
}

var unsignableHeaders = ["authorization", "content-type", "content-length", "user-agent", "presigned-expires", "expect", "x-amzn-trace-id"]

	
function isSignableHeader(e) {
	return 0 === e.toLowerCase().indexOf("x-amz-") || unsignableHeaders.indexOf(e) < 0
}

function each(e, t) {
	for (var r in e)
		if (Object.prototype.hasOwnProperty.call(e, r)) {
			var a = t.call(this, r, e[r]);
			if (a === s.abort)
				break
		}
}

function arrayEach(e, t) {
	for (var r in e)
		if (Object.prototype.hasOwnProperty.call(e, r)) {
			var a = t.call(this, e[r], parseInt(r, 10));
			if (a === s.abort)
				break
		}
}

function signedHeaders(headers) {
	var e = [];
	var keys = Object.keys(headers||request.headers)
	for(var key of keys) {
		key = key.toLowerCase()
		if(isSignableHeader(key)) {
			e.push(key)
		}
	}
	/*each.call(this, this.request.headers, function(t) {
		t = t.toLowerCase(),
			isSignableHeader(t) && e.push(t)
	});*/

	return e.sort().join(";")
}

						 /*


(5) (5) 

['content-md5:6ucujzbo0vbhm0k+xcljlq==', 'host:.r2.cloudflarestorage.com', 'x-amz-content-sha256:unsigned-payload', 'x-amz-date:20241119t062926z', 'x-amz-user-agent:aws-sdk-js/2.1481.0 callback']

['content-md5:3f1M2c/rNoABD8C9PZtn+g==', 'host:.r2.cloudflarestorage.com', 'x-amz-content-sha256:UNSIGNED-PAYLOAD', 'x-amz-date:20241119T063040Z', 'x-amz-user-agent:aws-sdk-js/2.1481.0 callback']
		 */
function canonicalHeaders(headers) {
	var ar = [];
	var source = Object.assign({}, headers)
	var ky = Object.keys(source)
	for(var k of ky) {
		var old = source[k];
		delete source[k]
		source[k.toLowerCase()] = old;
	}
	var keys = signedHeaders(headers || request.headers).split(";")
	for(var k of keys) {
		ar.push(
			(""+k.toLowerCase()+":"+source[k])
		)
	}

	return ar.join("\n");
	var e = [];
	each.call(this, this.request.headers, function(t, r) {
		e.push([t, r])
	}),
		e.sort(function(e, t) {
			return e[0].toLowerCase() < t[0].toLowerCase() ? -1 : 1
		});
	var t = [];
	return arrayEach.call(this, e, function(e) {
		var r = e[0].toLowerCase();
		if (isSignableHeader(r)) {
			var i = e[1];
			if (void 0 === i || null === i || "function" != typeof i.toString)
				throw new Error("Header " + r + " contains invalid value")
			t.push(r + ":" + canonicalHeaderValues(i.toString()))
		}
	}),
		t.join("\n")
}
function canonicalHeaderValues(e) {
	return e.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "")
}

function credentialString(e) {
	return createScope(e.substr(0, 8), request.region, serviceName)
}

function hexEncodedHash(e) {
	return sha256(e, "hex")
}


function createScope(e, t, r) {
	return [e.substr(0, 8), t, r, "aws4_request"].join("/")
}

function preparePostPolicy (e, t) {
	return atob(JSON.stringify({
		expiration: iso8601(e),
		conditions: t
	}))
}

function copy(e) {
	if (null === e || void 0 === e)
		return e;
	var t = {};
	for (var r in e)
		t[r] = e[r];
	return t
}
var awtsCache = {};
var awtsCacheAr = [];
function getSigningKey(e, t, r, o, n) {

	var u = generateHMAC(e.secretAccessKey, e.accessKeyId)
		, p = [u, t, r, o].join("_");
	if ((n = !1 !== n) && p in awtsCache)
		return awtsCache[p];
	var m = generateHMAC("AWS4" + e.secretAccessKey, t, "buffer");

	var c = generateHMAC(m, r, "buffer")
	var l = generateHMAC(c, o, "buffer")
	var d = generateHMAC(l, "aws4_request", "buffer");

	
	return n && (awtsCache[p] = d,
				 awtsCacheAr.push(p),
				 awtsCacheAr.length > 50 && delete awtsCache[awtsCacheAr.shift()]),
		d
}

function sha256(message, outputFormat = "hex") {
    // Ensure the input message is a string or WordArray
    const msg = typeof message === "string" ? CryptoJS.enc.Utf8.parse(message) : message;

    // Compute the SHA-256 hash
    const hash = CryptoJS.SHA256(msg);

    // Return the hash in the requested format
    if (outputFormat === "hex") {
        return CryptoJS.enc.Hex.stringify(hash);
    } else if (outputFormat === "base64") {
        return CryptoJS.enc.Base64.stringify(hash);
    } else {
        throw new Error("Invalid output format specified. Use 'hex' or 'base64'.");
    }
}

function generateMD5(input, type = "base64") {
    // Convert input to WordArray
    const data = 
        typeof input === "string" ? CryptoJS.enc.Utf8.parse(input) :
        input instanceof Uint8Array ? CryptoJS.lib.WordArray.create(input) :
        input;

    // Generate MD5 hash
    const md5Hash = CryptoJS.MD5(data);

    // Return in the desired format
    if (type === "base64") {
        return CryptoJS.enc.Base64.stringify(md5Hash);
    } else if (type === "hex") {
        return CryptoJS.enc.Hex.stringify(md5Hash);
    } else if (type === "buffer") {
        // Convert WordArray to Uint8Array
        const wordArray = md5Hash;
        const buffer = new ArrayBuffer(wordArray.sigBytes);
        const view = new DataView(buffer);

        for (let i = 0; i < wordArray.sigBytes; i++) {
            view.setUint8(i, (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff);
        }

        return new Uint8Array(buffer);
    } else {
        throw new Error("Invalid type specified. Use 'base64', 'hex', or 'buffer'.");
    }
}

function generateHMAC(secretKey, message, type = "base64") {
    // Ensure inputs are in the correct format
    const key = 
        typeof secretKey === "string" ? CryptoJS.enc.Utf8.parse(secretKey) :
        secretKey instanceof Uint8Array ? CryptoJS.lib.WordArray.create(secretKey) :
        secretKey;

    const msg = 
        typeof message === "string" ? CryptoJS.enc.Utf8.parse(message) :
        message instanceof Uint8Array ? CryptoJS.lib.WordArray.create(message) :
        message;

    // Create HMAC using SHA-256
    const hmac = CryptoJS.HmacSHA256(msg, key);

    // Convert the HMAC to the desired format
    if (type === "base64") {
        return CryptoJS.enc.Base64.stringify(hmac);
    } else if (type === "buffer") {
        // Convert WordArray to Uint8Array
        const wordArray = hmac;
        const buffer = new ArrayBuffer(wordArray.sigBytes);
        const view = new DataView(buffer);

        for (let i = 0; i < wordArray.sigBytes; i++) {
            view.setUint8(i, (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff);
        }

        return new Uint8Array(buffer);
    }  else if (type === "hex") {
        return CryptoJS.enc.Hex.stringify(hmac);
    } else {
        throw new Error("Invalid type specified. Use 'base64' or 'buffer' or hex.");
    }
}

export {

	sendIt	
}
