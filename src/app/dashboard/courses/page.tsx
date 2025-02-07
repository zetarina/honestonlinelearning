// /app/dashboard/courses/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  message,
  Popconfirm,
  Card,
  Tag,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import type { ColumnsType } from "antd/es/table";
import { CourseAPI } from "@/models/CourseModel";
import apiClient from "@/utils/api/apiClient";
import { User } from "@/models/UserModel";
import { useSettings } from "@/hooks/useSettings";
import { SETTINGS_KEYS } from "@/config/settingKeys";

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();
  const { settings } = useSettings();
  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.get("/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        message.error("An error occurred while fetching courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle delete operation
  const handleDelete = async (courseId: string) => {
    try {
      const response = await apiClient.delete(`/courses/${courseId}`);
      if (response.status === 200) {
        message.success("Course deleted successfully");
        setCourses(courses.filter((course) => course._id !== courseId));
      } else {
        message.error("Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      message.error("An error occurred while deleting the course");
    }
  };

  // Define table columns
  const columns: ColumnsType<CourseAPI> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text: string, record: CourseAPI) => (
        <a onClick={() => router.push(`/dashboard/courses/${record._id}`)}>
          {text}
        </a>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Programming", value: "programming" },
        { text: "Design", value: "design" },
      ],
      onFilter: (value, record) => record.category.includes(value as string),
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price: number) =>
        `${price.toFixed(2)}  ${settings[SETTINGS_KEYS.CURRENCY]}`,
    },
    {
      title: "Instructor",
      dataIndex: "instructor",
      key: "instructor",
      render: (instructor: User) => (
        <Tag color="gray">
          {instructor?.name
            ? `${instructor?.name} (${instructor?.username})`
            : "N/A"}
        </Tag>
      ),
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      filters: [
        { text: "Beginner", value: "beginner" },
        { text: "Intermediate", value: "intermediate" },
        { text: "Advanced", value: "advanced" },
      ],
      onFilter: (value, record) => record.level.includes(value as string),
      render: (level: string) => (
        <Tag color="red" style={{ textTransform: "capitalize" }}>
          {level}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => router.push(`/dashboard/courses/${record._id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this course?"
            onConfirm={() => handleDelete(record._id.toString())}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Courses Management"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/dashboard/courses/create")}
        >
          Create Course
        </Button>
      }
      style={{ maxWidth: "100%", margin: "0 auto" }}
    >
      <Input
        placeholder="Search courses"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
      />
      <Table<CourseAPI>
        columns={columns}
        dataSource={courses.filter((course) =>
          course.title.toLowerCase().includes(searchText.toLowerCase())
        )}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default CoursesPage;
