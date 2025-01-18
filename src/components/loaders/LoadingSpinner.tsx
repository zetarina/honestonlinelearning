import React, { FC } from "react";

interface LoadingSpinnerProps {
  backgroundColor?: string;
  height?: string | number;
  message?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  backgroundColor = "white",
  height = "100vh",
  message = "",
}) => {
  const spinnerStyle: React.CSSProperties = {
    background: backgroundColor,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: height,
    fontFamily: "'Roboto', sans-serif",
    color: "#555",
  };

  const messageStyle: React.CSSProperties = {
    marginTop: "30px", // Increased margin for better spacing
    fontSize: "24px", // Larger font for better visibility
    fontWeight: 600, // Bold text
    textAlign: "center",
    background: "linear-gradient(90deg, #1890ff, #40a9ff)", // Blue gradient text
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent", // Makes the gradient visible
  };

  const spinnerWrapperStyle: React.CSSProperties = {
    width: "80px", // Increased size for visibility
    height: "80px",
    position: "relative",
    display: "inline-block",
  };

  const spinnerSegmentStyle = (color: string, delay: string): React.CSSProperties => ({
    width: "100%",
    height: "100%",
    border: "6px solid transparent", // Thicker border for more prominent spinner
    borderTop: `6px solid ${color}`,
    borderRadius: "50%",
    position: "absolute",
    animation: "spin 1s cubic-bezier(0.4, 0.0, 0.2, 1) infinite",
    animationDelay: delay,
  });

  return (
    <div style={spinnerStyle}>
      <div style={spinnerWrapperStyle}>
        <div style={spinnerSegmentStyle("#1890ff", "0s")}></div> {/* Blue */}
        <div style={spinnerSegmentStyle("#40a9ff", "0.1s")}></div> {/* Sky Blue */}
        <div style={spinnerSegmentStyle("#69c0ff", "0.2s")}></div> {/* Lighter Blue */}
        <div style={spinnerSegmentStyle("#91d5ff", "0.3s")}></div> {/* Pale Blue */}
        <div style={spinnerSegmentStyle("#d6e4ff", "0.4s")}></div> {/* Almost White */}
      </div>
      {message && <div style={messageStyle}>{message}</div>}
      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
