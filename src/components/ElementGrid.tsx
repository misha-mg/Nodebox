import { Box, Typography } from "@mui/material";
import { getAccessibleTextColor, getCellBackgrounds } from "../lib/colors";
import { getCellMap } from "../lib/grid";
import { ElementDefinition, GridBounds } from "../lib/types";
import { GridCell } from "./GridCell";

interface ElementGridProps {
  elements: ElementDefinition[];
  bounds: GridBounds | null;
  selectColor: string;
  textInputColor: string;
  activeElement?: ElementDefinition;
}

export function ElementGrid({
  elements,
  bounds,
  selectColor,
  textInputColor,
  activeElement,
}: ElementGridProps) {
  if (!bounds) {
    return (
      <Box className="grid-empty-state">
        <Typography variant="h6">Grid preview will appear here</Typography>
        <Typography variant="body2">
          Add one or more lines above to generate draggable elements and blank
          placeholder cells.
        </Typography>
      </Box>
    );
  }

  const rows = Array.from(
    { length: bounds.maxRow - bounds.minRow + 1 },
    (_, index) => bounds.minRow + index
  );
  const columns = Array.from(
    { length: bounds.maxCol - bounds.minCol + 1 },
    (_, index) => bounds.minCol + index
  );
  const cellMap = getCellMap(elements);
  const backgrounds = getCellBackgrounds(elements, selectColor, textInputColor);

  return (
    <Box className="grid-wrapper">
      <Box
        className="element-grid"
        sx={{
          gridTemplateColumns: `repeat(${columns.length}, var(--grid-cell-width))`,
          gridAutoRows: "var(--grid-cell-height)",
        }}
      >
        {rows.flatMap((row) =>
          columns.map((col) => {
            const key = `${row}:${col}`;
            const backgroundColor = backgrounds.get(key) ?? "#F7F8FC";
            const foregroundColor = getAccessibleTextColor(backgroundColor);

            return (
              <GridCell
                key={key}
                row={row}
                col={col}
                element={cellMap.get(key)}
                backgroundColor={backgroundColor}
                foregroundColor={foregroundColor}
                activeElement={activeElement}
              />
            );
          })
        )}
      </Box>
    </Box>
  );
}
