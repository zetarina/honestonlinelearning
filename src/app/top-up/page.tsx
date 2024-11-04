"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Input,
  Upload,
  Button,
  message,
  Typography,
  Card,
  Image,
  Spin,
  Alert,
  Radio,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import UserContext from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useSettings } from "@/contexts/SettingsContext";
import { loadStripe } from "@stripe/stripe-js";
import { SETTINGS_KEYS } from "@/config/settingKeys";

const { Dragger } = Upload;
const { Title, Paragraph } = Typography;

const TopUpPage: React.FC = () => {
  const { user, refreshUser } = useContext(UserContext);
  const { settings } = useSettings();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState(
    settings[SETTINGS_KEYS.STRIPE_PUBLIC_KEY] ? "stripe" : "offline"
  );
  const [fetchingUserData, setFetchingUserData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const stripePromise = settings[SETTINGS_KEYS.STRIPE_PUBLIC_KEY]
    ? loadStripe(settings[SETTINGS_KEYS.STRIPE_PUBLIC_KEY])
    : null;

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/top-up");
    } else {
      refreshUser();
      setFetchingUserData(false);
    }
  }, [user, router]);

  const handleFileChange = async (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFileBase64(base64);
      setPreview(base64);
    };

    reader.readAsDataURL(file);
  };

  const handlePaymentMethodChange = (e: any) => {
    setPaymentMethod(e.target.value);
    resetFileState();
  };

  const resetFileState = () => {
    setPreview(null);
    setFileBase64(null);
    setFileList([]);
  };

  const handleSubmit = async (values: any) => {
    if (!user) {
      message.error("You need to log in first.");
      return;
    }

    if (paymentMethod === "offline" && !fileBase64) {
      message.error("Please upload a screenshot for offline payment.");
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear any previous error

      const payload = {
        amount: values.amount,
        userId: user.id,
        paymentMethod,
        ...(paymentMethod === "offline" && { screenshot: fileBase64 }),
      };

      const response = await axios.post("/api/top-up", payload);

      if (response.status === 200) {
        if (paymentMethod === "stripe") {
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
        } else {
          message.success("Top-up request submitted!");
          resetFileState();
        }
      } else {
        message.error("Failed to process top-up request.");
      }
    } catch (error: any) {
      console.error("Top-up error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Set specific server error message
      } else {
        setError("An unexpected error occurred during top-up.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUserData) {
    return (
      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          minHeight: "100vh",
          alignItems: "center",
        }}
      >
        <Spin size="large" tip="Loading user profile..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "40px 20px" }}>
      <Card
        style={{
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
          Top-Up Your Account
        </Title>
        <Paragraph style={{ textAlign: "center", marginBottom: "40px" }}>
          Select your preferred payment method to top up your account balance.
        </Paragraph>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "20px" }}
          />
        )}

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
              {settings[SETTINGS_KEYS.STRIPE_PUBLIC_KEY] && (
                <Radio value="stripe">Stripe (Visa/PayPal)</Radio>
              )}
              <Radio value="offline">Offline (Upload Screenshot)</Radio>
            </Radio.Group>
          </Form.Item>

          {paymentMethod === "offline" && (
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
                beforeUpload={(file) => {
                  handleFileChange(file);
                  setFileList([file]);
                  return false;
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag an image to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Ensure the screenshot is clear and includes the transaction
                  details.
                </p>
              </Dragger>
            </Form.Item>
          )}

          {preview && paymentMethod === "offline" && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <Image
                src={preview}
                alt="Payment Screenshot Preview"
                width={200}
                height={200}
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
            </div>
          )}

          <Form.Item style={{ marginTop: "40px" }}>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Submit Top-up Request
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TopUpPage;
