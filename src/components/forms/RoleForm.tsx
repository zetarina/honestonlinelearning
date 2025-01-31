"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Card, message, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import { Role } from "@/models/RoleModel";
import { APP_PERMISSIONS } from "@/config/permissions";

const { Option } = Select;

interface RoleFormProps {
  role?: Role;
}

const RoleForm: React.FC<RoleFormProps> = ({ role }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (role) {
      form.setFieldsValue(role);
    }
  }, [role, form]);

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      if (role?._id) {
        await apiClient.put(`/roles/${role._id}`, values);
        message.success("Role updated successfully!");
      } else {
        values.type = "custom";
        await apiClient.post("/roles", values);
        message.success("Role created successfully!");
      }

      form.resetFields();
      router.push("/dashboard/roles");
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
      title={role ? "Edit Role" : "Create Role"}
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* Role Name */}
        <Form.Item
          label="Role Name"
          name="name"
          rules={[{ required: true, message: "Please enter the role name" }]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        {/* Role Color */}
        <Form.Item
          label="Role Color"
          name="color"
          rules={[{ required: true, message: "Please select a color" }]}
        >
          <Input type="color" />
        </Form.Item>

        {/* Permissions */}
        <Form.Item
          label="Permissions"
          name="permissions"
          rules={[
            {
              required: true,
              message: "Please select at least one permission",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select permissions"
            disabled={role?.nonPermissionsEditable}
          >
            {Object.entries(APP_PERMISSIONS).map(([key, perm]) => (
              <Option key={perm} value={perm}>
                <Tooltip title={perm.replace("_", " ").toUpperCase()}>
                  {perm.replace("_", " ").toUpperCase()}
                </Tooltip>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {role ? "Update Role" : "Create Role"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RoleForm;
