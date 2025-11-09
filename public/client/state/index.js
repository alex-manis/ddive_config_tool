export const state = {
    allPublishers: [],
    currentPublisher: null,
    currentFilename: "",
    originalPublisherData: null,
    isDirty: false,
    isCreating: false,
};
export function hasUnsavedChanges() {
    return state.isDirty;
}
export function resetFormState() {
    state.isDirty = false;
    // Другие сбросы состояния при необходимости
}
export function setDirty() {
    state.isDirty = true;
}
