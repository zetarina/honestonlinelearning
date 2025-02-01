"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Card,
  Modal,
  Typography,
} from "antd";

import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import UserSelector from "@/components/inputs/UserSelector";

const { Text } = Typography;

const AddPointsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get("userId");
    const points = searchParams.get("points");
    const reason = searchParams.get("reason");

    const initialValues: any = {};
    if (userId) initialValues.userId = userId;
    if (points) initialValues.points = parseInt(points, 10);
    if (reason) initialValues.reason = reason;

    form.setFieldsValue(initialValues);
  }, [searchParams, form]);

  const onFinish = (values: any) => {
    setFormValues(values);
    setConfirmationVisible(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setConfirmationVisible(false);

    try {
      const { userId, points, reason } = formValues;
      const response = await apiClient.post("/add-points", {
        userId,
        points,
        reason,
      });

      if (response.status === 200) {
        message.success(`Successfully added ${points} points to the user.`);
        router.push("/dashboard/users");
      } else {
        message.error(response.data.error || "Failed to add points.");
      }
    } catch (error) {
      console.error("Error adding points:", error);
      message.error("An error occurred while adding points. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setConfirmationVisible(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
      <Card
        title="Add Points to User"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Select User"
            name="userId"
            rules={[{ required: true, message: "Please select a user!" }]}
          >
            <UserSelector />
          </Form.Item>

          <Form.Item
            label="Points"
            name="points"
            rules={[{ required: true, message: "Please input the points!" }]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Enter points to add"
            />
          </Form.Item>

          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: "Please provide a reason!" }]}
          >
            <Input.TextArea placeholder="Enter the reason for adding points" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Add Points
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        title="Confirm Add Points"
        open={confirmationVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
        confirmLoading={loading}
      >
        <Text>Are you sure you want to add the following points?</Text>
        <div style={{ marginTop: "16px" }}>
          <Text strong>User:</Text>{" "}
          {formValues && formValues.userId && <Text>{formValues.userId}</Text>}
        </div>
        <div>
          <Text strong>Points:</Text> {formValues?.points}
        </div>
        <div>
          <Text strong>Reason:</Text> {formValues?.reason}
        </div>
        <Text type="danger" style={{ display: "block", marginTop: "16px" }}>
          This action cannot be reverted!
        </Text>
      </Modal>
    </div>
  );
};

export default AddPointsPage;
