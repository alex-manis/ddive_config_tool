import { getPublishers } from "./api/publishers.js";
import { state } from "./state/appState.js";
import { renderPublisherList } from "./components/PublisherList.js";
import { updateEditorUIVisibility } from "./utils/ui.js";
import { initializeEventListeners } from "./events.js";
import { handleError } from "./utils/errorHandler.js";

// Main application entry point
export async function main() {
  try {
    state.allPublishers = await getPublishers();
    renderPublisherList(state.allPublishers);
    updateEditorUIVisibility("initial");
  } catch (error) {
    handleError("Could not load the list of publishers. Please check the server connection and try again.", error);
  }
}
initializeEventListeners();
main().catch(e => console.error(e));