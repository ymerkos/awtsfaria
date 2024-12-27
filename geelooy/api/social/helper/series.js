/**
 * B"H
 */




module.exports = {
	changeSubSeriesFromOneSeriesToAnother,
    addContentToSeries,
    deleteContentFromSeries,
    deleteSeriesFromHeichel,
    editSeriesDetails,
    makeNewSeries,
	getSubSeries,
    getSeries,
    getSubSeriesInHeichel,
	getSeriesByProperty,
    
    getAllSeriesInHeichel,
	editPostsInSeries,
	editSubSeriesInSeries,
	traverseSeries,
	checkParentIDsAndAdd
};

var {
    sp
} = require("./_awtsmoos.constants.js");


var {
    er, myOpts
} = require("./general.js");

var {
    verifyHeichelAuthority
} = require("./heichel.js")

var {
	deletePost,
	editPostDetails,
} = require("./post.js")

async function checkParentIDsAndAdd({
	aliasId,
	postsOnly=false,
	$i,
	callback,
	heichelId,
	parentSeriesId
}) {
	var originalParentSeriesId = parentSeriesId
	var aliasId = aliasId || $i.$_POST.aliasId
	var ha = await verifyHeichelAuthority({
		$i,
		aliasId,
		heichelId
		

	})
	if(!ha) {
		return er({
			code: "NO_AUTH"
		})
	}
	/*$i.propertyMap = {
		content: 1,
		id: true,
		title: true,
		name: true,
		parentSeriesId: true,
		dayuh: false
	}*/
	t=await traverseSeries({
		seriesId: parentSeriesId,
		heichelId,
		$i,
		callback: async ({post, series, parentSeriesId, id}) => {
			var wrote = false;
			if(post && !post.parentSeriesId) {
				var wr = Object.assign({}, post)
				wr.parentSeriesId = parentSeriesId
				wrote = wr;
				var wr =  await $i.db.write(
					sp + `/heichelos/${
						heichelId
					}/posts/${id}`, wr
				);
			}
			if(!postsOnly) {
				if(series && !series.parentSeriesId) {
					var wr = Object.assign({}, series)
					wr.parentSeriesId = parentSeriesId
					var wr =  await $i.db.write(
						sp + `/heichelos/${
							heichelId
						}/series/${id}/prateem`, wr
					);
				}
			}
			await callback?.({post,series,parentSeriesId,id, wrote})
		}
	})
	
}

async function traverseSeries({
	seriesId,
	heichelId,
	$i,
	callback
}) {
	var opts = myOpts($i);
	var p = await $i.db.get(
		sp + `/heichelos/${
			heichelId
		}/series/${seriesId}/posts`, opts
	);
	var or;
	p = Array.from(p || []);
	
	for(var postId of p) {
		var post = await $i.db.get(
			`/social/heichelos/${
				heichelId
			}/posts/${postId}`, opts
		);
		await callback?.({post, parentSeriesId: seriesId, id: postId, heichelId})
	}
	var seer = await $i.db.get(
		sp + `/heichelos/${
			heichelId
		}/series/${seriesId}/subSeries`
	);
	seer = Array.from(seer || []);
	
	for(var subSeriesId of seer) {
		var series = traverseSeries({
			heichelId,
			$i,
			callback,
			seriesId:subSeriesId
		})
		await callback?.({series,  parentSeriesId: seriesId})
	}
	if(!p.length || !seer.length) {
		await callback?.({post: "LOL", details:seriesId, seer, p, or})
	}
	var me = await $i.db.get(
		`/social/heichelos/${
			heichelId
		}/series/${seriesId}/prateem`, opts
	);
	me = Object.assign({}, me)
	me.id = seriesId;
	me.now=Date.now()
	return me;
}

