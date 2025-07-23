//switch styles and store in localStorage
function switchStyle(sheetPath) {
  const stylesheet = document.getElementById("themeStylesheet");
  if (stylesheet) {
    stylesheet.setAttribute("href", sheetPath);
    localStorage.setItem("themeStyle", sheetPath); 
  }
}

//load the saved style from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const savedStyle = localStorage.getItem("themeStyle"); 
  if (savedStyle) {
    switchStyle(savedStyle);
  }
});

