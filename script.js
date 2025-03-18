// Funktion zum Aktualisieren des Jahres im Footer
function updateFooterYear() {
    const currentYear = new Date().getFullYear();
    document.getElementById("currentYear").textContent = currentYear;
}

function init() {
    // Footer-Jahr aktualisieren
    updateFooterYear();
}

document.addEventListener("DOMContentLoaded", init);
