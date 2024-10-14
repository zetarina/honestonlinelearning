"use client";
import { Button, Input, Form, Alert, Typography, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

const { Title } = Typography;

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        router.push("/dashboard");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md relative transform transition-all duration-300 hover:shadow-lg">
        <Title level={2} className="text-center mb-6">
          Sign Up
        </Title>
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            className="mb-4"
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
        <div className="text-center mt-4">
          Already have an account? <a href="/login">Log In</a>
        </div>
      </div>
    </div>
  );
}
