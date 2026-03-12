import { Box, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function SectionCard({ title, actions, children }: SectionCardProps) {
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
            <Typography variant="h5" className="section-title">
              {title}
            </Typography>
          </Box>
          {actions}
        </Stack>

        {children}
      </Stack>
    </Box>
  );
}
