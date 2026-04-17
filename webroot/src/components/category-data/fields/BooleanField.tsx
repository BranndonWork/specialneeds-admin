import React from "react";
import {
  FormControl,
  FormLabel,
  Checkbox,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { FiCheck } from "react-icons/fi";
import type { FieldComponentProps } from "../types";

export const BooleanField: React.FC<FieldComponentProps> = ({
  fieldValue,
  onChange,
}) => {
  const isChecked = !!fieldValue.attributes.value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <FormControl mb={4}>
      <FormLabel mb={2}>
        <HStack spacing={2}>
          <Icon as={FiCheck} />
          <span>{fieldValue.label}</span>
        </HStack>
      </FormLabel>
      <Checkbox
        isChecked={isChecked}
        onChange={handleChange}
        isRequired={fieldValue.attributes.required}
        size="lg"
      >
        {fieldValue.description || "Yes"}
      </Checkbox>
    </FormControl>
  );
};
