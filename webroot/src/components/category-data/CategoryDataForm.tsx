import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { RenderField } from "./RenderField";
import type { CategoryData } from "./types";

interface CategoryDataFormProps {
  categoryData: CategoryData;
  onChange: (categoryKey: string, fieldKey: string, value: any, subField?: string | null, idx?: number | null) => void;
}

export const CategoryDataForm: React.FC<CategoryDataFormProps> = ({
  categoryData,
  onChange,
}) => {
  if (!categoryData || Object.keys(categoryData).length === 0) {
    return null;
  }

  // All accordions start open by default
  const defaultIndices = Object.keys(categoryData).map((_, index) => index);

  return (
    <Accordion allowMultiple defaultIndex={defaultIndices}>
      {Object.entries(categoryData).map(([categoryKey, categoryValue]) => (
        <AccordionItem key={categoryKey}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="medium">
                {categoryValue.label}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <SimpleGrid columns={12} spacing={4}>
              {Object.entries(categoryValue.fields).map(([fieldKey, fieldValue]) => {
                // Parse Bootstrap column classes (col-lg-6, col-md-4, etc.)
                const wrapperClass = fieldValue.attributes?.wrapperClass || "col-lg-12";
                const colMatch = wrapperClass.match(/col-(?:lg|md|sm|xs)?-(\d+)/);
                const colSpan = colMatch ? parseInt(colMatch[1]) : 12;

                return (
                  <Box key={fieldKey} gridColumn={`span ${colSpan}`}>
                    <RenderField
                      categoryKey={categoryKey}
                      fieldKey={fieldKey}
                      fieldValue={fieldValue}
                      onChange={onChange}
                    />
                  </Box>
                );
              })}
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
