import { publisherListEl, publisherSearchInput } from "../utils/dom.js";
import { state } from "../state/appState.js";
export function renderPublisherList(list) {
    publisherListEl.innerHTML = "";
    list.forEach(publisher => {
        const li = document.createElement("li");
        li.className = "list__item";
        if (publisher.file === state.currentFilename) {
            li.classList.add("list__item--selected");
        }
        li.dataset.file = publisher.file;
        li.textContent = publisher.alias;
        publisherListEl.appendChild(li);
    });
}
function filterPublishers(query) {
    const lowerQuery = query.toLowerCase();
    return state.allPublishers.filter(p => p.alias.toLowerCase().includes(lowerQuery) || p.id.toLowerCase().includes(lowerQuery));
}
publisherSearchInput.addEventListener("input", () => {
    const filtered = filterPublishers(publisherSearchInput.value.trim());
    renderPublisherList(filtered);
});
