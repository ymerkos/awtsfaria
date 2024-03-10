/**B"H */

document.addEventListener("DOMContentLoaded", function() {
    // Make a GET request to the /aliases/details endpoint
    fetch("/api/social/aliases/details")
        .then(response => response.json())
        .then(data => {
            const aliasList = document.querySelector(".alias-list");
            if(data.length == 0) {
                aliasList.textContent = "No aliases yet!"
                return;
            }
            aliasList.innerHTML = ""
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
                aliasDescription.textContent = alias.description;
                aliasDiv.appendChild(aliasDescription);
    
                // Add edit button
                const man = document.createElement("a");
                man.classList.add("alias-manage");
                man.classList.add("btn")
                man.href="./alias-manage?" + URLSearchParams({
                    alias: alias.id,
                    action: "update"
                });

                man.textContent = "Manage";

                aliasDiv.appendChild(man);

                // Append the alias div to the alias list
                aliasList.appendChild(aliasDiv);
            });
        })
        .catch(error => {
            aliasList.textContent = "Couldn't get your aliases"
            console.error("Error fetching aliases:", error);
        });
});