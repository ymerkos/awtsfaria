//B"H
var base = "/api/social"
// Function to fetch and display emails
async function fetchEmails() {
   
    const response = await fetch(base+'/mail/get');
    const emails = await response.json();
    // Populate email list
    emails.forEach(email => {
        // Create HTML elements for each email
        const emailElement = document.createElement('div');
        emailElement.innerHTML = `
            <div class="email">
                <span class="sender">${email.from}</span>
                <span class="subject">${email.subject}</span>
                <span class="time">${new Date(email.timeSent).toLocaleString()}</span>
                <button class="delete" onclick="deleteEmail('${email.id}')">Delete</button>
            </div>`;
        emailElement.addEventListener('click', async (e) => showEmailPreview(email, e));
        document.getElementById('emailList').appendChild(emailElement);
    });
}

// Function to delete an email
async function deleteEmail(messageId) {
    const confirmation = confirm('Are you sure you want to delete this email?');
    if (confirmation) {
        await fetch(base+`/mail/delete/${messageId}`, { method: 'DELETE' });
        // Refresh email list after deletion
        document.getElementById('emailList').innerHTML = '';
        fetchEmails();
    }
}

// Function to compose and send email
async function composeEmail() {
    const toAlias = document.getElementById('recipient').value;
    var fromAlias = document.getElementById('from').value;
    const subject = document.getElementById('subject').value;
    const content = document.getElementById('content').value;
    var res = await fetch(base+`/mail/sendTo/${toAlias}/from/${fromAlias}?subject=${encodeURIComponent(subject)}&content=${encodeURIComponent(content)}`, { method: 'POST' });
    try {
        var j = await res.json();
      
        if(j.success) {

            location.reload();
            document.getElementById('composeEmail').value = "";
           
        } else {
            if(j.error) {
                alert(j.error.message)
            }
        }
    } catch(e){

    }
}

async function fetchAndPopulateAliases() {
    const response = await fetch(base+'/aliases/details');
    const aliases = await response.json();
    const fromSelect = document.getElementById('from');
    // Clear previous options
    fromSelect.innerHTML = '';
    // Populate select options
    aliases.forEach(alias => {
        const option = document.createElement('option');
        option.value = alias.aliasId;
        option.textContent = alias.name;
        fromSelect.appendChild(option);
    });
}

// Function to generate the compose email form dynamically
function generateComposeForm() {
    const composeEmailContainer = document.getElementById('composeEmail');
    composeEmailContainer.innerHTML = ''; // Clear previous content

    const form = document.createElement('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        composeEmail(); // Call composeEmail function to send email
    });

    // Recipient input
    const recipientLabel = document.createElement('label');
    recipientLabel.setAttribute('for', 'recipient');
    recipientLabel.textContent = 'Recipient:';
    form.appendChild(recipientLabel);

    const recipientInput = document.createElement('input');
    recipientInput.setAttribute('type', 'text');
    recipientInput.setAttribute('id', 'recipient');
    recipientInput.setAttribute('required', '');
    form.appendChild(recipientInput);

    // From select menu
    const fromLabel = document.createElement('label');
    fromLabel.setAttribute('for', 'from');
    fromLabel.textContent = 'From:';
    form.appendChild(fromLabel);

    const fromSelect = document.createElement('select');
    fromSelect.setAttribute('id', 'from');
    fromSelect.setAttribute('required', '');
    form.appendChild(fromSelect);

    // Populate "From" dropdown options
    fetchAndPopulateAliases();

    // Subject input
    const subjectLabel = document.createElement('label');
    subjectLabel.setAttribute('for', 'subject');
    subjectLabel.textContent = 'Subject:';
    form.appendChild(subjectLabel);

    const subjectInput = document.createElement('input');
    subjectInput.setAttribute('type', 'text');
    subjectInput.setAttribute('id', 'subject');
    subjectInput.setAttribute('required', '');
    form.appendChild(subjectInput);

    // Content textarea
    const contentLabel = document.createElement('label');
    contentLabel.setAttribute('for', 'content');
    contentLabel.textContent = 'Content:';
    form.appendChild(contentLabel);

    const contentTextarea = document.createElement('textarea');
    contentTextarea.setAttribute('id', 'content');
    contentTextarea.setAttribute('rows', '4');
    contentTextarea.setAttribute('required', '');
    form.appendChild(contentTextarea);

    // Submit button
    const sendButton = document.createElement('button');
    sendButton.setAttribute('type', 'submit');
    sendButton.textContent = 'Send';
    form.appendChild(sendButton);

    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.setAttribute('type', 'button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function() {
        composeEmailContainer.innerHTML = ''; // Clear compose email form
    });
    form.appendChild(cancelButton);

    composeEmailContainer.appendChild(form);
}

// Function to show email preview
async function showEmailPreview(email, e) {
    var tar = e.target;
    console.log(tar)
    if(tar && tar.classList && tar.classList.contains("delete")) {
        return;
    }
    // Create HTML for email preview
    const previewElement = document.createElement('div');
    previewElement.innerHTML = `
        <h2>${email.subject}</h2>
        <p><strong>From:</strong> ${email.from}</p>
        <p><strong>Time:</strong> ${new Date(email.timeSent).toLocaleString()}</p>
        <p>${email.content}</p>
        <button onclick="closeEmailPreview()">Close</button>`;
    // Clear previous preview and display new preview
    document.getElementById('emailPreview').innerHTML = '';
    document.getElementById('emailPreview').appendChild(previewElement);
    var setR = await fetch(`/api/social/mail/get/${
        email.id
    }/read`)
}

// Function to close email preview
function closeEmailPreview() {
    document.getElementById('emailPreview').innerHTML = '';
}

// Fetch and display emails on page load
window.onload = function() {
    fetchEmails();
    
// Add event listener to the button
document.getElementById('generateFormButton').addEventListener('click', handleGenerateFormButtonClick);

};

// Function to handle click event on the generate compose form button
function handleGenerateFormButtonClick() {
    generateComposeForm(); // Generate compose email form dynamically
}
