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
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import "./styles.css";
import { ElementCard } from "./components/ElementCard";
import { ColorControls } from "./components/ColorControls";
import { ElementDrawerInput } from "./components/ElementDrawerInput";
import { ElementGrid } from "./components/ElementGrid";
import { getAccessibleTextColor } from "./lib/colors";
import { getGridBounds, moveElement, parseCoordKey } from "./lib/grid";
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
const SCHEMA_DRAFT_STORAGE_KEY = "nodebox.elementDrawer.schemaDraft";
const SCHEMA_LAST_VALID_STORAGE_KEY = "nodebox.elementDrawer.schemaLastValid";

interface PersistedSchemaState {
  draftText: string;
  elements: ReturnType<typeof parseElementLines>["elements"];
  errors: ReturnType<typeof parseElementLines>["errors"];
}

function loadPersistedSchemaState(): PersistedSchemaState {
  if (typeof window === "undefined") {
    return {
      draftText: INITIAL_TEXT,
      elements: initialResult.elements,
      errors: initialResult.errors,
    };
  }

  const storedDraftText = window.localStorage.getItem(SCHEMA_DRAFT_STORAGE_KEY);

  if (storedDraftText === null) {
    return {
      draftText: INITIAL_TEXT,
      elements: initialResult.elements,
      errors: initialResult.errors,
    };
  }

  const parsedDraft = parseElementLines(storedDraftText);

  if (parsedDraft.errors.length === 0) {
    return {
      draftText: storedDraftText,
      elements: parsedDraft.elements,
      errors: parsedDraft.errors,
    };
  }

  const storedLastValidText = window.localStorage.getItem(
    SCHEMA_LAST_VALID_STORAGE_KEY
  );
  const parsedLastValid = storedLastValidText
    ? parseElementLines(storedLastValidText)
    : null;

  return {
    draftText: storedDraftText,
    elements:
      parsedLastValid && parsedLastValid.errors.length === 0
        ? parsedLastValid.elements
        : [],
    errors: parsedDraft.errors,
  };
}

export default function App() {
  const persistedState = React.useMemo(loadPersistedSchemaState, []);
  const [draftText, setDraftText] = React.useState(persistedState.draftText);
  const [elements, setElements] = React.useState(persistedState.elements);
  const [errors, setErrors] = React.useState(persistedState.errors);
  const [selectColor, setSelectColor] = React.useState(DEFAULT_SELECT_COLOR);
  const [textInputColor, setTextInputColor] = React.useState(DEFAULT_TEXT_INPUT_COLOR);
  const [activeDragId, setActiveDragId] = React.useState<string | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    })
  );

  React.useEffect(() => {
    window.localStorage.setItem(SCHEMA_DRAFT_STORAGE_KEY, draftText);
  }, [draftText]);

  React.useEffect(() => {
    if (errors.length === 0) {
      window.localStorage.setItem(SCHEMA_LAST_VALID_STORAGE_KEY, draftText);
    }
  }, [draftText, errors]);

  React.useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (activeDragId === null) {
      return;
    }

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyTouchAction = body.style.touchAction;
    const previousDocumentOverflow = documentElement.style.overflow;
    const previousDocumentTouchAction = documentElement.style.touchAction;

    body.style.overflow = "hidden";
    body.style.touchAction = "none";
    documentElement.style.overflow = "hidden";
    documentElement.style.touchAction = "none";

    return () => {
      body.style.overflow = previousBodyOverflow;
      body.style.touchAction = previousBodyTouchAction;
      documentElement.style.overflow = previousDocumentOverflow;
      documentElement.style.touchAction = previousDocumentTouchAction;
    };
  }, [activeDragId]);

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
  const bounds = getGridBounds(elements);
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
              label={isPreviewStale ? "Showing last valid preview" : "Preview in sync"}
              color={isPreviewStale ? "warning" : "success"}
              variant="filled"
            />
          </Stack>

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
          </Stack>

          <Box className="preview-breakout">
            <Paper className="workspace-panel grid-panel grid-panel-full" elevation={0}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h5">Grid preview</Typography>
                  <Typography variant="body2" className="panel-copy">
                    Blank cells stay visible, and the preview keeps a stable
                    rhythm while you drag or validate the layout.
                  </Typography>
                </Box>

                {isPreviewStale ? (
                  <Box className="preview-status-banner preview-status-banner-warning">
                    <Typography variant="body2">
                      Showing the last valid layout while schema errors are present.
                    </Typography>
                  </Box>
                ) : null}

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
