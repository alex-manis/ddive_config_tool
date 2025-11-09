export interface Page {
  pageType: string;
  selector: string;
  position: string;
}

export interface PublisherConfig {
  [key: string]: any; // Allow arbitrary extra properties
  publisherId: string;
  aliasName: string;
  isActive: boolean;
  pages: Page[];
  publisherDashboard: string;
  monitorDashboard: string;
  qaStatusDashboard: string;
  customCss?: string;
  tags?: string[];
  notes?: string;
}

export interface PublisherListItem {
  id: string;
  alias: string;
  file: string;
}
