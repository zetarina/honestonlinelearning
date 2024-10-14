// LoadingSpinner.tsx
import React, { FC } from "react";
import { Spin } from "antd";

interface LoadingSpinnerProps {
  backgroundColor?: string;
  height?: string | number;
  // You can add more props if needed
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  backgroundColor = "white",
  height = "100vh",
}) => {
  const spinnerStyle: React.CSSProperties = {
    background: backgroundColor,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: height,
  };

  return (
    <div style={spinnerStyle}>
      <Spin size="large" />
    </div>
  );
};

export default LoadingSpinner;
