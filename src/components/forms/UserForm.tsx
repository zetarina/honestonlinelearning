"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { User } from "@/models/UserModel";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import ImageSelection from "../inputs/ImageSelection";
import DynamicMultiSelect from "../inputs/DynamicMultiSelect";

const { TextArea } = Input;

interface UserFormProps {
  user?: User;
}

const UserForm: React.FC<UserFormProps> = ({ user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        role_ids: user.roles?.map((role) => role._id) || [],
      });
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    const { password, role_ids, ...otherValues } = values;

    const userData = {
      ...otherValues,
      role_ids, // Multiple roles
      ...(password ? { password } : {}),
    };

    try {
      if (user?._id) {
        await apiClient.put(`/users/${user._id}`, userData);
        message.success("User updated successfully!");
      } else {
        await apiClient.post("/users", userData);
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

        <Form.Item label="Bio" name="bio">
          <TextArea
            rows={4}
            placeholder="Tell us a bit about yourself"
            autoComplete="off"
          />
        </Form.Item>

        <Form.Item
          label="Roles"
          name="role_ids"
          rules={[
            { required: true, message: "Please select at least one role" },
          ]}
        >
          <DynamicMultiSelect
            endpoint="/roles"
            valueKey="_id"
            labelKey="name"
            placeholder="Select roles"
            disabled={user?.roles?.some(role => role.type === "system")}
          />
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