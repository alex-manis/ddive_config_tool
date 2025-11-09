import request from "supertest";
import fs from "fs/promises";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { app } from "./server"; // Импортируем реальное приложение

// Мокаем fs/promises перед импортом сервера
jest.mock("fs/promises");

const mockedFs = fs as jest.Mocked<typeof fs>;

// Вручную присваиваем моки после автоматической заглушки от Jest
mockedFs.readFile = jest.fn();
mockedFs.writeFile = jest.fn();
mockedFs.unlink = jest.fn();

describe("Server API", () => {
  beforeEach(() => {
    // Сбрасываем состояние всех моков перед каждым тестом
    jest.resetAllMocks();
  });

  describe("GET /api/publishers", () => {
    it("should return a list of publishers", async () => {
      const publishers = { publishers: [{ id: "pub-1", alias: "Publisher 1", file: "pub1.json" }] };
      mockedFs.readFile.mockResolvedValue(JSON.stringify(publishers));

      const response = await request(app).get("/api/publishers");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(publishers);
    });

    it("should return 500 on file read error", async () => {
      mockedFs.readFile.mockRejectedValue(new Error("File not found"));

      const response = await request(app).get("/api/publishers");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to read publishers data" });
    });
  });

  describe("GET /api/publisher/:filename", () => {
    it("should return a single publisher config", async () => {
      const publisherConfig = { publisherId: "pub-test", aliasName: "Test Publisher" };
      mockedFs.readFile.mockResolvedValue(JSON.stringify(publisherConfig));

      const response = await request(app).get("/api/publisher/test.json");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(publisherConfig);
    });

    it("should return 404 if publisher not found", async () => {
      mockedFs.readFile.mockRejectedValue(new Error("Not Found"));

      const response = await request(app).get("/api/publisher/not-found.json");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Publisher config not found" });
    });
  });

  describe("PUT /api/publisher/:filename", () => {
    it("should save a publisher config and return success", async () => {
      const newConfig = { publisherId: "new-pub", aliasName: "New Publisher" };
      mockedFs.writeFile.mockResolvedValue();

      const response = await request(app)
        .put("/api/publisher/new.json")
        .send(newConfig);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, filename: "new.json" });
      expect(mockedFs.writeFile).toHaveBeenCalledTimes(1);
      expect(mockedFs.writeFile).toHaveBeenCalledWith(expect.any(String), JSON.stringify(newConfig, null, 2), "utf-8");
    });
  });

  describe("PUT /api/publisher/:filename (creating new)", () => {
    it("should create a new publisher file and update the list", async () => {
      const newConfig = { publisherId: "new-pub", aliasName: "New Publisher" };
      const initialPublishers = { publishers: [{ id: "old-pub", alias: "Old Publisher", file: "old.json" }] };
      
      // Мок для чтения существующего списка паблишеров
      mockedFs.readFile.mockResolvedValueOnce(JSON.stringify(initialPublishers));
      // Мок для записи файла конфига и обновленного списка
      mockedFs.writeFile.mockResolvedValue();

      const response = await request(app)
        .put("/api/publisher/new.json")
        .set("x-is-creating", "true")
        .send(newConfig);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, filename: "new.json" });
      // Проверяем, что writeFile был вызван дважды: для нового конфига и для списка publishers.json
      expect(mockedFs.writeFile).toHaveBeenCalledTimes(2);
      // Проверяем запись нового конфига
      expect(mockedFs.writeFile).toHaveBeenCalledWith(expect.stringContaining("new.json"), JSON.stringify(newConfig, null, 2), "utf-8");
      // Проверяем запись обновленного списка
      const expectedPublishers = {
        publishers: [
          { id: "new-pub", alias: "New Publisher", file: "new.json" },
          { id: "old-pub", alias: "Old Publisher", file: "old.json" }
        ]
      };
      expect(mockedFs.writeFile).toHaveBeenCalledWith(expect.stringContaining("publishers.json"), JSON.stringify(expectedPublishers, null, 2), "utf-8");
    });
  });

  describe("DELETE /api/publisher/:filename", () => {
    it("should delete a publisher file and update the list", async () => {
        const initialPublishers = { publishers: [{ file: "test.json" }, { file: "to-delete.json" }] };
        mockedFs.readFile.mockResolvedValue(JSON.stringify(initialPublishers));
        mockedFs.unlink.mockResolvedValue();
        mockedFs.writeFile.mockResolvedValue();
        
        const response = await request(app).delete("/api/publisher/to-delete.json");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
        expect(mockedFs.unlink).toHaveBeenCalledWith(expect.stringContaining("to-delete.json"));
        expect(mockedFs.writeFile).toHaveBeenCalledWith(expect.stringContaining("publishers.json"), JSON.stringify({ publishers: [{ file: "test.json" }] }, null, 2), "utf-8");
    });
  });
});
