// Utility function to select DOM elements with type safety
export function $(selector) {
    const element = document.querySelector(selector);
    if (!element)
        throw new Error(`Element with selector "${selector}" not found.`);
    return element;
}
// DOM elements used in the application
export const publisherListEl = $(".publisher-list");
export const editorTitle = $(".editor__title");
export const form = $(".publisher__form");
export const pagesTableBody = $(".publisher__pages-table-body");
export const addPageBtn = $(".publisher__add-page");
export const saveBtn = $(".publisher__save");
export const viewJsonBtn = $(".publisher__view-json");
export const jsonViewer = $(".publisher__json-viewer");
export const extraFieldsTableBody = $(".publisher__pages-table-extra");
export const addExtraFieldBtn = $(".publisher__add-extra-field");
export const publisherSearchInput = $(".main__search-input");
export const createNewBtn = $(".main__create-publisher");
export const deleteBtn = $(".publisher__delete");
export const cancelBtn = $(".publisher__cancel");
export const appTitle = $(".header__title");
export const editorTitleText = $(".editor__title-text");
export const loader = $(".editor__title-loader");
