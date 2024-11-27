import { Festival } from "../../src/api/festivals";
jest.mock("axios");

describe("fetchFestivalData", () => {
  beforeAll(() => {
    process.env.API_URL = "http://mockapi.com/";
  });

  afterAll(() => {
    delete process.env.API_URL;
  });

  it("should fetch festival data successfully", async () => {
    const { fetchFestivalData } = require("../../src/services/festivalService");
    const mockData: Festival[] = [
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
    const axios = require("axios");
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const data = await fetchFestivalData();
    expect(data).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.API_URL}codingtest/api/v1/festivals/`
    );
  });

  it("should handle API errors gracefully", async () => {
    const { fetchFestivalData } = require("../../src/services/festivalService");
    const axios = require("axios");
    const mockError = new Error("Network Error");
    (axios.get as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(fetchFestivalData()).rejects.toThrowError(
      "Failed to fetch data from the external API"
    );
    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.API_URL}codingtest/api/v1/festivals/`
    );
  });

  it("should throw an error if API_URL is not defined", async () => {
    delete process.env.API_URL;
    const { fetchFestivalData } = require("../../src/services/festivalService");

    await expect(fetchFestivalData()).rejects.toThrowError(
      "Error: API_URL is not defined in .env"
    );
  });
});
