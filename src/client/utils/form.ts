import type { PublisherConfig } from "../types/interfaces.js";
import { state } from "../state/appState.js";
import { editorTitleText, form } from "./dom.js";
import { collectPages, renderPages } from "../components/PagesTable.js";
import { collectExtraFields, renderExtraFields } from "../components/ExtraFieldsTable.js";

export function getStringValue(name: string): string {
  const el = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
  return el?.value || "";
}

export function getBoolValue(name: string): boolean {
  const el = form.elements.namedItem(name) as HTMLInputElement;
  return el?.checked || false;
}

export function collectFormData(): PublisherConfig | null {
  if (!state.currentPublisher && !state.isCreating) return null;

  // Создаем базовый объект, содержащий только стандартные поля из оригинала.
  // Это предотвращает сохранение удаленных "дополнительных полей".
  const baseConfig: Partial<PublisherConfig> = {};
  if (state.currentPublisher) {
    const publisher = state.currentPublisher;
    Object.keys(publisher).forEach(key => {
      // Используем тот же список стандартных ключей, что и в ExtraFieldsTable
      const STANDARD_KEYS = ["publisherId", "aliasName", "isActive", "pages", "publisherDashboard", "monitorDashboard", "qaStatusDashboard", "customCss", "tags", "notes"];
      if (STANDARD_KEYS.includes(key)) {
        baseConfig[key as keyof PublisherConfig] = publisher[key];
      }
    });
  }

  if (state.isCreating) {
    baseConfig.publisherId = getStringValue("publisherId");
  }

  const formData = {
    ...baseConfig,
    aliasName: getStringValue("aliasName"),
    isActive: getBoolValue("isActive"),
    publisherDashboard: getStringValue("publisherDashboard"),
    monitorDashboard: getStringValue("monitorDashboard"),
    qaStatusDashboard: getStringValue("qaStatusDashboard"),
    customCss: getStringValue("customCss"),
    tags: getStringValue("tags").split(",").map(s => s.trim()).filter(Boolean),
    notes: getStringValue("notes"),
    pages: collectPages(),
    ...collectExtraFields(),
  } as PublisherConfig;

  return formData;
}

export function fillForm(data: PublisherConfig) {
  editorTitleText.textContent = `Editing: ${data.aliasName}`;
  (form.elements.namedItem("publisherId") as HTMLInputElement).readOnly = !state.isCreating;
  (form.elements.namedItem("publisherId") as HTMLInputElement).value = data.publisherId;
  (form.elements.namedItem("aliasName") as HTMLInputElement).value = data.aliasName;
  (form.elements.namedItem("isActive") as HTMLInputElement).checked = data.isActive;
  (form.elements.namedItem("publisherDashboard") as HTMLInputElement).value = data.publisherDashboard;
  (form.elements.namedItem("monitorDashboard") as HTMLInputElement).value = data.monitorDashboard;
  (form.elements.namedItem("qaStatusDashboard") as HTMLInputElement).value = data.qaStatusDashboard;
  (form.elements.namedItem("customCss") as HTMLTextAreaElement).value = data.customCss || "";
  // Явная обработка полей-массивов для корректного отображения в input
  (form.elements.namedItem("tags") as HTMLInputElement).value = data.tags?.join(", ") || "";
  const allowedDomainsInput = form.elements.namedItem("allowedDomains") as HTMLInputElement;
  if (allowedDomainsInput) {
    allowedDomainsInput.value = data.allowedDomains?.join(", ") || "";
  }
  (form.elements.namedItem("notes") as HTMLTextAreaElement).value = data.notes || "";
  renderPages(data.pages);
  renderExtraFields(data);
}

export function prepareFormForCreation() {
  editorTitleText.textContent = "Create New Publisher";
  form.reset();
  (form.elements.namedItem("publisherId") as HTMLInputElement).value = "pub-";

  const newPublisherTemplate: Partial<PublisherConfig> = {
    // Начальное значение ID
    publisherId: "pub-",
    aliasName: "New Publisher",
    isActive: true,
    pages: [],
    publisherDashboard: "",
    monitorDashboard: "",
    qaStatusDashboard: "",
  };
  fillForm(newPublisherTemplate as PublisherConfig);
}