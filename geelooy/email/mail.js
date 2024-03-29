//B"H
// Function to fetch and display emails
async function fetchEmails() {
    const response = await fetch('/mail/get');
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
        document.getElementById('emailList').appendChild(emailElement);
    });
}

// Function to delete an email
async function deleteEmail(messageId) {
    const confirmation = confirm('Are you sure you want to delete this email?');
    if (confirmation) {
        await fetch(`/mail/delete/${messageId}`, { method: 'DELETE' });
        // Refresh email list after deletion
        document.getElementById('emailList').innerHTML = '';
        fetchEmails();
    }
}

// Function to compose and send email
async function composeEmail() {
    const toAlias = document.getElementById('recipient').value;
    const subject = document.getElementById('subject').value;
    const content = document.getElementById('content').value;
    await fetch(`/mail/sendTo/${toAlias}/from/${fromAlias}?subject=${encodeURIComponent(subject)}&content=${encodeURIComponent(content)}`, { method: 'POST' });
    // Clear compose email form after sending
    document.getElementById('recipient').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('content').value = '';
}

// Fetch and display emails on page load
window.onload = function() {
    fetchEmails();
};