import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { ColorLegend } from "./ColorLegend";

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
  const controls = [
    {
      label: "SELECT",
      hint: "Diagonal",
      value: selectColor,
      inputLabel: "Choose SELECT diagonal color",
      onChange: onSelectColorChange,
    },
    {
      label: "TEXT_INPUT",
      hint: "Orthogonal",
      value: textInputColor,
      inputLabel: "Choose TEXT_INPUT orthogonal color",
      onChange: onTextInputColorChange,
    },
  ];

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
            <Typography variant="h6" className="section-title">
              Adjacency colors
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

        <Box className="color-control-grid">
          {controls.map((control) => (
            <Box key={control.label} className="color-control-card">
              <Box className="color-control-heading">
                <Box>
                  <Typography variant="subtitle2">{control.label}</Typography>
                  <Typography variant="caption" className="color-control-copy">
                    {control.hint}
                  </Typography>
                </Box>
                <Chip
                  label={control.value.toUpperCase()}
                  size="small"
                  className="color-hex-chip"
                />
              </Box>

              <label className="color-picker-row">
                <input
                  aria-label={control.inputLabel}
                  className="color-picker-native"
                  type="color"
                  value={control.value}
                  onChange={(event) => control.onChange(event.target.value)}
                />
                <span className="color-picker-label">Pick accent</span>
              </label>
            </Box>
          ))}
        </Box>

        <ColorLegend selectColor={selectColor} textInputColor={textInputColor} />
      </Stack>
    </Box>
  );
}
