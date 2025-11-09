import type { PublisherConfig } from "../types/interfaces.js";
import { extraFieldsTableBody, addExtraFieldBtn } from "../utils/dom.js";

const STANDARD_KEYS = [
  "publisherId", "aliasName", "isActive", "pages", "publisherDashboard",
  "monitorDashboard", "qaStatusDashboard", "customCss", "tags", "notes",
];

function parseValue(value: string): any {
  const processedValue = value.trim();
  if (processedValue === "") return "";
  if (processedValue === "true") return true;
  if (processedValue === "false") return false;
  if (processedValue === "null") return null;
  if (!isNaN(Number(processedValue)) && processedValue !== "") return Number(processedValue);

  // Попытка распознать массив в строке (либо JSON, либо через запятую)
  if (processedValue.startsWith("[") && processedValue.endsWith("]")) {
    try {
      // Попытка распарсить как JSON-массив
      const arr = JSON.parse(processedValue);
      if (Array.isArray(arr)) return arr.map(String);
    } catch (e) {
      // Если не удалось, продолжаем как обычная строка
    }
  }
  
  // Если есть запятые, считаем, что это массив строк
  if (processedValue.includes(",")) {
    return processedValue.split(",").map(s => s.trim()).filter(Boolean);
  }

  return processedValue;
}

function createExtraFieldRow(key = "", value: any = ""): HTMLTableRowElement {
  const row = document.createElement("tr");
  const displayValue = Array.isArray(value) ? value.join(", ") : (typeof value === "object" && value !== null ? JSON.stringify(value) : value);
  row.innerHTML = `
    <td><input type="text" class="extra-key" value="${key}" placeholder="key" required></td>
    <td><input type="text" class="extra-value" value="${displayValue}" placeholder="value"></td>
    <td><button type="button" class="remove-extra-btn">Remove</button></td>
  `;
  return row;
}

export function renderExtraFields(data: PublisherConfig): void {
  extraFieldsTableBody.innerHTML = "";
  Object.entries(data).forEach(([key, value]) => {
    if (!STANDARD_KEYS.includes(key)) {
      extraFieldsTableBody.appendChild(createExtraFieldRow(key, value));
    }
  });
}

export function collectExtraFields(): Record<string, any> {
  const extras: Record<string, any> = {};
  extraFieldsTableBody.querySelectorAll("tr").forEach(tr => {
    const keyInput = tr.querySelector(".extra-key") as HTMLInputElement;
    const valueInput = tr.querySelector(".extra-value") as HTMLInputElement;
    const key = keyInput.value.trim();
    if (key) extras[key] = parseValue(valueInput.value);
  });
  return extras;
}

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
}