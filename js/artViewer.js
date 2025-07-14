document.addEventListener('DOMContentLoaded', () => {
        //store global variables
    // html elements
    const viewer = document.querySelector("section"); //section
    const artCarousel = document.querySelector(".carousel-inner");//.coursel
    const carItem = document.querySelector(".carousel-item"); //.coursel-item
    const modal = document.querySelector(".modal");
    const metaAccordion = document.querySelector("#metadata-FFH-32");
    //narrative to run
    let narValue = null;

    populate();

    //create asynchronous function to run fetch()
    async function populate(){
        //create variable to store url to json files
        const artworkURL = "resources/json/pracArtworks.json";
        const narURL = "resources/json/pracNarratives.json";
        
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


    //addArt() - creates art card to hold art image and info
    function addArt(artworks, narratives) {
        console.log(artworks);
        //clear art carousel
        artCarousel.firstElementChild.remove();

        //make a card item for each artwork
        for (let i=0; i<artworks.length; i++) {
            let art = artworks[i];
            console.log(art);
            createCard(art);
        }

        //set the first item to active
        artCarousel.firstElementChild.classList.add("active");
    }

    function createCard(art, narrative=null) {
        const newItem = carItem.cloneNode(true);
        artCarousel.appendChild(newItem);

        const card = newItem.querySelector(".card");
        const modalButton = card.querySelector("button");
        const modalBtnImg = modalButton.querySelector("img")
        const cardBody = card.querySelector(".card-body");

        //set attributes and id
        card.setAttribute("id", art.id);
        modalButton.setAttribute("data-bs-whatever", art.relativePath);
        modalBtnImg.setAttribute("src", art.relativePath);
        modalBtnImg.setAttribute("alt", art.title);

        //add text 
        cardBody.querySelector("h5").textContent = art.title;
        cardBody.querySelector("h6").textContent = art.creator;
        cardBody.querySelector("p").textContent = art.label;

        //remove narrative accordion when no narrative selected
        cardBody.querySelector("#narrative-FFH-32").remove();
        // cardBody.querySelector("#metadata-FFH-32").remove();

        //create modal element for art
        createModal(art);

        //add metadata accordion
        cardBody.appendChild(addMeta(art));
    }

    function createModal(art) {
        // const newModal = modal;
        // modal.remove();
        // const modalImg = newModal.querySelector("img");
        // newModal.setAttribute("id", `modal-${art.id}`);
        // newModal.setAttribute("aria-labelledby", `modal-${art.id}`);
        // modalImg.setAttribute("src", art.relativePath);
        // modalImg.setAttribute("alt", art.title);

        // document.querySelector("body").appendChild(newModal);
        if (modal) {
            modal.addEventListener('show.bs.modal', event => {
                // Button that triggered the modal
                const button = event.relatedTarget;
                // Extract info from data-bs-* attributes
                const artUrl = button.getAttribute('data-bs-whatever');
                // If necessary, you could initiate an Ajax request here
                // and then do the updating in a callback.

                // Update the modal's content.
                const modalImg = modal.querySelector('img');

                modalImg.setAttribute("src", art.relativePath);
                modalImg.setAttribute("alt", art.title);
            })
        }
    }

    function addMeta(art) {
       const newMeta = metaAccordion;
       newMeta.setAttribute("id", `metadata-${art.id}`);
       newMeta.querySelector("h2").setAttribute("id", `meta-${art.id}_header`);

       const collapse = newMeta.querySelector(".accordion-collapse");
       collapse.setAttribute("id", `meta-${art.id}`);
       collapse.setAttribute("aria-labelledby", `meta-${art.id}_header`);
       collapse.setAttribute("data-bs-parent", `#metadata-${art.id}`);

       const metaTable = collapse.querySelector("tbody");
       for (let i=0; i<metaTable.length; i++) {
        let meta = metaTable[i];
        tabelRow = document.createElement("td");
        meta.appendChild(tabelRow);
        tabelRow.textContent(art[meta.getAttribute("id")]);
       }

       return newMeta;
    }
});

//addToAccordion() 
//createModal()

    //set narrative to follow if one has been selected
    // let narrative;
    // let art = [];
    // if (narValue !== null) {
    //     for (n of narratives) {
    //         if (n.name === narValue) {
    //             narrative = n;
    //         }
    //     }
    // }
    //filter out artworks based on narrative, if one is selected
    // if (narrative !== null) {
    //     for (a of artworks) {
    //         if (a.id in narrative.art) {
    //             art.append(a);
    //         }
    //     }
    //     createCard(art, narrative);
    // }

    //if not create cards with no narrative info 
    // else {
    //     createCard(artworks);
    // }
