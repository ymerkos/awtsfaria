/**
 * B"H
 */

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("alias-form");
    const idValidation = document.getElementById("id-validation");
    var aliasIdInp = document.getElementById("alias-id")
    // Function to check if custom alias ID is available
    async function checkAliasId({aliasId, aliasName}) {
        var params  = new URLSearchParams({ 
            
            aliasName
        })
        if(aliasId) {
            params.set("inputId", aliasId, )
        }
        const response = await fetch("/api/social/aliases/checkOrGenerateId", {
            method: "POST",
            
            body:params
        });
        const data = await response.json();
        return data;
    }

    // Function to validate custom alias ID as user types
    function validateAliasId({aliasId, aliasName}) {
        checkAliasId({aliasId, aliasName}).then(data => {
            if (data.error) {
                idValidation.innerText = "Alias ID already taken. Please choose another.";
                idValidation.style.color = "red";
            } else {
                idValidation.innerText = "Alias ID available!";
                idValidation.style.color = "green";
                if(!aliasId)
                    aliasIdInp.value = data.aliasId
            }
        });
    }

    // Event listener for alias name input
    document.getElementById("alias-name").addEventListener("input", function(e) {
        validateAliasId({
            aliasName: e.target.value
        });
    });
    
    aliasIdInp.addEventListener("input", (e) => {
        validateAliasId({
            aliasId: e.target.value
        });
    })

    // Event listener for form submission
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const aliasName = document.getElementById("alias-name").value;
        const aliasDescription = document.getElementById("alias-description").value;
        const aliasId = document.getElementById("alias-id").value;

        // Submit the form data
        fetch("/api/social/aliases", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ aliasName, aliasDescription, inputId: aliasId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Error: " + data.error);
            } else {
                alert("Alias created successfully!");
                // Optionally redirect to another page or display a success message
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        });
    });

    document.querySelector(".tooltip").addEventListener("mouseenter", showTooltip);
    
    // Event listener for hiding tooltip
    document.querySelector(".tooltip").addEventListener("mouseleave", hideTooltip);

});

// Function to show tooltip at mouse cursor
function showTooltip(event) {
    const tooltip = document.querySelector(".tooltiptext");
    tooltip.style.display = "block";
    tooltip.style.top = (event.clientY + 10) + "px"; // Add 10px offset to avoid overlapping cursor
    tooltip.style.left = (event.clientX + 10) + "px"; // Add 10px offset to avoid overlapping cursor
}

// Function to hide tooltip
function hideTooltip() {
    const tooltip = document.querySelector(".tooltiptext");
    tooltip.style.display = "none";
}
