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

  useEffect(() => {
    document.querySelectorAll(".ql-toolbar").forEach((toolbar) => {
      (toolbar as HTMLElement).style.backgroundColor =
        xcolor.input.addon.background;
      (
        toolbar as HTMLElement
      ).style.border = `1px solid ${xcolor.input.addon.background}`;
    });

    document
      .querySelectorAll(".ql-formats, .ql-picker, .ql-stroke")
      .forEach((element) => {
        (element as HTMLElement).style.color = xcolor.input.text.default;
      });

    document
      .querySelectorAll(".ql-picker-label, .ql-picker-item")
      .forEach((picker) => {
        (picker as HTMLElement).style.backgroundColor =
          xcolor.input.active.background;
        (picker as HTMLElement).style.color = xcolor.input.text.default;
        (picker as HTMLElement).style.borderRadius = "4px";
      });
  }, [xcolor]);

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
