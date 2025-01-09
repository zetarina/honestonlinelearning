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
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <Typography.Title
            level={5}
            style={{
              color: "#333",
              marginTop: "0px",
              marginBottom: "16px",
              fontWeight: "600",
            }}
          >
            {config.label || title}
          </Typography.Title>
          {arrayValue.map((item: any, index: number) => (
            <div
              key={`${keyPrefix}[${index}]`}
              style={{
                border: "1px solid #eaeaea",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
                backgroundColor: "#fff",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s, box-shadow 0.2s",
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
                type="primary"
                onClick={() => handleRemoveArrayItem(index)}
                style={{
                  marginTop: "16px",
                  backgroundColor: "#ff4d4f",
                  borderColor: "#ff4d4f",
                }}
              >
                Remove Block
              </Button>
            </div>
          ))}
          <Button
            type="dashed"
            onClick={handleAddArrayItem}
            style={{
              marginTop: "16px",
              borderColor: "#40a9ff",
              color: "#40a9ff",
            }}
          >
            + Add New Block
          </Button>
        </div>
      );
    }

    return (
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
      >
        <Typography.Title
          level={5}
          style={{
            color: "#333",
            marginTop: "0px",
            marginBottom: "16px",
            fontWeight: "600",
          }}
        >
          {config.label || title}
        </Typography.Title>
        <div
          style={{
            paddingLeft: "16px",
            borderLeft: "4px solid #40a9ff",
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            padding: "16px",
          }}
        >
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
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          marginBottom: "16px",
        }}
      >
        <Typography.Text
          strong
          style={{
            fontSize: "14px",
            color: "#333",
            marginBottom: "8px",
            display: "block",
          }}
        >
          {config.label || title}
        </Typography.Text>
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
            style={{
              marginTop: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              padding: "8px",
            }}
          />
        )}
      </div>
    );
  }

  return null;
};

export default CombinedField;
