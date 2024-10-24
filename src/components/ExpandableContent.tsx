import React, { useState } from "react";
import { Button } from "antd";
import "./ExpandableContent.css";

interface ExpandableContentProps {
  content?: string; // Make content optional to avoid errors
  linesToShow?: number;
  color?: string;
}

const ExpandableContent: React.FC<ExpandableContentProps> = ({
  content = "", // Default to an empty string if content is undefined
  linesToShow = 2,
  color = "#555",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div
        className="expandable-content"
        style={{
          color: color,
          marginBottom: "0",
          marginTop: "10px",
          maxHeight: isExpanded ? "none" : `${linesToShow * 1.5}em`,
          overflow: "hidden",
          whiteSpace: "normal",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>

      {content && content.length > linesToShow * 100 && (
        <Button
          type="link"
          onClick={toggleExpand}
          style={{ paddingLeft: 0, marginTop: "8px" }}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
      )}
    </div>
  );
};

export default ExpandableContent;
