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
import { useRouter } from "next/navigation";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import apiClient from "@/utils/api/apiClient";

const { Title } = Typography;

const SetupForm: React.FC = () => {
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
      `input[name="${
        currentStep === 1
          ? "username"
          : `${SETTINGS_KEYS.SITE_SETTINGS}.siteName`
      }"]`
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
      user: userData, // User creation is handled by the backend now
      settings: {
        [SETTINGS_KEYS.SITE_SETTINGS]: {
          siteName: values[`${SETTINGS_KEYS.SITE_SETTINGS}.siteName`],
          siteUrl: values[`${SETTINGS_KEYS.SITE_SETTINGS}.siteUrl`],
        },
        [SETTINGS_KEYS.CURRENCY]: values[SETTINGS_KEYS.CURRENCY],
      },
    };

    Modal.confirm({
      title: "Confirm Setup",
      content: "Are you sure you want to save the settings?",
      onOk: async () => {
        try {
          const response = await apiClient.post("/setup", payload);
          if (response.status === 201) {
            message.success("Setup completed successfully!");
            setSetupCompleted(true);
            window.location.reload();
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

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedUsername = e.target.value.toLowerCase().replace(/\s+/g, "");
    form.setFieldsValue({ username: formattedUsername });
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
              rules={[
                { required: true, message: "Please input your username!" },
                {
                  pattern: /^[a-z0-9]+$/,
                  message: "Username must be lowercase and contain no spaces",
                },
              ]}
            >
              <Input placeholder="Username" onChange={handleUsernameChange} />
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
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
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
              name={`${SETTINGS_KEYS.SITE_SETTINGS}.siteName`}
              rules={[
                { required: true, message: "Please input your site name!" },
              ]}
            >
              <Input placeholder="Enter your site name" />
            </Form.Item>

            <Form.Item
              label="Site URL"
              name={`${SETTINGS_KEYS.SITE_SETTINGS}.siteUrl`}
              rules={[
                { required: true, message: "Please input your site URL!" },
              ]}
            >
              <Input placeholder="Enter your site URL" />
            </Form.Item>

            <Form.Item
              label="Currency"
              name={SETTINGS_KEYS.CURRENCY}
              rules={[
                { required: true, message: "Please input your currency code!" },
                {
                  pattern: /^[A-Z]{3}$/,
                  message: "Currency must be a valid 3-letter code (e.g., USD)",
                },
              ]}
            >
              <Input placeholder="Currency Code (e.g., USD)" />
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
          <p>Setup completed!</p>
          <Button type="link" onClick={() => router.push("/login")}>
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default SetupForm;
