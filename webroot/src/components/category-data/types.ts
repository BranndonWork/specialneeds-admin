// Type definitions for category data fields

export interface FieldAttributes {
  type?: string;
  value?: any;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  decimals?: number;
  options?: string[];
  additionalProps?: Record<string, any>;
  style?: Record<string, any>;
  maxTags?: number;
  fields?: Record<string, Field>;
  iconClass?: string;
  wrapperClass?: string; // Bootstrap col classes like "col-lg-6" or "col-md-4"
}

export interface Field {
  label: string;
  description?: string;
  attributes: FieldAttributes;
}

export interface CategorySection {
  label: string;
  description?: string;
  icon?: string;
  fields: Record<string, Field>;
}

export type CategoryData = Record<string, CategorySection>;

export interface RenderFieldProps {
  fieldKey: string;
  categoryKey: string;
  fieldValue: Field;
  onChange: (
    categoryKey: string,
    fieldKey: string,
    value: any,
    subField?: string | null,
    idx?: number | null
  ) => void;
}

export interface FieldComponentProps {
  fieldValue: Field;
  onChange: (value: any, subField?: string | null, idx?: number | null) => void;
}
