import React from "react";
import { DefaultField } from "./fields/DefaultField";
import { BooleanField } from "./fields/BooleanField";
import { NumberField } from "./fields/NumberField";
import { AutocompleteField } from "./fields/AutocompleteField";
import type { RenderFieldProps } from "./types";

export const RenderField: React.FC<RenderFieldProps> = ({
  fieldKey,
  categoryKey,
  fieldValue,
  onChange,
}) => {
  const handleChange = (eventValue: any, subField: string | null = null, idx: number | null = null) => {
    onChange(categoryKey, fieldKey, eventValue, subField, idx);
  };

  const fieldType = fieldValue.attributes.type || "text";

  // Determine icon class based on field type
  let iconClass = "";
  if (fieldType === "number" || fieldType === "float") {
    iconClass = "hash";
  } else if (fieldType === "tel") {
    iconClass = "phone";
  } else if (fieldType === "email") {
    iconClass = "email";
  } else if (fieldType === "url" || fieldType === "link") {
    iconClass = "link";
  } else if (fieldType === "date") {
    iconClass = "calendar";
  } else if (fieldType === "checkbox") {
    iconClass = "check";
  } else if (fieldType === "autocomplete") {
    iconClass = "list";
  }

  // Check if label contains cost-related keywords
  if (fieldValue.label.toLowerCase().includes("cost") || fieldValue.label.toLowerCase().includes("price")) {
    iconClass = "dollar";
  }

  // Allow override from field attributes
  if (fieldValue.attributes.iconClass) {
    iconClass = fieldValue.attributes.iconClass.replace("bx bx-", "");
  }

  // Render appropriate field component based on type
  switch (fieldType) {
    case "checkbox":
      return <BooleanField fieldValue={{...fieldValue, attributes: {...fieldValue.attributes, iconClass}}} onChange={handleChange} />;

    case "autocomplete":
      return <AutocompleteField fieldValue={{...fieldValue, attributes: {...fieldValue.attributes, iconClass}}} onChange={handleChange} />;

    case "number":
    case "float":
      return <NumberField fieldValue={{...fieldValue, attributes: {...fieldValue.attributes, iconClass, type: fieldType}}} onChange={handleChange} />;

    default:
      return <DefaultField fieldValue={{...fieldValue, attributes: {...fieldValue.attributes, iconClass, type: fieldType}}} onChange={handleChange} />;
  }
};
