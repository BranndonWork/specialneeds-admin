import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FormControl,
  FormLabel,
  Box,
  Icon,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { Typeahead } from "react-bootstrap-typeahead";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { FiList } from "react-icons/fi";
import type { FieldComponentProps } from "../types";

const DEFAULT_MAX_TAGS = 25;

export const AutocompleteField: React.FC<FieldComponentProps> = ({
  fieldValue,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState("");
  const ref = useRef<any>(null);
  const toast = useToast();

  const selected = Array.isArray(fieldValue.attributes.value)
    ? fieldValue.attributes.value
    : [];
  const allOptions = fieldValue.attributes.options || [];

  let maxTags = fieldValue.attributes.maxTags;
  const allowNew = fieldValue.attributes.additionalProps?.allowNew !== false;
  const multiple = fieldValue.attributes.additionalProps?.multiple !== false;

  // Get color from attributes.style or use defaults (matching client-side)
  const tagColor = fieldValue.attributes.style?.backgroundColor || "#007bff";
  const tagTextColor = fieldValue.attributes.style?.color || "white";

  const newSelectionPrefix = allowNew ? "Add new: " : "";
  const id = `autocomplete-${fieldValue.label.replace(/\s+/g, "-")}`;

  // Compute dropdown options inline - remove selected items
  const dropdownOptions = allOptions.filter((option) => !selected.includes(option));

  if (maxTags === undefined && multiple) {
    maxTags = DEFAULT_MAX_TAGS;
  }

  const focusInput = () => {
    if (ref.current && multiple) {
      ref.current.blur();
      ref.current.focus();
    }
  };

  const onTagsChange = (newTagList: any[]) => {
    let tags = [...newTagList];
    const lastTag = tags[tags.length - 1];
    const lastTagLabel = typeof lastTag === "string" ? lastTag : lastTag?.label;

    const tagsWereAdded = tags.length > selected.length;

    if (tagsWereAdded && lastTagLabel && !dropdownOptions.includes(lastTag)) {
      tags.pop();
      let splitTags = lastTagLabel.split(",").map((tag: string) => tag.trim());

      // remove any empty tags
      splitTags = splitTags.filter((tag: string) => tag);

      // Calculate the number of tags that can be added
      if (maxTags !== undefined) {
        const remainingTags = maxTags - selected.length;
        if (remainingTags < splitTags.length) {
          splitTags.length = remainingTags;
          toast({
            title: `You've reached the limit of ${maxTags} ${fieldValue.label.toLowerCase()}.`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }

      tags.push(...splitTags);
    }

    // If the maxTags limit is set, remove any tags beyond the limit
    if (maxTags !== undefined && tags.length > maxTags) {
      tags = tags.slice(0, maxTags);
      toast({
        title: `You've reached the limit of ${maxTags} ${fieldValue.label.toLowerCase()}.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    // Remove duplicates and format tags as strings
    tags = tags
      .filter((tag, index, self) => {
        const tagStr = typeof tag === "string" ? tag : tag?.label || "";
        return self.findIndex((t) => {
          const tStr = typeof t === "string" ? t : t?.label || "";
          return tStr.toLowerCase() === tagStr.toLowerCase();
        }) === index;
      })
      .map((tag) => {
        if (typeof tag === "string") {
          return tag;
        }
        if (tag?.label) {
          return tag.label;
        }
        return "";
      });

    // remove any empty tags
    tags = tags.filter((tag) => tag);

    onChange(tags);
    focusInput();
  };

  const additionalProps = fieldValue.attributes.additionalProps || {};

  return (
    <FormControl mb={4}>
      <FormLabel mb={2}>
        <HStack spacing={2}>
          <Icon as={FiList} />
          <span>{fieldValue.label}</span>
        </HStack>
      </FormLabel>
      <Box id={id} className="tag-field-wrapper">
        <style>{`
          #${id} .rbt-token {
            background-color: ${tagColor};
            color: ${tagTextColor};
          }
        `}</style>
        <Box className="tag-field-description">
          <Typeahead
            ref={ref}
            className="tag-input"
            id={`tag-input-${id}`}
            options={dropdownOptions}
            selected={selected}
            newSelectionPrefix={newSelectionPrefix}
            placeholder={
              fieldValue.attributes.placeholder ||
              `Enter ${fieldValue.label.toLowerCase()}...`
            }
            onChange={(newTags) => onTagsChange(newTags)}
            onInputChange={(text) => setInputValue(text)}
            onBlur={() => {
              if (!multiple && inputValue) {
                onTagsChange([inputValue]);
              }
            }}
            allowNew={allowNew}
            multiple={multiple}
            {...additionalProps}
          />
        </Box>
      </Box>
    </FormControl>
  );
};
