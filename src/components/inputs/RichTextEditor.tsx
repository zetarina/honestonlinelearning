"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useSettings } from "@/hooks/useSettings";
import "react-quill/dist/quill.snow.css";
import "./RichTextEditor.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Type here...",
}) => {
  const { xcolor } = useSettings();

  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="custom-quill-editor"
      style={{
        backgroundColor: xcolor.input.active.background,
        color: xcolor.input.text.default,
        border: `1px solid ${xcolor.input.addon.background}`,
        borderRadius: "8px",
        transition: "border-color 0.2s ease-in-out",
      }}
    />
  );
};

export default RichTextEditor;
