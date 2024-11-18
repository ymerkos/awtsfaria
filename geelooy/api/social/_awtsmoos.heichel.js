/**B"H
Heichelos
**/

var {
	detailedPostOperation,

	createHeichel,
	getHeichel,
	getHeichelos,
	getPostsInHeichel,
	generateHeichelId,
	getPostByProperty,
	addHeichelEditor,
	removeHeichelEditor,
	getHeichelEditors,
	getSeries,
	getSubSeries,
	deleteContentFromSeries,
	deleteSeriesFromHeichel,
	getSeriesByProperty,
	getSubSeriesInHeichel,
	editSeriesDetails,
	makeNewSeries,
	addContentToSeries,
	deleteHeichel,
	addPostToHeichel,
	updateHeichel,
	er,
	getHeichelEditors,
	verifyHeichelAuthority,
	editPostsInSeries,
	editSubSeriesInSeries
} = require("./helper/index.js");

var {
	
	sp
} =  require("./helper/_awtsmoos.constants.js");

module.exports = ({
	$i,
	userid,
} = {}) => ({
	
	"/heichelos/:heichel/editors": async vars => {
		if($i.request.method == "GET") {
			return await getHeichelEditors({
				$i,

				heichelId: vars.heichel
			})
		} else if($i.request.method == "POST") {
			return await addHeichelEditor({
				$i,
				heichelId: vars.heichel
			})
		} else if($i.request.method == "DELETE") {
			return await removeHeichelEditor({
				$i,
				heichelId: vars.heichel
			})
		}
	},
	"/heichelos/:heichel": async vars => {
		if ($i.request.method == "DELETE") {
			return await deleteHeichel({
				$i,
				
				heichelId,
				aliasId,
				
				er
			});
		}

		if ($i.request.method == "PUT") {
			return await deleteHeichel({
				
				$i,
				sp
			})
		}

		// Existing GET logic
		return await getHeichel({
			heichelId: vars.heichel,
			
			$i,
			
			er
		});
	},
	/**
	 * heichelos Endpoints - The Palaces of Wisdom
	 * by default just
	 * gets the heichelos  of given alias, so 
	 * same as search heichels by alias..
	 */
	"/alias/:alias/heichelos": async (v) => {

		if ($i.request.method == "GET") {
			var route = `/api/social/heichelos/searchByAliasOwner/${
				v.alias
			}`
			var heichelos = await $i.fetchAwtsmoos(route);

			return heichelos.map(w => w.id);
		}

		if ($i.request.method == "POST") {
			try {
				return await createHeichel({
					$i,
					sp,
					er,
					
					//
					aliasId: v.alias
				}) 
			} catch(e) {
				return er({
					code: "CREATE_PROBLEM",
					details:e+""
				})
			}
		}
	},

	/**
	 * @endpoint /heichelos/details
	 * returned the details of a 
	 * lot of heichelos.
	 * @returns 
	 */

	"/alias/:alias/heichelos/details": async (v) => {
		if ($i.request.method == "POST") {
			var heichelIds = $i.$_POST.heichelIds;
			/**
			 * formatted:
			 * heichelIds: [
			 *  
			 *    heichelId (String)
			 * 
			 * ]
			 */
			if (!heichelIds || !Array.isArray(heichelIds)) {
				return er("Invalid input");
			}


			var results = [];
			for (var i = 0; i < heichelIds.length; i++) {
				var details = await getHeichel({
					heichelId: heichelIds[i],
					$i,
					

					
					er
				});
				console.log("Hi awd ", details, heichelIds, i)
				if (!details) continue;
				details.id = heichelIds[i]

				results.push(details)

			}
			return results;

			return details;
		}
		if ($i.request.method == "GET") {
			var route = `/api/social/heichelos/searchByAliasOwner/${
			v.alias
		}`
			var heichelos = await $i.fetchAwtsmoos(route);
			return heichelos
		}
	},


	/**
	 * 
	 * @param {Object} vars 
	 * @returns $i.json of heichel with
	 * @property name
	 * @property description
	 * @property author
	 * 
	 */

	"/alias/:alias/heichelos/:heichel": async vars => {
		var heichelId = vars.heichel;
		var aliasId = vars.alias;
		if ($i.request.method == "DELETE") {
			return await deleteHeichel({
				$i,
				
				heichelId,
				aliasId,
				
				er
			});
		}

		if ($i.request.method == "PUT") {
			
			return await updateHeichel({
				vars,
				$i
			})
		}

		// Existing GET logic
		return await getHeichel({
			heichelId: vars.heichel,
			
			$i,
			
			er
		});
	},

	

	
	

	

	"/heichelos/searchByAliasOwner/:aliasId": async (v) => {
		if ($i.request.method == "GET") {
			var heichelos = await getHeichelos({
				$i,
				aliasId:v.aliasId
			});
			var results = [];
			for (var i = 0; i < heichelos.length; i++) {
				var details = await getHeichel({
					heichelId: heichelos[i],
					$i,
					

					
					er
				});
				if(!details) {
					continue
				}
				details.id = heichelos[i]
				if (details.author == v.aliasId) {
					results.push(details)
				}
			}
			return results;
		}
	},
	

	/**
	 * @endpoint get heichel editors
	 * @param {Object} vars 
	 * @returns $i.json of heichel with
	 * @property name
	 * @property description
	 * @property author
	 * 
	 */
/*
	"/heichelos/:heichel/editors": async vars => {
	
		// Existing GET logic
		return await getHeichelEditors({
			heichelId: vars.heichel,
			$i
		});
	},*/


	
	
	/**
        seriesName required 
		description optional
		seriesId optional
			the desired seriesId
			if already exists returns error.
			
        aliasId required

        **/
	

	


	

	"/alias/:alias/heichelos/:heichel/ownership": async vars => {
		try {
			var heichelId = vars.heichel;
			var owns = await verifyHeichelAuthority({
				heichelId,
				aliasId: vars.alias,
				$i,
				sp

			})

			if (owns) {
				return {
					yes: "You have permission to post to this heichel!",
					code: "YES"
				}
			} else {
				return {
					no: "You don't have permission to post to this heichel!",
					code: "NO"
				}
			}
		} catch(e) {
			return "OLP" + e
		}
	},
});
