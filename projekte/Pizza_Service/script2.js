// Der Code wird ausgeführt, wenn der DOM (Document Object Model) vollständig geladen ist
document.addEventListener("DOMContentLoaded", () => {
    // Alle Schaltflächen zum Bestellen mit der Klasse .order-button auswählen
    const orderButtons = document.querySelectorAll(".order-button");

    // Elemente für den Warenkorb und den Gesamtpreis im Warenkorb selektieren
    const cartList = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartContainer = document.getElementById("cart");

    // Checkout-Schaltfläche für die Bestellung
    const checkoutButton = document.getElementById("checkout-button");

    // Den Warenkorb aus dem localStorage laden, wenn er vorhanden ist, oder ein leerer Array, falls nicht
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Für jede Bestellschaltfläche wird ein Event-Listener hinzugefügt
    orderButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Name der Pizza und Preis aus den Attributen des Buttons auslesen
            const pizzaName = button.getAttribute("data-item");
            const priceText = button.getAttribute("data-price");  // Preis aus dem data-price-Attribut lesen
            const price = parseFloat(priceText);  // Preis in eine Zahl umwandeln

            // Prüfen, ob der Preis eine gültige Zahl ist
            if (!isNaN(price)) {
                // Die Pizza in den Warenkorb hinzufügen
                cart.push({ name: pizzaName, price: price });

                // Den aktuellen Warenkorb im localStorage speichern
                localStorage.setItem("cart", JSON.stringify(cart));

                // Den Warenkorb anzeigen und aktualisieren
                updateCart();

                // Den Warenkorb anzeigen, wenn ein Artikel hinzugefügt wurde
                cartContainer.classList.add("show"); 
            } else {
                // Fehlerbehandlung, wenn der Preis nicht korrekt gelesen werden konnte
                console.error("Fehler: Preis konnte nicht gelesen werden.", priceText);
            }
        });
    });

    // Funktion zur Aktualisierung des Warenkorbs
    function updateCart() {
        // Zuerst den Inhalt des Warenkorbs leeren
        cartList.innerHTML = "";

        // Variable für die Gesamtsumme des Warenkorbs initialisieren
        let total = 0;

        // Für jedes Element im Warenkorb
        cart.forEach((item, index) => {
            // Die Summe der Preise berechnen
            total += item.price;

            // Neues Listenelement für den Artikel erstellen
            const li = document.createElement("li");
            li.textContent = `${item.name} - ${item.price.toFixed(2)} €`;  // Text des Artikels mit Preis

            // Entfernen-Schaltfläche für den Artikel erstellen
            const removeButton = document.createElement("button");
            removeButton.textContent = "X";  // "X" für Entfernen
            removeButton.classList.add("remove-item");  // CSS-Klasse für das Styling der Schaltfläche

            // Event-Listener hinzufügen, um den Artikel aus dem Warenkorb zu entfernen
            removeButton.addEventListener("click", () => {
                // Den Artikel aus dem Array entfernen
                cart.splice(index, 1);

                // Den Warenkorb im localStorage aktualisieren
                localStorage.setItem("cart", JSON.stringify(cart));

                // Den Warenkorb nach dem Entfernen des Artikels erneut aktualisieren
                updateCart();

                // Wenn der Warenkorb leer ist, den Warenkorb ausblenden
                if (cart.length === 0) {
                    cartContainer.classList.remove("show");
                }
            });

            // Die Entfernen-Schaltfläche zum Listenelement hinzufügen
            li.appendChild(removeButton);
            // Das Listenelement zum Warenkorb hinzufügen
            cartList.appendChild(li);
        });

        // Den Gesamtpreis im Warenkorb anzeigen
        cartTotal.textContent = total.toFixed(2);
    }

    // Wenn die Checkout-Schaltfläche existiert, einen Event-Listener hinzufügen
    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            // Bestellbestätigung anzeigen
            alert("Bestellung abgeschickt! Vielen Dank.");

            // Den Warenkorb aus dem localStorage entfernen
            localStorage.removeItem("cart");

            // Den Warenkorb leeren
            cart.length = 0;

            // Den Warenkorb erneut aktualisieren
            updateCart();

            // Den Warenkorb ausblenden
            cartContainer.classList.remove("show");
        });
    }

    // Beim Laden der Seite den Warenkorb initialisieren und anzeigen
    updateCart();
});



