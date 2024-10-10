/**B"H */

document.addEventListener("DOMContentLoaded", async function() {
    // Make a GET request to the /aliases/details endpoint
    
    const aliasList = document.querySelector(".alias-list");
    window.aliasList = aliasList;
    console.log("Loading")
    var defaultAlias = (await (await fetch(`/api/social/alias/default`)).json())?.success;
    
    window.defaultAlias = defaultAlias;
    console.log("Got it",defaultAlias)
    try {
        var json = await (await fetch("/api/social/aliases/details")).json()
        displayData(json)
        
        
    } catch(error){
        aliasList.textContent = "Couldn't get your aliases"
        console.error("Error fetching aliases:", error);
    }
});

function displayData(data) {
    console.log("GOT aliases",data)
    if(!aliasList) {
        console.log("Cant ifndl ist")
    }
    if(data.length == 0) {
        aliasList.textContent = "No aliases yet!"
        return;
    }
    aliasList.innerHTML = ""
    /*
    if(defaultAlias) {
        var fnd = data.find(w=>w.id==defaultAlias)
        var ind = data.indexOf(fnd)
        if(ind >= 0) {
            data.splice(ind, 1);
            data.unshift(fnd);
            fnd.default = true;
        }
    }*/
    data.forEach(alias => {
        // Create a new alias div
        const aliasDiv = document.createElement("div");
        aliasDiv.classList.add("alias");


        // Add edit button
        const aliasId = document.createElement("a");
        aliasId.classList.add("alias-id");
        aliasId.href="/@"+alias.id
        aliasId.textContent = "@"+alias.id;
        aliasDiv.appendChild(aliasId);

        // Add alias name
        const aliasName = document.createElement("div");
        aliasName.classList.add("alias-name");
        aliasName.textContent = alias.name;
        aliasDiv.appendChild(aliasName);

        // Add alias description
        const aliasDescription = document.createElement("div");
        aliasDescription.classList.add("alias-description");
        aliasDescription.innerHTML = alias.description;
        aliasDiv.appendChild(aliasDescription);

        // Add edit button
        const man = document.createElement("a");
        man.classList.add("alias-manage");
        man.classList.add("btn")
        man.href="./alias-manage?" + new URLSearchParams({
            alias: alias.id,
            action: "update"
        });

        man.textContent = "Edit";

        aliasDiv.appendChild(man);

        if(alias.default) {
            var defLabel = document.createELement("div")
            defLabel.innerText = "Default"
            aliasDiv.appendChild(defLabel)
            defLabel.className = "defaultLabel"
            aliasDiv.classList.add("alias-manage");
        
        } else {
            var makeDefault = document.createELement("div")
            makeDefault.innerText = "Make Default"
            aliasDiv.appendChild(makeDefault)
            makeDefault.className = "makeDefault"
            makeDefault.classList.add("alias-manage");
            makeDefault.classList.add("btn")
            makeDefault.onclick = async () => {
                makeDefault.innerText = "Loading..."
                var defaultChange = (await (await fetch("api/social/alias/default", {
                    method: "POST",
                    body: "alias="+alias.id
                    
                })).json())?.success;
                if(defaultChange) {
                    
                    data.forEach(w=> {
                        if(w.id != alias.id) {
                            w.default = false
                        }
                    })
                    alias.default = true;
                    displayData(data)
                }
            }
            
        }

        // Append the alias div to the alias list
        aliasList.appendChild(aliasDiv);
    });
}
