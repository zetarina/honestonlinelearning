// app/dashboard/enrollments/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, message, Popconfirm, Card } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

import type { ColumnsType } from "antd/es/table";
import { Enrollment } from "@/models/EnrollmentModel";
import apiClient from "@/utils/api/apiClient";

const EnrollmentsPage: React.FC = () => {
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();

  // Fetch enrollments from the API
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await apiClient.get("/enrollments");
        setEnrollments(response.data);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
        message.error("An error occurred while fetching enrollments");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Handle delete operation
  const handleDelete = async (enrollmentId: string) => {
    try {
      const response = await apiClient.delete(`/enrollments/${enrollmentId}`);
      if (response.status === 200) {
        message.success("Enrollment deleted successfully");
        setEnrollments(
          enrollments.filter((enrollment) => enrollment._id !== enrollmentId)
        );
      } else {
        message.error("Failed to delete enrollment");
      }
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      message.error("An error occurred while deleting the enrollment");
    }
  };

  // Define table columns
  const columns: ColumnsType<Enrollment> = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (text, record) =>
        record.user?.name || record.user?.username || "N/A",
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      render: (text, record) => record.course?.title || "N/A",
    },
    {
      title: "Expires At",
      dataIndex: "expires_at",
      key: "expires_at",
      render: (expiresAt) =>
        expiresAt ? new Date(expiresAt).toLocaleDateString() : "Permanent",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this enrollment?"
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
      title="Enrollments Management"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/dashboard/enrollments/create")}
        >
          Create Enrollment
        </Button>
      }
      style={{ maxWidth: "100%", margin: "0 auto" }}
    >
      <Input
        placeholder="Search enrollments"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
      />
      <Table<Enrollment>
        columns={columns}
        dataSource={enrollments.filter((enrollment) => {
          const userName =
            enrollment.user?.name || enrollment.user?.username || "";
          return userName.toLowerCase().includes(searchText.toLowerCase());
        })}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default EnrollmentsPage;
