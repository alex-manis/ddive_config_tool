var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Universal error handler for API responses
function handleApiError(response, baseMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        let details = response.statusText;
        try {
            const errorData = yield response.json();
            if (errorData && errorData.error) {
                details = errorData.error;
            }
        }
        catch (e) {
        }
        throw new Error(`${baseMessage}: ${details} (status: ${response.status})`);
    });
}
// Fetch the list of publishers
export function fetchPublishers() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("/api/publishers");
        if (!response.ok) {
            return handleApiError(response, "Failed to fetch publishers");
        }
        const data = yield response.json();
        return data.publishers || [];
    });
}
// Fetch a single publisher by filename
export function fetchPublisher(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/api/publisher/${filename}`);
        if (!response.ok) {
            return handleApiError(response, `Failed to fetch publisher '${filename}'`);
        }
        return response.json();
    });
}
// Save or create a publisher
export function savePublisher(filename, data, isCreating) {
    return __awaiter(this, void 0, void 0, function* () {
        const finalFilename = isCreating ? `${data.publisherId}.json` : filename;
        const response = yield fetch(`/api/publisher/${finalFilename}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "X-Is-Creating": String(isCreating) },
            body: JSON.stringify(data, null, 2),
        });
        if (!response.ok) {
            return handleApiError(response, `Failed to save publisher '${finalFilename}'`);
        }
        return { newFilename: finalFilename };
    });
}
// Delete a publisher by filename
export function deletePublisher(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/api/publisher/${filename}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            return handleApiError(response, `Failed to delete publisher '${filename}'`);
        }
    });
}
