"use client";

import React, { useState } from "react";
import { Form, Input, Upload, Button, message, Typography, Card, Image } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import axios from "axios";

const { Dragger } = Upload;
const { Title, Paragraph } = Typography;

const TopUpPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // For image preview

  const handleFileChange = (info: any) => {
    const file = info.file.originFileObj;
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFileBase64(base64);
      setPreview(base64); // Show the preview of the image
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (values: any) => {
    if (!session?.user) {
      message.error("You need to log in first.");
      return;
    }

    if (!fileBase64) {
      message.error("Please upload a screenshot.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/top-up", {
        amount: values.amount,
        screenshot: fileBase64,
        userId: session.user.id,
      });

      if (response.status === 200) {
        message.success("Top-up request submitted!");
        setPreview(null); // Clear the preview after successful submission
        setFileBase64(null);
      } else {
        message.error("Failed to submit top-up request.");
      }
    } catch (error) {
      console.error("Top-up error:", error);
      message.error("An error occurred during top-up.");
    } finally {
      setLoading(false);
    }
  };

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
          Securely upload your payment screenshot to top up your account balance.
        </Paragraph>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter an amount" }]}
          >
            <Input type="number" placeholder="Enter amount" />
          </Form.Item>

          <Form.Item
            label="Payment Screenshot"
            name="screenshot"
            rules={[{ required: true, message: "Please upload a screenshot" }]}
          >
            <Dragger
              name="screenshot"
              multiple={false}
              accept="image/*"
              beforeUpload={() => false} // Prevent automatic upload
              onChange={handleFileChange}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag an image to this area to upload
              </p>
              <p className="ant-upload-hint">
                Ensure the screenshot is clear and includes the transaction details.
              </p>
            </Dragger>
          </Form.Item>

          {preview && (
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
