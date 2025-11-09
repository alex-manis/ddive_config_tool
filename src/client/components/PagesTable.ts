import type { Page } from "../types/interfaces.js";
import { pagesTableBody, addPageBtn } from "../utils/dom.js";
import { initTableManager } from "../utils/tableManager.js";

// Create a table row for a page
function createPageRow(page?: Page): HTMLTableRowElement {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" value="${page?.pageType || ""}" required></td>
    <td><input type="text" value="${page?.selector || ""}" required></td>
    <td><input type="text" value="${page?.position || ""}" required></td>
    <td><button type="button" class="button remove-btn">Remove</button></td>
  `;
  return row;
}

export type PagesManager = ReturnType<typeof initPagesTable>;

// Initialize the pages table manager
export function initPagesTable(onFormInput: () => void) { 
  return initTableManager<Page>({
    tableBody: pagesTableBody,
    addBtn: addPageBtn,
    createRow: createPageRow,
    collectRow: tr => {
      const inputs = tr.querySelectorAll("input");
      return { pageType: inputs[0].value, selector: inputs[1].value, position: inputs[2].value };
    },
    onChange: onFormInput
  });
}