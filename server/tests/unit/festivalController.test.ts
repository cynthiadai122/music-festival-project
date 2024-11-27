import request from "supertest";
import express from "express";
import { getFestivals } from "../../src/controllers/festivalController";
import { fetchFestivalData } from "../../src/services/festivalService";
import { formatFestivalData } from "../../src/api/festivals";

const app = express();
app.get("/festivals", getFestivals);

jest.mock("../../src/services/festivalService");
jest.mock("../../src/api/festivals");

describe("getFestivals controller", () => {
  beforeEach(() => {
    (fetchFestivalData as jest.Mock).mockReset();
    (formatFestivalData as jest.Mock).mockReset();
  });

  it("should return festival data successfully", async () => {
    const mockData = [
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
    ];

    const formattedData = mockData.map(festival => ({
      festivalName: festival.name,
      bands: festival.bands.map(band => band.name).join(", ")
    }));

    (fetchFestivalData as jest.Mock).mockResolvedValueOnce(mockData);
    (formatFestivalData as jest.Mock).mockReturnValueOnce(formattedData);

    const response = await request(app).get("/festivals");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(formattedData);
    expect(fetchFestivalData).toHaveBeenCalledTimes(1);
    expect(formatFestivalData).toHaveBeenCalledWith(mockData);
  });

  it("should handle errors and return a 500 status", async () => {
    const errorMessage = "Failed to fetch data from external API";
    (fetchFestivalData as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const response = await request(app).get("/festivals");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Failed to fetch festival data" });
    expect(fetchFestivalData).toHaveBeenCalledTimes(1);
    expect(formatFestivalData).not.toHaveBeenCalled();
  });

  it("should return a 500 error if festival data cannot be formatted", async () => {
    const mockData = [
      {
        name: "Festival A",
        bands: [
          { name: "Band 1", recordLabel: "Label 1" },
          { name: "Band 2", recordLabel: "Label 1" }
        ]
      }
    ];

    (fetchFestivalData as jest.Mock).mockResolvedValueOnce(mockData);
    (formatFestivalData as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Error formatting festival data");
    });

    const response = await request(app).get("/festivals");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Failed to fetch festival data" });
    expect(fetchFestivalData).toHaveBeenCalledTimes(1);
    expect(formatFestivalData).toHaveBeenCalledWith(mockData);
  });
});
