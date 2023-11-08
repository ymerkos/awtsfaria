/**
 * B"H
 * The Alias routes for the 
 * Awtsmoos Social network.
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
		return await getAliasDetails({
			info, sp, userID: v.user
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
				sp,
				er,
				aliasId
			});
		}
		
		
		// Existing GET logic
		return await getAlias(aliasId, info);
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
					`${sp}/aliases/`,
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
		return await getAliasDetails({
			info, sp
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
				userid,
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
				sp
			});
		}
		
		
		// Existing GET logic
		return await getAlias(aliasId, info);
	},
});


async function createNewAlias({
	info, er,
	sp,
	userid
}) {
	
	const aliasName = info.$_POST.aliasName;
	console.log("Tryig a",aliasName)
	if (
		!info.utils.verify(
			aliasName, 26
		)
	) {
		return er();
	}
	console.log("Made it",aliasName);
	
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
				aliasId
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

async function getAliasDetails({
	info,
	sp,
	userID=null
	
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
		
		const details = await Promise.all(
			aliasIds.map(id => ((async (aliasId) => {
				var user = userID;
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
				var detailedAlias = await info
					.db
					.get(`/users/${
						user
					}/aliases/${
						aliasId
					}`)
				
				 return detailedAlias;
				
			}))(id))
		);
		
		return details;
	}
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
		await info.db.delete(sp + `/aliases/${aliasId}/info`);
		
		// Get all heichelos associated with the alias
		const heichelos = await info
			.db.get(sp + `/aliases/${aliasId}/heichelos`);
		
		if (heichelos) {
			for (const heichelId in heichelos) {
				// Delete all heichelos data
				await info.db.delete(sp + `/aliases/${aliasId}/heichelos/${heichelId}`);
				await info.db.delete(sp + `/heichelos/${heichelId}`);
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
	er
}) {
	const aliasId = info.$_PUT.aliasId;
	const newAliasName = info.$_PUT.newAliasName ||
		info.$_PUT.aliasName;
	
	
	if (!aliasId || !newAliasName) {
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
	
	if (!info.utils.verify(newAliasName, 26)) {
		return er("Invalid new alias name");
	}
	
	try {
		// Fetch the existing alias data
		const aliasData = await info.db.get(sp + `/aliases/${aliasId}/info`);
		
		if (!aliasData) {
			return er("Alias not found");
		}
		
		// Update the alias name in the existing data
		aliasData.name = newAliasName;
		
		// Write the updated data back to the database
		await info.db.write(sp + `/aliases/${aliasId}/info`, aliasData);
		
		// Also update the alias name in user's aliases list
		await info.db.write(
			`/users/${userid}/aliases/${aliasId}`, { name: newAliasName, aliasId }
		);
		
		
		
		return { message: "Alias renamed successfully", newAliasName };
	} catch (error) {
		console.error("Failed to rename alias", error);
		return er("Failed to rename alias");
	}
}