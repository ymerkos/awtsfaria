/**
 * B"H
 * Some helper functions 
 * to mock requests 
 * and get template files
 */
let isBinary = false;
var isRealFile = false;
var foundAwtsmooses = []
var url = require("url");
var fs = require("fs").promises;
var path = require("path")
var getProperContent = require("./getProperContent.js")
var fetchAwtsmoos = require("./fetchAwtsmoos.js");
class Ayzarim {
	constructor(dependencies) {
		this.dependencies = dependencies;
		this.fetchAwtsmoos = fetchAwtsmoos;
		this.dependencies.fetchAwtsmoos =
			this.fetchAwtsmoos.bind(this)
		this.server = dependencies.self;
		this.foundAwtsmooses = []
		this.logs = {}


		this.filePath = dependencies
			.filePath;

        this.parentPath = dependencies 
            .parentPath;

		this.isDirectoryWithIndex = false
		this.isRealFile = false
		this.contentType = dependencies
			.contentType
	}

	errorMessage(...args) {
		return errorMessage.bind(this)(...args)
	}

	



	async doEverything() {
		return (doEverything.bind(this))()
	}
}

async function getPathInfo() {

	var {
        
		filePath,
		awtsRes,
		response,
		originalPath,
		parsedUrl
	} = this.dependencies;
	this.filePath = path.normalize(filePath);
	awtsRes.ended = false;
	var doesNotExist = false;

	this.filePaths = filePath
		.split("\\")
		
		
		.filter(q => q)
		.join("/")
		
		
		.split("/")
		.filter(w => w);
		

	this.fileName = this
		.filePaths[
			this
			.filePaths.length - 1
		];

	try {
		var st = await fs.stat(
			filePath
		);




		if (st && st.isDirectory()) {




			var indexFilePath = this.filePath +
				"/index.html";
                var san = path.normalize(indexFilePath)
                
                var ac = await exists(san)
                
			if (await exists(san)) {
				this.filePath = san;
				// Redirect if the original path does not end with a trailing slash
				if (!originalPath.endsWith('/')) {
					var redirectUrl = originalPath + '/';

					// Check if query parameters exist
					if (Object.keys(parsedUrl.query)
						.length > 0) {
						redirectUrl += '?' + new url.URLSearchParams(parsedUrl.query)
							.toString();
					}

					// Check if a hash fragment exists
					if (parsedUrl.hash) {
						redirectUrl += parsedUrl.hash;
					}

					response.writeHead(301, {
						Location: redirectUrl
					});

					response.end();
					awtsRes.ended = true;
					return false;

				}
                
				this.isDirectoryWithIndex = true;
				this.fileName = "index.html";



			} else {
				this.isDirectoryWithoutIndex = true;
				this
					.dependencies
					.awtsRes
					.ended = false;

			}
		} else if (st) {

			this.isRealFile = true;
			this.dependencies.awtsRes.ended = false;

		}
	} catch (err) {
        
		doesNotExist = true;
		if (err.code != "ENOENT")
			console.log("Issue?", err)
		// stat call failed, file or directory does not exist
	}

	this.dependencies.awtsRes.ended = false;
	var isReal = (
		!doesNotExist
	);
    
	var isDynamic = !isReal 
        || this.isDirectoryWithoutIndex;
	if (isDynamic) {

		this.foundAwtsmooses = await
		awtsRes.getAwtsmoosInfo(
            this.filePath,
            this.parentPath
        );
        
	}
    
    
	this.logs.lol = { filePath: this.filePath, fa: this.foundAwtsmooses, isDynamic }



	return (
		!!this.foundAwtsmooses.length ||
		isReal
	);

}

