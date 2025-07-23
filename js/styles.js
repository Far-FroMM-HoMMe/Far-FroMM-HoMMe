//switch styles and store in sessionStorage
function switchStyle(sheetPath) {
  const stylesheet = document.getElementById("themeStylesheet");
  if (stylesheet) {
    stylesheet.setAttribute("href", sheetPath);
    sessionStorage.setItem("themeStyle", sheetPath); 
  }
}

//load the saved style from sessionStorage
window.addEventListener("DOMContentLoaded", function () {
  const savedStyle = sessionStorage.getItem("themeStyle"); 
  if (savedStyle) {
    switchStyle(savedStyle);
  }
});

