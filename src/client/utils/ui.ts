import { form, deleteBtn, cancelBtn, saveBtn, editorTitleText, loader, viewJsonBtn } from "./dom.js";

// Define editor modes
export type EditorMode = "initial" | "editing" | "creating";

// Update the UI visibility based on the current editor mode
export function updateEditorUIVisibility(mode: EditorMode) {
  if (mode === "initial") {
    form.style.display = "none";
     editorTitleText.innerHTML = "Select a publisher or <span id=\"create-link\">create</span> a new one";
  } else { 
    form.style.display = "grid";
  }

  deleteBtn.style.display = mode === "editing" ? "inline-block" : "none";
  cancelBtn.style.display = mode === "initial" ? "none" : "inline-block";
  saveBtn.disabled = mode === "initial";
  viewJsonBtn.style.display = mode === "initial" ? "none" : "inline-block";
}