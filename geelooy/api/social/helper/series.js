/**
 * B"H
 */




module.exports = {
    addContentToSeries,
    deleteContentFromSeries,
    deleteSeriesFromHeichel,
    editSeriesDetails,
    makeNewSeries,
    getSeries,
    getSubSeriesInHeichel,
	getSeriesByProperty,
    
    getAllSeriesInHeichel,
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

async function getSeriesByProperty({
	heichelId,
	parentSeriesId,
	propertyValue,
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
		}/series/${parentSeriesId}`, opts);

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
				code: "NO_SUB_SER"
			})
		}

		if(seriesIDs.length == 0) {
			return null;
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
			details: e+""
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

async function getSeries({
	$i,


	seriesId,
	withDetails = false,
	heichelId,

}) {

	try {
		var rt = {id: seriesId};
		var prateem = await $i
			.db.get(sp +
				`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/prateem`

			);
			
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
			rt.prateem = {name:prateem.name}
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

	   deleteOriginal optional default false
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
		if(deleteOriginal) {
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

			} else{
			    var sre=deleteSeriesFromHeichel ({
				    heichelId,
				    $i,
				    seriesId:contentToRemove

			    });

		        }
		}
		return good

	} catch (e) {
		return er({
			code: "NO_DEL"
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



	
	userid,
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

	try {
		await $i.db.delete(
			`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesId
			
		}`);
		return er({
			code: "DELETED"
		});
	} catch (e) {
		return er({
			code: "NO_DEL"
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

			var index = $i.$_POST.index || lng;


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
			$i.$_PUT = {
				aliasId,
				parentSeriesId: seriesId
			};
			var resp;
			if(type == "post") {
				//edit post
				resp = await editPostDetails({
					$i,
					heichelId,
					postID: contentId,
					verified: true
				})
			} else {
				resp = await editSeriesDetails({
					$i,
					heichelId,
					seriesId: contentId,
					verified: true
				});
				if(resp.error) {
					return resp
				}
			}


			return {
				success: contentId,
				length: lng,
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
			details: e+""
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
				reason: e+""
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
	if (!description) description = ""
	if (seriesName > 50) {
		return er({
			message: "Too long series name",
			proper: {
				seriesName: 50
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
				details:e+""

			})

		}
		return good;

	} catch (e) {
		return er({
			code: "ISSUE_WRITING",
			details: e+""
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
