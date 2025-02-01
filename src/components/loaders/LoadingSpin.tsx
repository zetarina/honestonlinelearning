"use client";

import React, { FC } from "react";
import { useSettings } from "@/hooks/useSettings";
import { lighten } from "polished";
import { Spin } from "antd";

interface LoadingSpinProps {
  message?: string;
}

const LoadingSpin: FC<LoadingSpinProps> = ({ message = "" }) => {
  const { xcolor } = useSettings();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: xcolor.body.background,
      }}
    >
      <Spin size="large" />
    </div>
  );
};

export default LoadingSpin;
