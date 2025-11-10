import { state } from "../state/appState.js";
import { editorTitleText, form } from "./dom.js";
import { STANDARD_KEYS } from "../components/constants.js";
let pagesManager;
let extraFieldsManager;
export function setTableManagers(pm, efm) {
    pagesManager = pm;
    extraFieldsManager = efm;
}
// Helper functions to get form values
export function getStringValue(name) {
    const el = form.elements.namedItem(name);
    return (el === null || el === void 0 ? void 0 : el.value) || "";
}
// Helper function to get boolean form values
export function getBoolValue(name) {
    const el = form.elements.namedItem(name);
    return (el === null || el === void 0 ? void 0 : el.checked) || false;
}
// Collect all form data into a PublisherConfig object
export function collectFormData() {
    if (!state.currentPublisher && !state.isCreating)
        return null;
    const baseConfig = {};
    if (state.currentPublisher) {
        const publisher = state.currentPublisher;
        Object.keys(publisher).forEach(key => {
            if (STANDARD_KEYS.has(key)) {
                baseConfig[key] = publisher[key];
            }
        });
    }
    if (state.isCreating) {
        baseConfig.publisherId = getStringValue("publisherId");
    }
    // Assemble the final form data
    const formData = Object.assign(Object.assign(Object.assign({}, baseConfig), { aliasName: getStringValue("aliasName"), isActive: getBoolValue("isActive"), publisherDashboard: getStringValue("publisherDashboard"), monitorDashboard: getStringValue("monitorDashboard"), qaStatusDashboard: getStringValue("qaStatusDashboard"), customCss: getStringValue("customCss"), tags: getStringValue("tags").split(",").map(s => s.trim()).filter(Boolean), notes: getStringValue("notes"), pages: pagesManager.collect() }), Object.fromEntries(extraFieldsManager.collect().filter(([key]) => key)));
    return formData;
}
// Fill the form with data from a PublisherConfig object
export function fillForm(data) {
    var _a;
    editorTitleText.textContent = `Editing: ${data.aliasName}`;
    form.elements.namedItem("publisherId").readOnly = !state.isCreating;
    form.elements.namedItem("publisherId").value = data.publisherId;
    form.elements.namedItem("aliasName").value = data.aliasName;
    form.elements.namedItem("isActive").checked = data.isActive;
    form.elements.namedItem("publisherDashboard").value = data.publisherDashboard;
    form.elements.namedItem("monitorDashboard").value = data.monitorDashboard;
    form.elements.namedItem("qaStatusDashboard").value = data.qaStatusDashboard;
    form.elements.namedItem("customCss").value = data.customCss || "";
    form.elements.namedItem("tags").value = ((_a = data.tags) === null || _a === void 0 ? void 0 : _a.join(", ")) || "";
    const allowedDomainsInput = form.elements.namedItem("allowedDomains");
    if (allowedDomainsInput) {
        if (Array.isArray(data.allowedDomains)) {
            allowedDomainsInput.value = data.allowedDomains.join(", ");
        }
        else {
            allowedDomainsInput.value = "";
        }
    }
    form.elements.namedItem("notes").value = data.notes || "";
    pagesManager.render(data.pages);
    extraFieldsManager.renderFromConfig(data);
}
// Prepare the form for creating a new publisher
export function prepareFormForCreation() {
    editorTitleText.textContent = "Create New Publisher";
    form.reset();
    form.elements.namedItem("publisherId").value = "pub-";
    const newPublisherTemplate = {
        publisherId: "pub-",
        aliasName: "New Publisher",
        isActive: true,
        pages: [],
        publisherDashboard: "",
        monitorDashboard: "",
        qaStatusDashboard: "",
    };
    fillForm(newPublisherTemplate);
}
