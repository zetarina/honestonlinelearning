import React from "react";
import { Card, Button } from "antd";
import CombinedField from "./CombinedField";
import { ChildNestedField } from "@/config/settings";

const IntelligentJsonField: React.FC<{
  config: ChildNestedField;
  value: Record<string, any>;
  onChange: (val: Record<string, any>) => void;
}> = ({ config, value, onChange }) => {
  const handleFieldChange = (key: string, fieldValue: any) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const handlePasteJson = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const parsed = JSON.parse(clipboardText);
      if (typeof parsed === "object" && parsed !== null) {
        onChange(parsed);
      }
    } catch (error) {
      console.error("Failed to paste JSON", error);
    }
  };

  return (
    <Card
      title={
        <>
          {config.label}
          <Button onClick={handlePasteJson} style={{ marginLeft: 10 }}>
            Paste
          </Button>
        </>
      }
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

export default IntelligentJsonField;
