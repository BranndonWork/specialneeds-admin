import { Box, Button, Checkbox, OutlinedInput, Radio, Select, TextField } from "@mui/material";
import { styled } from "@mui/system";

const StyledForm = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "600px",
  margin: "0 auto",
}));

const StyledTextField = styled(TextField)({
  marginBottom: "2em",
  width: "100%",
  backgroundColor: "#ffffff",
  "& fieldset": {
    borderRadius: "15px",
  },
});

const StyledTextarea = styled(OutlinedInput)({
  marginBottom: "2em",
  width: "100%",
  backgroundColor: "#ffffff",
  "& fieldset": {
    borderRadius: "15px",
  },
});

const StyledSelect = styled(Select)({
  marginBottom: "2em",
  width: "100%",
  backgroundColor: "#ffffff",
  "& fieldset": {
    borderRadius: "15px",
  },
});

const StyledCheckbox = styled(Checkbox)({
  color: "#000",
  "&.Mui-checked": {
    color: "#000",
  },
});

const StyledRadio = styled(Radio)({
  color: "#000",
  "&.Mui-checked": {
    color: "#000",
  },
});

const StyledButton = styled(Button)({
  borderRadius: "100px",
  backgroundColor: "var(--mainColor)",
  color: "var(--whiteColor)",
  cursor: "pointer !important",
  fontSize: "20px",
  fontWeight: "600",
  padding: "0.5em 1.5em",
  boxShadow: "none",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "none",
    backgroundColor: "var(--mainColor)",
  },
});

const StyledIconButton = ({ iconClass, children, ...otherProps }) => {
  if (!iconClass) return <StyledButton {...otherProps}>{children}</StyledButton>;

  return (
    <StyledButton {...otherProps}>
      <i className={iconClass} style={{ verticalAlign: "inherit", marginTop: "-2px" }}></i>
      {children && <span style={{ marginLeft: "5px" }}>{children}</span>}
    </StyledButton>
  );
};

export {
  StyledForm,
  StyledTextField,
  StyledTextarea,
  StyledSelect,
  StyledCheckbox,
  StyledRadio,
  StyledButton,
  StyledIconButton,
};
