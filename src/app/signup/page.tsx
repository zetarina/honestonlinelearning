"use client";
import { Button, Input, Form, Alert, Typography, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import UserContext from "@/contexts/UserContext";
import { UserRole } from "@/models/UserModel";

const { Title } = Typography;

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const { refreshUser, user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      handleRoleBasedRedirect();
    }
  }, [user, router]);

  const handleRoleBasedRedirect = () => {
    if (redirect) {
      router.push(redirect);
      return;
    }

    if (user.role === UserRole.STUDENT) {
      router.push("/profile");
    } else {
      router.push("/dashboard");
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/auth/signup", {
        username: values.username,
        email: values.email,
        password: values.password,
      });

      if (response.status === 201) {
        refreshUser();
        handleRoleBasedRedirect();
      } else {
        setError(
          response.data?.error || "Signup failed! Please check your details."
        );
      }
    } catch (error: any) {
      setError(
        error.response?.data?.error ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
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
          transition: "all 0.3s ease-in-out",
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
            message={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: "16px" }}
          />
        )}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" size="large" />
          </Form.Item>
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
              {loading ? <Spin /> : "Sign Up"}
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
