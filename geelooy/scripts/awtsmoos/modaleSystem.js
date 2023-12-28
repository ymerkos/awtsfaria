/**
 * B"H
 */

 export default class ModalSystem {
    constructor(modalTemplateId) {
        this.modalTemplate = document.getElementById(modalTemplateId);
        this.modalStack = [];
    }

    showMessage(message) {
        var newModal = this.modalTemplate.cloneNode(true); // Clone the template
        newModal.id = ''; // Clear the id
        newModal.getElementsByClassName("modalMessage")[0].innerText = message; // Set the message
        modalStack.push(newModal); // Add the new modal to the stack
        document.body.appendChild(newModal); // Add the new modal to the body
        newModal.style.display = "block"; // Display the new modal
        newModal.getElementsByClassName("close")[0].onclick = closeModal;
}

    showDivInModal(div) {
        var newModal = this.modalTemplate.cloneNode(true); // Clone the template
        newModal.id = ''; // Clear the id
        newModal.getElementsByClassName("modalMessage")[0].appendChild(div); // Add the div to the modal
        modalStack.push(newModal); // Add the new modal to the stack
        document.body.appendChild(newModal); // Add the new modal to the body
        newModal.style.display = "block"; // Display the new modal
        newModal.getElementsByClassName("close")[0].onclick = closeModal;
    }

    closeModal() {
        var currentModal = this.modalStack.pop(); // Get the current modal from the stack
        currentModal.style.display = "none"; // Hide the current modal
        document.body.removeChild(currentModal); // Remove the current modal from the body
        // If there are any more modals in the stack, display the next one
        if (this.modalStack.length > 0) {
            this.modalStack[
                this.modalStack.length - 1
            ].style.display = "block";
        }
    }

    // other helper functions...
}