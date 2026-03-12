import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";

interface GridViewportControlsProps {
  minRow: string;
  maxRow: string;
  minCol: string;
  maxCol: string;
  hasOverrides: boolean;
  error?: string;
  onChange: (
    field: "minRow" | "maxRow" | "minCol" | "maxCol",
    value: string
  ) => void;
  onReset: () => void;
}

export function GridViewportControls({
  minRow,
  maxRow,
  minCol,
  maxCol,
  hasOverrides,
  error,
  onChange,
  onReset,
}: GridViewportControlsProps) {
  return (
    <Box className="viewport-controls">
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "flex-start" }}
        >
          <Box>
            <Typography className="section-kicker">Visible Range</Typography>
            <Typography variant="h6" className="section-title">
              Expose distant drop targets
            </Typography>
            <Typography variant="body2" className="panel-copy">
              Extend any edge to reveal more blank cells while always keeping
              the current layout in view.
            </Typography>
          </Box>

          <Button
            variant="text"
            onClick={onReset}
            startIcon={<RestartAltRoundedIcon />}
            className="secondary-action-button"
            disabled={!hasOverrides}
          >
            Fit to layout
          </Button>
        </Stack>

        <Box className="viewport-controls-grid">
          <TextField
            label="Min visible row"
            type="number"
            value={minRow}
            onChange={(event) => onChange("minRow", event.target.value)}
            fullWidth
          />
          <TextField
            label="Max visible row"
            type="number"
            value={maxRow}
            onChange={(event) => onChange("maxRow", event.target.value)}
            fullWidth
          />
          <TextField
            label="Min visible column"
            type="number"
            value={minCol}
            onChange={(event) => onChange("minCol", event.target.value)}
            fullWidth
          />
          <TextField
            label="Max visible column"
            type="number"
            value={maxCol}
            onChange={(event) => onChange("maxCol", event.target.value)}
            fullWidth
          />
        </Box>

        {error ? (
          <Alert severity="warning">{error}</Alert>
        ) : (
          <Typography variant="caption" className="panel-copy">
            Leave fields blank to auto-fit around the current elements, or set
            just one edge to expand the grid in that direction.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
