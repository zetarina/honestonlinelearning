"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Card, message } from "antd";
import { User, UserRole } from "@/models/UserModel";

import ImageSelection from "./inputs/ImageSelection";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/api/apiClient";

const { Option } = Select;
const { TextArea } = Input;

interface UserFormProps {
  user?: User;
}

const UserForm: React.FC<UserFormProps> = ({ user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    setLoading(true);

    // Prepare the user payload
    const { password, ...otherValues } = values;
    const userData = {
      ...otherValues,
      ...(password ? { password } : {}), // Include password only if it's provided
    };

    try {
      if (user?._id) {
        // Update existing user
        await apiClient.put(`/users/${user._id}`, userData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        message.success("User updated successfully!");
      } else {
        // Create new user
        await apiClient.post("/users", userData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        message.success("User created successfully!");
      }

      form.resetFields();
      router.push("/dashboard/users");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to submit the form.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={user ? "Edit User" : "Create User"}
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ role: UserRole.STUDENT }}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the full name" }]}
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
            { required: true, message: "Please enter an email" },
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

        <Form.Item label="Avatar" name="avatar">
          <ImageSelection />
        </Form.Item>

        <Form.Item label="Bio" name="bio" rules={[{ required: false }]}>
          <TextArea
            rows={4}
            placeholder="Tell us a bit about yourself"
            autoComplete="off"
          />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select>
            <Option value={UserRole.STUDENT}>Student</Option>
            <Option value={UserRole.INSTRUCTOR}>Instructor</Option>
            <Option value={UserRole.ADMIN}>Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {user ? "Update User" : "Create User"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserForm;
