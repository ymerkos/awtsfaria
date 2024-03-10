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
	getSeries,
	
	deleteContentFromSeries,
	deleteSeriesFromHeichel,
	getSubSeriesInHeichel,
	editSeriesDetails,
	makeNewSeries,
	addContentToSeries,
	deleteHeichel,
	addPostToHeichel,
	er
} = require("./helper/index.js");

var {
	
	sp
} =  require("./helper/_awtsmoos.constants.js");

module.exports = ({
	$i,
	userid,
} = {}) => ({
	/**
	 * 
	 * Use @method POST with 
	 * inputId to check and/or aliasName to generate new
	 * 
	 * @returns error if id already taken OR
	 * inputId (or generated id from aliasName)
	 * if available
	 */
	"/heichelos/checkOrGenerateId": async () => {
		
		
		if (!loggedIn($i)) {
			return er(NO_LOGIN);
		}

		if ($i.request.method == "POST") {
			
			try {
				var resp = await generateHeichelId({
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
				message: "Use POST with inputId to check and/or heichelName to generate new"
			}
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

	
	

	

	"/heichelos/searchByAliasOwner/:aliasId": async (v) => {
		if ($i.request.method == "GET") {
			var heichelos = await getHeichelos({
				$i,
				sp
			});
			var results = [];
			for (var i = 0; i < heichelos.length; i++) {
				var details = await getHeichel({
					heichelId: heichelos[i],
					$i,
					

					
					er
				});
				details.id = heichelos[i]
				if (details.author == v.aliasId) {
					results.push(details)
				}
			}
			return results;
		}
	},
	/**
	 * Posts Endpoints - The Chronicles of Existence
	 */
	"/heichelos/:heichel/posts": async (v) => {


		if ($i.request.method == "GET") {
			return await getPostsInHeichel({
				$i,
				
				heichelId: v.heichel
			})
		}

		if ($i.request.method == "POST") {
			return await addPostToHeichel({
				heichelId:v.heichel,
				
				
				
				
				$i
			});
		}
	},


	/**
	 * @endpoint /posts/details
	 * returned the details of a 
	 * lot of posts.
	 * @returns 
	 */

	"/heichelos/:heichel/posts/details": async (v) => {
		var heichelId = v.heichel;
		

		
			return await getPostsInHeichel({
				$i,
				withDetails: true,
				properties:{
					content: 256

				},
				
				heichelId: v.heichel
			});
			
		
	},

	/**
	 * 
	 * @endpoint /posts/:post
	 * @description gets details of 
	 * one post
	 * 
	 * OR if method is PUT edits post
	 * OR if method is DELETE deletes it
	 * 
	 * required params (dep. on method):
	 * postID
	 * 
	 * for edit:
	 * newTitle || title
	 * newContent || content
	 * @returns 
	 */
	"/heichelos/:heichel/post/:post": async (v) => {
		return await detailedPostOperation({
			
			userid,
			postID: v.post,
			heichelId: v.heichel,
			$i
			
			
			
		})
	},
	/**
	 * 
	 * similar as above but just for delete simpler
	 */
	"/heichelos/:heichel/post/:post/delete": async(v) => {

	},
	
	/**
        seriesName required 
		description optional
		seriesId optional
			the desired seriesId
			if already exists returns error.
			
        aliasId required

        **/
	"/heichelos/:heichel/addNewSeries": async (v) => {
		return makeNewSeries({
			$i,
			userid,
			
			heichelId: v.heichel
			

		})

	},
	
	"/heichelos/:heichel/series/": async v => {
		var sr = await getSubSeriesInHeichel({
			$i,


			seriesId: "root",
			withDetails:true,
			userid,
			heichelId: v.heichel,
			er
		});
		
		return sr;

	},
	
	"/heichelos/:heichel/series/:series": async v => {
		return await getSeries({
			$i,


			seriesId: v.series,
			
			userid,
			heichelId: v.heichel,
			er
		})

	},
	
	"/heichelos/:heichel/series/:series/details": async v => {
		if($i.request.method == "GET") {
		return await getSeries({
			$i,


			seriesId: v.series,
			withDetails: true,
			userid,
			heichelId: v.heichel,er
			
		})
		} 

		if($i.request.method=="POST") {
			var is=$i.$_POST.seriesIds;
			if(!is || !Array.isArray(is)) {
				return er({
					code:"NO_IDs"

				});

			}

			var details = await Promise.all(
				is.map(id => getSeries({
					heichelId:v.heichel,
					seriesId: id,
					withDetails:true,
					
					$i,
					properties: {
						description:256

					},
					
					userid,
					
				}))
			);
			return details;

		}

	},

	"/heichelos/:heichel/series/:series/posts": async v => {
		if($i.request.method == "GET") {
			var details = await getSeries({
				$i,


				seriesId: v.series,
				withDetails: true,
				userid,
				heichelId: v.heichel,er
				
			});
			if(details.posts) {
				return details.posts
			} else return [];
		}
	},
	"/heichelos/:heichel/series/:series/series": async v => {
		if($i.request.method == "GET") {
			var details = await getSeries({
				$i,


				seriesId: v.series,
				withDetails: true,
				userid,
				heichelId: v.heichel,er
				
			});
			if(details.subSeries) {
				return details.subSeries
			} else return [];
		}
	},
	/**
 POST
       contentId required
       seriesId required
       aliasId required
       contentType required either "post" or "series"
 

        **/
	"/heichelos/:heichel/addContentToSeries": async (v) => {
		return addContentToSeries({
			$i,
			userid,
			heichelId: v.heichel
			
			

		})

	},


	/**
 POST
       contentId required
       seriesId required
       aliasId required
       contentType required either "post" or "series"
       contentId optional,  but if not provided then need:
       indexInSeries optional (
          but if not there need
			contentId. index.. deletes
		the content in that index number while
		contentId searches for that id
		and deletes first occurrence

       )

	   deleteOriginal optional default false
		besides for removing
		content from series, also deltes it itself.
 

        **/
	"/heichelos/:heichel/deleteContentFromSeries": async (v) => {
		return deleteContentFromSeries({
			$i,
			userid,
			heichelId: v.heichel,
			
			sp

		})

	},

	/**
 edits details of series itself
 POST
       aliasId required
       seriesId required
       description optional
       name optional

        **/
	"/heichelos/:heichel/series/:series/editSeriesDetails": async (v) => {
		return editSeriesDetails({
			$i,
			userid,
			heichelId: v.heichel,
			seriesId:v.series
			
			

		})

	},

	/**
 POST
       aliasId required
       seriesId required
       

        **/
	"/heichelos/:heichel/deleteSeriesFromHeichel/:seriesId": async (v) => {
		return deleteSeriesFromHeichel({
			$i,
			userid,
			heichelId: v.heichel,
			seriesId:v.seriesId

		})

	},

	




	"/alias/:alias/heichelos/:heichel/ownership": async vars => {
		var heichelId = vars.heichel;
		var owns = await verifyHeichelAuthority({
			heichelId,
			aliasId: vars.alias,
			$i,
			sp

		})

		if (owns) {
			return {
				yes: "You own this!",
				code: "YES"
			}
		} else {
			return {
				no: "You don't own it!",
				code: "NO"
			}
		}
	},
});
