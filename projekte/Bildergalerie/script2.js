let imgNr;
let slider;
let isSlider = false;
let isCookieOk = false;
const url = "bilder2.json"; // Falls sich bilder2.json im gleichen Ordner befindet

let images; // Thumbs und Bigs src
let imageThumbElements; // Liste aller Thumb Tags
let imageBigElements; // Liste aller Big Img Tags

function setBigImg(nr) {
    // Verstecke alle großen Bilder
    imageBigElements.forEach(img => img.classList.remove("active"));

    if (imageBigElements[nr].getAttribute("src") === "") {
        imageBigElements[nr].setAttribute("src", images[nr].big);
    }

    // Setze das aktuell angeklickte Thumbnail als aktiv
    imageThumbElements[imgNr].classList.remove("active");
    imageThumbElements[nr].classList.add("active");

    // Setze das aktuell angezeigte große Bild als aktiv
    imageBigElements[nr].classList.add("active");

    imgNr = nr;
    displayDescription(images[nr].description); // Zeige die Beschreibung des aktuellen Bildes an
    if (isCookieOk) {
        localStorage.setItem("imgNr", imgNr);
    }
}

function prevImg() {
    setBigImg((imgNr - 1 + images.length) % images.length);
}

function nextImg() {
    setBigImg((imgNr + 1) % images.length);
}

function startInterval(btn) {
    if (!isSlider) {
        nextImg(); // Zeige das nächste Bild
        slider = setInterval(nextImg, 2000); // Starte den automatischen Bildwechsel
        btn.innerHTML = "STOP";
        isSlider = true;
    } else {
        clearInterval(slider); // Stoppe den automatischen Bildwechsel
        btn.innerHTML = "START";
        isSlider = false;
    }
}

function createThumbImages() {
    const divThumb = document.querySelector("div.thumb");
    images.forEach((image, i) => {
        const newImg = document.createElement("img");
        newImg.setAttribute("src", image.thumb);
        newImg.setAttribute("alt", image.description); // Setze die Beschreibung als alt-Attribut
        newImg.nr = i;

        newImg.addEventListener("click", function () {
            setBigImg(this.nr); // Wenn ein Thumbnail angeklickt wird, wird das Bild gesetzt
        });

        divThumb.appendChild(newImg);
    });
    imageThumbElements = divThumb.querySelectorAll("img");
}

function createBigImages() {
    const divBig = document.querySelector("div.big");
    images.forEach(() => {
        const newImg = document.createElement("img");
        newImg.setAttribute("src", "");
        newImg.setAttribute("alt", "");
        divBig.appendChild(newImg);
    });
    imageBigElements = divBig.querySelectorAll("img");
}

function createCtrlEvents() {
    const $btns = document.querySelectorAll(".ctrls button");

    $btns[0].addEventListener("click", prevImg);
    $btns[1].addEventListener("click", nextImg);
    $btns[2].addEventListener("click", function () {
        startInterval(this);
    });
}

function setCookieOk(isOk) {
    isCookieOk = isOk;
    document.getElementById("cookieOk").style.display = "none";
}

async function sndReq() {
    const url = "bilder2.json"; // Stelle sicher, dass der Pfad korrekt ist

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Fehler: " + response.status);
        }
        images = await response.json();
        createThumbImages();  // Erstelle Thumbnails
        createBigImages();    // Erstelle große Bilder

        // Überprüfe den gespeicherten Index im LocalStorage
        imgNr = localStorage.getItem("imgNr");
        imgNr = imgNr !== null ? parseInt(imgNr) : 0;
        setBigImg(imgNr);  // Zeige das Bild basierend auf dem gespeicherten Index an
        setCookieOk(true);  // Akzeptiere die Cookies

    } catch (error) {
        alert("Datei nicht gefunden: " + error.message);  // Fehlerbehandlung, falls die JSON-Datei nicht gefunden wird
    }
}

function displayDescription(description) {
    const descriptionDiv = document.getElementById("image-description");
    descriptionDiv.innerText = description; // Setze die Beschreibung
    descriptionDiv.style.display = "block"; // Sichtbar machen
}

function init() {
    sndReq();  // Lade die JSON-Datei und erstelle die Bilder
    createCtrlEvents();  // Füge Event-Listener für die Steuerung hinzu
}

window.onload = init;  // Stelle sicher, dass die Seite nach dem Laden initialisiert wird
