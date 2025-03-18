document.addEventListener("DOMContentLoaded", function () {
    // Funktion zum Aktualisieren des Jahres im Footer
    updateFooterYear();

    // Überprüfen, ob das Kontaktformular existiert
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Verhindert das Neuladen der Seite

            if (validateForm()) {
                let name = document.getElementById("name").value.trim();
                let message = document.getElementById("nachricht").value.trim();
                
                // Erfolgsmeldung und Nachricht anzeigen
                document.getElementById("successMessage").textContent = "Formular wurde erfolgreich gesendet!";
                document.getElementById("submittedMessage").innerHTML = `
                    <h3>Ihre Nachricht:</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Nachricht:</strong> ${message}</p>
                `;

                // Formular zurücksetzen, aber die Nachricht behalten
                contactForm.reset();
            }
        });
    }
});

function updateFooterYear() {
    const currentYear = new Date().getFullYear();
    const currentYearElement = document.getElementById("currentYear");
    if (currentYearElement) {
        currentYearElement.textContent = currentYear;
    }
}

function validateForm() {
    // Nur ausführen, wenn das Formular existiert
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return true;

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("nachricht").value.trim();

    let nameError = document.getElementById("nameError");
    let emailError = document.getElementById("emailError");
    let messageError = document.getElementById("messageError");
    let successMessage = document.getElementById("successMessage");

    // Fehler-Meldungen zurücksetzen
    if (nameError) nameError.textContent = "";
    if (emailError) emailError.textContent = "";
    if (messageError) messageError.textContent = "";
    if (successMessage) successMessage.textContent = "";

    let isValid = true;

    if (name === "") {
        if (nameError) nameError.textContent = "Bitte geben Sie Ihren Namen ein.";
        isValid = false;
    }

    if (email === "") {
        if (emailError) emailError.textContent = "Bitte geben Sie Ihre E-Mail-Adresse ein.";
        isValid = false;
    } else if (!isValidEmail(email)) {
        if (emailError) emailError.textContent = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
        isValid = false;
    }

    if (message === "") {
        if (messageError) messageError.textContent = "Bitte geben Sie eine Nachricht ein.";
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