async function getSeriesByProperty({
	heichelId,
	parentSeriesId,
	propertyValue,
	$i,
	propertyKey
}) {
	if(!propertyKey && propertyKey !== 0) {
		return er({
			message: "Property key needed",
			code: "PROP_KEY_NEEDED"
		})
	}

	try {
		var opts = myOpts($i)
		var bs /*base*/ = await $i.db.get(`${
			sp
		}/heichelos/${
			heichelId
		}/series/${
			parentSeriesId
		}`, opts);

		if(!bs) {
			return er({
				message: "No parent series found",
				code: "NO_PAR_SER",
				details: {
					parentSeriesId,
					heichelId
				}
			})
		}

		var seriesIDs = await $i.db.get(`${
			sp
		}/heichelos/${
			heichelId
		}/series/${
			parentSeriesId
		}/subSeries`, opts);
		if(!seriesIDs) {
			return er({
				message: "No sub series!"
				,
				code: "NO_SUB_SER",
				details: {
					parentSeriesId,
					heichelId,
					seriesIDs
				}
			})
		}

		if(seriesIDs.length == 0) {
			return [];
		}

		var filtered = [];
		for(var i = 0; i < seriesIDs.length; i++) {
			var c = seriesIDs[i];
			var withProp = await $i.db.get(`${
				sp
			}/heichelos/${
				heichelId
			}/series/${
				c
			}/prateem`, {
				propertyMap: {
					[propertyKey]: true
				}
			});
			if(withProp) {
				if(withProp[propertyKey] == propertyValue) {
					filtered.push(c)
				}
			}
		}
		return filtered;
	} catch(e) {
		return er({
			message: "Something happpened",
			code: "SERVER_ERROR",
			details: e.stack
		})
	}
}

async function getAllSeriesInHeichel({
	$i,



	
	userid,
	heichelId,
	withDetails = false,

}) {

	try {
		var ids = await $i
			.db.get(sp +
				`/heichelos/${
				heichelId
				
			}/series/`

			);
		if (!withDetails) return ids;
		return ids.map(async id => {
			var f = await $i
				.db.get(sp +
					`/heichelos/${
				heichelId
				
			}/series/${id}/prateem`

				);
			return f

		})
	} catch (e) {
		return []
		return er({
			code: "NO_SERIES"
		})

	}

}

async function getSubSeries({
	$i,
	parentSeriesId,
	heichelId,
	properties,
	withDetails=false
}) {
	var opts = myOpts($i);
	if(!parentSeriesId) return er({
		code: "MISSING_PARAMS",
		details: "parentSeriesId"
	});
	if(!heichelId) return er({
		code: "MISSING_PARAMS",
		details: "heichelId"
	});
	var ser = await $i.db.get(`${
		sp
	}/heichelos/${
		heichelId
	}/series/${
		parentSeriesId
	}/subSeries`);
	ser = Array.from(ser || []);
	if(!withDetails) return ser;
	var detailedSeries = []
	for(var seer of ser) {
		var series =  await $i.db.get(`${
			sp
		}/heichelos/${
			heichelId
		}/series/${
			seer
		}/prateem`, opts);
		if(series) {
			detailedSeries.push(series)
			series.id = seer
		}
	}
	return detailedSeries
}
async function getSeries({
	$i,


	seriesId,
	withDetails = false,
	heichelId,
	properties

}) {
	var opts = myOpts($i);
	//if(!properties) properties = {}
	try {
		var rt = {id: seriesId};
		
		var prateem = await $i
			.db.get(sp +
				`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/prateem`,
			properties?({
				propertyMap: properties
			}):undefined

		);
		if(!prateem) return null
			
		if(withDetails) {
			var subSeries = await $i
				.db.get(sp +
					`/heichelos/${
					heichelId
					
				}/series/${
					seriesId
				
				}/subSeries`

				);

			var posts = await $i
				.db.get(sp +
					`/heichelos/${
					heichelId
					
				}/series/${
					seriesId
				
				}/posts`

				);
			rt.posts = Array.from(posts);
			rt.subSeries = Array.from(subSeries);
			rt.prateem = prateem;
		} else {
			rt.prateem = prateem;//{name:prateem.name}
		}
		return rt

	} catch (e) {
		
		return er({
			code: "NO_SERIES"
		})

	}

}
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

	   deleteOriginal optional default true
		besides for removing
		content from series, also deltes it itself.
 
