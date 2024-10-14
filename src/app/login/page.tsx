"use client";
import { signIn } from "next-auth/react";
import { Button, Input, Form, Alert, Typography, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import useSWR from "swr";

const { Title } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm
        router={router}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
      />
    </Suspense>
  );
}

function LoginForm({
  router,
  loading,
  setLoading,
  error,
  setError,
}: {
  router: ReturnType<typeof useRouter>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const { mutate } = useSWR("/api/me");

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result?.ok) {
      await mutate();
      router.push(redirect);
    } else {
      setError("Login failed! Please check your credentials.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md relative transform transition-all duration-300 hover:shadow-lg">
        <Title level={2} className="text-center mb-6">
          Login
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
        <div className="text-center mt-4">
          Don&apos;t have an account? <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
}
