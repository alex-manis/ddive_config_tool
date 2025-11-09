import { jsonViewer } from "../utils/dom.js";
// Normalize values by trimming strings and removing empty entries
function normalizeValue(value) {
    if (value === null || value === undefined)
        return undefined;
    if (Array.isArray(value)) {
        const cleaned = value
            .map(v => (typeof v === "string" ? v.trim() : v))
            .filter((v) => v !== null && v !== undefined && v !== "");
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
// Deeply compare two values and generate HTML highlighting differences
function deepDiff(orig, updated, path = "") {
    let result = "";
    const normalizedOrig = normalizeValue(orig);
    const normalizedUpdated = normalizeValue(updated);
    if (Array.isArray(updated)) {
        const origArr = Array.isArray(orig) ? orig : [];
        updated.forEach((item, idx) => {
            result += deepDiff(origArr[idx], item, `${path}[${idx}]`);
        });
        if (origArr.length > updated.length) {
            for (let i = updated.length; i < origArr.length; i++) {
                result += `<div style="background-color:#f8d4d4;">${path}[${i}]: ${JSON.stringify(origArr[i])} (removed)</div>`;
            }
        }
        return result;
    }
    if (typeof updated !== "object" || updated === null) {
        if (JSON.stringify(normalizedOrig) !== JSON.stringify(normalizedUpdated)) {
            if (path) {
                result += `<div style="background-color:#d4f8d4;">${path}: ${JSON.stringify(updated)}</div>`;
            }
        }
        else if (path) {
            result += `<div>${path}: ${JSON.stringify(updated)}</div>`;
        }
        return result;
    }
    const origObj = (orig && typeof orig === "object" && !Array.isArray(orig)) ? orig : {};
    const updatedObj = updated;
    const allKeys = new Set([...Object.keys(origObj), ...Object.keys(updatedObj)]);
    allKeys.forEach(key => {
        const fullPath = path ? `${path}.${key}` : key;
        const origValue = origObj[key];
        const updatedValue = updatedObj[key];
        if (updatedValue === undefined) {
            result += `<div style="background-color:#f8d4d4;">${fullPath}: ${JSON.stringify(origValue)} (removed)</div>`;
        }
        else if (origValue === undefined) {
            result += `<div style="background-color:#d4f8d4;">${fullPath}: ${JSON.stringify(updatedValue)} (added)</div>`;
        }
        else {
            result += deepDiff(origValue, updatedValue, fullPath);
        }
    });
    return result;
}
// Compute the diff HTML between two PublisherConfig objects
export function computeDiffHTML(orig, updated) {
    return deepDiff(orig, updated);
}
// Show the JSON viewer with given HTML content
export function showJsonViewer(html) {
    jsonViewer.style.display = "block";
    jsonViewer.innerHTML = html;
}
// Hide the JSON viewer
export function hideJsonViewer() {
    jsonViewer.style.display = "none";
    jsonViewer.innerHTML = "";
}
