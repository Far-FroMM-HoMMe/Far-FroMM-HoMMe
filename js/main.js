

/** Grabs the DOM element with ID 'app', where the page content will be dynamically injected.
 * All routed content will be loaded into this container, replacing the need for multiple page loads
 */
const app = document.getElementById("app");

/** Changes the URL in the browser without reloading the page.
 * Then calls router() to load the appropriate content.
 * "Fake" page navigation.
 */
const navigateTo = url => {
    // Handle relative URLs by prepending the base path
    const fullUrl = url.startsWith('/Far-FroMM-HoMMe/') ? url : '/Far-FroMM-HoMMe' + url;
    history.pushState(null, null, fullUrl);
    router();
};

/** This function handles all routing logic.
 * It maps each route (like /about) to a corresponding partial HTML file.
 * MOVED UP and changed to function declaration for hoisting
 */
async function router() { 
    const routes = {
        "/Far-FroMM-HoMMe/": "pages/index.html",
        "/Far-FroMM-HoMMe/index.html": "pages/index.html",
        "/Far-FroMM-HoMMe/themes": "pages/themes.html",
        "/Far-FroMM-HoMMe/about": "pages/about.html",
        "/Far-FroMM-HoMMe/collection": "pages/collection.html",
        "/Far-FroMM-HoMMe/narratives": "pages/narratives.html"
    };

    /** Checks the current URL path.
     * Finds the corresponding file in the 'routes' object.
     * Defaults to the homepage if the path isn't found.
     */
    const path = window.location.pathname;
    const page = routes[path] || "Far-FroMM-HoMMe/index.html";

    /** Uses fetch() to load the HTML file from the pages/ folder.
     * Injects the resulting HTML directly into the #app container
     * Fetch() allows for asynchronous loading.
     * 
     * It maps each route (like /about) to a corresponding partial HTML file.
     */
    try {
        console.log('Current path:', path);
        console.log('Fetching:', page);
        console.log('Full URL being fetched:', window.location.origin + '/' + page);
        const res = await fetch(page);
        console.log('Response status:', res.status);
        if (!res.ok) throw new Error("Page not found");
        const html = await res.text();
        app.innerHTML = html;
    } catch (err) {
        app.innerHTML = "<h1>404 - Page Not Found</h1>";
        console.error(err);
    }
}

/** Waits for the HTML to be fully loaded before executing routing logic.
 * Listens for clicks on links that have data-link attribute (e.g. <a href="/about" data-link>)
 * prevents default link behaviour (which would reloud the page)
 * calls navigateTo() to change the URL and load the new content dynamically
 */
document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-link]");
    if (link) {
        event.preventDefault();
        navigateTo(link.href);
    }
});

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

/** Listens for browser "Back and "Forward" button events. When triggered, it re-runs the router.
 * This keeps your app in sync with browser navigation history.
 */
window.addEventListener("popstate", router);

