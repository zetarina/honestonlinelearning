import React from "react";
import { Typography, Button, Card, Divider } from "antd";
import CombinedField from "./CombinedField";
import { ChildNestedField } from "@/config/settings";

type ArrayFieldRendererProps = {
  config: ChildNestedField;
  value: any[];
  onChange: (value: any[]) => void;
};

const ArrayFieldRenderer: React.FC<ArrayFieldRendererProps> = ({
  config,
  value,
  onChange,
}) => {
  const handleAddArrayItem = () => {
    const arrayValue = Array.isArray(value) ? value : [];
    const newItem = Object.keys(config.fields || {}).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {} as Record<string, any>);
    onChange([...arrayValue, newItem]);
  };

  const handleRemoveArrayItem = (index: number) => {
    const arrayValue = Array.isArray(value) ? value : [];
    onChange(arrayValue.filter((_, i) => i !== index));
  };

  const arrayValue = Array.isArray(value) ? value : [];

  return (
    <Card
      title={config.label}
      style={{
        paddingLeft: "16px",
        borderLeft: "4px solid #40a9ff",
        padding: "0px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
      actions={[
        <Button
          type="dashed"
          style={{
            marginTop: "16px",
            borderColor: "#40a9ff",
          }}
          onClick={handleAddArrayItem}
          key="add-button"
        >
          + Add New Block
        </Button>,
      ]}
    >
      {arrayValue.map((item, index) => (
        <React.Fragment key={index}>
          {Object.entries(config.fields).map(([fieldKey, fieldConfig]) => (
            <CombinedField
              key={`${index}-${fieldKey}`}
              title={fieldConfig.label || fieldKey}
              keyPrefix={`${index}.${fieldKey}`}
              config={fieldConfig}
              values={item[fieldKey] || ""}
              onChange={(childKey, childValue) => {
                const updatedArray = [...arrayValue];
                updatedArray[index] = {
                  ...updatedArray[index],
                  [fieldKey]: childValue,
                };
                onChange(updatedArray);
              }}
            />
          ))}
          <Button
            type="primary"
            danger
            onClick={() => handleRemoveArrayItem(index)}
            style={{
              backgroundColor: "#ff4d4f",
              borderColor: "#ff4d4f",
            }}
          >
            Remove Block
          </Button>
          <Divider />
        </React.Fragment>
      ))}
    </Card>
  );
};

export default ArrayFieldRenderer;
