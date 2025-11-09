// Utility function to select DOM elements with type safety
export function $<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector(selector);
  if (!element) throw new Error(`Element with selector "${selector}" not found.`);
  return element as T;
}

// DOM elements used in the application
export const publisherListEl = $<HTMLUListElement>("#publisher-list");
export const editorTitle = $<HTMLHeadingElement>("#editor-title");
export const form = $<HTMLFormElement>("#publisher-form");
export const pagesTableBody = $<HTMLTableSectionElement>("#pages-table tbody");
export const addPageBtn = $<HTMLButtonElement>("#add-page");
export const saveBtn = $<HTMLButtonElement>("#save-btn");
export const viewJsonBtn = $<HTMLButtonElement>("#view-json-btn");
export const jsonViewer = $<HTMLElement>("#json-viewer");
export const extraFieldsTableBody = $<HTMLTableSectionElement>("#extra-fields-table tbody");
export const addExtraFieldBtn = $<HTMLButtonElement>("#add-extra-field");
export const publisherSearchInput = $<HTMLInputElement>("#publisher-search");
export const createNewBtn = $<HTMLButtonElement>("#create-new-btn");
export const deleteBtn = $<HTMLButtonElement>("#delete-btn");
export const cancelBtn = $<HTMLButtonElement>("#cancel-btn");
export const appTitle = $<HTMLHeadingElement>("#app-title");
export const editorTitleText = $<HTMLSpanElement>("#editor-title-text");