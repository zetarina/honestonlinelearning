"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useContext } from "react";
import UserContext from "@/contexts/UserContext";
import { Card, Typography, Row, Col, Divider } from "antd";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { user } = useContext(UserContext);

  const userDetails = useMemo(() => {
    return (
      <>
        <Divider />
        <div style={{ padding: "12px 0" }}>
          <Text strong>Email:</Text>
          <Text style={{ marginLeft: "8px" }}>{user?.email || "N/A"}</Text>
        </div>
        <Divider />
        <div style={{ padding: "12px 0" }}>
          <Text strong>Role:</Text>
          <Text style={{ marginLeft: "8px", textTransform: "capitalize" }}>
            {user?.role || "N/A"}
          </Text>
        </div>
        <Divider />
        <div style={{ padding: "12px 0" }}>
          <Text strong>Points Balance:</Text>
          <Text
            style={{
              marginLeft: "8px",
              color: "#1890ff",
              fontWeight: "bold",
            }}
          >
            {user?.pointsBalance || 0}
          </Text>
        </div>
      </>
    );
  }, [user]);

  return (
    <div style={{ padding: "40px", minHeight: "100vh" }}>
      <Row justify="center">
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            styles={{ body: { padding: "24px" } }}
          >
            <Title
              level={3}
              style={{ textAlign: "center", marginBottom: "16px" }}
            >
              Welcome to Your Dashboard
            </Title>
            {userDetails}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
