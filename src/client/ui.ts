import { form, deleteBtn, cancelBtn, saveBtn, editorTitleText } from "./utils/dom.js";

export type EditorMode = "initial" | "editing" | "creating";

/**
 * Обновляет видимость элементов редактора в зависимости от текущего режима.
 * @param mode Текущий режим редактора ('initial', 'editing', 'creating').
 */
export function updateEditorUIVisibility(mode: EditorMode) {
  if (mode === "initial") {
    form.style.display = "none";
    // Используем innerHTML для вложенной ссылки
    editorTitleText.innerHTML = "Select a publisher or <span id=\"create-link\">create</span> a new one";
  } else { // 'editing' or 'creating'
    form.style.display = "grid";
  }

  deleteBtn.style.display = mode === "editing" ? "inline-block" : "none";
  cancelBtn.style.display = mode === "initial" ? "none" : "inline-block";
  saveBtn.disabled = mode === "initial";
}