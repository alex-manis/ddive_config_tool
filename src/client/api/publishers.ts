import type { PublisherConfig, PublisherListItem } from "../types/interfaces.js";
import { BASE_URL } from "../utils/constants.js";


// Helper function to check fetch responses
async function checkResponse<T>(res: Response): Promise<T> {
  
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
 
    const errorMessage = data?.error || res.statusText || `Request failed with status ${res.status}`;
    throw new Error(errorMessage);
  }
  return data;
}

// Fetch the list of publishers
export function getPublishers(): Promise<PublisherListItem[]> {
  return fetch(`${BASE_URL}/publishers`)
    .then(checkResponse<{ publishers: PublisherListItem[] }>)
    .then(data => data.publishers || []);
}

// Fetch a single publisher by filename
export function getPublisher(filename: string): Promise<PublisherConfig> {
  return fetch(`${BASE_URL}/publisher/${filename}`).then(res => checkResponse<PublisherConfig>(res));
}

// Create a new publisher
export function createPublisher(data: PublisherConfig): Promise<{ newFilename: string }> {
  const filename = `${data.publisherId}.json`;
  return fetch(`${BASE_URL}/publisher/${filename}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data, null, 2),
  })
    .then(checkResponse)
    .then(() => ({ newFilename: filename }));
}

// Update an existing publisher
export function savePublisher(filename: string, data: PublisherConfig): Promise<{ newFilename: string }> {
  return fetch(`${BASE_URL}/publisher/${filename}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data, null, 2),
  })
    .then(checkResponse)
    .then(() => ({ newFilename: filename }));
}

// Delete a publisher by filename
export function deletePublisher(filename: string): Promise<void> {
  return fetch(`${BASE_URL}/publisher/${filename}`, {
    method: "DELETE",
  })
  .then(checkResponse)
  .then(() => undefined); 
}