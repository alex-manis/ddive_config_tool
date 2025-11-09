var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { deletePublisher, fetchPublishers, savePublisher } from "./api/publishers.js";
import { computeDiffHTML, hideJsonViewer, showJsonViewer } from "./components/JsonDiffViewer.js";
import { initExtraFieldsTable } from "./components/ExtraFieldsTable.js";
import { initPagesTable } from "./components/PagesTable.js";
import { renderPublisherList } from "./components/PublisherList.js";
import { onSelectPublisher, onStartCreatingPublisher, resetEditorView } from "./editor.js";
import { hasUnsavedChanges, state, setDirty, resetFormState } from "./state/appState.js";
import { cancelBtn, createNewBtn, deleteBtn, form, appTitle, jsonViewer, publisherListEl, saveBtn, viewJsonBtn, editorTitle } from "./utils/dom.js";
import { collectFormData } from "./utils/form.js";
import { validateForm } from "./utils/validation.js";
import { handleError } from "./errorHandler.js";
import { showLoader, hideLoader } from "./loader.js";
function handleFormInput() {
    setDirty();
    validateForm();
    // Dynamic update of the JSON viewer if it is open
    if (jsonViewer.style.display === "block") {
        const data = collectFormData();
        if (!data)
            return;
        const diffHtml = computeDiffHTML(state.originalPublisherData || {}, data);
        showJsonViewer(diffHtml);
    }
}
const delay = (ms) => new Promise(res => setTimeout(res, ms));
/**
 * Обертка для асинхронных операций, которая показывает/скрывает лоадер и обрабатывает ошибки.
 * @param requestFn Асинхронная функция для выполнения.
 * @param errorMessage Сообщение об ошибке для пользователя в случае сбоя.
 */
function withLoading(requestFn, errorMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        showLoader();
        try {
            // Добавляем искусственную задержку, чтобы спиннер был виден
            // даже при очень быстрых локальных запросах.
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
export function initializeEventListeners() {
    form.addEventListener("input", handleFormInput);
    initPagesTable(handleFormInput);
    initExtraFieldsTable(handleFormInput);
    // Динамическое обновление Publisher ID при создании
    const aliasNameInput = form.elements.namedItem("aliasName");
    aliasNameInput.addEventListener("input", () => {
        if (state.isCreating) {
            const publisherIdInput = form.elements.namedItem("publisherId");
            const firstWord = aliasNameInput.value.trim().split(/\s+/)[0].toLowerCase();
            publisherIdInput.value = `pub-${firstWord}`;
            // Так как мы меняем значение программно, нужно вызвать валидацию
            handleFormInput();
        }
    });
    document.querySelectorAll(".collapsible").forEach(header => {
        header.addEventListener("click", () => {
            header.classList.toggle("active");
            const content = header.nextElementSibling;
            if (content.style.display && content.style.display !== "none") {
                content.style.display = "none";
            }
            else {
                // Используем grid или flex в зависимости от содержимого
                content.style.display = "block";
            }
        });
    });
    publisherListEl.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
        const target = e.target;
        if (target.tagName !== "LI" || !target.dataset.file)
            return;
        const selectedFile = target.dataset.file;
        if (hasUnsavedChanges() && !confirm("You have unsaved changes. Continue without saving?")) {
            return;
        }
        // Снимаем выделение с предыдущего активного элемента
        const currentSelected = publisherListEl.querySelector(".list__item--selected");
        if (currentSelected) {
            currentSelected.classList.remove("list__item--selected");
        }
        // Выделяем новый выбранный элемент
        target.classList.add("list__item--selected");
        withLoading(() => onSelectPublisher(selectedFile), `Could not load data for ${selectedFile}. The file may be missing or corrupted.`);
    }));
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
    const createNewHandler = () => {
        if (hasUnsavedChanges() && !confirm("You have unsaved changes. Are you sure you want to start creating a new publisher?")) {
            return;
        }
        onStartCreatingPublisher();
    };
    createNewBtn.addEventListener("click", createNewHandler);
    // Используем делегирование событий для динамически создаваемой ссылки
    editorTitle.addEventListener("click", (e) => {
        if (e.target.id === "create-link") {
            createNewHandler();
        }
    });
    appTitle.addEventListener("click", resetEditorView);
    cancelBtn.addEventListener("click", resetEditorView);
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
            resetEditorView();
        }), "Error deleting publisher.");
    }));
    saveBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        if (!form.reportValidity())
            return;
        const data = collectFormData();
        if (!data)
            return;
        withLoading(() => __awaiter(this, void 0, void 0, function* () {
            const { newFilename } = yield savePublisher(state.currentFilename, data, state.isCreating);
            alert("Publisher saved!");
            if (state.isCreating) {
                state.allPublishers = yield fetchPublishers();
                renderPublisherList(state.allPublishers);
                yield onSelectPublisher(newFilename);
            }
            else {
                state.originalPublisherData = JSON.parse(JSON.stringify(data));
                resetFormState();
                validateForm();
            }
        }), "Error saving publisher.");
    }));
    window.addEventListener("beforeunload", e => {
        if (hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = "";
        }
    });
}
