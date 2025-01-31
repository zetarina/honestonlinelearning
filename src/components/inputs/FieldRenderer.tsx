import React from "react";
import { Typography, Input, Tooltip, Card, Switch } from "antd";
import ImageSelection from "@/components/inputs/ImageSelection";
import { ChildFieldInfo, FormType } from "@/config/settings";
import DynamicDropdown from "./DynamicDropdown";

type FieldRendererProps = {
  config: ChildFieldInfo;
  value: any;
  onChange: (value: any) => void;
};

const FieldRenderer: React.FC<FieldRendererProps> = ({
  config,
  value,
  onChange,
}) => {
  return (
    <Card
      title={
        <>
          {config.label}
          {config.guide && (
            <Tooltip title={config.guide}>
              <Typography.Text
                style={{
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  width: "20px",
                  height: "20px",
                  justifyContent: "center",
                }}
              >
                ℹ️
              </Typography.Text>
            </Tooltip>
          )}
        </>
      }
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        marginBottom: "16px",
      }}
    >
      {config.formType === FormType.IMAGE ? (
        <ImageSelection value={value || ""} onChange={onChange} />
      ) : config.formType === FormType.COLOR ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "8px",
          }}
        >
          <Input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            style={{
              borderRadius: "4px",
              height: "36px",
              width: "50px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          />
          <Typography.Text>{value || "#000000"}</Typography.Text>
        </div>
      ) : config.formType === FormType.ROLE_SELECTION ? (
        <DynamicDropdown
          endpoint="/roles"
          valueKey="_id"
          labelKey="name"
          placeholder="Select a role"
          value={value}
          onChange={onChange}
        />
      ) : config.formType === FormType.BOOLEAN ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "8px",
          }}
        >
          <Switch checked={!!value} onChange={onChange} />
          <Typography.Text>{value ? "Enabled" : "Disabled"}</Typography.Text>
        </div>
      ) : (
        <Input
          type={
            config.formType === FormType.NUMBER
              ? "number"
              : config.formType === FormType.EMAIL
              ? "email"
              : "text"
          }
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          style={{
            marginTop: "8px",
            borderRadius: "4px",

            padding: "8px",
          }}
        />
      )}
    </Card>
  );
};

export default FieldRenderer;
