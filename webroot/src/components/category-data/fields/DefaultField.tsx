import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import {
  FiTag,
  FiHash,
  FiPhone,
  FiMail,
  FiLink,
  FiCalendar,
  FiType,
  FiDollarSign,
} from "react-icons/fi";
import type { FieldComponentProps } from "../types";

const iconMap: Record<string, any> = {
  tag: FiTag,
  hash: FiHash,
  phone: FiPhone,
  email: FiMail,
  link: FiLink,
  calendar: FiCalendar,
  text: FiType,
  dollar: FiDollarSign,
};

export const DefaultField: React.FC<FieldComponentProps> = ({
  fieldValue,
  onChange,
}) => {
  const [hasBlurred, setHasBlurred] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fieldType = fieldValue.attributes.type || "text";
  const isTextarea = fieldType === "textarea";
  const iconClass = fieldValue.attributes.iconClass || "tag";
  const IconComponent = iconMap[iconClass] || FiTag;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);

    // Validate required fields
    if (fieldValue.attributes.required && !e.target.value) {
      setErrorMessage(`${fieldValue.label} is required`);
    } else {
      setErrorMessage("");
    }
  };

  const handleBlur = () => {
    setHasBlurred(true);
  };

  const isInvalid = hasBlurred && !!errorMessage;

  return (
    <FormControl isInvalid={isInvalid} isRequired={fieldValue.attributes.required} mb={4}>
      <FormLabel mb={2}>{fieldValue.label}</FormLabel>
      <InputGroup>
        <InputLeftElement pointerEvents="none" h="45px">
          <Icon as={IconComponent} color="gray.500" />
        </InputLeftElement>
        {isTextarea ? (
          <Textarea
            value={fieldValue.attributes.value || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={fieldValue.attributes.placeholder}
            pl={10}
            minH="100px"
            bg="#f5f5f5"
            border="1px solid #e2e8f0"
            _focus={{ bg: "white", borderColor: "blue.500", outline: "2px solid #3182ce", outlineOffset: "2px" }}
            fontSize="14.5px"
          />
        ) : (
          <Input
            type={fieldType}
            value={fieldValue.attributes.value || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={fieldValue.attributes.placeholder}
            h="45px"
            bg="#f5f5f5"
            border="1px solid #e2e8f0"
            _focus={{ bg: "white", borderColor: "blue.500", outline: "2px solid #3182ce", outlineOffset: "2px" }}
            fontSize="14.5px"
          />
        )}
      </InputGroup>
      {isInvalid && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
};
