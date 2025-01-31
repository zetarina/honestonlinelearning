"use client";

import React, { FC } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { lighten } from "polished";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ message = "" }) => {
  const { colors } = useSettings(); // Fetch dynamic colors from settings

  const spinnerStyle: React.CSSProperties = {
    background: colors.uiBackground.default, // Dynamically set background color
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "'Roboto', sans-serif",
    color: "#555",
  };

  const messageStyle: React.CSSProperties = {
    marginTop: "30px", // Increased margin for better spacing
    fontSize: "24px", // Larger font for better visibility
    fontWeight: 600, // Bold text
    textAlign: "center",
    background: `linear-gradient(90deg, ${colors.primary.default}, ${colors.secondary.default})`, // Gradient text using dynamic colors
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent", // Makes the gradient visible
  };

  const spinnerWrapperStyle: React.CSSProperties = {
    width: "80px", // Increased size for visibility
    height: "80px",
    position: "relative",
    display: "inline-block",
  };

  const spinnerSegmentStyle = (
    color: string,
    delay: number
  ): React.CSSProperties => ({
    width: "100%",
    height: "100%",
    border: "6px solid transparent", // Thicker border for more prominent spinner
    borderTop: `6px solid ${lighten(delay / 2, color)}`,
    borderRadius: "50%",
    position: "absolute",
    animation: "spin 1s cubic-bezier(0.4, 0.0, 0.2, 1) infinite",
    animationDelay: `${delay}s`,
  });

  return (
    <div style={spinnerStyle}>
      <div style={spinnerWrapperStyle}>
        <div style={spinnerSegmentStyle(colors.primary.default, 0)}></div>

        <div style={spinnerSegmentStyle(colors.primary.default, 0.1)}></div>
        <div style={spinnerSegmentStyle(colors.primary.default, 0.2)}></div>
        <div style={spinnerSegmentStyle(colors.primary.default, 0.3)}></div>
        <div style={spinnerSegmentStyle(colors.primary.default, 0.4)}></div>
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
