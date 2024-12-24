/*B"H*/
import AIService from "/ai/aiService.js";
import aiify from "./aiPics.js"
import { AwtsmoosPrompt } from "./alerts.js";
/*import {
	generateContent,
	content,
	streamIt
} from "/scripts/awtsmoos/api/ai.js"*/
import {
	traverseAllPostsInHeichel,
	traverseAllPostsInSeries
} from "./helperScripts/traverseAllPosts.js";

import {
	sendIt
} from "./helperScripts/s3-manager.js";

export {
	AIService,
	sendIt,
	aiify,
	editComment,
	traverseAllPostsInHeichel,
	traverseAllPostsInSeries,
	AwtsmoosPrompt,
    getHeichelDetails,
    getAliasName,
    getSeries,
    getPost,
getPostById,
    getAPI,
    aliasOwnership,
    getCommentsByAlias,
    getCommentsOfAlias,
    getComment,
	deleteComment,
    traverseSeries,
    addNewEditor,
	deleteAllCommentsFromAlias,
	deleteAllCommentsFromParent,

    leaveComment,

	editSeries,
	editPost,
    deleteAllCommentsOfAlias,
    makePost,
    makeSeries,
	filterPostsBy,
	filterSeriesBy,
	loadJSON,
	chooseTextFiles

    
}

// Function to open a directory asynchronously
async function openDirectory(directoryName) {
	try {
	  const dirHandle = await window.showDirectoryPicker();
	  //const dir = await dirHandle.getDirectoryHandle(directoryName, { create: true });
	  return dirHandle;
	} catch (error) {
	  console.error("Error opening directory:", error);
	  throw error;
	}
  }
  
  // Function to write a file to a directory
  async function writeFile(directoryHandle, fileName, content) {
	try {
	  const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
	  const writable = await fileHandle.createWritable();
	  await writable.write(content);
	  await writable.close();
	  console.log(`File "${fileName}" has been written successfully.`);
	} catch (error) {
	  console.error("Error writing file:", error);
	  throw error;
	}
  }

//B"H
async function deleteAllCommentsOfAlias({
	postId,
	author,
	aliasId,
	heichelId
}) {
	var r = await fetch(`https://awtsmoos.com/api/social/heichelos/${
		heichelId
  }/post/${
		postId
  }/comments/aliases/${author}`, {
		method: "DELETE",
		body: new URLSearchParams({
			aliasId,
			heichelId
		})
	})
	try {
		var h = await r.json()
		return h;
	} catch(e){
		console.log(e)
	}
}

/*
f=await deleteAllCommentsOfAlias({
	postId:'BH_POST_1710482432861_1407_sefarim_9_0',
	author: "rashi",
	heichelId: "ikar",
	aliasId:"sefarim"
})*/

function chooseTextFiles() {
	return new Promise(r => {
		var inp = document
			.createElement("input");
		inp.type="file";
		inp.click();
		inp.onchange = async () => {
			var files = [];
			var loaded = Array.from(inp.files)
			for(var f in loaded) {
				var url = URL.createObjectURL(f);
				var txt = await (await fetch(url)).text();
				flies.push({meta: f, text: txt})
			}
			r(files);
		}
	})
}
function loadJSON() {
    return new Promise(async (r,j) => {
        var ip = document.createElement("input")
        ip.style.position="fixed"
        ip.style.zIndex="123901283901290391302123"
        ip.style.left="25px"
        ip.style.top="26px"
        ip.type="file"
        ip.onchange = async () => {
            try {
                var g = await fetch(URL.createObjectURL(ip.files[0]));
                var h = await g.json()
                ip.parentNode.removeChild(ip)
                r(h)
            } catch(e){r(null)}
        }
        document.body.appendChild(ip)
        ip.click()
    })
    
}



var base = "https://awtsmoos.com"
async function makeSeries({
    heichelId,
    aliasId,
    description,
    title,
    parentSeriesId,
    dayuh
}) {
    return await (await fetch(
        location.origin+
        `/api/social/heichelos/${
            heichelId
        }/addNewSeries`, {
            method: "POST",
            body: new URLSearchParams({
                aliasId,
                description,
                title,
                parentSeriesId,
                dayuh: JSON.stringify(dayuh)
            })
        })).json();
}

async function editSeries({
    seriesName,
    heichelId,
    aliasId,
	index=null,
    description,
    parentSeries,
	seriesId
}) {
	var ob = {
		aliasId,
		description,
		title: seriesName,
		heichel: heichelId,
		parentSeriesId: parentSeries || "root"
	}
	if(index !== null && typeof(index) == "number") {
		ob.index = index;
	}
    var resp = await getAPI(`${base}/api/social/heichelos/${
        heichelId
    }/series/${
		seriesId
	}/editSeriesDetails`, {
        method: "PUT",
        body: new URLSearchParams(ob)
    });
    return resp;
}




