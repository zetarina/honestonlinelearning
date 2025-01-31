import React from "react";
import FieldRenderer from "./FieldRenderer";
import ArrayFieldRenderer from "./ArrayFieldRenderer";
import JsonFieldRenderer from "./JsonFieldRenderer";
import IntelligentJsonField from "./IntelligentJsonField";
import {
  ChildFieldInfo,
  ChildNestedField,
  NestedFieldType,
} from "@/config/settings";

type CombinedFieldProps = {
  title?: string;
  keyPrefix: string;
  config: ChildFieldInfo | ChildNestedField;
  values: any;
  onChange: (key: string, value: any, type: string) => void;
};

const isFieldInfo = (
  field: ChildFieldInfo | ChildNestedField
): field is ChildFieldInfo => "formType" in field;

const CombinedField: React.FC<CombinedFieldProps> = ({
  title,
  keyPrefix,
  config,
  values,
  onChange,
}) => {
  if ("fields" in config) {
    if (config.type === NestedFieldType.ARRAY) {
      return (
        <ArrayFieldRenderer
          config={config}
          value={values || []}
          onChange={(value) => onChange(keyPrefix, value, "array")}
        />
      );
    }

    if (config.type === NestedFieldType.JSON) {
      return (
        <JsonFieldRenderer
          config={config}
          value={values || {}}
          onChange={(value) => onChange(keyPrefix, value, "json")}
        />
      );
    }
    if (config.type === NestedFieldType.INTELLIGENT_JSON) {
      return (
        <IntelligentJsonField
          config={config}
          value={values || {}}
          onChange={(value) => onChange(keyPrefix, value, "json")}
        />
      );
    }
  }

  if (isFieldInfo(config)) {
    return (
      <FieldRenderer
        config={config}
        value={values}
        onChange={(value) => onChange(keyPrefix, value, config.formType)}
      />
    );
  }

  return null;
};

export default CombinedField;
