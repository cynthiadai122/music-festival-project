import {
  sortByKey,
  formatFestivalData,
  Festival
} from "../../src/api/festivals";

describe("sortByKey", () => {
  it("should sort an object by its keys", () => {
    const input = { b: 2, a: 1, c: 3 };
    const expectedOutput = { a: 1, b: 2, c: 3 };
    expect(sortByKey(input)).toEqual(expectedOutput);
  });

  it("should handle an empty object", () => {
    expect(sortByKey({})).toEqual({});
  });
});

describe("formatFestivalData", () => {
  it("should format festival data correctly", () => {
    const input: Festival[] = [
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

    const expectedOutput = [
      {
        recordLabel: "Label 1",
        bands: [
          { bandName: "Band 1", festivals: ["Festival A", "Festival B"] },
          { bandName: "Band 2", festivals: ["Festival A"] }
        ]
      },
      {
        recordLabel: "Label 2",
        bands: [{ bandName: "Band 3", festivals: ["Festival B"] }]
      }
    ];

    expect(formatFestivalData(input)).toEqual(expectedOutput);
  });

  it("should handle empty festival data", () => {
    const input: Festival[] = [];
    expect(formatFestivalData(input)).toEqual([]);
  });

  it("should handle missing fields gracefully", () => {
    const input: Festival[] = [
      {
        name: "",
        bands: [
          { name: "Band 1", recordLabel: "" },
          { name: "", recordLabel: "Label 1" }
        ]
      }
    ];

    const expectedOutput = [
      {
        recordLabel: "Label 1",
        bands: [{ bandName: "", festivals: ["Unknown Festival"] }]
      },
      {
        recordLabel: "Unknown",
        bands: [{ bandName: "Band 1", festivals: ["Unknown Festival"] }]
      }
    ];

    expect(formatFestivalData(input)).toEqual(expectedOutput);
  });
});
