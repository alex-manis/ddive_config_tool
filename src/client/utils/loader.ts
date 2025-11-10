import { loader } from "./dom.js";


export function showLoader() {
  loader.style.display = "block";
}

export function hideLoader() {
  loader.style.display = "none";
}