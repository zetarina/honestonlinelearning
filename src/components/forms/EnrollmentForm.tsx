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
  Radio,
  Row,
  Col,
} from "antd";
import axios from "axios";
import moment from "moment";
import { Enrollment } from "@/models/EnrollmentModel";
import { DurationType } from "@/models/CourseModel";
import { useRouter } from "next/navigation";

const { Option } = Select;

interface EnrollmentFormProps {
  enrollment?: Enrollment;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ enrollment }) => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isPermanent, setIsPermanent] = useState(false);
  const [expirationMethod, setExpirationMethod] = useState<"duration" | "date">(
    "duration"
  );
  const router = useRouter(); // Initialize useRouter

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
        expiresAt: enrollment.expires_at ? moment(enrollment.expires_at) : null,
        isPermanent: !enrollment.expires_at,
        durationType: enrollment.expires_at ? DurationType.DAY : null,
        durationCount: enrollment.expires_at ? 1 : null,
      });
      setIsPermanent(!enrollment.expires_at);
    }
  }, [enrollment, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (
        !isPermanent &&
        expirationMethod === "duration" &&
        (!values.durationType || !values.durationCount)
      ) {
        message.error("Please select a valid duration type and count.");
        setLoading(false);
        return;
      }
      if (!isPermanent && expirationMethod === "date" && !values.expiresAt) {
        message.error("Please select a valid expiration date.");
        setLoading(false);
        return;
      }

      const payload = {
        ...values,
        expiresAt: isPermanent
          ? null
          : expirationMethod === "date"
          ? values.expiresAt
          : null,
        durationType:
          expirationMethod === "duration" ? values.durationType : null,
        durationCount:
          expirationMethod === "duration" ? values.durationCount : null,
      };

      if (enrollment) {
        await axios.put(`/api/enrollments/${enrollment._id}`, payload);
        message.success("Enrollment updated successfully!");
      } else {
        try {
          await axios.post("/api/enrollments", payload);
          message.success("Enrollment created successfully!");
        } catch (error: any) {
          if (
            error.response?.data?.error ===
            "User is already enrolled in this course"
          ) {
            message.error("The user is already enrolled in this course.");
          } else {
            message.error("Failed to create enrollment.");
          }
        }
      }

      form.resetFields();

      // Redirect to the enrollments dashboard after success
      router.push("/dashboard/enrollments");
    } catch (error) {
      message.error("Failed to submit the form.");
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

        {!isPermanent && (
          <>
            <Form.Item label="Choose Expiration Method" name="expirationMethod">
              <Radio.Group
                onChange={(e) => setExpirationMethod(e.target.value)}
                value={expirationMethod}
              >
                <Radio value="duration">Duration Type & Count</Radio>
                <Radio value="date">Specific Expiration Date</Radio>
              </Radio.Group>
            </Form.Item>

            {expirationMethod === "duration" && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Duration Type"
                    name="durationType"
                    rules={[
                      {
                        required: true,
                        message: "Please select a duration type",
                      },
                    ]}
                  >
                    <Select placeholder="Select duration type">
                      <Option value={DurationType.DAY}>Day</Option>
                      <Option value={DurationType.WEEK}>Week</Option>
                      <Option value={DurationType.MONTH}>Month</Option>
                      <Option value={DurationType.YEAR}>Year</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Duration Count"
                    name="durationCount"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the duration count",
                      },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      placeholder="Enter count (e.g. 1 for one day)"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}

            {expirationMethod === "date" && (
              <Form.Item
                label="Expiration Date"
                name="expiresAt"
                rules={[
                  {
                    required: true,
                    message: "Please select an expiration date",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Select expiration date"
                  showTime
                />
              </Form.Item>
            )}
          </>
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