**/
async function deleteContentFromSeries({
	$i,



	
	userid,
	heichelId,



}) {

	var aliasId = $i.$_POST.aliasId
	var ha = await verifyHeichelAuthority({
		$i,
		aliasId,
		heichelId
		

	})

	if (!ha) {
		return er({
			code: "NO_AUTH",
			alias: aliasId,
			heichel: heichelId
		})

	}

	try {
		var type = $i.$_POST.contentType || "post";
		//is it a post or series?
		var wtw = wc(type)
		if (!wtw) {
			return er({
				code: "NO_TYPE"
			})

		}

		//editing existing heichel

		//the parent series ID to delete from
		var seriesId = $i.$_POST.seriesId
		var contentId = $i.$_POST.contentId
		var deleteOriginal = $i.$_POST.deleteOriginal 
			|| false;
		var es /*existing series*/ = await $i
			.db.get(sp +
				`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/${wtw}`

			);
		if (!es) {
			return er({
				code: "NO_CONTENT"
			})

		}
		var ar = Array.from(es);
		var i = ar.indexOf(contentId);
		var index = $i.$_POST.indexInSeries;
		if (i < 0) {
			try {
				i = parseInt(index);
				if (isNaN(i)) throw "no"


			} catch (e) {
				return er({
					code: "NOT_FOUND_IN_SERIES"
				})
			}

		}
		var elementAtIndex = ar[i];
		ar.splice(i, 1);
		var ob = Object.assign({}, ar)
		ob.length = ar.length;
		await $i
			.db.write(sp +
				`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/${wtw}`, ob

			);
		var good = {
			"success": {
				wrote: ob,
				deleted: contentId,
				from: seriesId

			}
		}
		
		var contentToRemove = elementAtIndex;
		if(type == "post") {
			$i.$_DELETE={
				aliasId
			
			}
			var del= await deletePost({
				$i,
				heichelId,
				postID:contentToRemove
				
			});
			if(del.error) return del.error;
			else good. deletedInfo=del;
			
			/*if(deleteOriginal)
			var sre=deleteSeriesFromHeichel ({
				heichelId,
				$i,
				seriesId:contentToRemove
				
			});*/
			

		} else /*is series*/ {
			var sre=deleteSeriesFromHeichel ({
				heichelId,
				$i,
				seriesId:contentToRemove
				
			});
			good. deletedInfo=sre;
		}
		return good

	} catch (e) {
		return er({
			code: "NO_DEL",
			stack:e
		})

	}
}

/**
 * 
 * @param {*} $i.$_POST
 * required:
 * aliasId 
 * seriesId (to delete)
 * @returns 
 */
async function deleteSeriesFromHeichel ({
	$i,



	
	
	heichelId,
	seriesId



}) {
	var aliasId = $i.$_POST.aliasId
	var ha = await verifyHeichelAuthority({
		$i,
		aliasId,
		heichelId
		

	})

	if (!ha) {
		return er({
			code: "NO_AUTH"
		})

	}
	var deleted = {}
	var error = null
	try {
		var subPosts = await $i.db.get(`${
			sp
		}/heichelos/${
			heichelId
		}/series/${
			seriesId
		}/posts`);
		subPosts = Array.from(subPosts || [])
		
		for(var p of subPosts) {
			if(!deleted.posts) 
				deleted.posts = [];
			var del= await deletePost({
				$i: {
					...$i,
					$_DELETE: $i.$_POST
				},
				heichelId,
				postID:p,
				aliasId

			});
			if(del.error) {
				throw del.error;
			}
			deleted.posts.push({postDeleted: {
				postId:p,deletion:del
			}});
			
		}
		

		var subSeries = await $i.db.get(`${
			sp
		}/heichelos/${
			heichelId
		}/series/${
			seriesId
		}/subSeries`);
		subSeries = Array.from(subSeries || []);
		
		if(!deleted.subSeries) {
			deleted.subSeries = []
		}
		for(var p of subSeries) {
			if(!deleted.subSeries) {
				deleted.subSeries = []
			}
			var del= await deleteSeriesFromHeichel({
				$i,
				heichelId,
				seriesId:p

			});
			if(del?.error) throw del.error;
			deleted.subSeries.push(del);
			
		}
		
	} catch(e) {
		return er({
			message: "Couldn't delete",
			stack: e.stack,
			tried: deleted,
			details: {
				aliasId,
				heichelId,
				seriesId
			},
			code: "NO_DELETE"
		})
	}

	try {
		
		var prateem = await $i.db.get(`${
			sp
		}/heichelos/${
			heichelId
		}/series/${
			seriesId
		}/prateem/`);
		var par = prateem?.parentSeriesId;
		var deletedParent = null;
		if(par) {
			var sub = await $i.db.get(
			`${
				sp
	
			}/heichelos/${
				heichelId
			}/series/${
				par
				
			}/subSeries`);
			var ar = Array.from(sub||[])
			var ind = ar.indexOf(seriesId);
			while(ind > -1) {
				ind = ar.indexOf(seriesId);
				if(ind > -1) {
					ar.splice(ind, 1)
				}
			}
			if(ar.length > 0) {
				var sub = await $i.db.write(
				`${
					sp
		
				}/heichelos/${
					heichelId
				}/series/${
					par
					
				}/subSeries`, ar);
				
			}
			deletedParent = {
				parentName: par,
				oldSeries: sub
			}
			deleted.deletedParent = deletedParent;
		}
		var delS = await $i.db.delete(
			`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesId
			
		}`);
		if(delS?.error) throw delS.error;
		deleted.series = delS
		
		
	} catch (e) {
		deleted.series = er({
			code: "NO_DEL",
			stack:e.stack
		})

	}
	return deleted;

}

