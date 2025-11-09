import { form, saveBtn } from "../utils/dom.js";
// Validate the form and highlight invalid fields
export function validateForm() {
    let isValid = true;
    // Clear previous validation states
    form.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
    // Check required inputs
    form.querySelectorAll("input[required]").forEach(input => {
        const isInputValid = !!input.value.trim();
        input.classList.toggle("invalid", !isInputValid);
        if (!isInputValid)
            isValid = false;
    });
    // Validate URL fields
    ["publisherDashboard", "monitorDashboard", "qaStatusDashboard"].forEach(name => {
        const input = form.elements.namedItem(name);
        const isUrlValid = !input.value || input.value.startsWith("http://") || input.value.startsWith("https://");
        input.classList.toggle("invalid", !isUrlValid);
        if (!isUrlValid)
            isValid = false;
    });
    saveBtn.disabled = !isValid;
    return isValid;
}
