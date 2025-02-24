"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Upload,
  Button,
  message,
  Typography,
  Card,
  Alert,
  Radio,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";

import { useSettings } from "@/hooks/useSettings";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import apiClient from "@/utils/api/apiClient";
import { loadStripe } from "@stripe/stripe-js";
import SubLoader from "@/components/loaders/SubLoader";
import { useUser } from "@/hooks/useUser";

const { Dragger } = Upload;
const { Title } = Typography;

const TopUpPage: React.FC = () => {
  const { user, refreshUser, initialLoading } = useUser();
  const { settings } = useSettings();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "offline">(
    settings[SETTINGS_KEYS.STRIPE]?.publicKey ? "stripe" : "offline"
  );

  const stripePublicKey = settings?.[SETTINGS_KEYS.STRIPE]?.publicKey;
  const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

  const resetFileState = () => {
    setPreview(null);
    setFile(null);
    setFileList([]);
  };

  const handleFileChange = async (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      message.error("File size exceeds the maximum limit of 20MB.");
      return;
    }

    setFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.onerror = () => {
      message.error("Failed to read file. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handlePaymentMethodChange = (e: any) => {
    setPaymentMethod(e.target.value);
    resetFileState();
  };

  const handleSubmit = async (values: any) => {
    if (!user) {
      message.error("You need to log in first.");
      return;
    }

    if (paymentMethod === "offline" && !file) {
      message.error("Please upload a screenshot for offline payment.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (paymentMethod === "offline" && file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("amount", values.amount);
        formData.append("paymentMethod", paymentMethod);

        const response = await apiClient.post("/top-up", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 201) {
          message.success("Top-up request submitted successfully!");
          resetFileState();
          refreshUser();
        } else {
          message.error("Failed to process top-up request.");
        }
      } else if (paymentMethod === "stripe") {
        const response = await apiClient.post("/top-up", {
          amount: values.amount,
          paymentMethod,
        });

        const { client_secret } = response.data;
        if (client_secret) {
          message.success("Redirecting to Stripe for payment...");
          const stripe = await stripePromise;
          const { error } = await stripe!.redirectToCheckout({
            sessionId: client_secret,
          });

          if (error) {
            message.error(error.message || "Stripe redirection failed.");
          }
        } else {
          message.error("Failed to initiate Stripe payment.");
        }
      }
    } catch (error: any) {
      console.error("Top-up error:", error);
      setError(error.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Show loading state while checking session (no need to manually redirect!)
  if (initialLoading || loading) {
    return <SubLoader tip="Loading top-up page..." />;
  }

  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: "50px auto" }}>
        <Alert message="Error" description={error} type="error" showIcon />
        <Button type="primary" onClick={refreshUser} style={{ marginTop: 20 }}>
          Retry
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ maxWidth: 600, margin: "50px auto" }}>
        <Alert
          message="User Not Found"
          description="No user data available."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "40px 20px" }}>
      <Card
        title="Top-Up Your Account"
        style={{
          borderRadius: "10px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter an amount" }]}
          >
            <Input type="number" placeholder="Enter amount" />
          </Form.Item>

          <Form.Item label="Payment Method">
            <Radio.Group
              onChange={handlePaymentMethodChange}
              value={paymentMethod}
            >
              {settings[SETTINGS_KEYS.STRIPE]?.publicKey && (
                <Radio value="stripe">Stripe (Visa/PayPal)</Radio>
              )}
              <Radio value="offline">Offline (Upload Screenshot)</Radio>
            </Radio.Group>
          </Form.Item>

          {paymentMethod === "offline" && !file && (
            <Form.Item
              label="Payment Screenshot"
              name="screenshot"
              rules={[
                { required: true, message: "Please upload a screenshot" },
              ]}
            >
              <Dragger
                name="screenshot"
                fileList={fileList}
                multiple={false}
                accept="image/*"
                maxCount={1}
                beforeUpload={(file) => {
                  handleFileChange(file);
                  setFileList([file]);
                  return false;
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p>Click or drag an image to this area to upload</p>
                <p>
                  Ensure the screenshot is clear and includes the transaction
                  details.
                </p>
              </Dragger>
            </Form.Item>
          )}

          <Form.Item style={{ marginTop: "40px" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              disabled={paymentMethod === "offline" && !file}
            >
              Submit Top-up Request
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TopUpPage;
