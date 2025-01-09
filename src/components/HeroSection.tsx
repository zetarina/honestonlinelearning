// components/HeroSection.tsx
"use client";
import React from "react";
import { Typography, Button } from "antd";
import { useSettings } from "@/contexts/SettingsContext";
import { SETTINGS_KEYS } from "@/config/settingKeys";

const { Title, Text } = Typography;

const HeroSection = () => {
  const { settings } = useSettings();
  return (
    <div
      style={{
        height: "100vh",
        background: `url('/images/hero.jpg') center/cover no-repeat`,
        position: "relative",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 21, 41, 0.6)",
          zIndex: 1,
        }}
      />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <Title level={1} style={{ color: "#fff", fontWeight: "bold" }}>
          {settings[SETTINGS_KEYS.CURRENCY]?.toUpperCase() ??
            `Welcome to Our Learning Platform`}
        </Title>
        <Text style={{ color: "#fff", fontSize: "18px" }}>
          {settings[SETTINGS_KEYS.CURRENCY]?.toUpperCase() ??
            `Welcome to Our Learning Platform`}
        </Text>
        <div style={{ marginTop: "20px" }}>
          <Button type="primary" size="large" style={{ fontWeight: "bold" }}>
            Browse Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
