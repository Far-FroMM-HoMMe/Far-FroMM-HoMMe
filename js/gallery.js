// adapt the cards from the viewerSkeleton html to populate the gallery 
let globalArt;
let card;
let metaAccordion;
let theme;
document.addEventListener('DOMContentLoaded', () => {
    const options = {
        keyboard: true,
        size: 'fullscreen'
    };

    console.log(localStorage.getItem("themeValue"));
    
    //store global variables
    //get skeleton doc to access its elements
    getSkeleton();
    
    //get the selected narrative 
    // let narValue = localStorage.getItem('narValue') || null;
    // console.log(narValue);
    // localStorage.removeItem('narValue');
    populate();

    //create asynchronous function to run fetch()
    async function populate(){
        //create variable to store url to json files
        const artworkURL = "resources/json/artworks.json";
        
        //create requests object to pass into fetch()
        const artworkRequest = new Request(artworkURL);
        
        //make network request with fetch() which will return a response
        const artworkResponse = await fetch(artworkRequest);
        
        //run a second asynchronous function to retrieve the json file with json() and the promise response from fetch()
        const artworksJson = await artworkResponse.json();

        globalArt = artworksJson;

        //take the retrieved json and it pass into the functions to handle populating the html
        addArt(artworksJson);
    }

    async function getSkeleton() {
        const response = await fetch("resources/viewerSkeleton.html");
        const htmlText = await response.text();
        const parser = new DOMParser();
        const skeletonDoc = parser.parseFromString(htmlText, "text/html");
        console.log(skeletonDoc); // ✅ parsed external HTML
        card = skeletonDoc.querySelector(".card");
        metaAccordion = skeletonDoc.querySelector(".accordion#metadata");
    }

    function addArt(artworks) {
        //make a card item for each artwork
        for (let i=0; i<artworks.length; i++) {
            // create column div to hold art card 
            const column = document.createElement("div");
            document.querySelector(".row").appendChild(column);
            column.classList.add("col-sm-12", "col-md-6", "col-lg-4", "mb-4", "px-3", "gallery-card");

            //create card to hold art image and matadata table
            let artwork = artworks[i];
            column.appendChild(createCard(artwork));
        }
    }

    function createCard(art) {
        //create new card for art
        //clone card node to add to current doc
        const newCard = document.importNode(card, true);
        newCard.classList.add("h-100");
        newCard.classList.remove("py-3");
        newCard.classList.add("py-1");

        //clear accordions from card
        newCard.querySelector("#narrative").remove();
        newCard.querySelector("#metadata").remove();

        //remove uneeded utility classes from card 
        const cardRow = newCard.querySelector(".row");
        cardRow.querySelector(".col-xl-7").classList.remove("col-xl-7");
        cardRow.querySelector(".col-xl-5").classList.remove("col-xl-5");

        //add theme class
        const theme = art.theme;
        newCard.classList.add(theme.replaceAll(" ", "-").toLowerCase());


        //select elements to set attributes and text
        const cardBody = newCard.querySelector(".card-body");
        cardBody.classList.remove("px-xl-5");
        //lightbox 
        const lbAnchor = newCard.querySelector("a");
        const lbImg = lbAnchor.querySelector("img");

        //set attributes and id
        newCard.setAttribute("id", art.id);
        // modalButton.setAttribute("data-bs-whatever", art.relativePath);
        // modalBtnImg.setAttribute("src", art.relativePath);
        // modalBtnImg.setAttribute("alt", art.title);
        
        //add content to lightbox
        //check if there is an embedded video 
        if (art.embedURL) {
            lbAnchor.setAttribute("href", art.embedURL);
            if (art.allow) {
                lbAnchor.setAttribute("allow", art.allow);
            }
            if (art.referrerpolicy) {
                lbAnchor.setAttribute("referrerpolicy", art.referrerpolicy);
            }
        }
        else {
            lbAnchor.setAttribute("href", art.relativePath);
        }
        //check if there is a specified credit line
        if (art.creditLine !== ""){
            lbAnchor.setAttribute("data-caption", art.creditLine);
        }
        else {
            lbAnchor.setAttribute("data-caption", art.title);
        }
        
        lbImg.setAttribute("src", art.relativePath);
        lbAnchor.setAttribute("data-gallery", "collection-gallery");


        //add event listener to initialise lightbox when image is clicked
        lbAnchor.addEventListener("click", function (e) {
            e.preventDefault();
            const lightbox = new Lightbox(lbAnchor, options);
            lightbox.show();
        });

        //add text
        const artTitle = cardBody.querySelector("h5");
        const creationYear = document.createElement("span");
        artTitle.textContent = art.title;
        creationYear.textContent = ` (${art.creationDate})`;
        artTitle.appendChild(creationYear);
        cardBody.querySelector("h6").textContent = art.creator;
        cardBody.querySelector("p").textContent = art.label;

        //add accordion for metadata
        cardBody.appendChild(addMeta(art));

        return newCard;

    }

    function addMeta(art) {
        //create new metadata accordion
        //clone accordion node to add to current document
        const newMetaAcc = document.importNode(metaAccordion, true);

        //select elements to set attributes
        newMetaAcc.setAttribute("id", `metadata-${art.id}`);
        newMetaAcc.querySelector("h2").setAttribute("id", `meta-${art.id}_header`);

        const accButton = newMetaAcc.querySelector("button");
        accButton.setAttribute("data-bs-target", `#meta-${art.id}`);
        accButton.setAttribute("aria-controls", `meta-${art.id}`);

        const collapse = newMetaAcc.querySelector(".accordion-collapse");
        collapse.setAttribute("id", `meta-${art.id}`);
        collapse.setAttribute("aria-labelledby", `meta-${art.id}_header`);
        collapse.setAttribute("data-bs-parent", `#metadata-${art.id}`);

        //add data to table 
        const tableRows = collapse.querySelectorAll("tr");
        for (const row of tableRows) {
            let metaProperty = row.getAttribute("id");
            const rowHeader = document.createElement("td");
            const rowValue = document.createElement("td");

            row.appendChild(rowHeader);
            row.appendChild(rowValue);

            //add source url to current location 
            if (metaProperty === "currentLocation") {
                let sourceUrl = art.source;
                const sourceAnchor = document.createElement("a");
                rowValue.appendChild(sourceAnchor);
                sourceAnchor.setAttribute("href", sourceUrl);
                sourceAnchor.setAttribute("target", "_blank");
                rowHeader.textContent = metaProperty;
                sourceAnchor.textContent = art[metaProperty];
            }

            else {
                rowHeader.textContent = metaProperty;
                rowValue.textContent = art[metaProperty];
            }
        }

        return newMetaAcc;

    }
});

const themeSelect = document.querySelector("#themes").querySelector("p").querySelectorAll("a");
const allArtLink = document.querySelector("#all-art"); // your "show all" anchor
for (const theme of themeSelect) {
    theme.addEventListener("click", () => {
        const themeName = theme.getAttribute("id").replaceAll("-", " ");

        // Get IDs of artworks matching the theme
        const themeArtIDs = globalArt
            .filter(art => art.theme === themeName)
            .map(art => art.id);

        const artColumns = document.querySelectorAll(".gallery-card");

        for (const col of artColumns) {
            const cardId = col.querySelector(".card").getAttribute("id");

            if (themeArtIDs.includes(cardId)) {
                col.classList.remove("d-none"); // show
            } else {
                col.classList.add("d-none"); // hide
            }
        }
    });
}

// Add event listener to the "All Art" link
allArtLink.addEventListener("click", () => {
    const artColumns = document.querySelectorAll(".gallery-card");

    for (const col of artColumns) {
        col.classList.remove("d-none"); // show everything again
    }
});

//function to switch styles
function switchStyle(sheet) {
    document.getElementById("themeStylesheet").setAttribute("href", sheet);
}