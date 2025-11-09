import express from "express";
import path from "path";
import type { PublisherListItem } from "./client/types/interfaces.js";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));
app.use("/client", express.static(path.join(__dirname, "client")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Parse JSON bodies
app.use(express.json());

// API endpoint to get publishers list
app.get("/api/publishers", async (_req, res) => {
  try {
    const dataPath = path.join(__dirname, "../data/publishers.json");
    const data = await fs.readFile(dataPath, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to read publishers data" });
  }
});

// API endpoint to get a specific publisher config
app.get("/api/publisher/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const dataPath = path.join(__dirname, "../data", filename);
    const data = await fs.readFile(dataPath, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(404).json({ error: "Publisher config not found" });
  }
});

// API endpoint to save a publisher config
app.put("/api/publisher/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const isCreating = req.headers["x-is-creating"] === "true";
    const dataPath = path.join(__dirname, "../data", filename);

    await fs.writeFile(dataPath, JSON.stringify(req.body, null, 2), "utf-8");

    if (isCreating) {
      const publishersListPath = path.join(__dirname, "../data/publishers.json");
      const publishersListData = await fs.readFile(publishersListPath, "utf-8");
      const publishersList = JSON.parse(publishersListData);

      publishersList.publishers.push({
        id: req.body.publisherId,
        alias: req.body.aliasName,
        file: filename,
      });

      publishersList.publishers.sort((a: PublisherListItem, b: PublisherListItem) => a.alias.localeCompare(b.alias));
      await fs.writeFile(publishersListPath, JSON.stringify(publishersList, null, 2), "utf-8");
    }

    res.json({ success: true, filename });
  } catch (error) {
    res.status(500).json({ error: "Failed to save publisher config" });
  }
});

// API endpoint to delete a publisher config
app.delete("/api/publisher/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const dataPath = path.join(__dirname, "../data", filename);
    const publishersListPath = path.join(__dirname, "../data/publishers.json");


    await fs.unlink(dataPath);
    const publishersListData = await fs.readFile(publishersListPath, "utf-8");
    const publishersList = JSON.parse(publishersListData);

    publishersList.publishers = publishersList.publishers.filter((p: PublisherListItem) => p.file !== filename);

    await fs.writeFile(publishersListPath, JSON.stringify(publishersList, null, 2), "utf-8");

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete publisher config" });
  }
});

// Start the server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
