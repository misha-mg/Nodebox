import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";

interface GridViewportControlsProps {
  minRow: string;
  maxRow: string;
  hasOverrides: boolean;
  error?: string;
  onChange: (field: "minRow" | "maxRow", value: string) => void;
  onReset: () => void;
}

export function GridViewportControls({
  minRow,
  maxRow,
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
            <Typography variant="h6" className="section-title">Row framing</Typography>
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
            label="First visible row"
            type="number"
            value={minRow}
            onChange={(event) => onChange("minRow", event.target.value)}
            fullWidth
          />
          <TextField
            label="Last visible row"
            type="number"
            value={maxRow}
            onChange={(event) => onChange("maxRow", event.target.value)}
            fullWidth
          />
        </Box>

        {error ? (
          <Alert severity="warning">{error}</Alert>
        ) : (
          <Typography variant="caption" className="panel-copy">
            Blank fields keep auto-fit.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
