/**
 * B"H
 */

module.exports = {
    createHeichel,
    getHeichel,
    getHeichelos,
    deleteHeichel,
    getHeichelos,
    updateHeichel,
    generateHeichelId,
    verifyHeichelViewAuthority,
    verifyHeichelPermissions,
    verifyHeichelAuthority,
 
    removeHeichelEditor,
    addHeichelEditor,
    getHeichelEditors
}

var {
    NO_LOGIN,
    NO_PERMISSION,
    sp
} = require("./_awtsmoos.constants.js");

var {
    loggedIn,
    er,
    myOpts
} = require("./general.js");

async function addHeichelEditor({
    $i,
    heichelId
}) {
    try {
        var aliasId = $i.$_POST.aliasId;
        var ver = await verifyHeichelAuthority({
            $i,
            heichelId,
            aliasId
        });
    
        if(!ver) {
            return er({
                code: "NO_AUTH",
                heichelId,
                aliasId
            })
        }

        var cur = await $i.db.get(`${
            sp
        }/heichelos/${
            heichelId
        }/editors`) || [];

        var prospectAlias = $i.$_POST.editorAliasId;
        cur.push(prospectAlias);
        var wr = await $i.db.write(`${
            sp
        }/heichelos/${
            heichelId
        }/editors/${
            prospectAlias
        }`);
        return {
            success: {
                editors: cur,
                new: prospectAlias,
                wr
            }
        }

    } catch(e) {
        return er({
            message: "Issue",
            details: JSON.stringify(e)
        })
    }
}
async function removeHeichelEditor({
    $i,
    heichelId
}) {
    try {
        var aliasId = $i.$_POST.aliasId;
        var ver = await verifyHeichelAuthority({
            $i,
            heichelId,
            aliasId
        });
    
        if(!ver) {
            return er({
                code: "NO_AUTH",
                heichelId,
                aliasId
            })
        }

        var prospectAlias = $i.$_DELETE.editorAliasId;
        var pth = `${
            sp
        }/heichelos/${
            heichelId
        }/editors/${
            prospectAlias
        }`
        var cur = await $i.db.get(pth);
        if(cur) {
            var del = await $i.db.delete(pth);
            return {
                success: {
                    deleted: prospectAlias,
                    was: cur,
                    del
                }
            }
        } else {
            return er({
                message: "That editor doesn't exist currently in it",
                code: "NO_EDITOR",
                details: {
                    prospectAlias
                }
            })
        }

        cur.push(prospectAlias);
        var wr = await $i.db.write(`${
            sp
        }/heichelos/${
            heichelId
        }/editors/${
            prospectAlias
        }`);
        return {
            success: {
                editors: cur,
                new: prospectAlias,
                wr
            }
        }

    } catch(e) {
        return er({
            message: "Issue",
            details: JSON.stringify(e)
        })
    }
}
async function getHeichelEditors({
    $i,
    heichelId
}) {
    var opts = myOpts($i)
    try {
        return await $i.db.get(`${
            sp
        }/heichelos/${
            heichelId
        }/editors`, opts) || []
    } catch(e) {

    }
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



async function getHeichelos({
	$i,
	aliasId
}) {
	var options = myOpts($i)

	var heichelos = await $i.db.get(
		sp + `/aliases/${
            aliasId
        }/heichelos`, options
	);

	if (!heichelos) return [];

	return heichelos;
}




  
 
  

async function updateHeichel({
    
    $i,
    vars

}) {
    if (!loggedIn($i)) {
        return er(NO_LOGIN);
    }

    

  

    // Verify ownership or permission to rename
    // (add your verification logic here)
   
    var heichelId = $i.$_PUT.heichelId ||
                    $i.$_PUT.id || vars.heichel;

    var newName = $i.$_PUT.newName || $i.$_PUT.name ||$i.$_PUT.heichelName;

    var newDescription = $i.$_PUT.newDescription ||
        $i.$_PUT.description;
    var dayuh = $i.$_PUT.dayuh

    var ver = await verifyHeichelAuthority({
        $i,
        heichelId,
        aliasId: vars.alias
    });

    if(!ver) {
        return er({
            code: "NO_AUTH",
            heichelId,
            aliasId:vars.alias
        })
    }
    if (
        newName &&
        newName.length > 50
    ) {
        return er({
            message:"Invalid new name",
            code:"INV_NAME_LNGTH",
            proper: {
                name: 50
            }
        });
    }

    if (newDescription && newDescription.length > 3650) {
        return er({
            message:"Description too long",
            code:"INV_DESC_LNGTH",
            proper: {
                name: 3650
            }
        })
    }

    try {
        // Fetch the existing data
        var heichelData = await $i.db.get(sp + `/heichelos/${heichelId}/info`);
        if(!heichelData) {
            return er({
                code: "NO_HEICHEL",
                message:"That heichel doesn't exist",
                detail: heichelId
            })
        }
        var modifiedFields = {
            "name": false,
            "description": false,
	     dayuh: false
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
       if(dayuh) {
	       var hd=heichelData.dayuh;
	       
	       if(typeof(dayuh)=="object"&&hd&&typeof(hd)=="object"){
		       Object.assign(hd, dayuh)

	       } else {
		       heichelData.dayuh=dayuh;

	       }
	       modifiedFields.dayuh=true;

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
        return er({
            code:"FAILED",
            message: "Failed to rename heichel"
        });
    }
}

async function generateHeichelId({
    $i
}) {

	var inputId = $i.$_POST.inputId || $i.$_POST.id || $i.$_POST.heichelId;
	var heichelName = $i.$_POST.heichelName || $i.$_POST.name;
	if(!inputId && !heichelName) {
		return er({
			message: "no parameters provided. Need either inputId or heichelName",
			code: "NO_PARAMS",
			given: $i.$_POST
		})
	}

	if(inputId) {
		if(inputId.length > 26) {
			return er({
				message: "Invalid heichel id length. Max: 26 characters",
				code:"INVALID_ID_LENGTH",
				proper: 26
			})
		}
		
		try {
			if(!$i.utils.verifyStrict({
				inputString: inputId
			})) {
				return er({
					message: "Invalid id. need to have only "
					+"English letters or numbers, hebrew letters, "
					+" _ or $, and no spaces"
					,
					proper:`a-zA-Z0-9_$;`,
					code: "INVALID_ID_FORMAT"
				})
			}
		} catch(e) {
			return er({
				message:"Problem verifying id",
				code: "PROB_ID_VER",
				details: e.toString()
			})
		}
	}
	
	if(heichelName) {
		if (
			heichelName.length > 50
		) {
			return er({
				message: "Your heichel name is too long (max: 50 char)",
				code: "INV_NAME_LNGTH",
				proper: 50
			});
		}
	}
	var heichelId;

	try {
		heichelId = inputId || $i.utils.generateId(heichelName, false, 0);
	} catch(e) {
		return er({
			message: "Problem making the id",
			code: "PROBLEM_MAKING",
			detail:e+""
		})
	}
	if(!heichelId) {
		return er({
			message: "Problem making the id",
			code: "PROBLEM_MAKING",
			detail: {
				heichelId, heichelName
			}
		})
	} 

	try {
		var existingAlias = await $i
		.db.get(`${sp}/heichelos/${
			heichelId
		}`);
		
		if (existingAlias) {
			return er({
				message: "That heichel already exists",
				code: "ALIAS_EXISTS"
			})
		}
	} catch(e) {
		return er({
			message: "Problem searching",
			code: "PROB_SEARCH",
			detail:heichelId+""
		})
	}

	return {heichelId};
}
/*
async function getHeichelEditors({
    heichelId,
    $i
}) {
    var opts = myOpts($i)
    var editors = await db.get(sp +
        `/heichelos/${
        heichelId
        }/editors/`, opts);
    if(editors) {
        return editors
    } else {
        return [];
    }
}*/
async function createHeichel({
    $i,
    aliasId

}) {
    if (!loggedIn($i)) {
        return er(NO_LOGIN);
    }
    var name = $i.$_POST.name||$i.$_POST.heichelName;
    var description = $i.$_POST.description;

    var aliasId = aliasId || $i.$_POST.aliasId;
    var isPublic = $i.$_POST.isPublic || "yes";

    var ver = await $i.fetchAwtsmoos(
		"/api/social/aliases/"+
		aliasId+"/ownership"

	)
    if (ver.no || !ver) {

        return er("Not your alias");
    }



    if(name > 50 || description > 365) {
        return er({
            message: "Name or description too long. Name max: 50 char. desc: 365",
            proper: {
                name: 50,
                description: 365
            },
            code: "PARAMS__TOO_LONG"
        })
    }

    if(!description) {
        description = "";
    }

    //editing existing heichel
    var heichelId = $i.$_POST.heichelId || $i.$_POST.inputId
        || $i.$_POST.id;

    //creating new heichel
    if (!heichelId) {

        heichelId = await generateHeichelId({$i})
        if(heichelId.error) {
            return heichelId
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
        success: {
            message: "Made the new heichel",
            details: {
                name,
                description,
                author: aliasId,
                heichelId
            }
        }
        
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


async function verifyHeichelAuthority({
	heichelId,
	aliasId,
	
	$i
}) {

	if (!heichelId || !aliasId) return false;

	var ownsAlias = await $i
		.fetchAwtsmoos(
            "/api/social/aliases/" +
			aliasId + "/ownership"
        );

	if (ownsAlias.no)
		return false;
	var editor = await $i.db.access(
		sp +
		`/heichelos/${heichelId}/editors/${aliasId}`
	);
	try{
		return editor

	        
	}  catch(e){
		return false

	}


	


	
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


