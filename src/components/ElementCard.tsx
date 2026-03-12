import {
  Box,
  MenuItem,
  Paper,
  SxProps,
  TextField,
  Theme,
  Typography,
  alpha,
} from "@mui/material";
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core/dist/hooks/useDraggable";
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
          cursor: isDragging ? "grabbing" : "grab",
          opacity: isDragging && !isOverlay ? 0.18 : 1,
          boxShadow: isOverlay
            ? `0 18px 46px ${alpha("#101828", 0.22)}`
            : "none",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      style={style}
      {...listeners}
      {...attributes}
    >
      <Typography variant="overline" className="cell-type">
        {element.type}
      </Typography>

      <Typography variant="subtitle2" className="cell-label">
        {element.label}
      </Typography>

      <Box sx={{ pointerEvents: "none" }}>
        {element.type === "SELECT" ? (
          <TextField
            select
            size="small"
            fullWidth
            value={element.options[0]}
            variant="outlined"
            InputProps={{ readOnly: true }}
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
            value=""
            placeholder={element.placeholder}
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={fieldSx(foregroundColor)}
          />
        )}
      </Box>
    </Paper>
  );
}
