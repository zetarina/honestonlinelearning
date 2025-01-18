export enum FormType {
  TEXT = "text",
  NUMBER = "number",
  BOOLEAN = "boolean",
  URL = "url",
  FILE = "file",
  IMAGE = "image",
  SELECT = "select",
  EMAIL = "email",
}
export enum NestedFieldType {
  JSON = "json",
  ARRAY = "array",
}
export type FieldInfo = {
  label: string;
  guide?: string;
  formType: FormType;
  visibility: "public" | "private";
};
export type NestedField = {
  label: string;
  type: NestedFieldType;
  visibility: "public" | "private";
  fields: Record<string, ChildFieldInfo | ChildNestedField>;
  options?: { label: string; value: string | number }[];
};

export type ChildFieldInfo = {
  label: string;
  guide: string;
  formType: FormType;
  options?: { label: string; value: string | number }[];
};

export type ChildNestedField = {
  label: string;
  type: NestedFieldType;
  fields: Record<string, ChildFieldInfo | ChildNestedField>;
};

export type GeneralConfig<Keys extends Record<string, string>> = {
  [K in Keys[keyof Keys]]: FieldInfo | NestedField;
};
