import type { PublisherConfig, PublisherListItem } from "../types/interfaces.js";

export const state = {
  allPublishers: [] as PublisherListItem[],
  currentPublisher: null as PublisherConfig | null,
  currentFilename: "",
  originalPublisherData: null as PublisherConfig | null,
  isDirty: false,
  isCreating: false,
};

export function hasUnsavedChanges(): boolean {
  return state.isDirty;
}

export function resetFormState() {
  state.isDirty = false;
}

export function setDirty() {
  state.isDirty = true;
}