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
module.exports = ({
    info,
    userid,
    loggedIn,
    verifyAlias,
    getAlias,
    verifyAliasOwnership,

    sp,
	er,
	NO_LOGIN
} = {}) => ({
	/*
	
	get aliases for current user
	*/
	"/user/:user/aliases": async (v) => {
		console.log("loading it");
		if(info.request.method == "GET") {
			const options = {
				page: info.$_GET.page || 1,
				pageSize: info.$_GET.pageSize || 10
			};
			var aliases;
			try {
				aliases = await info
				.db
				.get(
					`/users/${
						v.user
					}/aliases/`,
					options
				);
				console.log("Got them!",aliases)
				return aliases || [];
				
			} catch(e) {
				return [];
			}
		}
		
		if (info.request.method == "POST") {
			var resp = [];
			try {
				resp = await createNewAlias({
					info, er, sp,
					userid
				});
			} catch(e) {
				console.log(e);
				er(e+"")
			}
			console.log("POST",resp)
			return resp;
		}
	},
	"/user/:user/aliases/details": async (v) => {
		return await getAliasesDetails({
			info, sp, userID: v.user,
			er
		});
	},
	"/user/:user/aliases/:alias": async vars => {
		// Getting the aliasId from request, modify this part as per your setup
		const aliasId = vars.alias;
		if (info.request.method == "DELETE") {
			if (!loggedIn()) {
				return er(NO_LOGIN);
			}
			try {
				return await deleteAlias({
					info,
					er,
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
		
		if (info.request.method == "PUT") {
			if (!loggedIn()) {
				return er(NO_LOGIN);
			}
			
			return await updateAlias({
				info,
				verifyAliasOwnership,
				userid,
				sp,
				er,
				aliasId
			});
		}
		
		
		// Existing GET logic
		return await getAlias(aliasId, info);
	},
	"/user/:user/aliases/:alias/details": async(v) => {
		return await getDetailedAlias({
			info,
			aliasId: v.alias,
			userID: v.user
		})
	},
	"/aliases": async () => {
		
		
		if (!loggedIn()) {
			return er(NO_LOGIN);
		}

		if (info.request.method == "GET") {
			
			const options = {
				page: info.$_GET.page || 1,
				pageSize: info.$_GET.pageSize || 10
			};
			var aliases;
			try {
				aliases = await info
				.db
				.get(
					`/users/${userid}/aliases/`,
					options
				);
				
			} catch(e) {
				console.log(e,"Harsh")
			}

			if (!aliases) return [];
			
			return aliases;
		}

		if (info.request.method == "POST") {
			var resp = [];
			try {
				resp = await createNewAlias({
					info, er, sp,
					userid
				});
			} catch(e) {
				console.log(e);
				er(e+"")
			}
			console.log("POST",resp)
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
		console.log("detailed");
		return await getAliasesDetails({
			info, sp, er
		});
	},
	
	"/aliases/:alias/ownership": async vars => {
		
		var owns = await verifyAliasOwnership(
			vars.alias,
			info,
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
	 * @returns info.json of heichel with
	 * @property name
	 * @property description
	 * @property author
	 * 
	 */
	
	"/aliases/:alias": async vars => {
		// Getting the aliasId from request, modify this part as per your setup
		const aliasId = vars.alias;
		if (info.request.method == "DELETE") {
			if (!loggedIn()) {
				return er(NO_LOGIN);
			}
			return await deleteAlias({
				info,
				er,
				verifyAlias,
				userid,
				aliasId,
				sp
			})
		}
		
		if (info.request.method == "PUT") {
			if (!loggedIn()) {
				return er(NO_LOGIN);
			}
			
			return await updateAlias({
				info,
				er,
				sp,
				verifyAliasOwnership,
				userid
			});
		}
		
		
		// Existing GET logic
		return await getAlias(aliasId, info);
	},
	"/aliases/:alias/details": async(v) => {
		return await getDetailedAlias({
			info,
			aliasId: v.alias,
			userID: userid
		})
	},
});

/**
required: aliasName;
optional: 
	description
**/
async function createNewAlias({
	info, er,
	sp,
	userid
}) {
	
	const aliasName = info.$_POST.aliasName;
	const desc = info.$_POST.description;
	
	if (
		!info.utils.verify(
			aliasName, 26
		)
	) {
		return er();
	}
	
	let iteration = 0;
	let unique = false;
	let aliasId;
	
	while (!unique) {
		aliasId = info.utils.generateId(aliasName, false, iteration);
		const existingAlias = await info
		.db.get(`${sp}/aliases/${
			aliasId
		}`);
		
		if (!existingAlias) {
			unique = true;
		} else {
			iteration += 1;
		}
	}
	
	await info.db.write(
		
		`/users/${
		userid
		}/aliases/${
		aliasId
		}`, {
				name: aliasName,
				aliasId,
				...(
					desc?{
						description: desc
					}:null
				)
			}
	);

	await info.db.write(
		sp +
		`/aliases/${
	  aliasId
	}/info`, {
			name: aliasName,
			user: userid
		}
	);
	return { name: aliasName, aliasId };
}

async function getAliasesDetails({
	info,
	sp,
	userID=null,
	aliasId,
	er
	
}) {
	
	if (info.request.method == "POST") {
		const aliasIds = info.$_POST.aliasIds;
		/**
		 * formatted:
		 * aliasIds: [
		 *  
		 *    aliasIds (String)
		 * 
		 * ]
		 */
		if (!aliasIds || !Array.isArray(aliasIds)) {
			return er("Invalid input");
		}

		console.log("detailing");
		
		const details = await Promise.all(
			aliasIds.map(id => ((async (aliasId) => {
				var detailedAlias = await 
				getDetailedAlias({
					aliasId,
					info,
					userID
				});
				return detailedAlias;
				
			}))(id))
		);
		
		return details;
	} else if(info.request.method == "GET") {
		
	}
	
	
}

async function getDetailedAlias({
	aliasId,
	info,
	userID
}) {
	var user = userID;
	console.log("hi threer",user);
	if(!userID) {
		var value = await info
			.db
			.get(
				
				`${sp}/aliases/${
					aliasId
				}/info`
			);
		if(!value) {
			return null
		}

		user = value.user;
	}
	if(!user) {
		return er("Couldn't find alias")
	}
	console.log("usr",user)
	var detailedAlias = await info
		.db
		.get(`/users/${
			user
		}/aliases/${
			aliasId
		}`);
	console.log("Ayl",detailedAlias);
	if(!detailedAlias.description) {
		detailedAlias.description = ""
	}
	
	console.log("Getting!",detailedAlias)
	 return detailedAlias;
}

async function deleteAlias({
	info,
	sp,
	er,
	aliasId,
	verifyAlias,
	userid
}) {
	
	
	
	
	if (!aliasId) {
		return er("No alias ID provided");
	}
	
	var ver = await verifyAlias(aliasId, info);
	if (!ver) {
		return er("Not your alias");
	}
	
	try {
		// Delete alias from user's aliases
		await info.db.delete(`/users/${userid}/aliases/${aliasId}`);
		
		// Delete alias info
		await info.db.delete(sp + `/aliases/${aliasId}/`, true);
		
		// Get all heichelos associated with the alias
		const heichelos = await info
			.db.get(sp + `/aliases/${aliasId}/heichelos`);
		
		if (heichelos) {
			for (const heichelId in heichelos) {
				// Delete all heichelos data
				await info.db.delete(sp + `/aliases/${aliasId}/heichelos/${heichelId}`);
				await info.db.delete(sp + `/heichelos/${heichelId}`, true);
			}
		}
		
		return {
			message: "Alias and associated data deleted successfully",
			code: "DEL_DONE"
		};
	} catch (error) {
		console.error('Error deleting alias and associated data:', error);
		return er({error:"Error deleting alias and associated data", code: "DEL_ER"});
	}
}

async function updateAlias({
	info,
	sp,
	userid,
	verifyAliasOwnership,
	er
}) {
	const aliasId = info.$_PUT.aliasId;
	const newAliasName = info.$_PUT.newAliasName ||
		info.$_PUT.aliasName || 
		info.$_PUT.name;
	const desc = info.$_PUT.description || 
		info.$_PUT.newDescription;
	
	if (!aliasId) {
		return er("Alias ID or new alias name not provided");
	}
	
	var isVerified = await verifyAliasOwnership(
		aliasId,
		info,
		userid
	);
	
	if (!isVerified) {
		return er("You don't have permission to modify this alias.");
	}
	
	if(newAliasName) {
		if (!info.utils.verify(newAliasName, 26)) {
			return er("Invalid new alias name");
		}
	}
	
	if(
		desc
	) {
		if(
			desc.length > 5784
		) {
			return er({
				message: "Too long description",
				code: "DESC_TOO_LONG"
			})
		}
	}
	
	try {
		// Fetch the existing alias data
		const aliasData = await info.db.get(sp + `/aliases/${aliasId}/info`);
		
		if (!aliasData) {
			return er("Alias not found");
		}
		
		if(newAliasName)
			// Update the alias name in the existing data
			aliasData.name = newAliasName;
		
		// Write the updated data back to the database
		await info.db.write(sp + `/aliases/${aliasId}/info`, aliasData);
		
		var aliasUserData = {aliasId};
		if(newAliasName) {
			aliasUserData.name = newAliasName;
		}
		if(desc) {
			aliasUserData.description = desc;
		}
			
			console.log("Updating user alias",aliasUserData,newAliasName);
		// Also update the alias name in user's aliases list
		await info.db.write(
			`/users/${userid}/aliases/${aliasId}`, 
			aliasUserData
		);
		
		
		
		return { message: "Alias edited successfully", newAliasName, code:"ALIAS_EDIT_GOOD" };
	} catch (error) {
		console.log(error)
		return er("Failed to edit alias");
	}
}
