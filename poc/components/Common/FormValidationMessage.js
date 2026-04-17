import { Alert, Box } from "@mui/material";

const FormValidationMessage = ({ type, message, styles, onClose }) => {
  if (!message) return null;
  if (typeof styles !== "object") styles = {};
  if (typeof onClose !== "function") onClose = () => {};
  if (typeof type !== "string") type = "error";
  if (type !== "error" && type !== "success" && type !== "warning" && type !== "info")
    type = "error";
  if (typeof message !== "string") message = "An error occurred.";

  return (
    <Box style={styles}>
      <Alert severity={type} onClose={onClose} style={{ fontSize: "1.1rem" }}>
        {message}
      </Alert>
    </Box>
  );
};


export default FormValidationMessage;
