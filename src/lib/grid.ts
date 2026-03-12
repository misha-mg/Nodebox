import { Coordinate, ElementDefinition, GridBounds } from "./types";

export function coordKey(row: number, col: number) {
  return `${row}:${col}`;
}

export function parseCoordKey(key: string): Coordinate | null {
  const [rowPart, colPart] = key.split(":");
  const row = Number(rowPart);
  const col = Number(colPart);

  if (!Number.isInteger(row) || !Number.isInteger(col)) {
    return null;
  }

  return { row, col };
}

function hasCompleteBounds(bounds: Partial<GridBounds>) {
  return (
    bounds.minRow !== undefined &&
    bounds.maxRow !== undefined &&
    bounds.minCol !== undefined &&
    bounds.maxCol !== undefined
  );
}

export function getGridBounds(
  elements: ElementDefinition[],
  visibleRange: Partial<GridBounds> = {}
): GridBounds | null {
  if (elements.length === 0) {
    return hasCompleteBounds(visibleRange)
      ? {
          minRow: visibleRange.minRow!,
          maxRow: visibleRange.maxRow!,
          minCol: visibleRange.minCol!,
          maxCol: visibleRange.maxCol!,
        }
      : null;
  }

  const rows = elements.map((element) => element.row);
  const cols = elements.map((element) => element.col);
  const elementBounds = {
    minRow: Math.min(...rows) - 1,
    maxRow: Math.max(...rows) + 1,
    minCol: Math.min(...cols) - 1,
    maxCol: Math.max(...cols) + 1,
  };

  return {
    minRow: Math.min(elementBounds.minRow, visibleRange.minRow ?? elementBounds.minRow),
    maxRow: Math.max(elementBounds.maxRow, visibleRange.maxRow ?? elementBounds.maxRow),
    minCol: Math.min(elementBounds.minCol, visibleRange.minCol ?? elementBounds.minCol),
    maxCol: Math.max(elementBounds.maxCol, visibleRange.maxCol ?? elementBounds.maxCol),
  };
}

export function getCellMap(elements: ElementDefinition[]) {
  return new Map(elements.map((element) => [coordKey(element.row, element.col), element]));
}

export function moveElement(
  elements: ElementDefinition[],
  activeId: string,
  target: Coordinate
) {
  const activeElement = elements.find((element) => element.id === activeId);

  if (!activeElement) {
    return elements;
  }

  if (activeElement.row === target.row && activeElement.col === target.col) {
    return elements;
  }

  const targetElement = elements.find(
    (element) => element.row === target.row && element.col === target.col
  );

  return elements.map((element) => {
    if (element.id === activeId) {
      return { ...element, row: target.row, col: target.col };
    }

    if (targetElement && element.id === targetElement.id) {
      return { ...element, row: activeElement.row, col: activeElement.col };
    }

    return element;
  });
}
