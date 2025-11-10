import type { PublisherConfig, ConfigValue } from "../types/interfaces.js";
import { state } from "../state/appState.js";
import { editorTitleText, form } from "./dom.js";
import type { PagesManager } from "../components/PagesTable.js";
import type { ExtraFieldsManager } from "../components/ExtraFieldsTable.js";
import { STANDARD_KEYS } from "./constants.js";

let pagesManager: PagesManager;
let extraFieldsManager: ExtraFieldsManager;

export function setTableManagers(pm: PagesManager, efm: ExtraFieldsManager) {
  pagesManager = pm;
  extraFieldsManager = efm;
}
// Helper functions to get form values
export function getStringValue(name: string): string {
  const el = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
  return el?.value || "";
}

// Helper function to get boolean form values
export function getBoolValue(name: string): boolean {
  const el = form.elements.namedItem(name) as HTMLInputElement;
  return el?.checked || false;
}

// Collect all form data into a PublisherConfig object
export function collectFormData(): PublisherConfig | null {
  if (!state.currentPublisher && !state.isCreating) return null;
  const baseConfig: Partial<PublisherConfig> = {};
  if (state.currentPublisher) {
    const publisher = state.currentPublisher;
    Object.keys(publisher).forEach(key => {
        if (STANDARD_KEYS.has(key)) {
        baseConfig[key as keyof PublisherConfig] = publisher[key];
      }
    });
  }
  if (state.isCreating) {
    baseConfig.publisherId = getStringValue("publisherId");
  }

  // Assemble the final form data
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
    pages: pagesManager.collect(),
    ...Object.fromEntries(extraFieldsManager.collect().filter(([key]: [string, ConfigValue]) => key)),
  } as PublisherConfig;

  return formData;
}

// Fill the form with data from a PublisherConfig object
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
  (form.elements.namedItem("tags") as HTMLInputElement).value = data.tags?.join(", ") || "";
   const allowedDomainsInput = form.elements.namedItem("allowedDomains") as HTMLInputElement;
  if (allowedDomainsInput) {
    if (Array.isArray(data.allowedDomains)) {
      allowedDomainsInput.value = data.allowedDomains.join(", ");
    } else {
      allowedDomainsInput.value = "";
    }
  }
  (form.elements.namedItem("notes") as HTMLTextAreaElement).value = data.notes || "";
  pagesManager.render(data.pages);
  extraFieldsManager.renderFromConfig(data);
}

// Prepare the form for creating a new publisher
export function prepareFormForCreation() {
  editorTitleText.textContent = "Create New Publisher";
  form.reset();
  (form.elements.namedItem("publisherId") as HTMLInputElement).value = "pub-";

  const newPublisherTemplate: Partial<PublisherConfig> = {
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