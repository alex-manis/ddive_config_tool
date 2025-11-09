import type { PublisherConfig, ConfigValue } from "../types/interfaces.js";
import { extraFieldsTableBody, addExtraFieldBtn } from "../utils/dom.js";
import { STANDARD_KEYS } from "../constants.js";

// Helper function to parse string values into appropriate types
function parseValue(value: string): ConfigValue {
  const processedValue = value.trim();
  if (processedValue === "") return "";
  if (processedValue === "true") return true;
  if (processedValue === "false") return false;
  if (processedValue === "null") return null;
  if (!isNaN(Number(processedValue)) && processedValue !== "") return Number(processedValue);
 if (processedValue.startsWith("[") && processedValue.endsWith("]")) {
    try {
        const arr = JSON.parse(processedValue);
      if (Array.isArray(arr)) return arr.map(String);
    } catch (e) {
     
    }
  }
    if (processedValue.includes(",")) {
    return processedValue.split(",").map(s => s.trim()).filter(Boolean);
  }
  return processedValue;
}

// Create a table row for an extra field
function createExtraFieldRow(key = "", value: ConfigValue = ""): HTMLTableRowElement {
  const row = document.createElement("tr");
  const displayValue = Array.isArray(value) ? value.join(", ") : (typeof value === "object" && value !== null ? JSON.stringify(value) : value);
  row.innerHTML = `
    <td><input type="text" class="extra-key" value="${key}" placeholder="key" required></td>
    <td><input type="text" class="extra-value" value="${displayValue}" placeholder="value"></td>
    <td><button type="button" class="remove-extra-btn">Remove</button></td>
  `;
  return row;
}

// Render extra fields into the table
export function renderExtraFields(data: PublisherConfig): void {
  extraFieldsTableBody.innerHTML = "";
  Object.entries(data).forEach(([key, value]) => {
    if (!STANDARD_KEYS.has(key)) {
      extraFieldsTableBody.appendChild(createExtraFieldRow(key, value));
    }
  });
}

// Collect extra fields from the table into an object
export function collectExtraFields(): Record<string, ConfigValue> {
  const extras: Record<string, ConfigValue> = {};
  extraFieldsTableBody.querySelectorAll("tr").forEach(tr => {
    const keyInput = tr.querySelector(".extra-key") as HTMLInputElement;
    const valueInput = tr.querySelector(".extra-value") as HTMLInputElement;
    const key = keyInput.value.trim();
    if (key) extras[key] = parseValue(valueInput.value);
  });
  return extras;
}

// Initialize event listeners for the extra fields table
export function initExtraFieldsTable(onFormInput: () => void): void {
  addExtraFieldBtn.addEventListener("click", () => {
    extraFieldsTableBody.appendChild(createExtraFieldRow());
    onFormInput();
  });

  extraFieldsTableBody.addEventListener("click", e => {
    const target = e.target as HTMLButtonElement;
    if (target.classList.contains("remove-extra-btn")) {
      target.closest("tr")?.remove();
      onFormInput();
    }
  });

  extraFieldsTableBody.addEventListener("input", e => {
    const target = e.target as HTMLInputElement;
    if (target.classList.contains("extra-key") || target.classList.contains("extra-value")) {
      onFormInput();
    }
  });
}