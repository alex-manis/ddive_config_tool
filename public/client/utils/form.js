import { state } from "../state/appState.js";
import { editorTitleText, form } from "./dom.js";
import { collectPages, renderPages } from "../components/PagesTable.js";
import { collectExtraFields, renderExtraFields } from "../components/ExtraFieldsTable.js";
export function getStringValue(name) {
    const el = form.elements.namedItem(name);
    return (el === null || el === void 0 ? void 0 : el.value) || "";
}
export function getBoolValue(name) {
    const el = form.elements.namedItem(name);
    return (el === null || el === void 0 ? void 0 : el.checked) || false;
}
export function collectFormData() {
    if (!state.currentPublisher && !state.isCreating)
        return null;
    // Создаем базовый объект, содержащий только стандартные поля из оригинала.
    // Это предотвращает сохранение удаленных "дополнительных полей".
    const baseConfig = {};
    if (state.currentPublisher) {
        const publisher = state.currentPublisher;
        Object.keys(publisher).forEach(key => {
            // Используем тот же список стандартных ключей, что и в ExtraFieldsTable
            const STANDARD_KEYS = ["publisherId", "aliasName", "isActive", "pages", "publisherDashboard", "monitorDashboard", "qaStatusDashboard", "customCss", "tags", "notes"];
            if (STANDARD_KEYS.includes(key)) {
                baseConfig[key] = publisher[key];
            }
        });
    }
    if (state.isCreating) {
        baseConfig.publisherId = getStringValue("publisherId");
    }
    const formData = Object.assign(Object.assign(Object.assign({}, baseConfig), { aliasName: getStringValue("aliasName"), isActive: getBoolValue("isActive"), publisherDashboard: getStringValue("publisherDashboard"), monitorDashboard: getStringValue("monitorDashboard"), qaStatusDashboard: getStringValue("qaStatusDashboard"), customCss: getStringValue("customCss"), tags: getStringValue("tags").split(",").map(s => s.trim()).filter(Boolean), notes: getStringValue("notes"), pages: collectPages() }), collectExtraFields());
    return formData;
}
export function fillForm(data) {
    var _a, _b;
    editorTitleText.textContent = `Editing: ${data.aliasName}`;
    form.elements.namedItem("publisherId").readOnly = !state.isCreating;
    form.elements.namedItem("publisherId").value = data.publisherId;
    form.elements.namedItem("aliasName").value = data.aliasName;
    form.elements.namedItem("isActive").checked = data.isActive;
    form.elements.namedItem("publisherDashboard").value = data.publisherDashboard;
    form.elements.namedItem("monitorDashboard").value = data.monitorDashboard;
    form.elements.namedItem("qaStatusDashboard").value = data.qaStatusDashboard;
    form.elements.namedItem("customCss").value = data.customCss || "";
    // Явная обработка полей-массивов для корректного отображения в input
    form.elements.namedItem("tags").value = ((_a = data.tags) === null || _a === void 0 ? void 0 : _a.join(", ")) || "";
    const allowedDomainsInput = form.elements.namedItem("allowedDomains");
    if (allowedDomainsInput) {
        allowedDomainsInput.value = ((_b = data.allowedDomains) === null || _b === void 0 ? void 0 : _b.join(", ")) || "";
    }
    form.elements.namedItem("notes").value = data.notes || "";
    renderPages(data.pages);
    renderExtraFields(data);
}
export function prepareFormForCreation() {
    editorTitleText.textContent = "Create New Publisher";
    form.reset();
    form.elements.namedItem("publisherId").value = "pub-";
    const newPublisherTemplate = {
        // Начальное значение ID
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
