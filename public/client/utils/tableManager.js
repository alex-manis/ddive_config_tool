// Generic table manager for dynamic row addition/removal and data collection
export function initTableManager({ tableBody, addBtn, createRow, collectRow, onChange }) {
    function render(items) {
        tableBody.innerHTML = "";
        items.forEach(item => tableBody.appendChild(createRow(item)));
    }
    function collect() {
        const data = [];
        tableBody.querySelectorAll("tr").forEach(tr => {
            data.push(collectRow(tr));
        });
        return data;
    }
    // Event listeners for adding/removing rows and detecting changes
    addBtn.addEventListener("click", () => {
        tableBody.appendChild(createRow());
        onChange();
    });
    tableBody.addEventListener("click", e => {
        var _a;
        const target = e.target;
        if (target.classList.contains("remove-btn")) {
            (_a = target.closest("tr")) === null || _a === void 0 ? void 0 : _a.remove();
            onChange();
        }
    });
    tableBody.addEventListener("input", () => {
        onChange();
    });
    return { render, collect };
}
// Utility to parse string input into appropriate ConfigValue types
export function parseValue(value) {
    const processedValue = value.trim();
    if (processedValue === "")
        return "";
    if (processedValue === "true")
        return true;
    if (processedValue === "false")
        return false;
    if (processedValue === "null")
        return null;
    if (!isNaN(Number(processedValue)) && processedValue !== "")
        return Number(processedValue);
    if (processedValue.startsWith("[") && processedValue.endsWith("]")) {
        try {
            const arr = JSON.parse(processedValue);
            if (Array.isArray(arr))
                return arr.map(String);
        }
        catch (_a) {
            // Not a valid JSON array, fall through to other checks
        }
    }
    if (processedValue.includes(",")) {
        return processedValue.split(",").map(s => s.trim()).filter(Boolean);
    }
    return processedValue;
}
