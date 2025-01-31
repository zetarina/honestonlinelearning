import React from "react";
import { Card, Typography } from "antd";
import CombinedField from "./CombinedField";
import { ChildNestedField } from "@/config/settings";

type JsonFieldRendererProps = {
  config: ChildNestedField;
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
};

const JsonFieldRenderer: React.FC<JsonFieldRendererProps> = ({
  config,
  value,
  onChange,
}) => {
  const handleFieldChange = (key: string, fieldValue: any) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <Card
      title={config.label}
      style={{
        
        borderLeft: "4px solid #40a9ff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          borderRadius: "4px",
          padding: "16px",
        }}
      >
        {Object.entries(config.fields).map(([fieldKey, fieldConfig]) => (
          <CombinedField
            key={fieldKey}
            title={fieldConfig.label || fieldKey}
            keyPrefix={fieldKey}
            config={fieldConfig}
            values={value?.[fieldKey] || ""}
            onChange={(childKey, childValue) =>
              handleFieldChange(fieldKey, childValue)
            }
          />
        ))}
      </div>
    </Card>
  );
};

export default JsonFieldRenderer;
