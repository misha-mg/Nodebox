import {
  blendColors,
  getAccessibleTextColor,
  getCellBackgrounds,
} from "./colors";
import { ElementDefinition } from "./types";

describe("colors", () => {
  it("blends two colors in linear RGB", () => {
    expect(blendColors(["#FF0000", "#0000FF"])).toBe("#BC00BC");
  });

  it("computes adjacency backgrounds for both rule families", () => {
    const elements: ElementDefinition[] = [
      {
        id: "select",
        row: 1,
        col: 1,
        label: "Country",
        type: "SELECT",
        options: ["USA"],
      },
      {
        id: "text",
        row: 0,
        col: 1,
        label: "First Name",
        type: "TEXT_INPUT",
        placeholder: "Enter first name",
      },
    ];

    const result = getCellBackgrounds(elements, "#FF0000", "#0000FF");

    expect(result.get("0:0")).toBe("#BC00BC");
    expect(result.get("2:2")).toBe("#FF0000");
    expect(result.get("1:1")).toBe("#0000FF");
  });

  it("returns a readable text color for dark and light backgrounds", () => {
    expect(getAccessibleTextColor("#0000FF")).toBe("#FFFFFF");
    expect(getAccessibleTextColor("#F7F8FC")).toBe("#111111");
  });
});
