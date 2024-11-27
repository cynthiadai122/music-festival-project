import request from "supertest";
import express from "express";
import { PORT } from "../../src/config/env";
import router from "../../src/routes";
import { fetchFestivalData } from "../../src/services/festivalService";

jest.mock("../../src/config/env", () => ({
  PORT: 3000
}));

jest.mock("../../src/services/festivalService", () => ({
  fetchFestivalData: jest.fn()
}));

describe("Express App", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(router);
  });

  it("should start the server and respond to a request", async () => {
    (fetchFestivalData as jest.Mock).mockResolvedValueOnce([
      {
        name: "Festival A",
        bands: [
          { name: "Band 1", recordLabel: "Label 1" },
          { name: "Band 2", recordLabel: "Label 1" }
        ]
      },
      {
        name: "Festival B",
        bands: [
          { name: "Band 1", recordLabel: "Label 1" },
          { name: "Band 3", recordLabel: "Label 2" }
        ]
      }
    ]);

    const response = await request(app).get("/api/festivals");
    expect(response.status).toBe(200);
  });

  it("should respond with a 404 for an unknown route", async () => {
    const response = await request(app).get("/unknown-route");
    expect(response.status).toBe(404);
  });
});
