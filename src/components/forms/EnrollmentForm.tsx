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
import axios from "axios";
import { useRouter } from "next/navigation";
import { Enrollment } from "@/models/EnrollmentModel";
import dayjs from "dayjs";

const { Option } = Select;

interface EnrollmentFormProps {
  enrollment?: Enrollment;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ enrollment }) => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isPermanent, setIsPermanent] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsersAndCourses = async () => {
      try {
        const [userResponse, courseResponse] = await Promise.all([
          axios.get("/api/users"),
          axios.get("/api/courses"),
        ]);
        setUsers(userResponse.data);
        setCourses(courseResponse.data);
      } catch (error) {
        message.error("Failed to load users or courses.");
      }
    };

    fetchUsersAndCourses();
  }, []);

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
    try {
      const payload = {
        userId: values.userId,
        courseId: values.courseId,
        expires_at: values.expiresAt ? values.expiresAt.toISOString() : null,
        status: values.status,
        pointsSpent: values.pointsSpent,
        isPermanent: values.isPermanent,
      };

      const endpoint = enrollment
        ? `/api/enrollments/${enrollment._id}`
        : "/api/enrollments";

      await axios[enrollment ? "put" : "post"](endpoint, payload);

      message.success(
        enrollment
          ? "Enrollment updated successfully!"
          : "Enrollment created successfully!"
      );

      form.resetFields();
      router.push("/dashboard/enrollments");
    } catch (error: any) {
      message.error(
        error.response?.data?.error ===
          "User is already enrolled in this course"
          ? "The user is already enrolled in this course."
          : "Failed to submit the form."
      );
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
          <Select placeholder="Select a user">
            {users.map((user: any) => (
              <Option key={user._id} value={user._id}>
                {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Select Course"
          name="courseId"
          rules={[{ required: true, message: "Please select a course" }]}
        >
          <Select placeholder="Select a course">
            {courses.map((course: any) => (
              <Option key={course._id} value={course._id}>
                {course.title}
              </Option>
            ))}
          </Select>
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
