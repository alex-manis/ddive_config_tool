import type { Page } from "../types/interfaces.js";
import { pagesTableBody, addPageBtn } from "../utils/dom.js";

function createPageRow(page?: Page): HTMLTableRowElement {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" value="${page?.pageType || ""}" required></td>
    <td><input type="text" value="${page?.selector || ""}" required></td>
    <td><input type="text" value="${page?.position || ""}" required></td>
    <td><button type="button" class="remove-page-btn">Remove</button></td>
  `;
  return row;
}

export function renderPages(pages: Page[]): void {
  pagesTableBody.innerHTML = "";
  pages.forEach(page => pagesTableBody.appendChild(createPageRow(page)));
}

export function collectPages(): Page[] {
  const pages: Page[] = [];
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

export function initPagesTable(onFormInput: () => void): void {
  addPageBtn.addEventListener("click", () => {
    pagesTableBody.appendChild(createPageRow());
    onFormInput();
  });

  pagesTableBody.addEventListener("click", (e) => {
    const target = e.target as HTMLButtonElement;
    if (target.classList.contains("remove-page-btn")) {
      target.closest("tr")?.remove();
      onFormInput();
    }
  });
}