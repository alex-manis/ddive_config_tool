import { publisherListEl, publisherSearchInput } from "../utils/dom.js";
import { state } from "../state/appState.js";
// Render the list of publishers
export function renderPublisherList(list) {
    publisherListEl.innerHTML = "";
    list.forEach(publisher => {
        const li = document.createElement("li");
        li.className = "publisher-list__item";
        if (publisher.file === state.currentFilename) {
            li.classList.add("publisher-list__item--selected");
        }
        li.dataset.file = publisher.file;
        li.textContent = publisher.alias;
        publisherListEl.appendChild(li);
    });
}
// Filter publishers based on search query
function filterPublishers(query) {
    const lowerQuery = query.toLowerCase();
    return state.allPublishers.filter(p => p.alias.toLowerCase().includes(lowerQuery) || p.id.toLowerCase().includes(lowerQuery));
}
// Initialize search input event listener
publisherSearchInput.addEventListener("input", () => {
    const filtered = filterPublishers(publisherSearchInput.value.trim());
    renderPublisherList(filtered);
});
