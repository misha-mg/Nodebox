import { Box, Stack, Typography } from "@mui/material";
import { blendColors } from "../lib/colors";

interface ColorLegendProps {
  selectColor: string;
  textInputColor: string;
}

interface LegendSwatchProps {
  color: string;
  label: string;
}

function LegendSwatch({ color, label }: LegendSwatchProps) {
  return (
    <Box className="legend-item">
      <Box
        className="legend-swatch"
        sx={{
          background: color,
        }}
      />
      <Box>
        <Typography variant="subtitle2">{label}</Typography>
      </Box>
    </Box>
  );
}

export function ColorLegend({
  selectColor,
  textInputColor,
}: ColorLegendProps) {
  return (
    <Stack spacing={1.25} className="legend-panel">
      <Box>
        <Typography className="legend-title">Legend</Typography>
      </Box>
      <Box className="legend-grid">
        <LegendSwatch color={selectColor} label="SELECT diagonal" />
        <LegendSwatch color={textInputColor} label="TEXT_INPUT orthogonal" />
        <LegendSwatch color={blendColors([selectColor, textInputColor])} label="Mixed overlap" />
      </Box>
    </Stack>
  );
}
