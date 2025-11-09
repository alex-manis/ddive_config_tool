var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function fetchPublishers() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/api/publishers");
        if (!res.ok) {
            throw new Error(`Failed to fetch publishers: ${res.statusText}`);
        }
        const data = yield res.json();
        return data.publishers || []; // Убедимся, что возвращаем массив
    });
}
export function fetchPublisher(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`/api/publisher/${filename}`);
        return res.json();
    });
}
export function savePublisher(filename, data, isCreating) {
    return __awaiter(this, void 0, void 0, function* () {
        const finalFilename = isCreating ? `${data.publisherId}.json` : filename;
        const response = yield fetch(`/api/publisher/${finalFilename}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Is-Creating": String(isCreating)
            },
            body: JSON.stringify(data, null, 2),
        });
        if (!response.ok) {
            throw new Error(`Failed to save publisher: ${response.statusText}`);
        }
        return { newFilename: finalFilename };
    });
}
export function deletePublisher(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`/api/publisher/${filename}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete publisher");
        }
    });
}
