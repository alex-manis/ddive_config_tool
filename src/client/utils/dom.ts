// Utility function to select DOM elements with type safety
export function $<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector(selector);
  if (!element) throw new Error(`Element with selector "${selector}" not found.`);
  return element as T;
}

// DOM elements used in the application
export const publisherListEl = $<HTMLUListElement>(".publisher-list");
export const editorTitle = $<HTMLHeadingElement>(".editor__title");
export const form = $<HTMLFormElement>(".publisher__form");
export const pagesTableBody = $<HTMLTableSectionElement>(".publisher__pages-table-body");
export const addPageBtn = $<HTMLButtonElement>(".publisher__add-page");
export const saveBtn = $<HTMLButtonElement>(".publisher__save");
export const viewJsonBtn = $<HTMLButtonElement>(".publisher__view-json");
export const jsonViewer = $<HTMLElement>(".publisher__json-viewer");
export const extraFieldsTableBody = $<HTMLTableSectionElement>(".publisher__pages-table-extra");
export const addExtraFieldBtn = $<HTMLButtonElement>(".publisher__add-extra-field");
export const publisherSearchInput = $<HTMLInputElement>(".main__search-input");
export const createNewBtn = $<HTMLButtonElement>(".main__create-publisher");
export const deleteBtn = $<HTMLButtonElement>(".publisher__delete");
export const cancelBtn = $<HTMLButtonElement>(".publisher__cancel");
export const appTitle = $<HTMLHeadingElement>(".header__title");
export const editorTitleText = $<HTMLSpanElement>(".editor__title-text");
export const loader = $<HTMLDivElement>(".editor__title-loader");