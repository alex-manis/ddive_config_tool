var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getPublishers } from "./api/publishers.js";
import { state } from "./state/appState.js";
import { renderPublisherList } from "./components/PublisherList.js";
import { updateEditorUIVisibility } from "./utils/ui.js";
import { initializeEventListeners } from "./events.js";
import { handleError } from "./utils/errorHandler.js";
// Main application entry point
export function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            state.allPublishers = yield getPublishers();
            renderPublisherList(state.allPublishers);
            updateEditorUIVisibility("initial");
        }
        catch (error) {
            handleError("Could not load the list of publishers. Please check the server connection and try again.", error);
        }
    });
}
initializeEventListeners();
main().catch(e => console.error(e));
