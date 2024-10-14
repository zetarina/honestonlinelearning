// components/HeroSection.tsx
"use client";
import React from "react";
import { Typography, Button } from "antd";

const { Title, Text } = Typography;

const HeroSection = () => {
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
          Welcome to Our Learning Platform
        </Title>
        <Text style={{ color: "#fff", fontSize: "18px" }}>
          Master new skills, learn from expert instructors, and take your career
          to the next level.
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
