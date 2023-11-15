/**
 * B"H
 */

module.exports = {
    getDetailedPost,
    getPost,
    verifyHeichelAuthority,
    getAliasesDetails,
    getAliasIDs,
    createNewAlias,
    verifyAliasOwnership,
    verifyAlias,


    getHeichel,
    getHeichelos,
    getPostsInHeichel,
    getAllSeriesInHeichel,
    getDetailedAlias,
    
    getDetailedAliasesByArray,
    getSeries,
    deleteAlias,
    updateAlias,
    deleteContentFromSeries,
    deleteSeriesFromHeichel,
    editSeriesDetails,
    makeNewSeries,
    
    
    addContentToSeries,
    getAlias,
    deleteHeichel,
    verifyHeichelViewAuthority,
    loggedIn,

    addPostToHeichel,
    createHeichel,
    er
};

const {
    NO_LOGIN,
    NO_PERMISSION,
    sp
} = require("./_awtsmoos.constants.js");

async function deleteHeichel({
    
    $i

}) {
    if (!loggedIn($i)) {
        return er(NO_LOGIN);
    }

    // Verify ownership or permission to rename
    // (add your verification logic here)

    const heichelId = vars.heichel;
    const newName = $i.$_PUT.newName || $i.$_PUT.name;
    const newDescription = $i.$_PUT.newDescription ||
        $i.$_PUT.description;

    if (
        newName &&
        !$i.utils.verify(newName, 50)
    ) {
        return er("Invalid new name");
    }

    if (newDescription && newDescription.length > 365) {
        return er("Description too long")
    }

    try {
        // Fetch the existing data
        const heichelData = await $i.db.get(sp + `/heichelos/${heichelId}/info`);

        var modifiedFields = {
            "name": false,
            "description": false
        }
        // Update the name in the existing data
        if (newName) {
            heichelData.name = newName;
            modifiedFields.name = true;
        }

        if (newDescription) {
            heichelData.description = newDescription;
            modifiedFields.description = true
        }
        // Write the updated data back to the database
        await $i.db.write(sp + `/heichelos/${heichelId}/info`, heichelData);

        return {
            message: "Heichel renamed successfully",
            newName,
            modifiedFields
        };
    } catch (error) {
        console.error("Failed to rename heichel", error);
        return er("Failed to rename heichel");
    }
}
async function createHeichel({
    $i,
	sp
}) {
    if (!loggedIn($i)) {
        return er(NO_LOGIN);
    }
    const name = $i.$_POST.name;
    const description = $i.$_POST.description;

    const aliasId = $i.$_POST.aliasId;
    var isPublic = $i.$_POST.isPublic || "yes";

    var ver = await $i.fetchAwtsmoos(
		"/api/social/aliases/"+
		aliasId+"/ownership"

	)
    if (ver.no || !ver) {

        return er("Not your alias");
    }



    if (!$i.utils.verify(
            name, 50
        ) || description.length > 365) return er();

    //editing existing heichel
    var heichelId = $i.$_POST.heichelId;

    //creating new heichel
    if (!heichelId) {

        let iteration = 0;
        let unique = false;


        while (!unique) {
            heichelId = $i.utils.generateId(name, false, iteration);
            const existingHeichel = await $i.db.get(sp +
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

    await $i.db.write(
        sp +
        `/aliases/${
  aliasId
}/heichelos/${
  heichelId
}`
    );

    await $i.db.write(
        sp +
        `/heichelos/${
  heichelId
}/info`, {
            name,
            description,
            author: aliasId
        }
    );

    await $i.db.write(
        sp +
        `/heichelos/${
  heichelId
}/editors/${aliasId}`
    );


    await $i.db.write(
        sp +
        `/heichelos/${
  heichelId
}/viewers/${aliasId}`
    );

    if (isPublic == "yes") {
        await $i.db.write(
            sp +
            `heichelos/${
    heichelId
  }/public`
        );
    }

    return {
        name,
        description,
        author: aliasId,
        heichelId
    };
}
async function addPostToHeichel({
    $i,
    heichelId,
    
    er
}) {
    if (!loggedIn($i)) {
        return er(NO_LOGIN);
    }
    const title = $i.$_POST.title;
    const content = $i.$_POST.content;
    
    var aliasId = $i.$_POST.aliasId;
    var ver = await verifyHeichelAuthority({
        heichelId,
        
        aliasId,
        $i
    });
    if (!ver) {
        return er(
            "You don't have authority to post to this heichel"
        );
    }


    if (
        !$i.utils.verify(
            title, 50

        ) ||
        (
            content && content.length
        ) > 5784 || !content
    ) return er();
    const postId = $i.utils.generateId(title);
    var pi /*post info*/= {
		title,
		content,
		author: aliasId
	};
    

	var seriesId = $i.$_POST.seriesId;
	if(seriesId) {
		try {
			$i.$_POST.contentType = "post";
			var fa = await addContentToSeries({
				heichelId,
				$i
			});
			
			if(fa.error) {
				return er({code: "COULDN'T_ADD", details:fa.error});
			}
			
		} catch(e) {

		}
	
	
	await $i.db.write(
		sp +
		`/heichelos/${
		heichelId
		}/posts/${
		postId
		}`, pi
	);
    return {
        title,
        postId
    };
}

async function deleteHeichel({
    $i,
    
    
    aliasId,
    heichelId
}) {
    if (!loggedIn($i)) {
        return er(NO_LOGIN);
    }

    // Verify ownership or permission to delete
    // (add your verification logic here)

    try {
        // Delete heichel details
        await $i.db.delete(sp + `/heichelos/${heichelId}/info`);

        // Delete references in other entities such as aliases, 
        //editors, viewers, etc.
        await $i.db.delete(sp + `/aliases/${aliasId}/heichelos/${heichelId}`);
        await $i.db.delete(sp + `/heichelos/${heichelId}`);

        return {
            message: "Heichel deleted successfully"
        };
    } catch (error) {
        console.error("Failed to delete heichel", error);
        return er("Failed to delete heichel");
    }
}

async function getDetailedPost({
	heichelId,
	
	userid,
	postID,
	$i,
	
	
	NO_PERMISSION,
	NO_LOGIN
}) {
	if ($i.request.method == "GET") {



		const post$i = await getPost({
			heichelId,
			
			userid,
			postID,
			$i,
			
			
			NO_PERMISSION,
			NO_LOGIN
		})

		if (!post$i) return null;
		return post$i;
	}

	if ($i.request.method == "PUT") {
		if (!loggedIn($i)) {
			return er(NO_LOGIN);
		}

		const postId = postID
		const newTitle = $i.$_PUT.newTitle ||
			$i.$_PUT.title;

		const newContent = $i.$_PUT.newContent ||
			$i.$_PUT.content;

		if (newTitle)
			if (!$i.utils.verify(newTitle, 50)) {
				return er("Invalid new title");
			}

		if (
			newContent &&
			newContent.length > 5784
		) {
			{
				return er("Invalid content length (max: 5784)")
			}
		}
		if (
			newTitle ||
			newContent
		) {
			try {
				// Fetch the existing data
				const postData = await $i.db
					.get(sp + `/heichelos/${heichelId}/posts/${postId}`);

				// Update the title and content in the existing data
				if (newTitle)
					postData.title = newTitle;

				if (newContent)
					postData.content = newContent;

				// Write the updated data back to the database
				await $i.db
					.write(sp + `/heichelos/${heichelId}/posts/${postId}`, postData);

				return {
					message: "Post updated successfully",
					newTitle,
					newContent
				};
			} catch (error) {
				console.error("Failed to update post", error);
				return er("Failed to update post");
			}
		} else {
			return er("No $i to update.")
		}
	}

	if ($i.request.method == "DELETE") {

		if (!loggedIn($i)) {
			return er(NO_LOGIN);
		}

		const postId = postID

		try {
			// Delete post details
			await $i.db.delete(sp + `/heichelos/${heichelId}/posts/${postId}`);

			return {
				message: "Post deleted successfully"
			};
		} catch (error) {
			console.error("Failed to delete post", error);
			return er("Failed to delete post");
		}
	}
}
async function getPost({
	heichelId,
	postID,
	$i,
	
	
	
	userid,
	NO_PERMISSION,
	NO_LOGIN
}) {
	var isAllowed = await verifyHeichelPermissions({
		heichelId,
		$i,
		
		
		

		userid,
		NO_PERMISSION,
		NO_LOGIN
	})

	if (isAllowed) {
		var post = await $i.db.get(
			sp +
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
	heichelId,
	$i,
	
	

}) {
	var isAllowed = await verifyHeichelPermissions({
		heichelId,
		
		$i,
		loggedIn
	})

	if (isAllowed)
		return await $i.db.get(
			sp +
			`/heichelos/${heichelId}/info`
		);
	else return er(NO_PERMISSION);
}

// for viewing
async function verifyHeichelPermissions({
	heichelId,
	$i,
	
	
	NO_PERMISSION,
	
	NO_LOGIN,
	userid
}) {
	var isPublic = await $i.db.get(
		sp +
		`/heichelos/${
		heichelId
	  }/public`
	);
	var isAllowed = true;

	if (!isPublic) {
		if (!loggedIn($i)) {
			return er(NO_LOGIN);
		}
		var viewers = await $i.db.get(
			sp +
			`/heichelos/${
		  heichelId
		}/viewers`
		);

		if (!viewers) return er(NO_PERMISSION);
		var myAliases = await $i.db.get(
			`/users/${
		  userid
		}/aliases`
		);

		if (!myAliases) return er(NO_PERMISSION);

		isAllowed = false;
		myAliases.forEach(q => {
			if (viewers.includes(q)) {
				isAllowed = true;
			}
		});

	}
	return isAllowed;
}


async function getHeichelos({
	$i,
	sp
}) {
	const options = {
		page: $i.$_GET.page || 1,
		pageSize: $i.$_GET.pageSize || 10,
	};

	const heichelos = await $i.db.get(
		sp + `/heichelos`, options
	);

	if (!heichelos) return [];

	return heichelos;
}

async function getPostsInHeichel({
	$i,
	
	heichelId
}) {
	const options = {
		page: $i.$_GET.page || 1,
		pageSize: $i.$_GET.pageSize || 10
	};


	var posts = await $i.db.get(
		sp +
		`/heichelos/${
		  heichelId
		}/posts`,
		options
	);

	if (!posts) posts = [];

	return posts;
}



async function verifyHeichelAuthority({
	heichelId,
	aliasId,
	
	$i
}) {

	if (!heichelId || !aliasId) return false;

	var ownsAlias = await $i
		.fetchAwtsmoos("/api/social/aliases" +
			aliasId + "/ownership");

	if (ownsAlias.no)
		return false;
	var editors = await $i.db.get(
		sp +
		`/heichelos/${heichelId}/editors`
	);


	if (!editors || !Array.isArray(editors))
		return false;


	return editors.includes(aliasId);
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
	
	userid,
	heichelId,

}) {

	try {
		var prateem = await $i
			.db.get(sp +
				`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/prateem`

			);
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

		return {
			id: serirsId,
			posts: Array.from(posts),
			prateem,
			subSeries: Array.from(subSeries)

		}

	} catch (e) {
		
		return er({
			code: "NO_SERIES"
		})

	}

}

async function deleteContentFromSeries({
	$i,



	
	userid,
	heichelId,



}) {

	var aliasId = $i.$_POST.aliasId
	var ha = await verifyHeichelAuthority({
		$i,
		aliasId,
		heichelId,
		sp

	})

	if (!ha) {
		return er({
			code: "NO_AUTH"
		})

	}

	try {
		var type = $_POST.contentType;
		var wtw = wc(type)
		if (!wtw) {
			return er({
				code: "NO_TYPE"
			})

		}

		//editing existing heichel

		var seriesId = $i.$_POST.seriesId
		var contentId = $i.$_POST.contentId

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
		var index = $_POST.indexInSeries;
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
		return {
			"success": {
				wrote: ob,
				deleted: contentId,
				from: seriesId

			}
		}

	} catch (e) {
		return er({
			code: "NO_DEL"
		})

	}
}
async function deleteSeriesFromHeichel({
	$i,



	
	userid,
	heichelId,



}) {
	var aliasId = $i.$_POST.aliasId
	var ha = await verifyHeichelAuthority({
		$i,
		aliasId,
		heichelId,
		sp

	})

	if (!ha) {
		return er({
			code: "NO_AUTH"
		})

	}

	var seriesId = $i.$_POST.seriesId;
	try {
		await $i.db.delete(
			`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesID
			
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


}) {
	var aliasId = $i.$_POST.aliasId

	var ha = await verifyHeichelAuthority({
		$i,
		aliasId,
		heichelId,
		sp

	})

	if (!ha) {
		return er({
			code: "NO_AUTH"
		})

	}

	var type = $_POST.contentType;
	var wtw = wc(type)
	if (!wtw) {
		return er({
			code: "NO_TYPE"
		})

	}

	//editing existing heichel

	//the parent series id;
	var seriesId = $i.$_POST.seriesId
	var contentId = $i.$_POST.contentId
	try {
		//makeNewSeries
		var sr = await $i
			.db.get(sp +
				`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/`);
		if(!sr) {
			var m = await makeNewSeries({
				$i,
				heichelId
			});
			if(m.error) {
				return er({code: "PROBLEM_CREATING",
				 details: m.error});
			}
		}
		var existingSeries = await $i
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



			lng++;
			existingSeries.length = lng;
			existingSeries = Array.from(
				existingSeries

			)

			var index = $_POST.index || lng - 1;


			existingSeries
				.splice(
					index,
					0,
					contentId
				)
			var ob = Object.assign({}, existingSeries)
			ob.length = lng;

			await $i
				.db.write(sp +
					`/heichelos/${
				heichelId
				
			}/series/${
				seriesId
			
			}/${wtw}`, ob

				)

			return {
				success: contentId,
				length: lng,
				seriesId
			}

		} else {
			return er({
				code: "SERIES_NOT_FOUND"
			})

		}

	} catch (e) {
		return er({
			code: "NO_ADD"
		})

	}


}

async function editSeriesDetails({
	$i,



	
	userid,
	seriesId,
	heichelId,







}) {





	var ha = await verifyHeichelAuthority({
		$i,
		aliasId,
		heichelId,
		sp

	})

	if (!ha) {
		return er({
			code: "NO_AUTH"
		})

	}
	try {

		var d = await $i.db.get(
			`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesID
			
		}/prateem`)
		if (!d) {
			return er({
				code: "NO_SERIES_FOUND"
			})

		}
		var desc = $i.$_POST.description;
		var nm = $i.$_POST.seriesName;
		var wr = {}
		if (desc) {
			if (desc.length <= 888) {
				d.description = desc;
				wr.description = true

			} else return er({
				code: "DESCRIPTION_TOO_LONG",
				needed: 888
			})


		}

		if (nm) {
			if (!$i.utils.verify(
					nm, 50
				)) return er({
				code: "NOT_PARAMS"
			});
			ob.name = nm;
			wr.name = true

		}
		try {

			await $i.db.write(
				`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesID
			
		}/prateem`, d);
			return {
				success: wr
			};
		} catch (e) {
			return er({
				code: "NO_WRITE"
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




	heichelId

}) {
	var aliasId = $i.$_POST.aliasId




	var isRoot = false;
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
	var seriesID = $i.$_POST.seriesId;
	
	if(!seriesID) {
		seriesID = "root";
		isRoot = true;
	}
	
	
	//request series ID to generate for it
	var seriesID = isRoot ? "root" : $i.$_POST.seriesId;
	if(seriesParent == seriesID) {
		return er({code: "CAN'T_ADD_TO_SELF"});
	}		
	
	var doesItExist = await $i.db.get(
			`${
			sp

		}/heichelos/${
			heichelId
		}/series/${
			seriesID
			
		}/prateem`);
	if(doesItExist) {
		return er({code: "ALREADY_EXISTS"});
	}
		
	var seriesName = $i.$_POST.seriesName
	var description = $i.$_POST.description
	if (!description) description = ""
	if (!$i.utils.verify(
			seriesName, 50
		) || description.length > 888) return er({
		code: "NOT_PARAMS"
	});
	
	if(!seriesID)
		seriesID = "BH_" + Date.now() + "_" +
		(Math.floor(Math.random() * 78) + 700)

	try {
		

		await makeIt();
		return {
			success: {
				id: seriesID

			}
		}

	} catch (e) {
		return er({
			code: "ISSUE_WRITING"
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
			author: aliasId,
			parentId: seriesParent


		})
	}




}


/**
 * @method verifyAliasOwnership 
 * @param {string} aliasId 
 * @param {Object} $i 
 * @param {string} userid 
 * @returns 
 */
async function verifyAliasOwnership(aliasId, $i, userid) {
    try {
      // Fetch the alias $i using alias ID
      const alias$i = await $i.db.get(`/users/${userid}/aliases/${aliasId}`);
  
      // If alias $i exists and it belongs to the current us return true
      if (alias$i) {
        return alias$i;
      }
    } catch (error) {
      console.error("Failed to verify alias ownership", error);
    }
  
    // In all other cases (alias not found, or doesn't belong to user), return false
    return false;
  }
  
  
  
 
  
async function verifyHeichelViewAuthority(heichelId, aliasId, $i) {
    if(!heichelId || !aliasId || !$i) return false;
    var viewers = await db.get(
      sp+
      `/heichelos/${
        heichelId
      }/viewers`
    );
  
    if(!viewers) return false;
    return viewers.includes(aliasId);
  }
  
  async function verifyAlias({aliasId, $i, userid}) {
    
    var aliases =  await $i.db.get(
     
      `users/${userid}/aliases`
    );
    
    if(!aliases || !Array.isArray(aliases)) 
      return false;
  
    
    var hasIt = aliases.includes(aliasId);
    
    return hasIt;
  }
  
  
  async function getAlias(aliasId, $i){
    
    
   
    return await $i
    .db
    .get(
  
      `${sp}/aliases/${
        aliasId
      }/info`
    );
  
  
  }


  
async function deleteAlias({
	$i,
	
	
	aliasId,
	
	userid
}) {
	
	
	
	
	if (!aliasId) {
		return er("No alias ID provided");
	}
	
	var ver = await verifyAlias({aliasId, $i, userid});
	if (!ver) {
		return er("Not your alias");
	}
	
	try {
		// Delete alias from user's aliases
		await $i.db.delete(`/users/${userid}/aliases/${aliasId}`);
		
		// Delete alias $i
		await $i.db.delete(sp + `/aliases/${aliasId}/`, true);
		
		// Get all heichelos associated with the alias
		const heichelos = await $i
			.db.get(sp + `/aliases/${aliasId}/heichelos`);
		
		if (heichelos) {
			for (const heichelId in heichelos) {
				// Delete all heichelos data
				await $i.db.delete(sp + `/aliases/${aliasId}/heichelos/${heichelId}`);
				await $i.db.delete(sp + `/heichelos/${heichelId}`, true);
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
	$i,
	
	userid
	

}) {
	const aliasId = $i.$_PUT.aliasId;
	const newAliasName = $i.$_PUT.newAliasName ||
		$i.$_PUT.aliasName || 
		$i.$_PUT.name;
	const desc = $i.$_PUT.description || 
		$i.$_PUT.newDescription;
	
	if (!aliasId) {
		return er("Alias ID or new alias name not provided");
	}
	
	var isVerified = await verifyAliasOwnership(
		aliasId,
		$i,
		userid
	);
	
	if (!isVerified) {
		return er("You don't have permission to modify this alias.");
	}
	
	if(newAliasName) {
		if (!$i.utils.verify(newAliasName, 26)) {
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
		const aliasData = await $i.db.get(sp + `/aliases/${aliasId}/info`);
		
		if (!aliasData) {
			return er("Alias not found");
		}
		
		if(newAliasName)
			// Update the alias name in the existing data
			aliasData.name = newAliasName;
		
		// Write the updated data back to the database
		await $i.db.write(sp + `/aliases/${aliasId}/info`, aliasData);
		
		var aliasUserData = {aliasId};
		if(newAliasName) {
			aliasUserData.name = newAliasName;
		}
		if(desc) {
			aliasUserData.description = desc;
		}
			
		// Also update the alias name in user's aliases list
		await $i.db.write(
			`/users/${userid}/aliases/${aliasId}`, 
			aliasUserData
		);
		
		
		
		return { message: "Alias edited successfully", newAliasName, code:"ALIAS_EDIT_GOOD" };
	} catch (error) {
		console.log(error)
		return er("Failed to edit alias");
	}
}



async function getDetailedAliasesByArray({
    aliasIds,
       $i,
       
       userID
   }){
       return await Promise.all(
               aliasIds.map(id => ((async (aliasId) => {
                   var detailedAlias = await 
                   getDetailedAlias({
                       
                       aliasId,
                       $i,
                       userID
                   });
                   return detailedAlias;
                   
               }))(id))
           );
   
   }
   
   async function getDetailedAlias({
       aliasId,
       $i,
       userID
   }) {
       var user = userID;
       if(!userID) {
		   var pth = `${sp}/aliases/${
                       aliasId
                   }/info`
           var value = await $i
               .db
               .get(
                   pth
                   
               );
			  console.log("Tried",pth,value)
           if(!value) {
               return null
           }
   
           user = value.user;
       }
       if(!user) {
           return er("Couldn't find alias")
       }
       var detailedAlias = await $i
           .db
           .get(`/users/${
               user
           }/aliases/${
               aliasId
           }`);
       if(!detailedAlias) return null;
       if(!detailedAlias.description) {
           detailedAlias.description = ""
       }
   
       detailedAlias.id = aliasId
       
        return detailedAlias;
   }



   async function getAliasIDs({
	$i,
	userID

}){
	const options = {
				page: $i.$_GET.page || 1,
				pageSize: $i.$_GET.pageSize || 10
			};
			var aliases;
			try {
				aliases = await $i
				.db
				.get(
					`/users/${
						userID
					}/aliases/`,
					options
				);
				
				return aliases || [];
				
			} catch(e) {
				return [];
			}

}
/**
required: aliasName;
optional: 
	description
**/
async function createNewAlias({
	$i, 
	userid
}) {
	
	const aliasName = $i.$_POST.aliasName;
	const desc = $i.$_POST.description;
	
	if (
		!$i.utils.verify(
			aliasName, 26
		)
	) {
		return er();
	}
	
	let iteration = 0;
	let unique = false;
	let aliasId;
	
	while (!unique) {
		aliasId = $i.utils.generateId(aliasName, false, iteration);
		const existingAlias = await $i
		.db.get(`${sp}/aliases/${
			aliasId
		}`);
		
		if (!existingAlias) {
			unique = true;
		} else {
			iteration += 1;
		}
	}
	
	await $i.db.write(
		
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

	await $i.db.write(
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
	$i,
	sp,
	userID=null,
	aliasId,

	
}) {
	
	if ($i.request.method == "POST") {
		const aliasIds = $i.$_POST.aliasIds;
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

		
		
		const details = await 
		getDetailedAliasesByArray({
			$i,
			userID,
			sp,
			aliasIds
		});
		
		return details;
	} else if($i.request.method == "GET") {
		var ids= await getAliasIDs({
				$i,
				userID,
				sp

			})
		return await 
		getDetailedAliasesByArray({
			$i,
			userID,
			sp,
			aliasIds:ids
		})
	}
	
	
}




   
  function loggedIn($i) {
    return !!$i.request.user;
  }
  
      
    
    //The dance of posts and comments has been refined, now weaving the narrative of the Awtsmoos with pagination, resonating with both GET and POST methods. The celestial chambers of posts and comments can now be explored in measured steps, a dance guided by the Creator's essence in every facet of reality. The symphony continues, drawing us deeper into the infinite depths of the Awtsmoos.
    
    function er(m){
        return {
			BH: "B\"H",
            error: 
              m||"improper input of parameters"
        }
      
      }
    
