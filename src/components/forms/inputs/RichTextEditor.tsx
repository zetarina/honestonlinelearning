import React, { useState } from "react";
import { Form } from "antd";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import "./RichTextEditor.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextEditorProps {
  label: string;
  name: string;
  rules?: any[];
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  name,
  rules,
}) => {
  const [value, setValue] = useState<string>("");

  const handleChange = (content: string) => {
    setValue(content);
  };

  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      valuePropName="value"
      getValueFromEvent={(e) => e}
    >
      <ReactQuill
        value={value}
        onChange={handleChange}
        className="custom-quill-editor"
      />
    </Form.Item>
  );
};

export default RichTextEditor;
