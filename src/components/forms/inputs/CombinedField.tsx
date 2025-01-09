import React from "react";
import { Typography, Input, Button } from "antd";
import ImageSelection from "@/components/forms/inputs/ImageSelection";
import { ChildFieldInfo, ChildNestedField } from "@/config/settings";

type CombinedFieldProps = {
  title?: string;
  keyPrefix: string;
  config: ChildFieldInfo | ChildNestedField;
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
};

const isFieldInfo = (
  field: ChildFieldInfo | ChildNestedField
): field is ChildFieldInfo => "formType" in field;

const CombinedField: React.FC<CombinedFieldProps> = ({
  title,
  keyPrefix,
  config,
  values = {},
  onChange,
}) => {
  const handleAddArrayItem = () => {
    const arrayValue: any[] = Array.isArray(values) ? values : [];
    const fieldConfig = config as ChildNestedField;

    const newItem = Object.keys(fieldConfig.fields || {}).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {} as Record<string, any>);

    onChange(keyPrefix, [...arrayValue, newItem]);
  };

  const handleRemoveArrayItem = (index: number) => {
    const arrayValue: any[] = Array.isArray(values) ? values : [];
    onChange(
      keyPrefix,
      arrayValue.filter((_: any, i: number) => i !== index)
    );
  };

  if ("fields" in config) {
    if (config.type === "array" && config.fields) {
      const arrayValue: any[] = Array.isArray(values) ? values : [];
      return (
        <div style={{ marginBottom: "16px" }}>
          <Typography.Title level={5}>{config.label || title}</Typography.Title>
          {arrayValue.map((item: any, index: number) => (
            <div
              key={`${keyPrefix}[${index}]`}
              style={{
                padding: "16px",
                marginBottom: "16px",
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
              }}
            >
              {Object.entries(config.fields).map(([fieldKey, fieldConfig]) => (
                <CombinedField
                  key={fieldKey}
                  title={fieldConfig.label || fieldKey}
                  keyPrefix={`${keyPrefix}[${index}].${fieldKey}`}
                  config={fieldConfig}
                  values={item[fieldKey] || ""}
                  onChange={(childKey, childValue) => {
                    const updatedArray = [...arrayValue];
                    updatedArray[index] = {
                      ...updatedArray[index],
                      [fieldKey]: childValue,
                    };
                    onChange(keyPrefix, updatedArray);
                  }}
                />
              ))}
              <Button
                danger
                onClick={() => handleRemoveArrayItem(index)}
                style={{ marginTop: "8px" }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="dashed"
            onClick={handleAddArrayItem}
            style={{ marginTop: "8px" }}
          >
            Add New Block
          </Button>
        </div>
      );
    }

    return (
      <div style={{ marginBottom: "16px" }}>
        <Typography.Title level={5}>{config.label || title}</Typography.Title>
        <div style={{ paddingLeft: "16px" }}>
          {Object.entries(config.fields).map(([fieldKey, fieldConfig]) => (
            <CombinedField
              key={fieldKey}
              title={fieldConfig.label || fieldKey}
              keyPrefix={`${keyPrefix}.${fieldKey}`}
              config={fieldConfig}
              values={values[fieldKey] || {}}
              onChange={onChange}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isFieldInfo(config)) {
    return (
      <div style={{ marginBottom: "16px" }}>
        <Typography.Text strong>{config.label || title}</Typography.Text>
        {config.formType === "image" ? (
          <ImageSelection
            value={typeof values === "string" ? values : ""}
            onChange={(newValue) => onChange(keyPrefix, newValue)}
          />
        ) : (
          <Input
            type={config.formType === "number" ? "number" : "text"}
            value={
              typeof values === "string" || typeof values === "number"
                ? values
                : ""
            }
            onChange={(e) => onChange(keyPrefix, e.target.value)}
            style={{ marginTop: "8px" }}
          />
        )}
      </div>
    );
  }

  return null;
};

export default CombinedField;