async function editPost({
    heichelId,
    aliasId,
    postId,
    content="",
    title,
    parentSeriesId,
    dayuh
}) {
    return await (await fetch(
        location.origin+
        `/api/social/heichelos/${
            heichelId
        }/post/${postId}`, {
            method: "PUT",
            body: new URLSearchParams({
                aliasId,
                content,
                title,
                parentSeriesId,
                dayuh: JSON.stringify(dayuh)
            })
        })).json();
}


async function makePost({
    heichelId,
    aliasId,
       
    content="",
    title,
    parentSeriesId,
    dayuh
}) {
    return await (await fetch(
        location.origin+
        `/api/social/heichelos/${
            heichelId
        }/posts`, {
            method: "POST",
            body: new URLSearchParams({
                aliasId,
                content,
                title,
                parentSeriesId,
                dayuh: JSON.stringify(dayuh)
            })
        })).json();
}

async function deleteComment({
 
	heichelId,
	parentType,
	parentId,
	commentId,
	seriesId,
	postId,
	aliasId,
	get={}
}) {
    var base = location.origin;
    try {
        var r = await fetch(base+`/api/social/heichelos/${
            heichelId
        }/comment/${
            commentId
        }`, {
        method: "DELETE",
        body:  new URLSearchParams({
                aliasId,
                parentId,
                seriesId,
                postId,
                parentType,
                ...(get)
            })
                                 
        });
        var t = await r.json();
        return t;
    } catch(e) {
        console.log(e);
        return []
    }
}

async function getComment({
 
	heichelId,
	parentType,
	parentId,
	commentId,
	seriesId,
	postId,
	aliasId,
	get={}
}) {
    try {
        var r = await fetch(base+`/api/social/heichelos/${
            heichelId
        }/comment/${
            commentId
        }?` + new URLSearchParams({
		aliasId,
		parentId,
		seriesId,
		postId,
		parentType,
		...(get)
	}));
        var t = await r.json();
        return t;
    } catch(e) {
        console.log(e);
        return []
    }
}


async function getCommentsOfAlias({
    postId,
    heichelId,
    aliasId,
    get={}

}) {
    try {
        var r = await fetch(base+`/api/social/heichelos/${
            heichelId
        }/post/${
            postId
        }/comments/aliases/${
            aliasId
        }/?${
		new URLSearchParams(get)
	}`)
        var t = await r.json();
        return t;
    } catch(e) {
        console.log(e);
        return []
    }
}

//B"H
async function editComment({
 
	heichelId,
	parentType,
	parentId,
	commentId,
	seriesId,
	postId,
	aliasId,
    content,
    dayuh,
	printFull=false,
	get={}
}) {
    var base = location.origin;
    try {
        var r = await fetch(base+`/api/social/heichelos/${
            heichelId
        }/comment/${
            commentId
        }`, {
        method: "PUT",
        body:  new URLSearchParams({
                aliasId,
                parentId,
                seriesId,
                postId,
                parentType,
                content,
                dayuh: JSON.stringify(dayuh),
                printFull,
                ...(get)
            })
                                 
        });
        var t = await r.json();
        return t;
    } catch(e) {
        console.log(e);
        return []
    }
}
async function leaveComment({
    postId,
    heichelId,
    content,
    dayuh,
    aliasId
}) {
	console.log("DAYUH",dayuh)
    if(!dayuh) dayuh = {};
	var body = new URLSearchParams({
		aliasId,
		dayuh: JSON.stringify(dayuh),
		content
	})
    var p = await getAPI(`/api/social/heichelos/${
        heichelId
    }/post/${
        postId
    }/comments`, {
        method: "POST",
        body
    })
	console.log("P",body)
    return p;
}

//gets comments of alias on a post
async function getCommentsByAlias({
    postId,
    heichelId,
    get={}
}) {
    try {
        var r = await fetch(base+`/api/social/heichelos/${
            heichelId
        }/post/${
            postId
        }/comments/aliases/?`+new URLSearchParams(get))
        var t = await r.json();
        return t;
    } catch(e) {
        console.log(e);
        return []
    }
}
async function aliasOwnership(aliasId, options) {
    try {
        var r = await fetch(base+`/api/social/aliases/${
            aliasId
        }/ownership`, options)
        var t = await r.json();
        return !t.no
    } catch(e) {
        console.log(e)
        return false;
    }
}

