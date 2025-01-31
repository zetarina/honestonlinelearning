"use client";

import { Button, Input, Form, Alert, Typography, Spin, Card } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import UserContext from "@/contexts/UserContext";
import SubLoader from "@/components/loaders/SubLoader";
import { APP_PERMISSIONS } from "@/config/permissions";

const { Title } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const {
    user,
    signIn,
    loading: sessionLoading,
    initialLoading,
  } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !initialLoading) {
      handleRoleBasedRedirect();
    }
  }, [user, initialLoading]);

  const handleRoleBasedRedirect = () => {
    const canViewProfile = user?.roles?.some((role) =>
      role.permissions.includes(APP_PERMISSIONS.VIEW_DASHBOARD)
    );

    const target = redirect || (canViewProfile ? "/dashboard" : "/profile");
    router.replace(target);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);

    try {
      await signIn(values.email, values.password);
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(
        err.message || "An unexpected error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Show a loader while the user session is being initialized
  if (initialLoading || sessionLoading || (user && !initialLoading)) {
    return <SubLoader tip="Logging in..." />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Card
        title="Login"
        style={{
          width: "100%",
          maxWidth: "400px",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {error && (
          <Alert
            message="Login Error"
            description={error}
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
            <Input placeholder="Email" size="large" autoComplete="email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              size="large"
              autoComplete="current-password"
            />
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
              Login
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          Don&apos;t have an account? <a href="/signup">Sign Up</a>
        </div>
      </Card>
    </div>
  );
}
