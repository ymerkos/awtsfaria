/**B"H */

document.addEventListener("DOMContentLoaded", function() {
    // Make a GET request to the /aliases/details endpoint
    fetch("/api/social/aliases/details")
        .then(response => response.json())
        .then(data => {
            const aliasList = document.querySelector(".alias-list");
            if(aliasList.length == 0) {
                aliasList.textContent = "No aliases yet!"
                return;
            }
            data.forEach(alias => {
                // Create a new alias div
                const aliasDiv = document.createElement("div");
                aliasDiv.classList.add("alias");

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
                const editButton = document.createElement("button");
                editButton.classList.add("edit-alias");
                editButton.textContent = "Edit Alias";
                aliasDiv.appendChild(editButton);

                // Append the alias div to the alias list
                aliasList.appendChild(aliasDiv);
            });
        })
        .catch(error => {
            aliasList.textContent = "Couldn't get your aliases"
            console.error("Error fetching aliases:", error);
        });
});