async function changeSubSeriesFromOneSeriesToAnother({
	$i,
	heichelId,
	seriesFromId,
	seriesToId,
	
}) {
	try {
		var test = $i.$_POST.test;
		//return "Hi"
		if(!seriesToId) seriesToId = $i.$_POST.seriesToId || $i.$_POST.moveTo; //seriesId to move entries to, optional.
		var aliasId = $i.$_POST.aliasId
	
		var ha = await verifyHeichelAuthority({
			$i,
			aliasId,
			heichelId
		})
	
		if (!ha) {
			return er({
				code: "NO_AUTH",
				details: aliasId,
				heichelId,
				seriesFromId,
	    			aliasId
			})
	
		}
		var subSeriesIDs = $i.$_POST.subSeriesIDs;
		if(!Array.isArray(subSeriesIDs)) {
			return er({
				message: "Requires an array of series IDs",
				subSeriesIDs
			});
		}
	
		var existingSubSeries = await $i.db.get(
			sp + 
			`/heichelos/${
				heichelId
			}/series/${
				seriesFromId
			}/subSeries`
		);
		existingSubSeries = Array.from(existingSubSeries);
		var toChange = [];
		var i = 0;
		for(var subSeriesId of existingSubSeries) {
			if(subSeriesIDs.includes(subSeriesId)) {
				existingSubSeries.splice(i, 1);
				toChange.push(subSeriesId)
			}
			i++;
		}
		var ob = {
			seriesToId,
			seriesFromId,
			toChange
		}
		var deleted = [];
		var errors = [];
		ob.errors = errors;
		ob.deleted = deleted;
		var existingSubSeriesInTo = await $i.db.get(
			sp + 
			`/heichelos/${
				heichelId
			}/series/${
				seriesToId
			}/subSeries`
		);
		existingSubSeriesInTo = Array.from(existingSubSeries);
		existingSubSeriesInTo.concat(toChange);
		
		var resTo =!test ?  await $i.db.write(sp +
				`/heichelos/${
				heichelId
			}/series/${
				seriesToId
			}/subSeries`, existingSubSeriesInTo) : {}
		
		if(resTo.error) {
			return er({message: resTo.error, seriesToId});
		}
		var resFrom = !test ? await $i.db.write(sp +
				`/heichelos/${
				heichelId
			}/series/${
				seriesFromId
			}/subSeries`, existingSubSeries) : {};
		
		if(resFrom.error) {
			return er({message: resFrom.error, seriesFromId});
		}
		return {
			success: {
				resTo,
				resFrom,
				seriesFromId,
				seriesToId,
				existingSubSeries,
				existingSubSeriesInTo
			}
		}
	} catch(e) {
		return er({
			message: e.stack
		})
	}
	
}
async function editSubSeriesInSeries({
	$i,
	heichelId,
	seriesId,
	
}) {
	var aliasId = $i.$_POST.aliasId

	var ha = await verifyHeichelAuthority({
		$i,
		aliasId,
		heichelId,
		seriesId
	})

	if (!ha) {
		return er({
			code: "NO_AUTH"
		})

	}
	var subSeriesIDs = $i.$_POST.subSeriesIDs;
	if(!Array.isArray(subSeriesIDs)) {
		return er({
			message: "Requires an array of post IDs"
		});
	}
	try {
		var existingSubSeries = await $i.db.get(
			sp + 
			`/heichelos/${
				heichelId
			}/series/${
				seriesId
			}/subSeries`
		);
		existingSubSeries = Array.from(existingSubSeries);
		var changed = [];
		for(var subSeriesId of subSeriesIDs) {
			if(!existingSubSeries.includes(subSeriesId)) {
				changed.push(subSeriesId)
			}
		}
		var ob = {
			seriesId,
			changed
		}
		var deleted = [];
		var errors = [];
		ob.errors = errors;
		ob.deleted = deleted;
		/*for(var toDelete of changedToDelete) {
			var del = await $i.db.delete(sp +
				`/heichelos/${
				heichelId
			}/series/${
				toDelete
			}`);
			if(del.error) {
				errors.push(del)
				return er({
					message: "Issue deleting",
					code: "NO_DEL",
					tried: ob
				})
			}
			
		}*/
		var res = await $i.db.write(sp +
				`/heichelos/${
				heichelId
			}/series/${
				seriesId
			}/subSeries`, subSeriesIDs)
		if(res) {
			return {success: subSeriesIDs}
		}
	} catch(e) {
		return er({
			message: e.stack
		})
	}
}

