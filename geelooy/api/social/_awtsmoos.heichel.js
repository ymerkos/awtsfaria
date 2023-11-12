/**B"H
Heichelos
**/

module.exports = ({
    info,
    userid,
    loggedIn,
    verifyAlias,
    getAlias,
    verifyAliasOwnership,


    sp,
	er,
	NO_LOGIN,
	NO_PERMISSION
} = {}) => ({
	/**
   * heichelos Endpoints - The Palaces of Wisdom
   * by default just
   * gets the heichelos  of given alias, so 
   * same as search heichels by alias..
   */
  "/alias/:alias/heichelos": async (v) => {
	
	if (info.request.method == "GET") {
		var route = `/api/social/heichelos/searchByAliasOwner/${
			v.alias
		}`
		var heichelos = await info.fetchAwtsmoos(route);
		
		return heichelos.map(w=>w.id);
	}

	if (info.request.method == "POST") {
	  if(!loggedIn()) {
		return er(NO_LOGIN);
	  }
	  const name = info.$_POST.name;
	  const description = info.$_POST.description;
	  
	  const aliasId = info.$_POST.aliasId;
	  var isPublic = info.$_POST.isPublic || "yes";

	  var ver = await verifyAlias(aliasId, info)
	  if(!ver) {
		
		return er("Not your alias");
	  }

	  

	  if(!info.utils.verify(
		name,50
	  ) || description.length > 365) return er();

	  //editing existing heichel
	  var heichelId = info.$_POST.heichelId;
	  
	  //creating new heichel
	  if(!heichelId) {
		  
		let iteration = 0;
		let unique = false;
		
		
		while (!unique) {
		  heichelId = info.utils.generateId(name, false, iteration);
		  const existingHeichel = await info.db.get(sp+
			`/heichelos/${
			  heichelId
			}/info`);
		  
		  if (!existingHeichel) {
			unique = true;
		  } else {
			iteration += 1;
		  }
		}
		
	  }
	  
	  await info.db.write(
		sp+
		`/aliases/${
		  aliasId
		}/heichelos/${
		  heichelId
		}`
	  );

	  await info.db.write(
		sp+
		`/heichelos/${
		  heichelId
		}/info`, { name, description, author: aliasId }
	  );

	  await info.db.write(
		sp+
		`/heichelos/${
		  heichelId
		}/editors/${aliasId}`
	  );

	  
	  await info.db.write(
		sp+
		`/heichelos/${
		  heichelId
		}/viewers/${aliasId}`
	  );

	  if(isPublic == "yes") {
		await info.db.write(
		  sp+
		  `heichelos/${
			heichelId
		  }/public`
		);
	  }

	  return { name, description, author: aliasId, heichelId };
	}
  },

  /**
   * @endpoint /heichelos/details
   * returned the details of a 
   * lot of heichelos.
   * @returns 
   */

  "/alias/:alias/heichelos/details": async (v) => {
	if (info.request.method == "POST") {
	  const heichelIds = info.$_POST.heichelIds;
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
	  for(var i = 0; i < heichelIds.length; i++) {
		 var details = await getHeichel({
			heichelId:heichelIds[i], info, loggedIn,

			sp,
			er
		 });
		 console.log("Hi awd ",details,heichelIds,i)
		 if(!details) continue;
		 details.id = heichelIds[i]
		 
		results.push(details)
		 
	  }
	  return results;
  
	  return details;
	}
	if(info.request.method == "GET") {
		var route = `/api/social/heichelos/searchByAliasOwner/${
			v.alias
		}`
		var heichelos = await info.fetchAwtsmoos(route);
		return heichelos
	}
  },

  
  /**
   * 
   * @param {Object} vars 
   * @returns info.json of heichel with
   * @property name
   * @property description
   * @property author
   * 
   */

  "/alias/:alias/heichelos/:heichel": async vars => {
	if (info.request.method == "DELETE") {
	  if(!loggedIn()) {
		return er(NO_LOGIN);
	  }
  
	  // Verify ownership or permission to delete
	  // (add your verification logic here)
  
	  const heichelId = vars.heichel;
	  const aliasId = vars.alias;
	  try {
		// Delete heichel details
		await info.db.delete(sp+`/heichelos/${heichelId}/info`);
  
		// Delete references in other entities such as aliases, 
		//editors, viewers, etc.
		await info.db.delete(sp+`/aliases/${aliasId}/heichelos/${heichelId}`);
		await info.db.delete(sp+`/heichelos/${heichelId}`);
  
		return { message: "Heichel deleted successfully" };
	  } catch (error) {
		console.error("Failed to delete heichel", error);
		return er("Failed to delete heichel");
	  }
	}
  
	if (info.request.method == "PUT") {
	  if(!loggedIn()) {
		return er(NO_LOGIN);
	  }
  
	  // Verify ownership or permission to rename
	  // (add your verification logic here)
  
	  const heichelId = vars.heichel;
	  const newName = info.$_PUT.newName || info.$_PUT.name;
	  const newDescription = info.$_PUT.newDescription ||
		 info.$_PUT.description;
		 
	  if(
		newName && 
		!info.utils.verify(newName, 50)
	  ) {
		return er("Invalid new name");
	  }

	  if(newDescription && newDescription.length > 365) {
		return er("Description too long")
	  }
  
	  try {
		// Fetch the existing data
		const heichelData = await info.db.get(sp+`/heichelos/${heichelId}/info`);
  
		var modifiedFields = {
		  "name":false,
		  "description":false
		}
		// Update the name in the existing data
		if(newName) {
		  heichelData.name = newName;
		  modifiedFields.name = true;
		}

		if(newDescription) {
		  heichelData.description = newDescription;
		  modifiedFields.description = true
		}
		// Write the updated data back to the database
		await info.db.write(sp+`/heichelos/${heichelId}/info`, heichelData);
  
		return { message: "Heichel renamed successfully", newName, modifiedFields };
	  } catch (error) {
		console.error("Failed to rename heichel", error);
		return er("Failed to rename heichel");
	  }
	}

	// Existing GET logic
	return await getHeichel({
		heichelId:vars.heichel,
		sp, 
		info,loggedIn,
		er});
  },
  
  "/heichelos/searchByAliasOwner/:aliasId": async(v) => {
	  if (info.request.method == "GET") {
		  var heichelos = await getHeichelos({
			info, sp
		  });
		  var results = [];
		  for(var i = 0; i < heichelos.length; i++) {
			 var details = await getHeichel({
				heichelId:heichelos[i], info, loggedIn,

				sp,
				er
			 });
			 details.id = heichelos[i]
			 if(details.author == v.aliasId) {
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
	
	
	if (info.request.method == "GET") {
	  return await getPostsInHeichel({
		info,
		sp,
		heichelId:v.heichel
	  })
	}

	if (info.request.method == "POST") {
	  if(!loggedIn()) {
		return er(NO_LOGIN);
	  }
	  const title = info.$_POST.title;
	  const content = info.$_POST.content;
	  const heichelId = v.heichel;
	  var aliasId = info.$_POST.aliasId;
	  console.log("DOING",aliasId,heichelId,title,content)
	  var ver = await verifyHeichelAuthority({
		heichelId,
		sp,
		aliasId,
		info
	});
	  if(!ver) {
		return er(
		  "You don't have authority to post to this heichel"
		);
	  }

	  
	  if(
		!info.utils.verify(
		title,50 
		
	  ) || 
		(
		  content && content.length
		) > 5784 || !content
	  ) return er();
	  const postId = info.utils.generateId(title);
	  console.log('postId',postId)
	  await info.db.write(
		sp+
		`/heichelos/${
		  heichelId
		}/posts/${
		  postId
		}`, { title, content, author: aliasId }
	  );
	  return { title, postId };
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
	if (info.request.method == "POST") {
	  const postIds = info.$_POST.postIds;
	  
	  /**
	   * formatted:
	   * postIds: [
	   *  
	   *    postId
	   *    
	   *  
	   * ],
	   * heichelId (String)
	   */
	  
	  if (!postIds || !Array.isArray(postIds)) {
		return er("Invalid input");
	  }
	  
	  const details = await Promise.all(
		postIds.map(id => getPost({
			heichelId, postID:id,
			sp,
			info,
			loggedIn,
			userid,
			er,
			NO_PERMISSION,
			NO_LOGIN
		}))
	  );
  
	  return details;
	}

	if(info.request.method == "GET") {
		var postIDs = await getPostsInHeichel({
			info,
			sp,
			heichelId:v.heichel
		  });
		return await Promise.all(
			postIDs.map(async id => await getPost({
				heichelId, postID:id,
				sp,
				info,
				loggedIn,
				userid,
				er,
				NO_PERMISSION,
				NO_LOGIN
			}))
		)
	}
  },

  /**
   * 
   * @endpoint /posts/:post
   * @description gets details of 
   * one post
   * @returns 
   */
  "/heichelos/:heichel/post/:post": async (v) => {
		return await getDetailedPost({
			sp,
			userid,
			postID:v.post,
			heichelId:v.heichel,
			info,
			loggedIn,
			er,
			NO_PERMISSION,
			NO_LOGIN
		})
  	},
	"/heichelos/:heichel/posts/:post": async v => {
		return await getDetailedPost({
			sp,
			userid,
			postID:v.post,
			heichelId:v.heichel,
			info,
			loggedIn,
			er,
			NO_PERMISSION,
			NO_LOGIN
		})
	},
	/**
        seriesName required 
	description optional
        aliasId required

        **/
	"/heichelos/:heichel/addNewSeries":async(v)=>{
		return makeNewSeries({
			info,
			userid,
			er,
			heichelId:v.heichel,
			sp

		})

	},
	"/heichelos/:heichel/getAllSeries":async v=>{
		return await getAllSeriesInHeichel({
	info, 
	
        
        
        sp,
        userid,
	heichelId:v.heichel,
	er
})
	},

"/heichelos/:heichel/getAllSeries/details":async v=>{
		return await getAllSeriesInHeichel({
	info, 
	
        
        
        sp,
        userid,
			withDetails: true, 
	heichelId:v.heichel,
	er
})

	},
	"/heichelos/:heichel/getSeries/:series":async v=>{
		return await getSeries({
	info, 
	
        
        seriesId:v.series,
        sp,
        userid,
	heichelId:v.heichel,
	er
})

	},
	/**
 POST
       contentId required
       seriesId required
       aliasId required
       contentType required either "post" or "series"
 

        **/
	"/heichelos/:heichel/addContentToSeries":async(v)=>{
		return addContentToSeries({
			info,
			userid,
			heichelId:v.heichel,
			er,
			sp

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
 

        **/
	"/heichelos/:heichel/deleteContentFromSeries":async(v)=>{
		return deleteContentFromSeries({
			info,
			userid,
			heichelId:v.heichel,
			er,
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
	"/heichelos/:heichel/editSeriesDetails":async(v)=>{
		return editSeriesDetails({
			info,
			userid,
			heichelId:v.heichel,
			er,
			sp

		})

	},

	/**
 POST
       aliasId required
       seriesId required
       

        **/
	"/heichelos/:heichel/deleteSeriesFromHeichel":async(v)=>{
		return deleteSeriesFromHeichel({
			info,
			userid,
			heichelId:v.heichel,
			er,
			sp

		})

	},
	



	"/alias/:alias/heichelos/:heichel/ownership": async vars => {
		const heichelId = vars.heichel;
		var owns = await verifyHeichelAuthority
		({
			heichelId,
			aliasId:vars.alias,
			info,
			sp
			
		})
		
		if(owns) {
			return {yes: "You own this!", code: "YES"}
		} else {
			return {no: "You don't own it!", code: "NO"}
		}
	},
});

async function getDetailedPost({
	heichelId,
	sp,
	userid,
	postID,
	info,
	loggedIn,
	er,
	NO_PERMISSION,
	NO_LOGIN
}) {
	if (info.request.method == "GET") {
		  
  
		
		const postInfo = await getPost({
			  heichelId,
			  sp,
			  userid,
			  postID,
			  info,
			  loggedIn,
			  er,
			  NO_PERMISSION,
			  NO_LOGIN
		  })
		  
		if(!postInfo) return null;
		return postInfo;
	}
	
	if (info.request.method == "PUT") {
		if(!loggedIn()) {
			return er(NO_LOGIN);
		}

		const postId = postID
		const newTitle = info.$_PUT.newTitle ||
		  info.$_PUT.title;
		 
		const newContent = info.$_PUT.newContent ||
		  info.$_PUT.content;
		
		if(newTitle)
		  if(!info.utils.verify(newTitle, 50)) {
			  return er("Invalid new title");
		  }

		if(
		  newContent &&
		  newContent.length > 5784
		) {
		   {
			return er("Invalid content length (max: 5784)")
		  }
		}
		if(
		  newTitle ||
		  newContent
		) {
		  try {
			  // Fetch the existing data
			  const postData = await info.db
			  .get(sp+`/heichelos/${heichelId}/posts/${postId}`);
  
			  // Update the title and content in the existing data
			  if(newTitle)
				postData.title = newTitle;
			  
			  if(newContent)
				postData.content = newContent;
  
			  // Write the updated data back to the database
			  await info.db
			  .write(sp+`/heichelos/${heichelId}/posts/${postId}`, postData);
  
			  return { message: "Post updated successfully", newTitle, newContent };
		  } catch (error) {
			  console.error("Failed to update post", error);
			  return er("Failed to update post");
		  }
		} else {
		  return er("No info to update.")
		}
	}

	if (info.request.method == "DELETE") {

		if(!loggedIn()) {
			return er(NO_LOGIN);
		}

		const postId = postID

		try {
			// Delete post details
			await info.db.delete(sp+`/heichelos/${heichelId}/posts/${postId}`);

			return { message: "Post deleted successfully" };
		} catch (error) {
			console.error("Failed to delete post", error);
			return er("Failed to delete post");
		}
	}
}
async function getPost({
	heichelId, postID,
	info,
	loggedIn,
	sp,
	er,
	userid,
	NO_PERMISSION,
	NO_LOGIN
}) {
	var isAllowed = await verifyHeichelPermissions
	({
		heichelId,
		info,
		loggedIn,
		sp,
		er,
		
		userid,
		NO_PERMISSION,
		NO_LOGIN
	})
	
	if(isAllowed) {
	  var post = await info.db.get(
		sp+
		`/heichelos/${
		  heichelId
		}/posts/${
		  postID
		}`
	  );
	  post.id = postID
	  return post;
	}
  
	return null;
	
  }

  
async function getHeichel({
	heichelId, info, 
	loggedIn,
	sp,
	er
}) {
    var isAllowed = await verifyHeichelPermissions({
		heichelId,
		er,
		info,
		loggedIn
	})

    if(isAllowed)
      return await info.db.get(
        sp+
        `/heichelos/${heichelId}/info`
      );
    else return er(NO_PERMISSION);
}

// for viewing
async function verifyHeichelPermissions({
	heichelId,
	info,
	loggedIn,
	er,
	NO_PERMISSION,
	sp,
	NO_LOGIN,
	userid
}) {
	var isPublic = await info.db.get(
	  sp +
	  `/heichelos/${
		heichelId
	  }/public`
	);
	var isAllowed = true;
  
	if(!isPublic) {
	  if(!loggedIn()) {
		return er(NO_LOGIN);
	  }
	  var viewers = await info.db.get(
		sp + 
		`/heichelos/${
		  heichelId
		}/viewers`
	  );
  
	  if(!viewers) return er(NO_PERMISSION);
	  var myAliases = await info.db.get(
		`/users/${
		  userid
		}/aliases`
	  );
  
	  if(!myAliases) return er(NO_PERMISSION);
	  
	  isAllowed = false;
	  myAliases.forEach(q=> {
		if(viewers.includes(q)) {
		  isAllowed = true;
		}
	  });
  
	}
	return isAllowed;
  }


  async function getHeichelos({
	info,
	sp
  }) {
	const options = {
		page: info.$_GET.page || 1,
		pageSize: info.$_GET.pageSize || 10,
	};

	const heichelos = await info.db.get(
		sp+`/heichelos`, options
	);
	
	if(!heichelos) return [];

	return heichelos;
  }

  async function getPostsInHeichel({
	info,
	sp,
	heichelId
  }) {
	const options = {
		page: info.$_GET.page || 1,
		pageSize: info.$_GET.pageSize || 10
	  };

	
	  var posts = await info.db.get(
		sp+
		`/heichelos/${
		  heichelId
		}/posts`, 
		options
	  );
	  
	  if(!posts) posts = [];
	  
	  return posts;
  }

  
    
async function verifyHeichelAuthority
({heichelId, aliasId,
	sp,
	info}) {

	if(!heichelId || !aliasId) return false;

	var ownsAlias=await info
.fetchAwtsmoos("/api/social/aliases"
+aliasId+"/ownership");

if(ownsAlias.no)
return false;
	var editors = await info.db.get(
	  sp+
	  `/heichelos/${heichelId}/editors`
	);
	
  
	if(!editors || !Array.isArray(editors))
	  return false;
	
	  
	return editors.includes(aliasId);
  }

async function getAllSeriesInHeichel({
	info, 
	
        
        
        sp,
        userid,
	heichelId,
	withDetails=false, 
	er
}){

	try{
		var ids= await info
		.db.get(sp+
			`/heichelos/${
				heichelId
				
			}/series/`

		);
		if(!withDetails) return ids;
		return ids.map(async id=>{
			var f = await info
		.db.get(sp+
			`/heichelos/${
				heichelId
				
			}/series/${id}/prateem`

		);
			return f

		})
	} catch(e){
		return []
		return er({code:"NO_SERIES"})

	}

}

async function getSeries({
	info, 
	
        
        seriesId,
        sp,
        userid,
	heichelId,
	er
}){

	try{
		var prateem=await info
		.db.get(sp+
			`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/prateem`

		);
		var subSeries=await info
		.db.get(sp+
			`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/subSeries`

		);

		var posts=await info
		.db.get(sp+
			`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/posts`

		);

		return {
			id:serirsId,
			posts:Array.from(posts),
			prateem,
			subSeries:Array.from(subSeries)

		}
		
	} catch(e){
		return [];
		return er({code:"NO_SERIES"})

	}

}

async function deleteContentFromSeries({
	info, 
	
        
        
        sp,
        userid,
	heichelId,
	er
	

}) {

	var aliasId =info.$_POST.aliasId
	var ha=await verifyHeichelAuthority({
	info,
	aliasId,
	heichelId,
	sp

})

if(!ha){
	return er({code:"NO_AUTH"})

}

	try {
		var type=$_POST.contentType;
var wtw=wc(type)
if(!wtw) {
	return er({code:"NO_TYPE"})

}
	
//editing existing heichel
	
	    var seriesId =info.$_POST.seriesId
var contentId=info.$_POST.contentId
	
		var es/*existing series*/=await info
		.db.get(sp+
			`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/${wtw}`

		);
		if(!es){
			return er({code:"NO_CONTENT"})

		}
		var ar=Array.from(es);
		var i=ar.indexOf(contentId);
		var index=$_POST.indexInSeries;
		if(i<0) {
			try {
				i=parseInt(index);
				if(isNaN(i)) throw "no"
				

			} catch(e){
			return er({code:"NOT_FOUND_IN_SERIES"})
			}

		}
		ar.splice(i,1);
		var ob=Object.assign({},ar)
		ob.length=ar.length;
		await info
		.db.write(sp+
			`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/${wtw}`,ob

		);
		return {"success":{
			wrote: ob,
			deleted: contentId,
			from: seriesId

		}}

	} catch(e){
		return er({code:"NO_DEL"})

	}
}
async function deleteSeriesFromHeichel({
	info, 
	
        
        
        sp,
        userid,
	heichelId,
	er
	

}){
	var aliasId =info.$_POST.aliasId
	var ha=await verifyHeichelAuthority({
	info,
	aliasId,
	heichelId,
	sp

})

if(!ha){
	return er({code:"NO_AUTH"})

}

	var seriesId =info.$_POST.seriesId;
	try {
		await info.db.delete(
		`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesID
			
		}`);
		return er({code:"DELETED"});
	}  catch(e){
		return er({code:"NO_DEL"})

	}

}

function wc/*what content*/(type){
	return type=="post"?"posts":
	type=="series"?"subSeries"
	:null;
	

}
async function addContentToSeries({
	info, 
	
        
        
        sp,
        userid,
	heichelId,
	




	
er





}) {
var aliasId =info.$_POST.aliasId

var ha=await verifyHeichelAuthority({
	info,
	aliasId,
	heichelId,
	sp

})

if(!ha){
	return er({code:"NO_AUTH"})

}
	
var type=$_POST.contentType;
var wtw=wc(type)
if(!wtw) {
	return er({code:"NO_TYPE"})

}
	
//editing existing heichel
	
	    var seriesId =info.$_POST.seriesId
var contentId=info.$_POST.contentId
	try{
		var existingSeries=await info
		.db.get(sp+
			`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/${wtw}`

		)

		if(existingSeries) {
			var lng=existingSeries
			.length

			if(isNaN(lng+0)){
				lng=0

			}

		

			lng++;
			existingSeries.length
			=lng;
			existingSeries=Array.from(
				existingSeries

			)

			var index=$_POST.index||lng-1;
			

			existingSeries
				.splice(
					index, 
					0,
					contentId
				)
			var ob=Object. assign({},existingSeries)
			ob.length=lng;

			await info
		.db.write(sp+
			`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/${wtw}`, ob

		)

			return {success:contentId,length:lng,seriesId}

		} else {
			return er({code:"SERIES_NOT_FOUND"})

		}

	}catch(e){
		return er({code:"NO_ADD"})

	}


}

async function editSeriesDetails({
	info, 
	
        
        
        sp,
        userid,
	seriesId,
	heichelId,




	
er

}) {
	




var ha=await verifyHeichelAuthority({
	info,
	aliasId,
	heichelId,
	sp

})

if(!ha){
	return er({code:"NO_AUTH"})

}
try {

	var d=await info.db.get(
		`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesID
			
		}/prateem`)
	if(!d) {
		return er({code:"NO_SERIES_FOUND"})

	}
	var desc=info.$_POST.description;
	var nm=info.$_POST.seriesName;
	var wr={}
	if(desc) {
		if(desc.length<=888){
			d. description=desc;
			wr. description=true

		} else return er({
			code:"DESCRIPTION_TOO_LONG",
			needed:888
		})
		

	}

	if(nm){
		if(!info.utils.verify(
		nm,50
	  )) return er({code:"NOT_PARAMS"});
		ob.name=nm;
		wr.name=true

	}
	try{

	await info.db.write(
		`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesID
			
		}/prateem`,d);
		return {success: wr};
	} catch(e){
		return er({code:"NO_WRITE"})

	}

} catch(e) {
	return er({code:"NO_GET"})

}

}
async function makeNewSeries({
	info, 
	
        
        
        sp,
        userid,
	heichelId,




	
er





}) {
var aliasId =info.$_POST.aliasId





var ha=await verifyHeichelAuthority({
	info,
	aliasId,
	heichelId,
	sp

})

if(!ha){
	return er({code:"NO_AUTH"})

}


//editing existing heichel
	
var seriesName =info.$_POST.seriesName
var description =info.$_POST.description
if(!description) description=""
if(!info.utils.verify(
		seriesName,50
	  ) || description.length > 888) return er({code:"NOT_PARAMS"});
var seriesID="BH_"+Date.now()+"_"
	+(Math.floor(Math.random()*78)+700)
	  
try {
	await info.db.write(
		`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesID
			
		}/posts`,{
			
			length:0
			

		})

		await info.db.write(`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesID
			
		}/subSeries`,{
			
			length:0
			

		})

		await info.db.write(
		`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesID
			
		}/prateem`,{
			name:seriesName,
			id:seriesID,
			description, 
			author:aliasId,
			

		})

	
	return {success:{
		id:seriesID

	}}

} catch(e){
	return er({code:"ISSUE_WRITING"})

}




}
