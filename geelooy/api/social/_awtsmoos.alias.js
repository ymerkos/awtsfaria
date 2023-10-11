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
    sp
} = {}) => ({
	"/aliases": async () => {
		if (!loggedIn()) {
			return er(NO_LOGIN);
		}
		if (info.request.method == "GET") {
			const options = {
				page: info.$_GET.page || 1,
				pageSize: info.$_GET.pageSize || 10
			};
			const aliases = await info
				.db
				.get(
					`${sp}/aliases/`
				);
			if (!aliases) return [];
			
			return aliases;
		}
		if (info.request.method == "POST") {
			
			const aliasName = info.$_POST.aliasName;
			
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
	},
	
	
	
	/**
	 * @endpoint /aliases/details
	 * returned the details of a 
	 * lot of aliases.
	 * @returns 
	 */
	
	"/aliases/details": async () => {
		
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
					var value = await info
						.db
						.get(
							
							`${sp}/aliases/${
                                aliasId
                            }`
						);
					
					 return value;
					
				}))(id))
			);
			
			return details;
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
				
				// Get all heichels associated with the alias
				const heichels = await info.db.get(sp + `/aliases/${aliasId}/heichels`);
				
				if (heichels) {
					for (const heichelId in heichels) {
						// Delete all heichels data
						await info.db.delete(sp + `/aliases/${aliasId}/heichels/${heichelId}`);
						await info.db.delete(sp + `/heichels/${heichelId}`);
					}
				}
				
				return { message: "Alias and associated data deleted successfully" };
			} catch (error) {
				console.error('Error deleting alias and associated data:', error);
				return er("Error deleting alias and associated data");
			}
		}
		
		if (info.request.method == "PUT") {
			if (!loggedIn()) {
				return er(NO_LOGIN);
			}
			
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
		
		
		// Existing GET logic
		return await getAlias(aliasId, info);
	},
});