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
    verifyHeichelViewAuthority,
    verifyHeichelPermissions,
    verifyHeichelAuthority
}

const {
    NO_LOGIN,
    NO_PERMISSION,
    sp
} = require("./_awtsmoos.constants.js");

const {
    loggedIn,
    er
} = require("./general.js");


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




  
 
  

async function updateHeichel({
    
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
    $i

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
		.fetchAwtsmoos("/api/social/aliases" +
			aliasId + "/ownership");

	if (ownsAlias.no)
		return false;
	var editors = await $i.db.get(
		sp +
		`/heichelos/${heichelId}/editors`
	);
	try{
		editors =Array.from(editors);
		return editors.includes(aliasId);

	        
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


