import { jsonViewer } from "../utils/dom.js";
function normalizeValue(value) {
    if (value === null || value === undefined)
        return undefined;
    if (Array.isArray(value)) {
        const cleaned = value
            .map(v => (typeof v === "string" ? v.trim() : v))
            .filter(v => v !== null && v !== undefined && v !== "");
        return cleaned.length > 0 ? cleaned : undefined;
    }
    if (typeof value === "object") {
        const entries = Object.entries(value)
            .map(([k, v]) => [k, normalizeValue(v)])
            .filter(([_, v]) => v !== undefined);
        return entries.length > 0 ? Object.fromEntries(entries) : undefined;
    }
    return value;
}
export function computeDiffHTML(orig, updated, path = "") {
    let result = "";
    orig = normalizeValue(orig);
    updated = normalizeValue(updated);
    if (typeof updated !== "object" || updated === null) {
        if (orig !== updated) {
            result += `<div style="background-color:#d4f8d4;">${path}: ${JSON.stringify(updated)}</div>`;
        }
        else {
            result += `<div>${path}: ${JSON.stringify(updated)}</div>`;
        }
        return result;
    }
    if (Array.isArray(updated)) {
        const origArr = Array.isArray(orig) ? orig : [];
        updated.forEach((item, idx) => {
            result += computeDiffHTML(origArr[idx], item, `${path}[${idx}]`);
        });
        if (origArr.length > updated.length) {
            for (let i = updated.length; i < origArr.length; i++) {
                result += `<div style="background-color:#f8d4d4;">${path}[${i}]: ${JSON.stringify(origArr[i])} (removed)</div>`;
            }
        }
        return result;
    }
    const origObj = (orig && typeof orig === "object") ? orig : {};
    const allKeys = new Set([...Object.keys(origObj), ...Object.keys(updated)]);
    allKeys.forEach(key => {
        const fullPath = path ? `${path}.${key}` : key;
        const origValue = origObj[key];
        const updatedValue = updated[key];
        if (updatedValue === undefined) {
            result += `<div style="background-color:#f8d4d4;">${fullPath}: ${JSON.stringify(origValue)} (removed)</div>`;
        }
        else if (origValue === undefined) {
            result += `<div style="background-color:#d4f8d4;">${fullPath}: ${JSON.stringify(updatedValue)} (added)</div>`;
        }
        else {
            result += computeDiffHTML(origValue, updatedValue, fullPath);
        }
    });
    return result;
}
export function showJsonViewer(html) {
    jsonViewer.style.display = "block";
    jsonViewer.innerHTML = html;
}
export function hideJsonViewer() {
    jsonViewer.style.display = "none";
    jsonViewer.innerHTML = "";
}
