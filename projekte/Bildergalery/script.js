// Bilderdaten
let images = [
    { "thumb": "images/thumbs/pic1.jpg", "big": "images/big/Chrysanthemum.jpg", "description": "Chrysantheme" },
    { "thumb": "images/thumbs/pic2.jpg", "big": "images/big/Dessert.jpg", "description": "Wüste" },
    { "thumb": "images/thumbs/pic3.jpg", "big": "images/big/Hydrangeas.jpg", "description": "Hortensien" },
    { "thumb": "images/thumbs/pic4.jpg", "big": "images/big/Jellyfish.jpg", "description": "Qualle" },
    { "thumb": "images/thumbs/pic5.jpg", "big": "images/big/Koala.jpg", "description": "Koala" },
    { "thumb": "images/thumbs/pic6.jpg", "big": "images/big/Lighthouse.jpg", "description": "Leuchtturm" },
    { "thumb": "images/thumbs/pic7.jpg", "big": "images/big/Penguins.jpg", "description": "Pinguine" },
    { "thumb": "images/thumbs/pic8.jpg", "big": "images/big/Tulips.jpg", "description": "Tulpen" }
];

let imgNr = 0;
let slider;
let isSlider = false;
let imageBigElements;

// Speichern der Bilder im localStorage
function saveImagesToLocalStorage() {
    if (!localStorage.getItem("imageData")) {
        localStorage.setItem("imageData", JSON.stringify(images));
    }
    images = JSON.parse(localStorage.getItem("imageData"));
}

// Erstellen der Thumbnail-Bilder
function createThumbImages() {
    const divThumb = document.querySelector("div.thumb");
    divThumb.innerHTML = "";
    images.forEach((image, i) => {
        const newImg = document.createElement("img");
        newImg.setAttribute("src", image.thumb);
        newImg.setAttribute("alt", image.description);
        newImg.setAttribute("loading", "lazy");
        newImg.nr = i;
        newImg.addEventListener("click", function () {
            setBigImg(this.nr);
        });
        divThumb.appendChild(newImg);
    });
}

// Erstellen der großen Bilder
function createBigImages() {
    const divBig = document.querySelector(".big");
    divBig.innerHTML = "";
    images.forEach((image, i) => {
        const newImg = document.createElement("img");
        newImg.setAttribute("src", image.big);
        newImg.setAttribute("alt", image.description);
        newImg.onload = function () {
            adjustContainerSize(newImg);
        };
        divBig.appendChild(newImg);
    });
    imageBigElements = divBig.querySelectorAll("img");
}

// Anpassen der Containergröße
function adjustContainerSize(img) {
    const container = document.querySelector(".big");
    const imgWidth = img.width;
    const imgHeight = img.height;
    const aspectRatio = imgWidth / imgHeight;
    const containerWidth = container.offsetWidth;
    const containerHeight = containerWidth / aspectRatio;
    if (containerHeight > container.offsetHeight) {
        container.style.height = container.offsetHeight + "px";
    } else {
        container.style.height = containerHeight + "px";
    }
}

// Setzen des großen Bildes
function setBigImg(nr) {
    imageBigElements.forEach(img => {
        img.classList.remove("active");
        img.style.display = "none";
    });
    imageBigElements[nr].classList.add("active");
    imageBigElements[nr].style.display = "block";
    document.getElementById("image-description").innerText = images[nr].description;
    localStorage.setItem("imgNr", nr);
    imgNr = nr;

    // Aktualisieren des aktiven Thumbnails
    const thumbs = document.querySelectorAll(".thumb img");
    thumbs.forEach((thumb, index) => {
        if (index === nr) {
            thumb.classList.add("active");
        } else {
            thumb.classList.remove("active");
        }
    });
}

// Vorheriges Bild anzeigen
function prevImg() {
    imgNr = (imgNr - 1 + images.length) % images.length;
    setBigImg(imgNr);
}

// Nächstes Bild anzeigen
function nextImg() {
    imgNr = (imgNr + 1) % images.length;
    setBigImg(imgNr);
}

// Starten/Stoppen des Bildwechsel-Intervalls
function startInterval(btn) {
    if (!isSlider) {
        nextImg();
        slider = setInterval(nextImg, 2000);
        btn.innerHTML = "STOP";
        isSlider = true;
    } else {
        clearInterval(slider);
        btn.innerHTML = "START";
        isSlider = false;
    }
}

// Umschalten des Dunkelmodus
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

// Behandlung von Tastatureingaben
function handleKeyPress(e) {
    switch(e.key) {
        case "ArrowLeft":
            prevImg();
            break;
        case "ArrowRight":
            nextImg();
            break;
    }
}

// Behandlung des Bild-Uploads
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newImage = {
                "thumb": e.target.result,
                "big": e.target.result,
                "description": "Hochgeladenes Bild"
            };
            images.push(newImage);
            localStorage.setItem("imageData", JSON.stringify(images));
            createThumbImages();
            createBigImages();
            setBigImg(images.length - 1);
        };
        reader.readAsDataURL(file);
    }
}

// Erstellen der Steuerelemente-Events
function createCtrlEvents() {
    document.getElementById("prevBtn").addEventListener("click", prevImg);
    document.getElementById("nextBtn").addEventListener("click", nextImg);
    document.getElementById("startBtn").addEventListener("click", function () {
        startInterval(this);
    });
    document.getElementById("darkModeToggle").addEventListener("change", toggleDarkMode);
    document.getElementById("imageUpload").addEventListener("change", handleImageUpload);
    document.addEventListener("keydown", handleKeyPress);
}

// Initialisierungsfunktion
function init() {
    saveImagesToLocalStorage();
    createThumbImages();
    createBigImages();
    imgNr = parseInt(localStorage.getItem("imgNr")) || 0;
    setBigImg(imgNr);
    createCtrlEvents();

    // Dunkelmodus-Zustand wiederherstellen
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    document.getElementById("darkModeToggle").checked = isDarkMode;
    if (isDarkMode) {
        document.body.classList.add("dark-mode");
    }
}

// Starten der Initialisierung, wenn das DOM geladen ist
document.addEventListener("DOMContentLoaded", init);
