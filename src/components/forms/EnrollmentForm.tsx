"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Select,
  DatePicker,
  InputNumber,
  message,
  Card,
  Checkbox,
} from "antd";

import { useRouter } from "next/navigation";
import { EnrollmentAPI } from "@/models/EnrollmentModel";
import dayjs from "dayjs";
import apiClient from "@/utils/api/apiClient";
import CourseSelector from "../inputs/CourseSelector";
import UserSelector from "../inputs/UserSelector";

const { Option } = Select;

interface EnrollmentFormProps {
  enrollment?: EnrollmentAPI;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ enrollment }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isPermanent, setIsPermanent] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (enrollment) {
      form.setFieldsValue({
        userId: enrollment.user_id,
        courseId: enrollment.course_id,
        expiresAt: enrollment.expires_at ? dayjs(enrollment.expires_at) : null,
        status: enrollment.status,
        pointsSpent: enrollment.pointsSpent,
        isPermanent: enrollment.isPermanent,
      });
      setIsPermanent(enrollment.isPermanent);
    }
  }, [enrollment, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const { expiresAt, ...otherValues } = values;
    const enrollmentData = {
      ...otherValues,
      expires_at: expiresAt ? expiresAt.toISOString() : null,
    };

    try {
      if (enrollment?._id) {
        // Update existing enrollment
        await apiClient.put(`/enrollments/${enrollment._id}`, enrollmentData);
        message.success("Enrollment updated successfully!");
      } else {
        // Create new enrollment
        await apiClient.post("/enrollments", enrollmentData);
        message.success("Enrollment created successfully!");
      }

      form.resetFields();
      router.push("/dashboard/enrollments");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ===
        "User is already enrolled in this course"
          ? "The user is already enrolled in this course."
          : "Failed to submit the form.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={enrollment ? "Edit Enrollment" : "Create Enrollment"}
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Select User"
          name="userId"
          rules={[{ required: true, message: "Please select a user" }]}
        >
          <UserSelector />
        </Form.Item>

        <Form.Item
          label="Select Course"
          name="courseId"
          rules={[{ required: true, message: "Please select a course" }]}
        >
          <CourseSelector />
        </Form.Item>

        <Form.Item name="isPermanent" valuePropName="checked">
          <Checkbox onChange={(e) => setIsPermanent(e.target.checked)}>
            Permanent Enrollment
          </Checkbox>
        </Form.Item>

        <Form.Item
          label="Points Spent"
          name="pointsSpent"
          rules={[{ required: true, message: "Please enter points spent" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select placeholder="Select status">
            <Option value="active">Active</Option>
            <Option value="completed">Completed</Option>
            <Option value="expired">Expired</Option>
          </Select>
        </Form.Item>

        {!isPermanent && (
          <Form.Item label="Expiration Date" name="expiresAt">
            <DatePicker style={{ width: "100%" }} showTime />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {enrollment ? "Update Enrollment" : "Create Enrollment"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EnrollmentForm;