async function doEverything() {

	var {
		fs,

		awtsRes,
		response,
		originalPath,
		parsedUrl,
		request,
		getPostData,
		getPutData,
		getDeleteData
	} = this.dependencies;



	var iExist = await (getPathInfo.bind(this))();
	

	if (!iExist) {


		if (this
			.fileName.startsWith("@")) {
			var tr = "/@/" + this
				.fileName.substring(1)


			var res = await this.fetchAwtsmoos(
				tr, {
					superSecret: true
				}
			)
			
			if(res) {
				if(typeof(res) == "object") {
					res = JSON.stringify(res);
					response.setHeader("content-type",
						"application/json; charset=utf-8"
					)
				}
				response.end(res);
			}
			else return errorMessage.bind(this)({
				message: "Content empty",
				code: "EMPTY"
			})
			return;
		}

		


        try {
			return errorMessage.bind(this)({
				message: "Dynamic route not found",
				code: "DYN_ROUTE_NOT_FOUND",
				info: {
					filePath: this.filePath
				},
				logs: this.logs
			});
		} catch(e) {
			
		}
	}



	if (this.isDirectoryWithIndex) {

		this
			.contentType = "text/html";
	}

	var didThisPathAlready = false;

	if (request.method.toUpperCase() == "POST") {
		await getPostData();
	}

	if (request.method.toUpperCase() == "PUT") {
		await getPutData();
	}

	if (request.method.toUpperCase() == "DELETE") {
		await getDeleteData();
	}

	if (
		this.foundAwtsmooses.length &&
		!this.isDirectoryWithIndex
	) {
		try {

			didThisPathAlready = await
			awtsRes.doAwtsmooses({
				foundAwtsmooses: this.foundAwtsmooses,
				filePath: this.filePath,
				extraInfo: {
					fetchAwtsmoos:this.fetchAwtsmoos
				}
			});
		} catch(e) {
			return {
				BH:
				"yo",
				AwtsmoosError: {
					message: e.message,
					stack: e.stack
				}
			}
		}


	}

	
	if (
		didThisPathAlready === false
	) {
		if (

			this
			.isDirectoryWithIndex ||
			this
			.isRealFile

		) {

			var startsWithAw = this
				.fileName.startsWith("_awtsmoos")
			
			if (
				!startsWithAw ||
				request.superSecret
			) {


				return await doFileResponse.bind(this)();

			} else {
				return errorMessage.bind(this)(
					"You're not allowed to see that!"
				)
			}

		} else {
			return errorMessage.bind(this)({
				message: "Invalid Dynamic Route",
				code: "INVALID_DYNAMIC_ROUTE",
				more: {
					didThisPathAlready,
					foundAwtsmooses: this.foundAwtsmooses,
					idwi:this.isDirectoryWithIndex,
					logs: this.logs

				}

			})

		}

	} else if(didThisPathAlready.error) {
		return errorMessage.bind(this)({
			message: "actual error in route computation!",
			code: "ROUTE_ERROR",
			error:didThisPathAlready.error,
			more: {
				didThisPathAlready,
				logs: this.logs,
				foundAwtsmooses: this.foundAwtsmooses

			}
		})
	}


	if (didThisPathAlready.c) {
		var res = didThisPathAlready
			.responseInfo;

		try {

			if (!res.actualResponse) {
				return errorMessage.bind(this)({
					message: "No actual response",
					code: "NO_AC_RES",
					info: res,
					details: didThisPathAlready
				})
			}
			if (res.actualResponse
				.contentType) {
				response.setHeader(
					"content-type",
					res.actualResponse
					.contentType+"; charset=utf-8"
				);
			} else {
				response.setHeader(
					"content-type",
					"text/html; charset=utf-8"
				);
			}

			
			var con = res.actualResponse.content;
			if (con) {
				if(typeof(con) == "object") {
					//con = JSON.stringify(con)
				} else if (typeof(con) != "string") {
					con += ""
				}
			//	console.log("HI",con)
		//	console.log("Doing resp awts",response.getHeaders())
				response.end(
					con
				)
			} else {

				return errorMessage.bind(this)({
					message: "No Awtsmoos Response",
					code: "NO_AWTS_RESP"
				});
			}
		} catch (e) {
			console.log("Problem", e)
		}
		return;
	} else if (didThisPathAlready.invalidRoute) {
		return errorMessage.bind(this)({
			message: "Invalid Route",
			code: "INVALID_ROUTE",
			more: {
				didThisPathAlready,
				logs: this.logs,
				foundAwtsmooses: this.foundAwtsmooses

			}
		})
	} else if (didThisPathAlready.isPrivate) {
		return errorMessage.bind(this)({
			message: "That's a private route",
			code: "PRIVATE_ROUTE"
		})
	} else {
		return errorMessage.bind(this)({
			message: "Did not find route",
			code: "NOT_FOUND"
		})
	}

}




async function doFileResponse() {
	var {
		fs,
		request,
		response,
		template,
		binaryMimeTypes,
		fetchAwtsmoos
	} = this.dependencies;
	
	try {
		let content;

		if (binaryMimeTypes.includes(this.contentType)) {
			// If the file is a binary file, read it as binary.
			content = await fs.readFile(this.filePath);
			this.isBinary = true;
		} else {
			// Otherwise, read the file as 'utf-8' text and process it as a template.
			var textContent = await fs.readFile(this.filePath, 'utf-8');
			var ei/*extra info*/ = request.yeser/*extra*/;
			if(!(typeof(ei) == "object" && ei)) {
				ei = {}
				//asdf
			}
			ei.fetchAwtsmoos = fetchAwtsmoos;
			content = await template(textContent, ei);
		}

		// Send the processed content back to the client

		content = setProperContent.bind(this)(
			content,
			this.contentType,
			this.isBinary
		);
	//	console.log("Doing resp",response.getHeaders())
		response.end(content);

		return;
	} catch (errors) {
		// If there was an error, send a 500 response and log the error
		console.error(errors);
		return errorMessage.bind(this)(
			errors
		) 
	}

}



function setProperContent(content, contentType, isBinary = false) {
	var { response } = this.dependencies;

	var cnt = getProperContent(content, contentType, isBinary)


	if (cnt.contentType) {
		try {
			response.setHeader('Content-Type', contentType+"; charset=utf-8");
		} catch(e){}
	}
	return cnt.content;

}


function errorMessage(custom) {
	var {
		response
	} = this.dependencies;
		try {
			try {
				response.setHeader("content-type", "application/json; charset=utf-8");
			} catch(e){}
			try {
				response.end(JSON.stringify({
					BH: "B\"H",
					error: custom || "Not found"
				}));
			} catch(e) {}
		} catch (e) {
			console.log(e)
		}


		return true;
	
}



/**
 * The "Binah", understanding of whether a file exists at the given file path.
 * 
 * @param {string} filePath - The path to the file, our "Malkhut", sovereignty over the file system.
 * @returns {boolean} True if the file exists, false otherwise.
 */
async function exists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
};
module.exports = Ayzarim;
