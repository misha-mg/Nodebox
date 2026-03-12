export type InputKind = "SELECT" | "TEXT_INPUT";

export type ElementDefinition =
  | {
      id: string;
      row: number;
      col: number;
      label: string;
      type: "SELECT";
      options: string[];
    }
  | {
      id: string;
      row: number;
      col: number;
      label: string;
      type: "TEXT_INPUT";
      placeholder: string;
    };

export interface ParseError {
  line: number;
  message: string;
}

export interface ParseResult {
  elements: ElementDefinition[];
  errors: ParseError[];
}

export interface Coordinate {
  row: number;
  col: number;
}

export interface GridBounds {
  minRow: number;
  maxRow: number;
  minCol: number;
  maxCol: number;
}
