var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createPublisher, deletePublisher, getPublishers, savePublisher } from "./api/publishers.js";
import { computeDiffHTML, hideJsonViewer, showJsonViewer } from "./components/JsonDiffViewer.js";
import { initExtraFieldsTable } from "./components/ExtraFieldsTable.js";
import { initPagesTable } from "./components/PagesTable.js";
import { renderPublisherList } from "./components/PublisherList.js";
import { onSelectPublisher, onStartCreatingPublisher, resetEditorView } from "./components/editor.js";
import { hasUnsavedChanges, state, setDirty } from "./state/appState.js";
import { cancelBtn, createNewBtn, deleteBtn, form, appTitle, jsonViewer, publisherListEl, saveBtn, viewJsonBtn, editorTitle } from "./utils/dom.js";
import { collectFormData, setTableManagers } from "./utils/form.js";
import { validateForm } from "./utils/validation.js";
import { handleError } from "./utils/errorHandler.js";
import { showLoader, hideLoader } from "./utils/loader.js";
// Handle form input events to track changes and validate
function handleFormInput() {
    setDirty();
    validateForm();
    if (jsonViewer.style.display === "block") {
        const data = collectFormData();
        if (!data)
            return;
        const diffHtml = computeDiffHTML(state.originalPublisherData || {}, data);
        showJsonViewer(diffHtml);
    }
}
// Utility function to add a delay
const delay = (ms) => new Promise(res => setTimeout(res, ms));
// Wrap async operations with loading spinner and error handling
function withLoading(requestFn, errorMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        showLoader();
        try {
            yield Promise.all([requestFn(), delay(300)]);
        }
        catch (error) {
            if (errorMessage) {
                handleError(errorMessage, error);
            }
        }
        finally {
            hideLoader();
        }
    });
}
// Initialize all event listeners for the application
export function initializeEventListeners() {
    const pagesManager = initPagesTable(handleFormInput);
    const extraFieldsManager = initExtraFieldsTable(handleFormInput);
    setTableManagers(pagesManager, extraFieldsManager);
    form.addEventListener("input", handleFormInput);
    const aliasNameInput = form.elements.namedItem("aliasName");
    aliasNameInput.addEventListener("input", () => {
        if (state.isCreating) {
            const publisherIdInput = form.elements.namedItem("publisherId");
            const firstWord = aliasNameInput.value.trim().split(/\s+/)[0].toLowerCase();
            publisherIdInput.value = `pub-${firstWord}`;
            handleFormInput();
        }
    });
    // Collapsible sections functionality
    document.querySelectorAll(".collapsible").forEach(header => {
        header.addEventListener("click", () => {
            header.classList.toggle("active");
            const content = header.nextElementSibling;
            if (content.style.display && content.style.display !== "none") {
                content.style.display = "none";
            }
            else {
                content.style.display = "block";
            }
        });
    });
    // Handle selecting a publisher from the list
    publisherListEl.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
        const target = e.target;
        if (target.tagName !== "LI" || !target.dataset.file)
            return;
        const selectedFile = target.dataset.file;
        if (hasUnsavedChanges() && !confirm("You have unsaved changes. Continue without saving?")) {
            return;
        }
        const currentSelected = publisherListEl.querySelector(".publisher-list__item--selected");
        if (currentSelected) {
            currentSelected.classList.remove("publisher-list__item--selected");
        }
        target.classList.add("publisher-list__item--selected");
        withLoading(() => onSelectPublisher(selectedFile), `Could not load data for ${selectedFile}. The file may be missing or corrupted.`);
    }));
    // View JSON diff button functionality
    viewJsonBtn.addEventListener("click", () => {
        if (jsonViewer.style.display === "block") {
            hideJsonViewer();
            return;
        }
        if (!state.currentPublisher && !state.isCreating)
            return;
        const diffHtml = computeDiffHTML(state.originalPublisherData || {}, collectFormData() || {});
        if (diffHtml) {
            showJsonViewer(diffHtml);
        }
    });
    // Refresh the publisher list and optionally select a publisher
    function refreshPublisherList(selectedFilename) {
        return __awaiter(this, void 0, void 0, function* () {
            state.allPublishers = yield getPublishers();
            renderPublisherList(state.allPublishers);
            if (selectedFilename) {
                yield onSelectPublisher(selectedFilename);
            }
            else {
                resetEditorView();
                state.currentPublisher = null;
                state.currentFilename = "";
                state.isCreating = false;
            }
        });
    }
    // Create new publisher button functionality
    const createNewHandler = () => {
        if (hasUnsavedChanges() && !confirm("You have unsaved changes. Are you sure you want to start creating a new publisher?")) {
            return;
        }
        onStartCreatingPublisher();
    };
    createNewBtn.addEventListener("click", createNewHandler);
    // Create new publisher link in the editor title
    editorTitle.addEventListener("click", (e) => {
        if (e.target.id === "create-link") {
            createNewHandler();
        }
    });
    // Cancel button functionality
    appTitle.addEventListener("click", resetEditorView);
    cancelBtn.addEventListener("click", resetEditorView);
    // Delete button functionality
    deleteBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (state.isCreating || !state.currentFilename)
            return;
        if (!confirm(`Are you sure you want to delete ${(_a = state.currentPublisher) === null || _a === void 0 ? void 0 : _a.aliasName}? This cannot be undone.`)) {
            return;
        }
        withLoading(() => __awaiter(this, void 0, void 0, function* () {
            yield deletePublisher(state.currentFilename);
            alert("Publisher deleted successfully.");
            yield refreshPublisherList();
        }), "Error deleting publisher.");
    }));
    // Save button functionality
    saveBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        if (!form.reportValidity())
            return;
        const data = collectFormData();
        if (!data)
            return;
        withLoading(() => __awaiter(this, void 0, void 0, function* () {
            let newFilename;
            if (state.isCreating) {
                const result = yield createPublisher(data);
                newFilename = result.newFilename;
            }
            else {
                const result = yield savePublisher(state.currentFilename, data);
                newFilename = result.newFilename;
            }
            alert("Publisher saved!");
            yield refreshPublisherList(newFilename);
        }), "Error saving publisher.");
    }));
    // Warn user of unsaved changes before leaving the page
    window.addEventListener("beforeunload", e => {
        if (hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = "";
        }
    });
}
