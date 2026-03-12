import React from "react";
import {
  Alert,
  Box,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import "./styles.css";
import { ColorLegend } from "./components/ColorLegend";
import { ElementCard } from "./components/ElementCard";
import { ColorControls } from "./components/ColorControls";
import { ElementDrawerInput } from "./components/ElementDrawerInput";
import { ElementGrid } from "./components/ElementGrid";
import { GridViewportControls } from "./components/GridViewportControls";
import { getAccessibleTextColor } from "./lib/colors";
import { getGridBounds, moveElement, parseCoordKey } from "./lib/grid";
import { GridBounds } from "./lib/types";
import { parseElementLines, serializeElements } from "./lib/parser";

const INITIAL_TEXT = [
  "1;1;First Name;TEXT_INPUT;Enter first name",
  "1;2;Country;SELECT;USA,Canada,UK",
  "2;1;Last Name;TEXT_INPUT;Enter last name",
  "2;3;Role;SELECT;Admin,User,Guest",
].join("\n");

const initialResult = parseElementLines(INITIAL_TEXT);
const DEFAULT_SELECT_COLOR = "#FF0000";
const DEFAULT_TEXT_INPUT_COLOR = "#0000FF";
const EMPTY_VIEWPORT_RANGE = {
  minRow: "",
  maxRow: "",
  minCol: "",
  maxCol: "",
};

function parseOptionalInteger(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  if (!/^-?\d+$/.test(trimmed)) {
    return null;
  }

  return Number(trimmed);
}

export default function App() {
  const [draftText, setDraftText] = React.useState(INITIAL_TEXT);
  const [elements, setElements] = React.useState(initialResult.elements);
  const [errors, setErrors] = React.useState(initialResult.errors);
  const [selectColor, setSelectColor] = React.useState(DEFAULT_SELECT_COLOR);
  const [textInputColor, setTextInputColor] = React.useState(DEFAULT_TEXT_INPUT_COLOR);
  const [activeDragId, setActiveDragId] = React.useState<string | null>(null);
  const [viewportRange, setViewportRange] = React.useState(EMPTY_VIEWPORT_RANGE);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const handleTextChange = (value: string) => {
    setDraftText(value);

    const next = parseElementLines(value);
    setErrors(next.errors);

    if (next.errors.length === 0) {
      setElements(next.elements);
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveDragId(null);

    if (!over) {
      return;
    }

    const target = parseCoordKey(String(over.id));

    if (!target) {
      return;
    }

    setElements((current) => {
      const next = moveElement(current, String(active.id), target);

      if (next === current) {
        return current;
      }

      const serialized = serializeElements(next);
      setDraftText(serialized);
      setErrors([]);

      return next;
    });
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveDragId(String(active.id));
  };

  const handleDragCancel = (_event: DragCancelEvent) => {
    setActiveDragId(null);
  };

  const handleLoadDemo = () => {
    setDraftText(INITIAL_TEXT);
    setElements(initialResult.elements);
    setErrors([]);
  };

  const handleClearCanvas = () => {
    setDraftText("");
    setElements([]);
    setErrors([]);
  };

  const handleResetColors = () => {
    setSelectColor(DEFAULT_SELECT_COLOR);
    setTextInputColor(DEFAULT_TEXT_INPUT_COLOR);
  };

  const handleViewportChange = React.useCallback(
    (field: keyof typeof EMPTY_VIEWPORT_RANGE, value: string) => {
      setViewportRange((current) => ({
        ...current,
        [field]: value,
      }));
    },
    []
  );

  const handleResetViewport = React.useCallback(() => {
    setViewportRange(EMPTY_VIEWPORT_RANGE);
  }, []);

  const visibleRangeState = React.useMemo(() => {
    const parsed = {
      minRow: parseOptionalInteger(viewportRange.minRow),
      maxRow: parseOptionalInteger(viewportRange.maxRow),
      minCol: parseOptionalInteger(viewportRange.minCol),
      maxCol: parseOptionalInteger(viewportRange.maxCol),
    };
    const nextBounds: Partial<GridBounds> = {};
    const invalidFields = Object.entries(parsed)
      .filter(([, value]) => value === null)
      .map(([key]) => key);
    const errors: string[] = [];

    if (invalidFields.length > 0) {
      errors.push("Visible range fields must contain whole numbers.");
    }

    if (parsed.minRow !== null && parsed.minRow !== undefined) {
      nextBounds.minRow = parsed.minRow;
    }

    if (parsed.maxRow !== null && parsed.maxRow !== undefined) {
      nextBounds.maxRow = parsed.maxRow;
    }

    if (
      nextBounds.minRow !== undefined &&
      nextBounds.maxRow !== undefined &&
      nextBounds.minRow > nextBounds.maxRow
    ) {
      delete nextBounds.minRow;
      delete nextBounds.maxRow;
      errors.push("Visible row range must keep the minimum row below the maximum row.");
    }

    if (parsed.minCol !== null && parsed.minCol !== undefined) {
      nextBounds.minCol = parsed.minCol;
    }

    if (parsed.maxCol !== null && parsed.maxCol !== undefined) {
      nextBounds.maxCol = parsed.maxCol;
    }

    if (
      nextBounds.minCol !== undefined &&
      nextBounds.maxCol !== undefined &&
      nextBounds.minCol > nextBounds.maxCol
    ) {
      delete nextBounds.minCol;
      delete nextBounds.maxCol;
      errors.push("Visible column range must keep the minimum column below the maximum column.");
    }

    return {
      bounds: nextBounds,
      error: errors[0],
      hasOverrides: Object.keys(nextBounds).length > 0,
    };
  }, [viewportRange]);

  const bounds = getGridBounds(elements, visibleRangeState.bounds);
  const rowCount = bounds ? bounds.maxRow - bounds.minRow + 1 : 0;
  const columnCount = bounds ? bounds.maxCol - bounds.minCol + 1 : 0;
  const cellCount = rowCount * columnCount;
  const isPreviewStale = errors.length > 0;
  const activeElement =
    activeDragId === null
      ? undefined
      : elements.find((element) => element.id === activeDragId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <Container maxWidth="xl" className="element-drawer-shell">
        <Stack spacing={3} sx={{ py: { xs: 3, md: 5 } }}>
          <Box>
            <Typography variant="overline" className="eyebrow">
              React Coding Task
            </Typography>
            <Typography variant="h3" gutterBottom>
              Element Drawer
            </Typography>
            <Typography variant="body1" className="lead-copy">
              Parse each line into a form element, place it in an unbounded grid,
              drag it to a new coordinate, and let adjacency rules color every
              affected cell.
            </Typography>
          </Box>

          <Alert severity="info" className="task-alert">
            <Typography variant="subtitle2" gutterBottom>
              Input format
            </Typography>
            <Typography
              variant="body2"
              component="p"
              sx={{ mb: 1.5, fontFamily: "monospace" }}
            >
              rowNumber;columnNumber;inputLabel;inputType;inputOptions
            </Typography>
            <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
              <li>SELECT colors diagonal neighbors with Color Selector 1.</li>
              <li>TEXT_INPUT colors orthogonal neighbors with Color Selector 2.</li>
              <li>Dragging into an occupied cell swaps coordinates.</li>
            </Box>
          </Alert>

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            className="status-strip"
          >
            <Chip label={`${elements.length} elements`} color="primary" variant="outlined" />
            <Chip
              label={
                bounds
                  ? `${rowCount} rows x ${columnCount} columns`
                  : "0 rows x 0 columns"
              }
              variant="outlined"
            />
            <Chip label={`${cellCount} visible cells`} variant="outlined" />
            <Chip
              label={visibleRangeState.hasOverrides ? "Extended range" : "Auto-fit range"}
              variant="outlined"
            />
            <Chip
              label={isPreviewStale ? "Showing last valid preview" : "Preview in sync"}
              color={isPreviewStale ? "warning" : "success"}
              variant="filled"
            />
          </Stack>

          <Paper className="workspace-panel controls-panel" elevation={0}>
            <Stack spacing={3}>
              <ElementDrawerInput
                value={draftText}
                onChange={handleTextChange}
                errors={errors}
                onLoadDemo={handleLoadDemo}
                onClear={handleClearCanvas}
              />

              <ColorControls
                selectColor={selectColor}
                textInputColor={textInputColor}
                onSelectColorChange={setSelectColor}
                onTextInputColorChange={setTextInputColor}
                onResetDefaults={handleResetColors}
              />

              <ColorLegend
                selectColor={selectColor}
                textInputColor={textInputColor}
              />
            </Stack>
          </Paper>

          <Box className="preview-breakout">
            <Paper className="workspace-panel grid-panel grid-panel-full" elevation={0}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h5">Grid preview</Typography>
                  <Typography variant="body2" className="panel-copy">
                    Empty placeholders remain visible, and you can widen the
                    visible range to expose drop targets beyond the current
                    layout.
                  </Typography>
                </Box>

                <GridViewportControls
                  minRow={viewportRange.minRow}
                  maxRow={viewportRange.maxRow}
                  minCol={viewportRange.minCol}
                  maxCol={viewportRange.maxCol}
                  hasOverrides={visibleRangeState.hasOverrides}
                  error={visibleRangeState.error}
                  onChange={handleViewportChange}
                  onReset={handleResetViewport}
                />

                <Alert severity={isPreviewStale ? "warning" : "success"}>
                  {isPreviewStale
                    ? "The textarea contains validation errors, so the grid is still showing the last valid layout."
                    : "The grid is fully synced with the textarea. Drag any filled cell to move or swap it."}
                </Alert>

                <ElementGrid
                  elements={elements}
                  bounds={bounds}
                  selectColor={selectColor}
                  textInputColor={textInputColor}
                  activeElement={activeElement}
                />
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </Container>
      <DragOverlay>
        {activeElement ? (
          <Box className="drag-overlay-shell">
            <ElementCard
              element={activeElement}
              foregroundColor={getAccessibleTextColor("#F7F8FC")}
              isDragging
              isOverlay
              className="cell-card drag-overlay-card"
            />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
