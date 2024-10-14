"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Alert,
  Typography,
  Spin,
  Modal,
} from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SETTINGS_KEYS } from "@/config/settingKeys"; // Import the settings keys

const { Title } = Typography;

const SetupPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [setupCompleted, setSetupCompleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const inputToFocus = document.querySelector(
      `input[name="${currentStep === 1 ? "username" : SETTINGS_KEYS.SITE_NAME}"]`
    ) as HTMLInputElement;
    inputToFocus?.focus();
  }, [currentStep]);

  const handleNextStep = async (values: any) => {
    setUserData({ ...userData, ...values });
    setCurrentStep(2);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError(null);

    const payload = {
      user: userData,
      settings: {
        [SETTINGS_KEYS.SITE_NAME]: values[SETTINGS_KEYS.SITE_NAME],
        [SETTINGS_KEYS.SITE_URL]: values[SETTINGS_KEYS.SITE_URL],
      },
    };

    Modal.confirm({
      title: "Confirm Setup",
      content: "Are you sure you want to save the settings?",
      onOk: async () => {
        try {
          const response = await axios.post("/api/setup", payload);
          if (response.status === 201) {
            message.success("Setup completed successfully!");
            setSetupCompleted(true);
            router.push("/dashboard");
          } else {
            setError(
              response.data?.error || "Setup failed! Please check your details."
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
      },
      onCancel() {
        setLoading(false);
      },
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Title level={2} className="text-center mb-6">
        Setup Your Site
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

      <Form
        form={form}
        layout="vertical"
        onFinish={currentStep === 1 ? handleNextStep : handleSubmit}
      >
        {currentStep === 1 ? (
          <>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                {loading ? <Spin /> : "Next"}
              </Button>
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              label="Site Name"
              name={SETTINGS_KEYS.SITE_NAME}
              rules={[{ required: true, message: "Please input your site name!" }]}
            >
              <Input placeholder="Enter your site name" />
            </Form.Item>

            <Form.Item
              label="Site URL"
              name={SETTINGS_KEYS.SITE_URL}
              rules={[{ required: true, message: "Please input your site URL!" }]}
            >
              <Input placeholder="Enter your site URL" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                {loading ? <Spin /> : "Save Settings"}
              </Button>
            </Form.Item>
          </>
        )}
      </Form>

      {setupCompleted && (
        <div className="text-center mt-4">
          <p>You have completed the setup!</p>
          <Button type="link" onClick={() => router.push("/login")}>
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default SetupPage;
