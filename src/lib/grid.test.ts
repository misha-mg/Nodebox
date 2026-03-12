import { getGridBounds, moveElement } from "./grid";
import { ElementDefinition } from "./types";

const elements: ElementDefinition[] = [
  {
    id: "first-name",
    row: 1,
    col: 1,
    label: "First Name",
    type: "TEXT_INPUT",
    placeholder: "Enter first name",
  },
  {
    id: "country",
    row: 1,
    col: 2,
    label: "Country",
    type: "SELECT",
    options: ["USA", "Canada"],
  },
];

describe("moveElement", () => {
  it("adds one empty cell of padding around the current layout", () => {
    expect(getGridBounds(elements)).toEqual({
      minRow: 0,
      maxRow: 2,
      minCol: 0,
      maxCol: 3,
    });
  });

  it("moves an element into an empty cell", () => {
    const result = moveElement(elements, "first-name", { row: 2, col: 2 });
    const moved = result.find((element) => element.id === "first-name");

    expect(moved).toMatchObject({ row: 2, col: 2 });
  });

  it("swaps elements when the target cell is occupied", () => {
    const result = moveElement(elements, "first-name", { row: 1, col: 2 });
    const first = result.find((element) => element.id === "first-name");
    const second = result.find((element) => element.id === "country");

    expect(first).toMatchObject({ row: 1, col: 2 });
    expect(second).toMatchObject({ row: 1, col: 1 });
  });
});