async function editPostsInSeries({
	$i,
	heichelId,
	seriesId
}) {
	var aliasId = $i.$_POST.aliasId
	var expandedResponse = $i.$_POST.expanded;
	var ha = await verifyHeichelAuthority({
		$i,
		aliasId,
		heichelId,
		seriesId
	})

	if (!ha) {
		return er({
			code: "NO_AUTH"
		})

	}
	var postIDs = $i.$_POST.postIDs;
	if(!Array.isArray(postIDs)) {
		return er({
			message: "Requires an array of post IDs"
		});
	}
	try {
		var existingPosts = await $i.db.get(
			sp + 
			`/heichelos/${
				heichelId
			}/series/${
				seriesId
			}/posts`
		);
		existingPosts = Array.from(existingPosts);
		var changedToDelete = [];
		for(var postId of postIDs) {
			if(!existingPosts.includes(postId)) {
				changedToDelete.push(postId)
			}
		}
		var ob = {
			postIDs:expandedResponse?postIDs : postIDs.length,seriesId
		}
		var deleted = [];
		var errors = [];
		ob.errors = errors;
		ob.deleted = deleted;
		for(var toDelete of changedToDelete) {
			var del = await $i.db.delete(sp +
				`/heichelos/${
				heichelId
			}/posts/${
				toDelete
			}`);
			if(del.error) {
				errors.push(del)
				return er({
					message: "Issue deleting",
					code: "NO_DEL",
					tried: ob
				})
			}
			
		}
		
		var res = await $i.db.write(sp +
				`/heichelos/${
				heichelId
			}/series/${
				seriesId
			}/posts`, postIDs)
		ob.written = res;
		ob.changedToDelete = changedToDelete
		
		
		return {success: ob}
		
	} catch(e) {
		return er({
			message: e.stack
		})
	}
}

