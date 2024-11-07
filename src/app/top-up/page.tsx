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
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";

import UserContext from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useSettings } from "@/contexts/SettingsContext";
import { loadStripe } from "@stripe/stripe-js";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import apiClient from "@/utils/api/apiClient";

const { Dragger } = Upload;
const { Title, Paragraph } = Typography;

const TopUpPage: React.FC = () => {
  const { user, refreshUser } = useContext(UserContext);
  const { settings } = useSettings();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
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

  const handlePaymentMethodChange = (e: any) => {
    setPaymentMethod(e.target.value);
    resetFileState();
  };

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

  const handleRemoveFile = () => {
    resetFileState();
    message.info("Selected file has been removed.");
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
        // Removed appending userId as it's retrieved from the backend session
        formData.append("paymentMethod", paymentMethod);

        const response = await apiClient.post("/top-up", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response);
        if (response.status === 201) {
          message.success("Top-up request submitted successfully!");
          resetFileState();
        } else {
          message.error("Failed to process top-up request.");
        }
      } else if (paymentMethod === "stripe") {
        const response = await apiClient.post("/top-up", {
          amount: values.amount,
          // Removed userId as it's retrieved from the backend session
          paymentMethod: paymentMethod,
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
                  return false; // Prevent automatic upload
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

          {file && paymentMethod === "offline" && (
            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                position: "relative",
              }}
            >
              <Image
                src={preview}
                alt="Payment Screenshot Preview"
                width={200}
                height={200}
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={handleRemoveFile}
                style={{
                  position: "absolute",
                  top: 10,
                  right: "50%",
                  transform: "translateX(50%)",
                }}
              >
                Remove
              </Button>
            </div>
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
