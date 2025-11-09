import type { PublisherConfig, PublisherListItem } from "../types/interfaces.js";

// Universal error handler for API responses
async function handleApiError(response: Response, baseMessage: string): Promise<never> {
  let details = response.statusText;
  try {
    const errorData = await response.json();
    if (errorData && errorData.error) {
      details = errorData.error;
    }
  } catch (e) {
  }
  throw new Error(`${baseMessage}: ${details} (status: ${response.status})`);
}

// Fetch the list of publishers
export async function fetchPublishers(): Promise<PublisherListItem[]> {
  const response = await fetch("/api/publishers");
  if (!response.ok) {
    return handleApiError(response, "Failed to fetch publishers");
  }
  const data = await response.json();
  return data.publishers || [];
}

// Fetch a single publisher by filename
export async function fetchPublisher(filename: string): Promise<PublisherConfig> {
  const response = await fetch(`/api/publisher/${filename}`);
  if (!response.ok) {
    return handleApiError(response, `Failed to fetch publisher '${filename}'`);
  }
  return response.json();
}

// Save or create a publisher
export async function savePublisher(filename: string, data: PublisherConfig, isCreating: boolean): Promise<{newFilename: string}> {
  const finalFilename = isCreating ? `${data.publisherId}.json` : filename;

  const response = await fetch(`/api/publisher/${finalFilename}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Is-Creating": String(isCreating) },
    body: JSON.stringify(data, null, 2),
  });
  if (!response.ok) {
    return handleApiError(response, `Failed to save publisher '${finalFilename}'`);
  }
  return { newFilename: finalFilename };
}

// Delete a publisher by filename
export async function deletePublisher(filename: string): Promise<void> {
  const response = await fetch(`/api/publisher/${filename}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    return handleApiError(response, `Failed to delete publisher '${filename}'`);
  }
}