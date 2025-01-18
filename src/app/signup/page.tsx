"use client";

import { Button, Input, Form, Alert, Typography, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useContext, useEffect } from "react";

import UserContext from "@/contexts/UserContext";
import { UserRole } from "@/models/UserModel";
import apiClient from "@/utils/api/apiClient";

const { Title } = Typography;

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const { refreshUser, user } = useContext(UserContext);

  const [form] = Form.useForm(); // Ant Design form instance
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect user if already logged in
  useEffect(() => {
    if (user) {
      handleRoleBasedRedirect();
    }
  }, [user]);

  const handleRoleBasedRedirect = () => {
    const target =
      redirect || (user?.role === UserRole.STUDENT ? "/profile" : "/dashboard");
    router.replace(target);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);

    try {
      const { status, data } = await apiClient.post("/auth/signup", values);

      if (status === 201) {
        refreshUser(); // Refresh user data after successful signup
        handleRoleBasedRedirect();
      } else {
        setError(data?.error || "Signup failed. Please check your details.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedUsername = e.target.value.toLowerCase().replace(/\s+/g, "");
    form.setFieldsValue({ username: formattedUsername });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "white",
          padding: "32px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Sign Up
        </Title>

        {error && (
          <Alert
            message="Signup Error"
            description={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: "16px" }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            username: "",
            email: "",
            password: "",
          }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Please input your username!" },
              {
                pattern: /^[a-z0-9]+$/,
                message: "Username must be lowercase and contain no spaces.",
              },
            ]}
          >
            <Input
              placeholder="Username"
              size="large"
              onChange={handleUsernameChange}
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address." },
            ]}
          >
            <Input placeholder="Email" size="large" autoComplete="email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long.",
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              size="large"
              autoComplete="new-password"
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
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{
            textAlign: "center",
            marginTop: "16px",
          }}
        >
          Already have an account? <a href="/login">Log In</a>
        </div>
      </div>
    </div>
  );
}
