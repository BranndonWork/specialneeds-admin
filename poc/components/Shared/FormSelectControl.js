import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const FormSelectControl = ({ id, label, value, onChange, options }) => {
  return (
    <FormControl sx={{ minWidth: 80, mr: 1 }}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select label={label} id={id} onChange={onChange} value={value}>
        {options.map(({ value, label, condition = true }, index) =>
          condition ? (
            <MenuItem key={index} value={value}>
              {label}
            </MenuItem>
          ) : null
        )}
      </Select>
    </FormControl>
  );
};

export default FormSelectControl;
