import { Typography, Alert, TextField, Box, Stack } from "@mui/material";
import "./styles.css";

export default function App() {
  return (
    <Box className="element-drawer" sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Create an Element Drawer
      </Typography>

      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Enter strings with the following format:
        </Typography>

        <Typography
          variant="caption"
          component="p"
          sx={{ mb: 2, fontFamily: "monospace" }}
        >
          rowNumber;columnNumber;inputLabel;inputType;inputOptions
        </Typography>

        <Typography variant="body1" gutterBottom>
          Example:
        </Typography>

        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            component="p"
            sx={{ fontFamily: "monospace" }}
          >
            1;1;gender;SELECT;Male,Female
          </Typography>
          <Typography
            variant="caption"
            component="p"
            sx={{ fontFamily: "monospace" }}
          >
            2;1;firstName;TEXT_INPUT;Enter your first name
          </Typography>
        </Stack>

        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          <Typography variant="caption" component="li">
            rowNumber - Row position of the element
          </Typography>
          <Typography variant="caption" component="li">
            columnNumber - Column position of the element
          </Typography>
          <Typography variant="caption" component="li">
            inputLabel - Label text of the input element
          </Typography>
          <Typography variant="caption" component="li">
            inputType - Input type (SELECT or TEXT_INPUT)
          </Typography>
          <Typography variant="caption" component="li">
            inputOptions - For SELECT: comma-separated options. For TEXT_INPUT:
            input placeholder text
          </Typography>
        </Box>
      </Alert>

      <TextField
        label="Element Drawer"
        placeholder="1;2;First Name;TEXT_INPUT;Enter your first name"
        multiline
        fullWidth
        sx={{ mt: 2 }}
      />
    </Box>
  );
}