function wc /*what content*/(type) {
	return type == "post" ? "posts" :
		type == "series" ? "subSeries" :
		null;


}
async function addContentToSeries({
	$i,



	
	heichelId,
	myParentSeriesId=null


}) {
	var aliasId = $i.$_POST.aliasId

	var ha = await verifyHeichelAuthority({
		$i,
		aliasId,
		heichelId

	})

	if (!ha) {
		return er({
			code: "NO_AUTH"
		})

	}

	var type = $i.$_POST.contentType || "post";
	var wtw = wc(type)
	if (!wtw) {
		return er({
			code: "NO_TYPE"
		})

	}

	//editing existing heichel

	//the parent series id;
	var seriesId = myParentSeriesId||
		$i.$_POST.seriesId || "root";
	var contentId = $i.$_POST.contentId;
	var inputIndex = $i.$_POST.index;
	if(!contentId) {
		return er({code: "NO_CONTENT_ID"});
	}
	try {
		//makeNewSeries
		// if parent (including root)
		// doesn't exist yet
		var sr = await $i
			.db.get(sp +
				`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/prateem`);
		
		if(!sr) {
			var t=$i.$_POST.title;
			$i.$_POST.title=seriesId;
			var m = await makeNewSeries({
				$i,
				isRoot: seriesId=="root",
				heichelId
			});
			if(m.error) {
				return er({code: "PROBLEM_CREATING",
				 details: m.error});
			}
			$i.$_POST.title=t;
		}
		var indexAddedTo = null;
		var existingSeries/*if the PARENT series exists:*/ = await $i
			.db.get(sp +
				`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/${wtw}`

			)

		if (existingSeries) {
			var lng = existingSeries
				.length

			if (isNaN(lng + 0)) {
				lng = 0

			}



			existingSeries = Array.from(
				existingSeries

			)

			var index = inputIndex;
			if(typeof(index) != "number") {
				index = lng;
			}


			existingSeries
				.splice(
					index,
					0,
					contentId
				);
			indexAddedTo = index;
			var ob = Object.assign({}, existingSeries)
			ob.length = existingSeries.length;

			await $i
				.db.write(sp +
					`/heichelos/${
						heichelId
						
					}/series/${
						seriesId
					
					}/${wtw}`, ob

				);
				
			//EDIT the parent series property of it
			
			var resp;
			var ar = Array.from(ob);
			if(type == "post") {
				
				/*var postResp = []
				var i = 0;
				for(var p in ar) {
					
					//edit post
					var pr = await editPostDetails({
						$i,
						heichelId,
						
						postID: p,
						verified: true,
						dontUpdateIndex: true
					})
					postResp.push(pr);
					i++;
				}*/
				$i.$_PUT = {
					aliasId,
					parentSeriesId: seriesId
				};
				var pr = await editPostDetails({
					$i,
					heichelId,
					
					postID: contentId,
					verified: true,
					dontUpdateIndex: true
				})
				//contentId
				resp = pr;
				
			} else {
				var serRes = []
				var i = 0;
				for(var p in ar) {
					$i.$_PUT = {
						aliasId,
						parentSeriesId: seriesId,
						indexInSeries: i
					};
					//edit post
					var pr = await editSeriesDetails({
						$i,
						heichelId,
						seriesId: contentId,
						verified: true,
						dontUpdateIndex: true
					});
					serRes.push(pr);
					i++;
				}
				resp = serRes;
				
				
			}


			return {
				success: contentId,
				length: lng,
				inputIndex,
				seriesId,
				resp,
				indexAddedTo
			}

		} else {
			return er({
				code: "SERIES_NOT_FOUND"
			})

		}

	} catch (e) {
		return er({
			code: "NO_ADD",
			details: e.stack
		})

	}


}

