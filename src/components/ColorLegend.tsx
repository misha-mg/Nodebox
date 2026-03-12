import { Box, Stack, Typography } from "@mui/material";
import { blendColors } from "../lib/colors";

interface ColorLegendProps {
  selectColor: string;
  textInputColor: string;
}

interface LegendSwatchProps {
  color: string;
  label: string;
  description: string;
}

function LegendSwatch({ color, label, description }: LegendSwatchProps) {
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
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

export function ColorLegend({
  selectColor,
  textInputColor,
}: ColorLegendProps) {
  return (
    <Stack spacing={1.5} className="legend-panel">
      <Box>
        <Typography className="section-kicker">Legend</Typography>
        <Typography variant="body2" className="panel-copy">
          A quick read of how both adjacency rules combine on the canvas.
        </Typography>
      </Box>
      <Box className="legend-grid">
        <LegendSwatch
          color={selectColor}
          label="SELECT diagonal"
          description="Applied to diagonal neighbors."
        />
        <LegendSwatch
          color={textInputColor}
          label="TEXT_INPUT orthogonal"
          description="Applied to top, bottom, left, and right neighbors."
        />
        <LegendSwatch
          color={blendColors([selectColor, textInputColor])}
          label="Mixed overlap"
          description="Shown when both adjacency rules hit the same cell."
        />
      </Box>
    </Stack>
  );
}
