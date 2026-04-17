import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
} from "@chakra-ui/react";
import type { FieldComponentProps } from "../types";

export const NumberField: React.FC<FieldComponentProps> = ({
  fieldValue,
  onChange,
}) => {
  const [hasBlurred, setHasBlurred] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isFloat = fieldValue.attributes.type === "float";
  const min = fieldValue.attributes.min;
  const max = fieldValue.attributes.max;
  const precision = isFloat ? (fieldValue.attributes.decimals || 2) : 0;

  const handleChange = (valueAsString: string, valueAsNumber: number) => {
    const value = isNaN(valueAsNumber) ? null : valueAsNumber;
    onChange(value);

    // Validate
    let error = "";
    if (fieldValue.attributes.required && (value === null || value === undefined)) {
      error = `${fieldValue.label} is required`;
    } else if (value !== null && value !== undefined) {
      if (min !== undefined && value < min) {
        error = `Minimum value is ${min}`;
      } else if (max !== undefined && value > max) {
        error = `Maximum value is ${max}`;
      }
    }
    setErrorMessage(error);
  };

  const handleBlur = () => {
    setHasBlurred(true);
  };

  const isInvalid = hasBlurred && !!errorMessage;

  return (
    <FormControl isInvalid={isInvalid} isRequired={fieldValue.attributes.required} mb={4}>
      <FormLabel mb={2}>{fieldValue.label}</FormLabel>
      <NumberInput
        value={fieldValue.attributes.value ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        precision={precision}
        step={isFloat ? 0.01 : 1}
      >
        <NumberInputField
          placeholder={fieldValue.attributes.placeholder}
          h="45px"
          bg="#f5f5f5"
          border="1px solid #e2e8f0"
          _focus={{ bg: "white", borderColor: "blue.500", outline: "2px solid #3182ce", outlineOffset: "2px" }}
          fontSize="14.5px"
        />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {isInvalid && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
};
