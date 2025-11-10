import { form, deleteBtn, cancelBtn, saveBtn, editorTitleText, viewJsonBtn } from "./dom.js";
// Update the UI visibility based on the current editor mode
export function updateEditorUIVisibility(mode) {
    if (mode === "initial") {
        form.style.display = "none";
        editorTitleText.innerHTML = "Select a publisher or <span id=\"create-link\">create</span> a new one";
    }
    else {
        form.style.display = "grid";
    }
    deleteBtn.style.display = mode === "editing" ? "inline-block" : "none";
    cancelBtn.style.display = mode === "initial" ? "none" : "inline-block";
    saveBtn.disabled = mode === "initial";
    viewJsonBtn.style.display = mode === "initial" ? "none" : "inline-block";
}
