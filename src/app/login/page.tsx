"use client";
import { signIn } from "next-auth/react";
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

  const {
    awaitRefreshUser,
    user,
    loading: sessionLoading,
  } = useContext(UserContext);

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
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.ok) {
        await awaitRefreshUser(); // Ensure the user context refreshes
        handleRoleBasedRedirect(); // Redirect based on the user's role
      } else {
        setError("Login failed! Please check your credentials.");
      }
    } catch (error) {
      console.log(error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Login
        </Title>
        {error && !sessionLoading && (
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
        <div
          style={{
            textAlign: "center",
            marginTop: "16px",
          }}
        >
          Don&apos;t have an account? <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
}
