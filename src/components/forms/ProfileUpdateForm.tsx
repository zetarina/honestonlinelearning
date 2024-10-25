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
  const [form] = Form.useForm(); // Create the form instance
  const [loading, setLoading] = useState(false);

  // Reset form fields whenever the modal becomes visible
  useEffect(() => {
    if (visible) {
      if (user) {
        form.setFieldsValue({
          name: user.name,
          username: user.username,
          email: user.email,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, user, form]);

  const handleCancel = () => {
    form.resetFields(); // Ensure the form is reset on cancel
    onCancel(); // Call the parent onCancel handler
  };

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const payload = { ...values };
      if (!values.password) {
        delete payload.password; // If password is empty, don't send it
      }

      await axios.put("/api/me", payload); // Make the API call

      message.success("Profile updated successfully!");
      form.resetFields(["password"]); // Clear only the password field
      if (onSuccess) {
        onSuccess(); // Trigger onSuccess callback if provided
      }
      handleCancel(); // Close the modal
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
      key={user?.id || "profile-modal"}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true} // Ensure modal is destroyed on close
      maskClosable={false}
      centered
    >
      <Form
        form={form} // Pass the form instance here
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
