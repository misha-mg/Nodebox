import { Box, Typography, alpha } from "@mui/material";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { coordKey } from "../lib/grid";
import { ElementDefinition } from "../lib/types";
import { ElementCard } from "./ElementCard";

interface GridCellProps {
  row: number;
  col: number;
  element?: ElementDefinition;
  backgroundColor: string;
  foregroundColor: string;
  activeElement?: ElementDefinition;
}

export function GridCell({
  row,
  col,
  element,
  backgroundColor,
  foregroundColor,
  activeElement,
}: GridCellProps) {
  const key = coordKey(row, col);
  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id: key,
  });
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: element?.id ?? `empty-${key}`,
    disabled: !element,
  });

  const dragStyle = {
    transform: CSS.Translate.toString(transform),
  };
  const isDifferentFromActive =
    activeElement !== undefined &&
    (activeElement.row !== row || activeElement.col !== col);
  const isDropTarget =
    activeElement !== undefined && isDifferentFromActive && isOver;
  const dropHint = !isDropTarget
    ? null
    : element
    ? `Swap with ${element.label}`
    : "Move here";

  return (
    <Box
      ref={setDroppableNodeRef}
      className="grid-cell"
      sx={{
        backgroundColor,
        color: foregroundColor,
        borderColor: isOver ? alpha(foregroundColor, 0.7) : alpha("#162033", 0.1),
        boxShadow: isOver
          ? `0 0 0 2px ${alpha(foregroundColor, 0.25)}`
          : "inset 0 1px 0 rgba(255,255,255,0.12)",
        transform: isDropTarget ? "translateY(-2px)" : "none",
      }}
      data-testid={`cell-${row}-${col}`}
    >
      <Typography variant="caption" className="cell-coordinate">
        ({row}, {col})
      </Typography>

      {element ? (
        <ElementCard
          element={element}
          foregroundColor={foregroundColor}
          isDragging={isDragging}
          cardRef={setDraggableNodeRef}
          listeners={listeners}
          attributes={attributes}
          style={dragStyle}
        />
      ) : (
        <Box className="grid-placeholder">
          <Typography variant="caption">Empty</Typography>
        </Box>
      )}

      {dropHint ? (
        <Box
          className="grid-drop-hint"
          sx={{
            backgroundColor: alpha(foregroundColor, 0.14),
            color: foregroundColor,
            borderColor: alpha(foregroundColor, 0.26),
          }}
        >
          <Typography variant="caption">{dropHint}</Typography>
        </Box>
      ) : null}
    </Box>
  );
}
