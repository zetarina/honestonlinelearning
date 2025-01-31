"use client";

import React, { useState } from "react";
import { Button } from "antd";
import { useSettings } from "@/contexts/SettingsContext";
import { lighten } from "polished";

interface ExpandableContentProps {
  content?: string;
  linesToShow?: number;
  color?: string;
}

const ExpandableContent: React.FC<ExpandableContentProps> = ({
  content = "",
  linesToShow = 2,
  color,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { colors } = useSettings(); // Fetch theme colors

  const textColor = color || colors.text.default; // Allow override or default

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div
        className="expandable-content"
        style={{
          color: textColor,
          marginBottom: "0",
          marginTop: "10px",
          maxHeight: isExpanded ? "none" : `${linesToShow * 1.5}em`,
          overflow: "hidden",
          whiteSpace: "normal",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>

      {content.length > linesToShow * 100 && (
        <Button
          type="link"
          onClick={toggleExpand}
          style={{
            paddingLeft: 0,
            marginTop: "8px",
            fontWeight: "bold",
            background: `linear-gradient(90deg, ${colors.primary.default}, ${colors.secondary.default})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
      )}
    </div>
  );
};

export default ExpandableContent;
