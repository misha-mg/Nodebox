import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";

interface ColorControlsProps {
  selectColor: string;
  textInputColor: string;
  onSelectColorChange: (value: string) => void;
  onTextInputColorChange: (value: string) => void;
  onResetDefaults: () => void;
}

export function ColorControls({
  selectColor,
  textInputColor,
  onSelectColorChange,
  onTextInputColorChange,
  onResetDefaults,
}: ColorControlsProps) {
  return (
    <Box className="controls-section">
      <Stack spacing={2.25}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "flex-start" }}
          justifyContent="space-between"
          className="controls-section-header"
        >
          <Box>
            <Typography className="section-kicker">Color System</Typography>
            <Typography variant="h6" className="section-title">
              Tune adjacency feedback
            </Typography>
            <Typography variant="body2" className="panel-copy">
              Use two distinct accents so diagonal and orthogonal reactions stay
              easy to scan without overpowering the grid.
            </Typography>
          </Box>
          <Button
            variant="text"
            onClick={onResetDefaults}
            startIcon={<RestartAltRoundedIcon />}
            className="secondary-action-button"
          >
            Reset colors
          </Button>
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          alignItems="stretch"
        >
          <Box className="color-control-card">
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Box>
                  <Typography variant="subtitle2">SELECT diagonal</Typography>
                  <Typography variant="caption" className="color-control-copy">
                    Highlights the four diagonal neighbors.
                  </Typography>
                </Box>
                <Chip label={selectColor.toUpperCase()} size="small" className="color-hex-chip" />
              </Stack>

              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box
                  className="color-preview-orb"
                  sx={{
                    background: `linear-gradient(145deg, ${selectColor}, rgba(255,255,255,0.96))`,
                  }}
                />
                <Box className="color-picker-shell">
                  <input
                    aria-label="Choose SELECT diagonal color"
                    className="color-picker-native"
                    type="color"
                    value={selectColor}
                    onChange={(event) => onSelectColorChange(event.target.value)}
                  />
                  <Box className="color-picker-copy">
                    <Typography variant="subtitle2">Diagonal accent</Typography>
                    <Typography variant="caption" className="color-control-copy">
                      Click the swatch to open the color picker.
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Box className="color-control-card">
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Box>
                  <Typography variant="subtitle2">TEXT_INPUT orthogonal</Typography>
                  <Typography variant="caption" className="color-control-copy">
                    Highlights top, bottom, left, and right.
                  </Typography>
                </Box>
                <Chip
                  label={textInputColor.toUpperCase()}
                  size="small"
                  className="color-hex-chip"
                />
              </Stack>

              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box
                  className="color-preview-orb"
                  sx={{
                    background: `linear-gradient(145deg, ${textInputColor}, rgba(255,255,255,0.96))`,
                  }}
                />
                <Box className="color-picker-shell">
                  <input
                    aria-label="Choose TEXT_INPUT orthogonal color"
                    className="color-picker-native"
                    type="color"
                    value={textInputColor}
                    onChange={(event) => onTextInputColorChange(event.target.value)}
                  />
                  <Box className="color-picker-copy">
                    <Typography variant="subtitle2">Orthogonal accent</Typography>
                    <Typography variant="caption" className="color-control-copy">
                      Click the swatch to open the color picker.
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
