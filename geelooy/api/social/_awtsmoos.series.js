/*
  B"H
  Series
*/
var {
  getSeries,
  getSubSeries,
  deleteContentFromSeries,
  deleteSeriesFromHeichel,
  getSeriesByProperty,
  getSubSeriesInHeichel,
getPostsInHeichel,
	changeSubSeriesFromOneSeriesToAnother,
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
	//getSeriesByProperty

	"/heichelos/:heichel/series/:series/filterPostsBy/:propKey/:propVal": async v => {
		
		var pv = v.propVal;
		var pk = v.propKey;
		try {
			pv = decodeURIComponent(pv)
		} catch(e){

		}
		try {
			pk = decodeURIComponent(pk)
		} catch(e){

		}
		
		return await getPostByProperty({
			heichelId: v.heichel,
			parentSeriesId: v.series,
			$i,
			propertyKey: pk,
			propertyValue: pv
		})
	},

	"/heichelos/:heichel/series/:series/filterSeriesBy/:propKey/:propVal": async v => {
		
		var pv = v.propVal;
		var pk = v.propKey;
		try {
			pv = decodeURIComponent(pv)
		} catch(e){

		}
		try {
			pk = decodeURIComponent(pk)
		} catch(e){

		}
		
		return await getSeriesByProperty({
			heichelId: v.heichel,
			parentSeriesId: v.series,
			$i,
			propertyKey: pk,
			propertyValue: pv
		})
	},
	
	"/heichelos/:heichel/series/:series/series": async v => {
		if($i.request.method == "GET") {
			return await getSubSeries({
				$i,

				withDetails:false,
				parentSeriesId: v.series,
				
				heichelId: v.heichel,er
				
			});
		} 

	},
	"/heichelos/:heichel/series/:series/subSeries/": async v => {
		if($i.request.method == "GET") {
			return await getSubSeries({
				$i,

				withDetails:false,
				parentSeriesId: v.series,
				
				heichelId: v.heichel,er
				
			});
		} 

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
						name: true,
						description:256

					},
					
					userid,
					
				}))
			);
			return details;

		}

	},

	"/heichelos/:heichel/series/:series/parent": async v => {
		if($i.request.method == "GET") {
			var res = await getSeries({
				$i,


				seriesId: v.series,
				userid,
				properties: {
					parentSeriesId:true

				},
				heichelId: v.heichel,
				er
				
			});
			if(res.prateem.parentSeriesId) {
				var ser = await getSeries({
					heichelId:v.heichel,
					seriesId:  res.prateem.parentSeriesId,
					
					$i,
					
					userid,
					
				})
				return ser;
			}
			
			return res;
		} 

	

	},
	"/heichelos/:heichel/series/:series/breadcrumb": async v => {
		if($i.request.method == "GET") {
			try {
				var crumb = []
				var curID = v.series;
				var curParent = {id:curID}
				var start = Date.now();
				async function getBreadcrumb() {
					var res = await getSeries({
						$i,
		
		
						seriesId: curID,
						userid,
						properties: {
							parentSeriesId:2560
		
						},
						heichelId: v.heichel,
						er
						
					});
					var parentSeriesId = res?.prateem?.parentSeriesId;
					if(!parentSeriesId) parentSeriesId = "root"
					
					curParent = await getSeries({
						heichelId:v.heichel,
						seriesId:  parentSeriesId,
						properties: {
							parentSeriesId:true,
							name: true,
							id: true
							
		
						},
						$i,
						
						
						userid,
						
					})
					curID = curParent.id;
					crumb.push({...curParent,hi:Date.now()})
				
				}
				if(curParent.id != "root") 
					while(
						curParent && curParent.id != "root" && curParent.id && Date.now() - start < 5 * 1000
					) {
						await getBreadcrumb();
					}
				else {
					await getBreadcrumb();	
				}
				
				
				return crumb;
			} catch(e) {
				return er({
					code: "BREADCRUMB_ISSUE",
					details:e+""
				})
			}
		} 

	

	},
	//var heichelos = await $i.fetchAwtsmoos(route);

	"/heichelos/:heichel/series/:series/posts": async v => {
		if($i.request.method == "GET") {
			$i.$_GET.seriesId = v.series;
			var withDetails = $i.$_GET.details;
			if(!withDetails) {
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
			} else {
				$i.seriesId = v.series;
				return await getPostsInHeichel({
					$i,
					withDetails: true,
					
					
					heichelId: v.heichel
				});	
			}
		}
	},
	"/heichelos/:heichel/series/:series/posts/details": async v => {
		try {
			if($i.request.method == "GET") {
				$i.$_GET.seriesId = v.series;
	
				return await getPostsInHeichel({
					$i,
					withDetails: true,
					seriesId:v.series,
					
					heichelId: v.heichel
				});		
				
			}
		} catch(e) {
			return er({details: e.stack})
		}
	},
	"/heichelos/:heichel/series/:series/subSeries/details": async v => {
		if($i.request.method == "GET") {
			return await getSubSeries({
				$i,

				withDetails:true,
				parentSeriesId: v.series,
				
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
		expects new $_POST.postIDs list of new IDs 
  		to be in that series (to change order / edit)
 	**/
	"/heichelos/:heichel/series/:series/changePostsInSeries": async (v) => {
		return editPostsInSeries({
			$i,
			userid,
			heichelId: v.heichel,
			seriesId:v.series
			
			

		})

	},

	"/heichelos/:heichel/series/:series/changeSubSeriesInSeries": async (v) => {
		return editSubSeriesInSeries({
			$i,
			userid,
			heichelId: v.heichel,
			seriesId:v.series
			
			

		})

	},
	"/heichelos/:heichel/series/:series/changeSubSeriesFromOneSeriesToAnother/:toSeries": async (v) => {
		
		return changeSubSeriesFromOneSeriesToAnother({
			$i,
			userid,
			heichelId: v.heichel,
			seriesFromId:v.series,
			seriesToId: v.toSeries
			
			

		})

	},
	//changeSubSeriesFromOneSeriesToAnother
	
	//editPostsInSeries
	//editSubSeriesInSeries
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
})
