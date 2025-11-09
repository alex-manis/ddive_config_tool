import { $ } from "./utils/dom.js";
const loader = $("#title-loader");
export function showLoader() {
    loader.style.display = "block";
}
export function hideLoader() {
    loader.style.display = "none";
}
