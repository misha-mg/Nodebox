import {
  Box,
  IconButton,
  MenuItem,
  Paper,
  SxProps,
  TextField,
  Theme,
  Typography,
  alpha,
} from "@mui/material";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core/dist/hooks/useDraggable";
import React from "react";
import { ElementDefinition } from "../lib/types";

interface ElementCardProps {
  element: ElementDefinition;
  foregroundColor: string;
  isDragging?: boolean;
  isOverlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<Theme>;
  cardRef?: React.Ref<HTMLDivElement>;
  attributes?: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
}

function fieldSx(foregroundColor: string) {
  return {
    "& .MuiOutlinedInput-root": {
      color: foregroundColor,
      backgroundColor: alpha("#FFFFFF", 0.16),
      "& fieldset": {
        borderColor: alpha(foregroundColor, 0.32),
      },
    },
    "& .MuiInputBase-input::placeholder": {
      color: alpha(foregroundColor, 0.76),
      opacity: 1,
    },
    "& .MuiSelect-icon": {
      color: foregroundColor,
    },
  };
}

export function ElementCard({
  element,
  foregroundColor,
  isDragging = false,
  isOverlay = false,
  className = "cell-card",
  style,
  sx,
  cardRef,
  attributes,
  listeners,
}: ElementCardProps) {
  const [textValue, setTextValue] = React.useState("");
  const [selectValue, setSelectValue] = React.useState(
    element.type === "SELECT" ? element.options[0] ?? "" : ""
  );

  React.useEffect(() => {
    if (element.type === "SELECT") {
      setSelectValue(element.options[0] ?? "");
      return;
    }

    setTextValue("");
  }, [element]);

  const isInteractive = !isOverlay;

  return (
    <Paper
      ref={cardRef}
      elevation={0}
      className={className}
      sx={[
        {
          backgroundColor: alpha(foregroundColor, isOverlay ? 0.14 : 0.08),
          borderColor: alpha(foregroundColor, isDragging ? 0.65 : 0.18),
          color: foregroundColor,
          opacity: isDragging && !isOverlay ? 0.18 : 1,
          boxShadow: isOverlay
            ? `0 18px 46px ${alpha("#101828", 0.22)}`
            : "none",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      style={style}
    >
      <Box sx={{ display: "flex", alignItems: "start", gap: 1 }}>
        <Typography variant="overline" className="cell-type" sx={{ flex: 1 }}>
          {element.type}
        </Typography>

        {!isOverlay ? (
          <IconButton
            size="small"
            aria-label={`Drag ${element.label}`}
            className="cell-drag-handle"
            sx={{
              color: alpha(foregroundColor, 0.82),
              border: `1px solid ${alpha(foregroundColor, 0.18)}`,
              backgroundColor: alpha("#FFFFFF", 0.12),
              cursor: isDragging ? "grabbing" : "grab",
              "&:hover": {
                backgroundColor: alpha("#FFFFFF", 0.18),
              },
            }}
            {...listeners}
            {...attributes}
          >
            <DragIndicatorRoundedIcon fontSize="small" />
          </IconButton>
        ) : null}
      </Box>

      <Typography variant="subtitle2" className="cell-label">
        {element.label}
      </Typography>

      <Box>
        {element.type === "SELECT" ? (
          <TextField
            select
            size="small"
            fullWidth
            value={selectValue}
            variant="outlined"
            onChange={(event) => setSelectValue(event.target.value)}
            disabled={!isInteractive}
            sx={fieldSx(foregroundColor)}
          >
            {element.options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            size="small"
            fullWidth
            value={textValue}
            placeholder={element.placeholder}
            variant="outlined"
            onChange={(event) => setTextValue(event.target.value)}
            disabled={!isInteractive}
            sx={fieldSx(foregroundColor)}
          />
        )}
      </Box>
    </Paper>
  );
}
