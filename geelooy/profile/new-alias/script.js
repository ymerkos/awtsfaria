/**
 * B"H
 */

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("alias-form");
    const idValidation = document.getElementById("id-validation");

    // Function to check if custom alias ID is available
    async function checkAliasId(aliasId) {
        const response = await fetch("/api/social/aliases/checkOrGenerateId", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputId: aliasId })
        });
        const data = await response.json();
        return data;
    }

    // Function to validate custom alias ID as user types
    function validateAliasId(aliasId) {
        checkAliasId(aliasId).then(data => {
            if (data.error) {
                idValidation.innerText = "Alias ID already taken. Please choose another.";
                idValidation.style.color = "red";
            } else {
                idValidation.innerText = "Alias ID available!";
                idValidation.style.color = "green";
            }
        });
    }

    // Event listener for alias name input
    document.getElementById("alias-name").addEventListener("input", function() {
        const aliasId = this.value.replace(/\s/g, "_"); // Replace spaces with underscores
        validateAliasId(aliasId);
    });

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


// Function to show tooltip
function showTooltip() {
    const tooltip = document.querySelector(".tooltiptext");
    tooltip.classList.add("show");
}

// Function to hide tooltip
function hideTooltip() {
    const tooltip = document.querySelector(".tooltiptext");
    tooltip.classList.remove("show");
}