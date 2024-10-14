import React, { useState } from "react";
import { Button } from "antd";
import "./ExpandableContent.css"; // Import the CSS file

interface ExpandableContentProps {
  content: string;
  linesToShow?: number;
  color?: string;
}

const ExpandableContent: React.FC<ExpandableContentProps> = ({
  content,
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
        className="expandable-content" // Use the class to apply the external CSS
        style={{
          color: color,
          marginBottom: "0",
          marginTop: "10px",
          maxHeight: isExpanded ? "none" : `${linesToShow * 1.5}em`, // Adjust height dynamically
          overflow: "hidden", // Hide overflow when not expanded
          whiteSpace: "normal",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>

            {content.length > linesToShow * 100 && (
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
