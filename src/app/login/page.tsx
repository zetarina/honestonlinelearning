"use client";

import { Button, Input, Form, Alert, Typography, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import UserContext from "@/contexts/UserContext";
import { UserRole } from "@/models/UserModel";

const { Title } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const { user, signIn, loading: sessionLoading, initialLoading } =
    useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !initialLoading) {
      handleRoleBasedRedirect();
    }
  }, [user, initialLoading]);

  const handleRoleBasedRedirect = () => {
    const target = redirect || (user?.role === UserRole.STUDENT ? "/profile" : "/dashboard");
    router.replace(target);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);

    try {
      await signIn(values.email, values.password);
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading || sessionLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "white",
          padding: "32px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
          Login
        </Title>
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: "16px" }}
          />
        )}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              disabled={loading}
              size="large"
            >
              {loading ? <Spin /> : "Login"}
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          Don&apos;t have an account? <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
}
