// LANDING PAGE SCRIPT //

// -----------------------------------------//
// Animation of the landing page elements

document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show')
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // set narrative value and start story
    const startStoryLinks = document.querySelectorAll(".start-story");
    startStoryLinks.forEach(link => {
      link.addEventListener("click", () => {
        const story = link.getAttribute("id");
        console.log("Setting narValue:", story);
        localStorage.setItem("narValue", story);
      });
    });
});

// --------------------------------------- //
// Save the current style in localStorage
let currentStyle = "";

function switchStyle(sheet) {
  document.getElementById("themeStylesheet").setAttribute("href", sheet);
  currentStyle = sheet;

  localStorage.setItem("currentStyle", sheet);
}

// --------------------------------------- //
// Offcanvas behavior for the landing page
// ----------------------------------------//
document.addEventListener("DOMContentLoaded", function () {
  const offcanvas = document.getElementById("offcanvasExample");
  const chooseLayoutBtn = document.getElementById("chooseLayout");
  const windowsButton = document.getElementById("windows-button");
  let bsOffcanvas;

  let currentStyle = localStorage.getItem("currentStyle") || "css/styles.css";

  // Always initialize the Bootstrap Offcanvas instance
  if (bootstrap && bootstrap.Offcanvas) {
    bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas) || new bootstrap.Offcanvas(offcanvas);
  }

  // Set the initial style based on localStorage
  chooseLayoutBtn.addEventListener("click", function () {
    // Check if the current style is Windows style
    currentStyle = localStorage.getItem("currentStyle") || "css/styles.css";

    // if the current style is Windows and the screen width is less than or equal to 440px, show offcanvas
    if (currentStyle === "css/windows.css") {
      if (window.innerWidth <= 440) {
        bsOffcanvas.show();
      }
    } else {
      bsOffcanvas.show(); // fallback for non-Windows themes
    }
  });

  //  Switch to Windows style WITHOUT opening offcanvas
  windowsButton.addEventListener("click", function () {
    switchStyle("css/windows.css");

    bsOffcanvas.hide();
  });

  // wrap scrollable area
  const target = document.querySelector(".scrollable-area");
  if (target && !target.closest('.custom-scroll-wrapper')) {
    const wrapper = document.createElement("div");
    wrapper.className = "custom-scroll-wrapper";
    target.parentNode.insertBefore(wrapper, target);
    wrapper.appendChild(target);
  }
});