async function deleteAllCommentsFromAlias({
	aliasId/*the one editing*/,
	deleteAliasId,
	heichelId,
	postId
}) {
	return getAPI(`https://awtsmoos.com/api/social/heichelos/${
		heichelId		
	}/post/${
		postId	
	}/comments/aliases/${
		deleteAliasId
	}`, {
		method: "DELETE",
		body: new URLSearchParams({
			aliasId
		})
	});
}


async function deleteAllCommentsFromParent({
	aliasId/*the one editing*/,
	heichelId,
	postId
}) {
	return getAPI(`https://awtsmoos.com/api/social/heichelos/${
		heichelId		
	}/post/${
		postId	
	}/comments/`, {
		method: "DELETE",
		body: new URLSearchParams({
			aliasId
		})
	});
}

async function getAPI(url, options) {
    try {
        var r = await fetch(url, options)
        var t = await r.text();
        try {
            t = JSON.parse(t)
        } catch(e){}
        return t;
    } catch(e) {
        return null;
    }
}

//B"H
async function addNewEditor({
	aliasId/*the one doing the adding*/,
	heichelId,
	editorAliasId//to add as new
}) {
	var k = await getAPI(`/api/social/heichelos/${
		heichelId
	}/editors`, {
		method: "POST",
		body: new URLSearchParams({
			aliasId,
			editorAliasId
		})
	});
	return k
}


/**
 * 
 * example
 * p = await addCommentariesAsComments({
	seriesId:"BH_1710482432718_757_sefarim",
	postIndex:0,
	heichelId:"ikar"
})
 */







async function traverseSeries({
	heichelId,
	seriesId,
	callbackForSeries,
	path=[],
	callbackForEachPost,
	shouldBreak=false
}) {
	var shouldBreak = shouldBreak;
	var breakIt = () => {
		shouldBreak = true;	
	}
	
	var first = await getSeries(seriesId, heichelId);
	var pth = Array.from(path);
	if(typeof(callbackForSeries) == "function") {
		callbackForSeries({
			seriesInfo: first.prateem,
			posts: first.posts,
			subSeries: first.subSeries,
			path,
			breakIt,
			shouldBreak
		})
	}
	for(var i = 0; i < first.subSeries.length; i++) {
		try {
			var b = first.subSeries[i]
			await traverseSeries({
				heichelId, seriesId: b,
				series: first,
				callbackForSeries,
				callbackForEachPost,
				path: pth.concat(seriesId),
				breakIt,
				shouldBreak
			})
			if(shouldBreak) {
				break;	
			}
		} catch(e) {
			console.log(e);
			break;
		}
	}

	if(typeof(callbackForEachPost) == "function")
		for(var i = 0; i < first.posts.length; i++) {
			try {
				await (async (i) => {
					var b = first.posts[i];
					var post = await getPost(
						first, i, heichelId
					)
					await callbackForEachPost({
						heichelId, seriesId,
						postId: b,
						post,
						index:i,
						callbackForSeries,
						callbackForEachPost,
						path: pth.concat(seriesId)
					})
				})(i);
				if(shouldBreak) {
					break;	
			}
			} catch(e) {
				console.log(e);
				break;
			}
			
		}
	return first
}

async function getHeichelDetails(heichelId) {
    return await getAPI(`${base}/api/social/heichelos/${
        heichelId
    }`)
}

async function getAliasName(alias) {
    return await getAPI(`${base}/api/social/aliases/${
        alias
    }`)
}

async function getSeries(id, heichel) {
    var seriesData = await getAPI(
        `${base}/api/social/heichelos/${
            heichel
        }/series/${id}/details` 
    );
    return seriesData;
}


async function getPostById({
	postId,
	heichelId
}) {
    


    var postInfo =  await getAPI(
        `${base}/api/social/heichelos/${
            heichelId
        }/post/${postId}` 
    );

    return postInfo

}

async function getPost(parentSeries, index, heichel) {
    

    var p = parentSeries.posts[index];
    if(!p) return null;

    var postInfo =  await getAPI(
        `${base}/api/social/heichelos/${
            heichel
        }/post/${p}` 
    );

    return postInfo

}

async function filterPostsBy({
	heichelId,
	parentSeriesId = "root",
	propertyKey,
	propertyValue
}) {
	var p = await getAPI(`${
		base
	}/api/social/heichelos/${
		heichelId
	}/series/${
		parentSeriesId
	}/filterPostsBy/${
		propertyKey
	}/${
		propertyValue
	}`);
	return p;
}


async function filterSeriesBy({
	heichelId,
	parentSeriesId = "root",
	propertyKey,
	propertyValue
}) {
	var p = await getAPI(`${
		base
	}/api/social/heichelos/${
		heichelId
	}/series/${
		parentSeriesId
	}/filterSeriesBy/${
		propertyKey
	}/${
		propertyValue
	}`);
	return p;
}


