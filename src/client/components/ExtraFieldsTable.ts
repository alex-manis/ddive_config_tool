import type { PublisherConfig, ConfigValue } from "../types/interfaces.js";
import { extraFieldsTableBody, addExtraFieldBtn } from "../utils/dom.js";
import { STANDARD_KEYS } from "../utils/constants.js";
import { initTableManager, parseValue } from "../utils/tableManager.js";

// Create a table row for an extra field
function createExtraFieldRow(key = "", value: ConfigValue = ""): HTMLTableRowElement {
  const row = document.createElement("tr");
  const displayValue = Array.isArray(value) ? value.join(", ") : (typeof value === "object" && value !== null ? JSON.stringify(value) : value);
  row.innerHTML = `
    <td><input type="text" class="extra-key" value="${key}" placeholder="key" required></td>
    <td><input type="text" class="extra-value" value="${displayValue}" placeholder="value"></td>
    <td><button type="button" class="button remove-btn">Remove</button></td>
  `;
  return row;
}

export type ExtraFieldsManager = ReturnType<typeof initExtraFieldsTable>;

// Initialize the extra fields table manager
export function initExtraFieldsTable(onFormInput: () => void) { 
  const manager = initTableManager<[string, ConfigValue]>({
    tableBody: extraFieldsTableBody,
    addBtn: addExtraFieldBtn,
    createRow: (item) => createExtraFieldRow(item?.[0] || "", item?.[1] || ""),
    collectRow: tr => {
      const keyInput = tr.querySelector(".extra-key") as HTMLInputElement;
      const valueInput = tr.querySelector(".extra-value") as HTMLInputElement;
      return [keyInput.value.trim(), parseValue(valueInput.value)];
    },
    onChange: onFormInput
  });
  
// Render extra fields from a PublisherConfig object
    function renderFromConfig(data: PublisherConfig) {
    const extras: [string, ConfigValue][] = [];
    Object.entries(data).forEach(([key, value]) => { 
      if (!STANDARD_KEYS.has(key) && value !== undefined) {
        extras.push([key, value]);
      }
    });
    manager.render(extras);
  }

  return { ...manager, renderFromConfig };
}