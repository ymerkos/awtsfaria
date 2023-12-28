/**
B"H
**/
/**
 * @method fetchAwtsmoos gets the
 * result as if one makes a request to
 * this path
 * @param {String} path 
 * @param {Object} opts 
 * 		@params of opts:
 * 		- method: 'POST', 'GET', etc.
 * 		- body: Data to be passed for POST, PUT, etc.
 * 		- headers: any additional headers
 * 		
 */
async function fetchAwtsmoos(path, opts) {
	if (!opts) opts = {}
	var dep = this.dependencies||{LOL:2}
	
	var	{
		request
	} = dep;
	if(!request) {
		var {
			request
		} = this;
	}
	var req = (request||{
		headers: {}
	})
	var user = req.user;
	// Mock request object
	var mockRequest = {
		url: path,
		user,
		method: opts.method || 'GET',
		headers: {
			cookie: opts.cookies || '',
			...req.headers
		},
		...opts,
		on: (eventName, callback) => {
			// Simulating request events for methods like POST/PUT
			if (eventName === 'data') {
				if (opts.body) {
					var dataChunks = typeof opts.body === 'string' ? [opts.body] : opts.body;
					dataChunks.forEach(chunk => callback(chunk));
				}
			} else if (eventName === 'end') {
				callback();
			}
		}
	};

	var _data = "";
	var _responseHeaders = {};
	// Mock response object
	var mockResponse = {
		_data: '',
		setHeader: (name, value) => {
			if (typeof(name) == "string") {
				name = name.toLowerCase();
			} else return;

			_responseHeaders
				[name] = value
			// For this mock, we won't do anything with headers
			// but in a real server, this sets HTTP headers for the response
		},
		end: function(data) {
			_data += data;
		},
		get data() {
			return _data;
		}
	};

	try {
		// Invoke onRequest function
		await this.server.onRequest(mockRequest, mockResponse);
	} catch (e) {
		console.log(e)
	}

	var d = mockResponse.data;
	var ct = _responseHeaders["content-type"]
	if (ct && ct.includes("json")) {
		try {
			d = JSON.parse(d)
		} catch (e) {

		}
	}


	return d;
};

module.exports = fetchAwtsmoos;