import type { ConfigValue } from "../types/interfaces.js";

type CreateRowFn<T> = (item?: T) => HTMLTableRowElement;
type CollectRowFn<T> = (tr: HTMLTableRowElement) => T;

// Options for initializing a table manager
interface TableManagerOptions<T> {
  tableBody: HTMLElement;
  addBtn: HTMLElement;
  createRow: CreateRowFn<T>;
  collectRow: CollectRowFn<T>;
  onChange: () => void;
}

// Generic table manager for dynamic row addition/removal and data collection
export function initTableManager<T>({
  tableBody,
  addBtn,
  createRow,
  collectRow,
  onChange
}: TableManagerOptions<T>) {

    function render(items: T[]) {
    tableBody.innerHTML = "";
    items.forEach(item => tableBody.appendChild(createRow(item)));
  }

  function collect(): T[] {
    const data: T[] = [];
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
    const target = e.target as HTMLElement;
    if (target.classList.contains("remove-btn")) {
      target.closest("tr")?.remove();
      onChange();
    }
  });

  tableBody.addEventListener("input", () => {
    onChange();
  });

  return { render, collect };
}

// Utility to parse string input into appropriate ConfigValue types
export function parseValue(value: string): ConfigValue {
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
    } catch {
      // Not a valid JSON array, fall through to other checks
    }
  }
  if (processedValue.includes(",")) {
    return processedValue.split(",").map(s => s.trim()).filter(Boolean);
  }
  return processedValue;
}