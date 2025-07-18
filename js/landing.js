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