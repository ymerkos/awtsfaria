/*B"H*/
/**
 * B"H
 */
var params = new URLSearchParams(location.search);
var ac = params.get("action");
var heichel = params.get("heichel")
var aliasId = params.get("alias")
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("heichel-form");
    const idValidation = document.getElementById("id-validation");
    var heichelIdInp = document.getElementById("heichel-id");
    var del = document.getElementById("delete");
    if(heichel) {
        heichelIdInp.value = heichel;
        heichelIdInp.disabled = true;
    }
    // Function to check if custom heichel ID is available
    async function checkheichelId({heichelId, heichelName}) {
        var params  = new URLSearchParams()
        if(heichelId) {
            params.set("inputId", heichelId)
        }
        if(heichelName) {
            params.set("name", heichelName)
        }
        const response = await fetch("/api/social/aliases/checkOrGenerateId", {
            method: "POST",
            
            body:params
        });
        const data = await response.json();
        return data;
    }

    // Function to validate custom heichel ID as user types
    function validateheichelId({heichelId, heichelName}) {
        checkheichelId({heichelId, heichelName}).then(data => {
            if (data.error) {
                if(data.error.code == "INV_NAME_LNGTH") {
                    idValidation.innerText = "heichel NAME is too long. Max: 50 characters.";
                } else if(data.error.code == "heichel_EXISTS")
                    idValidation.innerText = "heichel ID already taken. Please choose another.";
                else if(data.error.code == "NO_PARAMS") {
                    idValidation.innerText = "You need to enter an heichel name and proper heichel ID"
                }
                else {
                    console.log("Error:",data)
                    idValidation.innerText = data.error.message
                }
                idValidation.style.color = "red";
            } else {
                idValidation.innerText = "heichel ID available!";
                idValidation.style.color = "green";
                
            }
            if(!heichelId && data.aliasId)
                heichelIdInp.value = data.aliasId
        });
    }

    // Event listener for heichel name input
    document.getElementById("heichel-name").addEventListener("input", function(e) {
        validateheichelId({
            heichelName: e.target.value
        });
    });
    
    heichelIdInp.addEventListener("input", (e) => {
        validateheichelId({
            heichelId: e.target.value
        });
    })

    var endpoint = "https://awtsmoos.com/api/social/heichelos" + (heichel ? "/"+heichel:"");
    console.log(window.en = endpoint)
    if(del) {
        del.onclick = async () => {
            try {
                var r = await fetch(endpoint, {
                    method: "DELETE"
                });
                var j = await r.json()
                console.log(j)
                alert("Deleted Successfully")
            } catch(e){
                alert("PRobelm deleting");
                console.log(e);
            }
        }
    }
    // Event listener for form submission
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const heichelName = document.getElementById("heichel-name").value;
        const heichelDescription = document.getElementById("heichel-description").value;
        const heichelId = document.getElementById("heichel-id").value;

        // Submit the form data
        fetch(endpoint, {
            method: 
                ac == "update" ? 
                "PUT" : "POST",
            
            body: new URLSearchParams({
                ...(heichelName? {
                    heichelName
                } : {}), 
                
                ...(heichelDescription ? {
                    description:heichelDescription
                } : {}), 
                ...(aliasId ? {
                    aliasId
                } : {}),
                inputId: heichelId,
                id: heichelId,
                heichelId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log(data)
                alert("Error: " + JSON.stringify(data.error));
            } else {
                alert("heichel " + ac == "update" ? "Updated" : "Created" + " successfully!");
                backToProfile()
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


function backToProfile() {
    location.href = "/profile"
}