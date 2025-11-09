import type { PublisherConfig, PublisherListItem } from "../types/interfaces.js";

// Application state management
export const state = {
  allPublishers: [] as PublisherListItem[],
  currentPublisher: null as PublisherConfig | null,
  currentFilename: "",
  originalPublisherData: null as PublisherConfig | null,
  isDirty: false,
  isCreating: false,
};

// Check if there are unsaved changes
export function hasUnsavedChanges(): boolean {
  return state.isDirty;
}

// Reset form state
export function resetFormState() {
  state.isDirty = false;
}

// Mark the form as dirty (unsaved changes)
export function setDirty() {
  state.isDirty = true;
}