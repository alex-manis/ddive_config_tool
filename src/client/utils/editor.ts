import { getPublisher } from "../api/publishers.js";
import { hideJsonViewer } from "../components/JsonDiffViewer.js";
import { state, resetFormState, hasUnsavedChanges } from "../state/appState.js";
import { updateEditorUIVisibility } from "./ui.js";
import { form, publisherListEl } from "./dom.js";
import { fillForm, prepareFormForCreation } from "./form.js";

// Helper function to deselect the currently selected publisher in the list
function deselectCurrentPublisher() {
  const currentSelected = publisherListEl.querySelector(".publisher-list__item--selected");
  if (currentSelected) {
    currentSelected.classList.remove("publisher-list__item--selected");
  }
}

// Handle selecting an existing publisher for editing
export async function onSelectPublisher(file: string) {
  state.isCreating = false;
  state.currentFilename = file;
  state.currentPublisher = await getPublisher(state.currentFilename);
  state.originalPublisherData = JSON.parse(JSON.stringify(state.currentPublisher));
  fillForm(state.currentPublisher);
  form.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
  hideJsonViewer();
  resetFormState();
  updateEditorUIVisibility("editing");
}

// Start creating a new publisher
export function onStartCreatingPublisher() {
  state.isCreating = true;
  state.currentPublisher = null;
  state.originalPublisherData = null;
  state.currentFilename = "";
  prepareFormForCreation();
  deselectCurrentPublisher();
  resetFormState();
  updateEditorUIVisibility("creating");
}

// Reset the editor view to its initial state
export function resetEditorView() {
  if (hasUnsavedChanges() && !confirm("You have unsaved changes. Are you sure you want to cancel?")) {
    return;
  }
  state.currentPublisher = null;
  state.currentFilename = "";
  state.isCreating = false;
  resetFormState();

  deselectCurrentPublisher();
  hideJsonViewer();
  updateEditorUIVisibility("initial");
}