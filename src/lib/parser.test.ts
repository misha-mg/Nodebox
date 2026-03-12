import { parseElementLines, serializeElements } from "./parser";

describe("parser", () => {
  it("parses valid lines and serializes them in a stable order", () => {
    const text = [
      "2;3;Role;SELECT;Admin,User,Guest",
      "1;1;First Name;TEXT_INPUT;Enter first name",
    ].join("\n");

    const result = parseElementLines(text);

    expect(result.errors).toHaveLength(0);
    expect(result.elements).toHaveLength(2);
    expect(serializeElements(result.elements)).toBe(
      [
        "1;1;First Name;TEXT_INPUT;Enter first name",
        "2;3;Role;SELECT;Admin,User,Guest",
      ].join("\n")
    );
  });

  it("reports duplicate coordinates and invalid types", () => {
    const result = parseElementLines([
      "1;1;Name;TEXT_INPUT;Enter name",
      "1;1;Country;SELECT;USA,Canada",
      "2;1;Bad;RADIO;a,b",
    ].join("\n"));

    expect(result.errors).toEqual([
      {
        line: 2,
        message: "Coordinate (1, 1) is already used on line 1",
      },
      {
        line: 3,
        message: 'Input type must be "SELECT" or "TEXT_INPUT"',
      },
    ]);
  });
});
