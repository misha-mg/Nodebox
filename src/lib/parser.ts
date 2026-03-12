import { ElementDefinition, ParseError, ParseResult } from "./types";

const VALID_INPUT_TYPES = new Set(["SELECT", "TEXT_INPUT"]);

function parseInteger(value: string) {
  if (!/^-?\d+$/.test(value.trim())) {
    return null;
  }

  return Number(value.trim());
}

function buildId(lineNumber: number, row: number, col: number) {
  return `element-${lineNumber}-${row}-${col}`;
}

export function parseElementLines(text: string): ParseResult {
  const lines = text.split(/\r?\n/);
  const elements: ElementDefinition[] = [];
  const errors: ParseError[] = [];
  const occupiedCoords = new Map<string, number>();

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (!line.trim()) {
      return;
    }

    const segments = line.split(";");

    if (segments.length < 5) {
      errors.push({
        line: lineNumber,
        message: "Expected format: row;column;label;type;options",
      });
      return;
    }

    const [rawRow, rawCol, rawLabel, rawType, ...rawConfigParts] = segments;
    const row = parseInteger(rawRow);
    const col = parseInteger(rawCol);
    const label = rawLabel.trim();
    const type = rawType.trim().toUpperCase();
    const configText = rawConfigParts.join(";").trim();

    if (row === null || col === null) {
      errors.push({
        line: lineNumber,
        message: "Row and column must be integers",
      });
      return;
    }

    if (!label) {
      errors.push({
        line: lineNumber,
        message: "Label is required",
      });
      return;
    }

    if (!VALID_INPUT_TYPES.has(type)) {
      errors.push({
        line: lineNumber,
        message: 'Input type must be "SELECT" or "TEXT_INPUT"',
      });
      return;
    }

    const key = `${row}:${col}`;

    if (occupiedCoords.has(key)) {
      errors.push({
        line: lineNumber,
        message: `Coordinate (${row}, ${col}) is already used on line ${occupiedCoords.get(
          key
        )}`,
      });
      return;
    }

    occupiedCoords.set(key, lineNumber);

    if (type === "SELECT") {
      const options = configText
        .split(",")
        .map((option) => option.trim())
        .filter(Boolean);

      if (options.length === 0) {
        errors.push({
          line: lineNumber,
          message: "SELECT requires at least one option",
        });
        return;
      }

      elements.push({
        id: buildId(lineNumber, row, col),
        row,
        col,
        label,
        type: "SELECT",
        options,
      });

      return;
    }

    elements.push({
      id: buildId(lineNumber, row, col),
      row,
      col,
      label,
      type: "TEXT_INPUT",
      placeholder: configText,
    });
  });

  return { elements, errors };
}

function compareElements(left: ElementDefinition, right: ElementDefinition) {
  if (left.row !== right.row) {
    return left.row - right.row;
  }

  if (left.col !== right.col) {
    return left.col - right.col;
  }

  return left.label.localeCompare(right.label);
}

export function serializeElements(elements: ElementDefinition[]) {
  return [...elements]
    .sort(compareElements)
    .map((element) => {
      if (element.type === "SELECT") {
        return `${element.row};${element.col};${element.label};SELECT;${element.options.join(
          ","
        )}`;
      }

      return `${element.row};${element.col};${element.label};TEXT_INPUT;${element.placeholder}`;
    })
    .join("\n");
}
