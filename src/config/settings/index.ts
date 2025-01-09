export type FieldInfo = {
  label: string;
  guide?: string;
  formType: "string" | "number" | "boolean" | "url" | "file" | "image";
  visibility: "public" | "private";
};
export type NestedField = {
  label: string;
  type: "array" | "json";
  visibility: "public" | "private";
  fields: Record<string, ChildFieldInfo | ChildNestedField>;
};

export type ChildFieldInfo = {
  label: string;
  guide: string;
  formType: "string" | "number" | "boolean" | "url" | "file" | "image";
};

export type ChildNestedField = {
  label: string;
  type: "array" | "json";
  fields: Record<string, ChildFieldInfo | ChildNestedField>;
};

export type GeneralConfig<Keys extends Record<string, string>> = {
  [K in Keys[keyof Keys]]: FieldInfo | NestedField;
};
