// Application state management
export const state = {
    allPublishers: [],
    currentPublisher: null,
    currentFilename: "",
    originalPublisherData: null,
    isDirty: false,
    isCreating: false,
};
// Check if there are unsaved changes
export function hasUnsavedChanges() {
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
