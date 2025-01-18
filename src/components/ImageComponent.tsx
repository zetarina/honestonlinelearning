"use client";

import React from "react";

interface ImageComponentProps {
  src: string;
  alt: string;
  width?: number | string; // Optional and flexible
  height?: number | string; // Optional and flexible
  objectFit?: "cover" | "contain";
  style?: React.CSSProperties;
  priority?: boolean;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  src,
  alt,
  width = "100%", // Default to full width
  height = "auto", // Default to auto height
  objectFit = "cover",
  style,
  priority = false,
}) => {
  if (!src) {
    console.error("Image source is invalid:", src);
    return <div>Invalid image source</div>; // Placeholder for invalid source
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width, // Flexible width
        height, // Flexible height
        objectFit,
        ...style,
      }}
    />
  );
};

export default ImageComponent;
