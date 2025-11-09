import type { PublisherConfig, PublisherListItem } from "../types/interfaces.js";

export async function fetchPublishers(): Promise<PublisherListItem[]> {
  const res = await fetch("/api/publishers");
  if (!res.ok) {
    throw new Error(`Failed to fetch publishers: ${res.statusText}`);
  }
  const data = await res.json();
  return data.publishers || [];
}

export async function fetchPublisher(filename: string): Promise<PublisherConfig> {
  const res = await fetch(`/api/publisher/${filename}`);
  return res.json();
}

export async function savePublisher(filename: string, data: PublisherConfig, isCreating: boolean): Promise<{newFilename: string}> {
  const finalFilename = isCreating ? `${data.publisherId}.json` : filename;

  const response = await fetch(`/api/publisher/${finalFilename}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Is-Creating": String(isCreating)
    },
    body: JSON.stringify(data, null, 2),
  });

   if (!response.ok) {
    throw new Error(`Failed to save publisher: ${response.statusText}`);
  }
  
  return { newFilename: finalFilename };
}

export async function deletePublisher(filename: string): Promise<void> {
  const response = await fetch(`/api/publisher/${filename}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete publisher");
  }
}