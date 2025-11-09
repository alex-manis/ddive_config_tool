var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchPublisher } from "./api/publishers.js";
import { hideJsonViewer } from "./components/JsonDiffViewer.js";
import { state, resetFormState, hasUnsavedChanges } from "./state/appState.js";
import { updateEditorUIVisibility } from "./ui.js";
import { form, publisherListEl } from "./utils/dom.js";
import { fillForm, prepareFormForCreation } from "./utils/form.js";
export function onSelectPublisher(file) {
    return __awaiter(this, void 0, void 0, function* () {
        state.isCreating = false;
        state.currentFilename = file;
        state.currentPublisher = yield fetchPublisher(state.currentFilename);
        // Сохраняем копию для проверки изменений
        state.originalPublisherData = JSON.parse(JSON.stringify(state.currentPublisher));
        fillForm(state.currentPublisher);
        // Сброс состояния формы
        form.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
        hideJsonViewer();
        resetFormState();
        updateEditorUIVisibility("editing");
    });
}
export function onStartCreatingPublisher() {
    state.isCreating = true;
    state.currentPublisher = null;
    state.originalPublisherData = null;
    state.currentFilename = "";
    prepareFormForCreation();
    resetFormState();
    updateEditorUIVisibility("creating");
}
export function resetEditorView() {
    if (hasUnsavedChanges() && !confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        return;
    }
    state.currentPublisher = null;
    state.currentFilename = "";
    state.isCreating = false;
    resetFormState();
    // Снимаем выделение в списке
    const currentSelected = publisherListEl.querySelector(".list__item--selected");
    if (currentSelected) {
        currentSelected.classList.remove("list__item--selected");
    }
    hideJsonViewer();
    updateEditorUIVisibility("initial"); // Просто обновляем UI
}
