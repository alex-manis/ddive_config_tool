// Utility function to select DOM elements with type safety
export function $(selector) {
    const element = document.querySelector(selector);
    if (!element)
        throw new Error(`Element with selector "${selector}" not found.`);
    return element;
}
// DOM elements used in the application
export const publisherListEl = $("#publisher-list");
export const editorTitle = $("#editor-title");
export const form = $("#publisher-form");
export const pagesTableBody = $("#pages-table tbody");
export const addPageBtn = $("#add-page");
export const saveBtn = $("#save-btn");
export const viewJsonBtn = $("#view-json-btn");
export const jsonViewer = $("#json-viewer");
export const extraFieldsTableBody = $("#extra-fields-table tbody");
export const addExtraFieldBtn = $("#add-extra-field");
export const publisherSearchInput = $("#publisher-search");
export const createNewBtn = $("#create-new-btn");
export const deleteBtn = $("#delete-btn");
export const cancelBtn = $("#cancel-btn");
export const appTitle = $("#app-title");
export const editorTitleText = $("#editor-title-text");
