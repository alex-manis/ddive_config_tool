import { $ } from "./utils/dom.js";

const loader = $<HTMLDivElement>("#title-loader");

export function showLoader() {
  loader.style.display = "block";
}

export function hideLoader() {
  loader.style.display = "none";
}