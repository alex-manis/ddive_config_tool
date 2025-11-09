import { form, saveBtn } from "../utils/dom.js";

export function validateForm(): boolean {
  let isValid = true;

  // Убираем старые подсветки с формы
  form.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));

  // Проверяем все поля с атрибутом required
  form.querySelectorAll<HTMLInputElement>("input[required]").forEach(input => {
    const isInputValid = !!input.value.trim();
    input.classList.toggle("invalid", !isInputValid);
    if (!isInputValid) isValid = false;
  });

  // URL-поля
  ["publisherDashboard", "monitorDashboard", "qaStatusDashboard"].forEach(name => {
    const input = form.elements.namedItem(name) as HTMLInputElement;
    const isUrlValid = !input.value || input.value.startsWith("http://") || input.value.startsWith("https://");
    input.classList.toggle("invalid", !isUrlValid);
    if (!isUrlValid) isValid = false;
  });

  saveBtn.disabled = !isValid;
  return isValid;
}