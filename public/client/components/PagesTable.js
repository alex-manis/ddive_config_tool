import { pagesTableBody, addPageBtn } from "../utils/dom.js";
function createPageRow(page) {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td><input type="text" value="${(page === null || page === void 0 ? void 0 : page.pageType) || ""}" required></td>
    <td><input type="text" value="${(page === null || page === void 0 ? void 0 : page.selector) || ""}" required></td>
    <td><input type="text" value="${(page === null || page === void 0 ? void 0 : page.position) || ""}" required></td>
    <td><button type="button" class="remove-page-btn">Remove</button></td>
  `;
    return row;
}
export function renderPages(pages) {
    pagesTableBody.innerHTML = "";
    pages.forEach(page => pagesTableBody.appendChild(createPageRow(page)));
}
export function collectPages() {
    const pages = [];
    pagesTableBody.querySelectorAll("tr").forEach(tr => {
        const inputs = tr.querySelectorAll("input");
        pages.push({
            pageType: inputs[0].value,
            selector: inputs[1].value,
            position: inputs[2].value,
        });
    });
    return pages;
}
export function initPagesTable(onFormInput) {
    addPageBtn.addEventListener("click", () => {
        pagesTableBody.appendChild(createPageRow());
        onFormInput();
    });
    pagesTableBody.addEventListener("click", (e) => {
        var _a;
        const target = e.target;
        if (target.classList.contains("remove-page-btn")) {
            (_a = target.closest("tr")) === null || _a === void 0 ? void 0 : _a.remove();
            onFormInput();
        }
    });
}
