/**
 * B"H
 * The Alias routes for the 
 * Awtsmoos Social network.
 
 @endpoint alias
 {
	 aliasId,
	 name,
	 description,
	 properties {
		 dynamic list of 
		 other
		 properties like
		 profile pic URL 
		 and other things
	 }
 }
 */
 var {
	NO_LOGIN,
	sp
  
  } = require("./helper/_awtsmoos.constants.js");
  
var {
	loggedIn,
	er
} = require("./helper/general.js");

var {
	getAlias,
	verifyAlias,
	deleteAlias,
	
	verifyAliasOwnership,
	getDetailedAlias,
	getAliasesDetails,

    createNewAlias,
	getAliasIDs,
	updateAlias,
	
	generateAliasId,
	getDefaultAlias,
	setDefaultAlias
} = require("./helper/alias.js");

module.exports = ({
    $i,
    userid,
} = {}) => ({
	"/alias/default": async v => {
		if($i.request.method == "GET") {
			return await getDefaultAlias({
				$i,
				userid

			})
		}
		if ($i.request.method == "POST") {
			
			return await setDefaultAlias({
				$i,
				userid

			})
		}
		return "What is it?"
	},
	/*
	
	get aliases for current user
	*/
	"/user/:user/aliases": async (v) => {
		
		if($i.request.method == "GET") {
			return await getAliasIDs({
				$i,
				userID:v.user

			})
		}
		
		if ($i.request.method == "POST") {
			var resp = [];
			try {
				resp = await createNewAlias({
					$i,  
					userid
				});
			} catch(e) {
				console.log(e);
				er(e+"")
			}
			
			return resp;
		}
	},
	"/user/:user/aliases/details": async (v) => {
		return await getAliasesDetails({
			$i, sp, userID: v.us
		
		});
	},
	"/user/:user/aliases/:alias": async vars => {
		// Getting the aliasId from request, modify this part as per your setup
		var aliasId = vars.alias;
		if ($i.request.method == "DELETE") {
			if (!loggedIn($i)) {
				return er(NO_LOGIN);
			}
			try {
				return await deleteAlias({
					$i,
					
					userid,
					sp,
					verifyAlias,
					aliasId
				});
			} catch(e) {
				console.log(e)
				return er({
					message: "Couldn't delete",
					code: "NO_DEL"
				})
			}
		}
		
		if ($i.request.method == "PUT") {
			if (!loggedIn($i)) {
				return er(NO_LOGIN);
			}
			
			return await updateAlias({
				$i,
				userid,
				aliasId
			});
		}
		
		
		// Existing GET logic
		return await getAlias(aliasId, $i);
	},
	"/user/:user/aliases/:alias/details": async(v) => {
		return await getDetailedAlias({
			$i,
			aliasId: v.alias,
			userID: v.user,
			sp
		})
	},
	/**
	 * 
	 * Use @method POST with 
	 * inputId to check and/or aliasName to generate new
	 * 
	 * @returns error if id already taken OR
	 * inputId (or generated id from aliasName)
	 * if available
	 */
	"/aliases/checkOrGenerateId": async () => {
		
		
		if (!loggedIn($i)) {
			return er(NO_LOGIN);
		}

		if ($i.request.method == "POST") {
			
			try {
				var resp = await generateAliasId({
					$i,  sp,
					userid
				});
				return resp;
			} catch(e) {
				er({
					error: e+"",
					code: "500 INTERNAL"
				})
			}
		} else {
			return {
				message: "Use POST with inputId to check and/or aliasName to generate new"
			}
		}
	},
	/**
	 * 
	 * @returns list of alias IDs if GET
	 * can use get params: page and page size
	 * 
	 * if @method POST then creates new
	 * alias.
	 * 
	 * need an aliasName
	 * optional description
	 * optional inputId -- request to make
	 * that the new ID instead of generating it from
	 * aliasName
	 * 
	 * returns {error:, code:} if problem, or
	 * if succesfuly returns { name: aliasName, aliasId };
	 */
	"/aliases": async () => {
		
		
		if (!loggedIn($i)) {
			return er(NO_LOGIN);
		}

		if ($i.request.method == "GET") {
			
			return await getAliasIDs({
				$i,
				userID:userid

			})
		}

		if ($i.request.method == "POST") {
			var resp = [];
			try {
				resp = await createNewAlias({
					$i,  sp,
					userid
				});
			} catch(e) {
				console.log(e);
				er(e+"")
			}
			

			return resp;
		}
	},
	
	
	
	/**
	 * @endpoint /aliases/details
	 * returned the details of a 
	 * lot of aliases.
	 * @returns 
	 */
	
	"/aliases/details": async () => {
		
		if (!loggedIn($i)) {
			return er(NO_LOGIN);
		}
		return await getAliasesDetails({
			$i, sp, 
			userID:userid
		});
	},
	
	"/aliases/:alias/ownership": async vars => {
		
		var owns = await verifyAliasOwnership(
			vars.alias,
			$i,
			userid
		)
		
		if(owns) {
			return {yes: "You own this!", code: "YES"}
		} else {
			return {no: "You don't own it!", code: "NO"}
		}
	},
	/**
	 * @endpoint aliases/:alias
	 * @description gets details of, updates or 
	 * deletes an alias.
	 * @param {Object} vars 
	 * @returns $i.json of heichel with
	 * @property name
	 * @property description
	 * @property author
	 * 
	 */
	
	"/aliases/:alias": async vars => {
		
		// Getting the aliasId from request, modify this part as per your setup
		var aliasId = vars.alias;
		if ($i.request.method == "DELETE") {
			if (!loggedIn($i)) {
				return er(NO_LOGIN);
			}
			return await deleteAlias({
				$i,
				
				userid,
				aliasId,
				
			})
		}
		
		if ($i.request.method == "PUT") {
			if (!loggedIn($i)) {
				return er(NO_LOGIN);
			}
			
			return await updateAlias({
				$i,
				
				verifyAliasOwnership,
				userid
			});
		}
		
		
		// Existing GET logic
		
		return await getAlias(aliasId, $i);
	},
	"/aliases/:alias/details": async(v) => {
		
		var da = await getDetailedAlias({
			$i,
			aliasId: v.alias,
			userID: null
		});
	//	console.log("HI",v,da);
		return da || er({code: "PROBLEM_WITH_ALIAS"});
	},
});
