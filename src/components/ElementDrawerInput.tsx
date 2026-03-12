import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ParseError } from "../lib/types";

interface ElementDrawerInputProps {
  value: string;
  onChange: (value: string) => void;
  errors: ParseError[];
  onLoadDemo: () => void;
  onClear: () => void;
}

export function ElementDrawerInput({
  value,
  onChange,
  errors,
  onLoadDemo,
  onClear,
}: ElementDrawerInputProps) {
  const lineCount = value.trim().length === 0 ? 0 : value.split("\n").length;
  const statusLabel =
    errors.length > 0 ? `${errors.length} issue${errors.length > 1 ? "s" : ""}` : "Synced";

  return (
    <Box className="controls-section">
      <Stack spacing={2.25}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "flex-start" }}
          className="controls-section-header"
        >
          <Box>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ mb: 0.75 }}
            >
              <Typography variant="h5" className="section-title">
                Drawer schema
              </Typography>
              <Chip
                size="small"
                label={statusLabel}
                color={errors.length > 0 ? "warning" : "success"}
                variant={errors.length > 0 ? "filled" : "outlined"}
              />
            </Stack>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            className="controls-actions"
          >
            <Button
              variant="contained"
              onClick={onLoadDemo}
              startIcon={<AutoAwesomeRoundedIcon />}
              className="primary-action-button"
            >
              Load demo
            </Button>
            <Button
              variant="text"
              onClick={onClear}
              startIcon={<DeleteSweepRoundedIcon />}
              className="secondary-action-button"
            >
              Clear
            </Button>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          className="format-hints"
        >
          <Chip
            icon={<NotesRoundedIcon />}
            label="row;column;label;type;options"
            variant="outlined"
          />
          <Chip label={`${lineCount} line${lineCount === 1 ? "" : "s"}`} variant="outlined" />
        </Stack>

        <TextField
          label="Schema"
          placeholder="1;2;First Name;TEXT_INPUT;Enter your first name"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          multiline
          minRows={6}
          fullWidth
          className="drawer-input-field"
          helperText={
            errors.length > 0
              ? "Fix the lines below to refresh the preview."
              : "One element per line. Dragging cells rewrites coordinates automatically."
          }
          sx={{
            "& .MuiInputBase-input": {
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: 13.5,
              lineHeight: 1.7,
            },
          }}
        />

        {errors.length > 0 ? (
          <Alert severity="error" className="input-error-alert">
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Review these lines:
            </Typography>

            <Stack spacing={0.5}>
              {errors.map((error) => (
                <Typography key={`${error.line}-${error.message}`} variant="body2">
                  Line {error.line}: {error.message}
                </Typography>
              ))}
            </Stack>
          </Alert>
        ) : null}
      </Stack>
    </Box>
  );
}
