document.addEventListener('DOMContentLoaded', () => {

    const options = {
        keyboard: true,
        size: 'fullscreen'
    };
    //store global variables
    //get skeleton doc to access its elements
    getSkeleton();
    let carouselItem;
    let card;
    let metaAccordion;
    let narAccordion;
    
    //get the selected narrative 
    let narValue = localStorage.getItem('narValue') || null;
    console.log(narValue);

    populate();

    //create asynchronous function to run fetch()
    async function populate(){
        //create variable to store url to json files
        const artworkURL = "resources/json/artworks.json";
        const narURL = "resources/json/narratives.json";
        
        //create requests object to pass into fetch()
        const artworkRequest = new Request(artworkURL);
        const narRequest = new Request(narURL);
        
        //make network request with fetch() which will return a response
        const artworkResponse = await fetch(artworkRequest);
        const narResponse = await fetch(narRequest);
        
        //run a second asynchronous function to retrieve the json file with json() and the promise response from fetch()
        const artworks = await artworkResponse.json();
        const narratives = await narResponse.json();

        //take the retrieved json and it pass into the functions to handle populating the html
        addArt(artworks, narratives);
        // console.log(artworks);
        // console.log(narratives);
    }

    async function getSkeleton() {
        const response = await fetch("resources/viewerSkeleton.html");
        const htmlText = await response.text();
        const parser = new DOMParser();
        const skeletonDoc = parser.parseFromString(htmlText, "text/html");
        console.log(skeletonDoc); // ✅ parsed external HTML
        carouselItem = skeletonDoc.querySelector(".carousel-item");
        card = skeletonDoc.querySelector(".card");
        metaAccordion = skeletonDoc.querySelector(".accordion#metadata");
        narAccordion = skeletonDoc.querySelector(".accordion#narrative");
    }


    //addArt() - creates art card to hold art image and info
    function addArt(artworks, narratives) {
        //check if a narrative has been set
        let narrative;
        if (narValue !== null) {
            for (nar of narratives) {
                if (narValue === nar.id) {
                    narrative = nar;
                }
            }
        }

        //filter artworks based on narrative and make cards
        if (narrative) {
            const narArt = [];
            for (const art of artworks) {
                if (art.id in narrative.art) {
                    narArt.push(art);
                }
            }

            //make a card item for each artwork
            for (let i=0; i<narArt.length; i++) {
                //create new carousel item
                //clone carousel item node to add it to current doc
                const newCarItem = document.importNode(carouselItem, true);

                //add new item to carousel 
                document.querySelector(".carousel-inner").appendChild(newCarItem);

                //clear item of cards 
                newCarItem.querySelector(".card").remove();

                let art = narArt[i];
                newCarItem.appendChild(createCard(art, narrative));
            }

        }

        else {
            //make a card item for each artwork
            for (let i=0; i<artworks.length; i++) {
                //create new carousel item
                //clone carousel item node to add it to current doc
                const newCarItem = document.importNode(carouselItem, true);

                //add new item to carousel 
                document.querySelector(".carousel-inner").appendChild(newCarItem);

                //clear item of cards 
                newCarItem.querySelector(".card").remove();

                let art = artworks[i];
                newCarItem.appendChild(createCard(art));
            }
        }

        //set the first item to active
        document.querySelector(".carousel-inner").firstElementChild.classList.add("active");
    }

    function createCard(art, narrative=null) {
        //create new card for art
        //clone card node to add to current doc
        const newCard = document.importNode(card, true);

        //clear accordions from card
        newCard.querySelector("#narrative").remove();
        newCard.querySelector("#metadata").remove();


        //select elements to set attributes and text
        const cardBody = newCard.querySelector(".card-body");
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
            if (arguments.allow) {
                lbAnchor.setAttribute("allow", art.allow);
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

        lbAnchor.addEventListener("click", function (e) {
            e.preventDefault();
            const lightbox = new Lightbox(lbAnchor, options);
            lightbox.show();
        });

        //add text 
        cardBody.querySelector("h5").textContent = art.title;
        cardBody.querySelector("h6").textContent = art.creator;
        cardBody.querySelector("p").textContent = art.label;

        //add accordion for metadata
        cardBody.appendChild(addMeta(art));

        //add narrative accordion if narrative has been selected 
        if (narrative) {
            cardBody.appendChild(addNar(art, narrative));
        }

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

    function addNar(art, narrative) {
        //create new metadata accordion
        //clone accordion node to add to current document
        const newNar = document.importNode(narAccordion, true);

        //select elements to set attributes
        newNar.setAttribute("id", `narrative-${art.id}`);
        newNar.querySelector("h2").setAttribute("id", `narrative-${art.id}_header`);

        const accButton = newNar.querySelector("button");
        accButton.setAttribute("data-bs-target", `#nar-${art.id}`);
        accButton.setAttribute("aria-controls", `nar-${art.id}`);
        accButton.textContent = `${narrative.name} narrative`;

        const collapse = newNar.querySelector(".accordion-collapse");
        collapse.setAttribute("id", `nar-${art.id}`);
        collapse.setAttribute("aria-labelledby", `nar-${art.id}_header`);
        collapse.setAttribute("data-bs-parent", `#narrative-${art.id}`);

        //add narrative text
        collapse.querySelector("p").textContent = narrative.art[art.id];

        //make the narrative text visable 
        collapse.classList.add("show");

        return newNar;

    }

});


