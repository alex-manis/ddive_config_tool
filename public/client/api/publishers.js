var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BASE_URL } from "../components/constants.js";
// Helper function to check fetch responses
function checkResponse(res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield res.json().catch(() => ({}));
        if (!res.ok) {
            const errorMessage = (data === null || data === void 0 ? void 0 : data.error) || res.statusText || `Request failed with status ${res.status}`;
            throw new Error(errorMessage);
        }
        return data;
    });
}
// Fetch the list of publishers
export function getPublishers() {
    return fetch(`${BASE_URL}/publishers`)
        .then((checkResponse))
        .then(data => data.publishers || []);
}
// Fetch a single publisher by filename
export function getPublisher(filename) {
    return fetch(`${BASE_URL}/publisher/${filename}`).then(res => checkResponse(res));
}
// Create a new publisher
export function createPublisher(data) {
    const filename = `${data.publisherId}.json`;
    return fetch(`${BASE_URL}/publisher/${filename}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data, null, 2),
    })
        .then(checkResponse)
        .then(() => ({ newFilename: filename }));
}
// Update an existing publisher
export function savePublisher(filename, data) {
    return fetch(`${BASE_URL}/publisher/${filename}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data, null, 2),
    })
        .then(checkResponse)
        .then(() => ({ newFilename: filename }));
}
// Delete a publisher by filename
export function deletePublisher(filename) {
    return fetch(`${BASE_URL}/publisher/${filename}`, {
        method: "DELETE",
    })
        .then(checkResponse)
        .then(() => undefined);
}