async function editSeriesDetails({
	$i,



	
	seriesId,
	heichelId,
	verified = false







}) {
	var aliasId = $i.$_PUT.aliasId ||
		$i.$_POST.aliasId;
	if(!aliasId) {
		return er({
			code: "NO_ALIAS",
			message: "No Alias Id provided"

		})

	}




	if(!verified) {
		var ha = await verifyHeichelAuthority({
			$i,
			aliasId,
			heichelId
			

		})

		if (!ha) {
			return er({
				code: "NO_AUTH"
			})

		}
	}

	try {

		var d = await $i.db.get(
			`${
				sp

			}/heichelos/${
				heichelId
			}/series/${
				seriesId
				
			}/prateem`
		);

		if (!d) {
			return er({
				code: "NO_SERIES_FOUND"
			})
		}

		var desc = $i.$_PUT.description || $i.$_POST.description;
		var nm = $i.$_PUT.seriesName ||
			$i.$_PUT.name ||
			$i.$_PUT.title || $i.$_POST.title || $i.$_POST.name;

		var {
			parentSeriesId
		} = $i.$_PUT;

		var wr = {}
		if (desc && typeof(desc) == "string") {
			if (desc.length <= 888) {
				d.description = desc;
				wr.description = true

			} else return er({
				code: "DESCRIPTION_TOO_LONG",
				proper: 888
			})


		}

		if (nm && typeof(nm) == "string") {
			if (nm.length > 50) return er({
				code: "NOT_PARAMS",
				proper: {
					name: 50
				}
			});
			d.name = nm;
			wr.name = true

		}

		if(parentSeriesId) {
			wr.parentSeriesId = true;
			wr.parentSeriesId = parentSeriesId
			d.parentSeriesId = parentSeriesId;
		}

		try {

			await $i.db.write(
				`${
					sp

				}/heichelos/${
					heichelId
				}/series/${
					seriesId
					
				}/prateem`, d);

				return {
					success: wr
				};
		} catch (e) {
			return er({
				code: "NO_WRITE",
				reason: e.stack
			})

		}

	} catch (e) {
		return er({
			code: "NO_GET"
		})

	}

}
async function makeNewSeries({
	$i,
	isRoot= false, 




	heichelId

}) {
	var aliasId = $i.$_POST.aliasId




	
	var ha = await verifyHeichelAuthority({
		$i,
		aliasId,
		heichelId

	})

	if (!ha) {
		return er({
			code: "NO_AUTH"
		})

	}


	//parent series to add to 
	var seriesID = isRoot?"root":
		$i.$_POST.seriesId;
	
	var seriesName = $i.$_POST.seriesName || 
		$i.$_POST.title ||
		$i.$_POST.name ||
		seriesID;
	var description = $i.$_POST.description
	if (!description || description == "undefined") description = ""
	if (seriesName > 50) {
		return er({
			message: "Too long series name",
			proper: {
				seriesName: 50
			}
		})	
	}
	if(seriesName == "undefined") seriesName = undefined;

	if(typeof(seriesName) != "string") {
		return er({
			message: "Wrong series name",
			got: {
				seriesName, description,
				seriesID
			}
		})
	}
	if (seriesName > 888) {
		return er({
			message: "Too long series desc",
			proper: {
				description: 888
			}
		})	
	}
	seriesName = seriesName.trim();
	if(!seriesID)
		seriesID = "BH_" + Date.now() + "_" +
		(Math.floor(Math.random() * 78) + 700)
	+"_"+aliasId

	
		
	
	var doesItExist = await $i.db.get(
			`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesID
			
		}/prateem`);
	if(doesItExist) {
		return er({
			code: "ALREADY_EXISTS",
			tried: seriesID,
			isRoot
		});
	}
		
	
	try {
		

		await makeIt();
		var good = {
			success: {
				id: seriesID,
				name:seriesName

			}
		};
		if(isRoot) {
			return good;

		}
		var pr=$i.$_POST.parentSeriesId;
		if(!pr) pr= "root";
		if(pr==seriesID) {
			return er({
				code:"NO_SELF_ADD"

			})

		}
		try {
			// parent series to add to
			// default "root"
			$i.$_POST.seriesId=pr;
			// this id
			$i.$_POST.contentId=seriesID;
			//adding series to other series
			$i.$_POST.contentType="series"
			var a=await addContentToSeries({
				$i,
				heichelId

			});
			if(a.error) {
				return er({
					code:
					"NO_ADD_NEW",
					details:
					a.error

						

				})

			}

			return {
				success:
				{
					newSeriesID: seriesID,
					parentId:pr
				}
		        };

		} catch(e) {
			return er({
				code:
				"ERROR_ADDING",
				details:e.stack

			})

		}
		return good;

	} catch (e) {
		return er({
			code: "ISSUE_WRITING",
			details: e.stack
		})

	}
	
	async function makeIt() {
		await $i.db.write(
			`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesID
			
		}/posts`, {

				length: 0


			})

		await $i.db.write(`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesID
			
		}/subSeries`, {

			length: 0


		})

		await $i.db.write(
			`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesID
			
		}/prateem`, {
			name: seriesName,
			id: seriesID,
			description,
			author: aliasId


		})
	}




}



async function getSubSeriesInHeichel({
	$i,
	userid,
	withDetails=false,
	heichelId

}) {
	// the series to get sub series
	// of
	var par=$i.$_POST.seriesId || "root";
	var s= await getSeries({
		$i,
		$userid,
		heichelId,
		withDetails: true,
		seriesId: par
		

	});

	if(s.error) {
		return er({
			code:"NO_PARENT",
			details: s.error

		});

	}

	if(!Array.isArray(s.subSeries)) {
		return er({
			code: "NO_SUB_SERIES"

		});

	}
	var rs=[];
	var errors=[]
	for(
		var i=0;
		i<s.subSeries. length;
		i++

	) {
		var id=s.subSeries[i];
		var ss= await getSeries({
			$i,
			heichelId,
			withDetails, 
			seriesId: id

		});
		if(!ss || ss.error) {
			errors.push(er({
				code:
				"PROBLEM_WITH_SUB",
				details:ss?
					ss.error:
					"NOT_HERE"

			}));
			continue;
		}
		if(!ss.prateem) {
			errors.push(er({
				code:
				"NO_SUB_PRATEEM",
				details:ss

			}));
			continue;

		}
		rs.push(ss.prateem);
		

	}

	var rt={};
	if(errors. length)
		rt.errors=errors;
	
	rt. success=rs;
	return rt;

	



}
