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
  Select,
} from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

const { Text } = Typography;
const { Option } = Select;

interface User {
  _id: string;
  username: string;
  email: string;
}

const AddPointsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        if (response.status === 200) {
          setUsers(response.data);
        } else {
          message.error("Failed to fetch users.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("An error occurred while fetching users.");
      }
    };

    fetchUsers();
  }, []);

  const onFinish = (values: any) => {
    setFormValues(values);
    setConfirmationVisible(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setConfirmationVisible(false);

    try {
      const { userId, points, reason } = formValues;
      const response = await axios.post("/api/add-points", {
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
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Select User"
            name="userId"
            rules={[{ required: true, message: "Please select a user!" }]}
          >
            <Select
              placeholder="Select a user"
              showSearch
              optionFilterProp="children"
            >
              {users.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.username} ({user.email})
                </Option>
              ))}
            </Select>
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
          {users.find((u) => u._id === formValues?.userId)?.username} (
          {users.find((u) => u._id === formValues?.userId)?.email})
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
