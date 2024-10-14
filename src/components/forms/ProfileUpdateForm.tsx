"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Modal } from "antd";
import axios from "axios";
import { User } from "@/models/UserModel";

interface ProfileUpdateFormProps {
  user: User;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({
  user,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        username: user.username,
        email: user.email,
      });
    } else {
      form.resetFields();
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const payload = { ...values };
      if (!values.password) {
        delete payload.password;
      }

      await axios.put("/api/me", payload);

      message.success("Profile updated successfully!");
      form.resetFields(["password"]);
      if (onSuccess) {
        onSuccess();
      }
      onCancel();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update the profile";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      maskClosable={false}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter a username" }]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input.Password
            placeholder="Leave blank to keep the current password"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProfileUpdateForm;
