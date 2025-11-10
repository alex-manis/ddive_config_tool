import { extraFieldsTableBody, addExtraFieldBtn } from "../utils/dom.js";
import { STANDARD_KEYS } from "../utils/constants.js";
import { initTableManager, parseValue } from "../utils/tableManager.js";
// Create a table row for an extra field
function createExtraFieldRow(key = "", value = "") {
    const row = document.createElement("tr");
    const displayValue = Array.isArray(value) ? value.join(", ") : (typeof value === "object" && value !== null ? JSON.stringify(value) : value);
    row.innerHTML = `
    <td><input type="text" class="extra-key" value="${key}" placeholder="key" required></td>
    <td><input type="text" class="extra-value" value="${displayValue}" placeholder="value"></td>
    <td><button type="button" class="button remove-btn">Remove</button></td>
  `;
    return row;
}
// Initialize the extra fields table manager
export function initExtraFieldsTable(onFormInput) {
    const manager = initTableManager({
        tableBody: extraFieldsTableBody,
        addBtn: addExtraFieldBtn,
        createRow: (item) => createExtraFieldRow((item === null || item === void 0 ? void 0 : item[0]) || "", (item === null || item === void 0 ? void 0 : item[1]) || ""),
        collectRow: tr => {
            const keyInput = tr.querySelector(".extra-key");
            const valueInput = tr.querySelector(".extra-value");
            return [keyInput.value.trim(), parseValue(valueInput.value)];
        },
        onChange: onFormInput
    });
    // Render extra fields from a PublisherConfig object
    function renderFromConfig(data) {
        const extras = [];
        Object.entries(data).forEach(([key, value]) => {
            if (!STANDARD_KEYS.has(key) && value !== undefined) {
                extras.push([key, value]);
            }
        });
        manager.render(extras);
    }
    return Object.assign(Object.assign({}, manager), { renderFromConfig });
}
