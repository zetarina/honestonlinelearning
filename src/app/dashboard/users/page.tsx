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

import apiClient from "@/utils/api/apiClient";
import { UserAPI } from "@/models/UserModel";
import { RoleAPI } from "@/models/RoleModel";
import ProtectedPage from "@/components/loaders/ProtectedPage";
import { APP_PERMISSIONS } from "@/config/permissions";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get("/users");
        if (response.status === 200) {
          setUsers(response.data);
        } else {
          message.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("An error occurred while fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      if (response.status === 200) {
        message.success("User deleted successfully");
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        message.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("An error occurred while deleting the user");
    }
  };

  const columns: ColumnsType<UserAPI> = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      render: (text: string, record: UserAPI) => (
        <a onClick={() => router.push(`/dashboard/users/${record._id}`)}>
          {text}
        </a>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles: RoleAPI[]) => (
        <>
          {roles?.map((role) => (
            <Tag key={role._id} color={role.color || "red"}>
              {role.name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Points Balance",
      dataIndex: "pointsBalance",
      key: "pointsBalance",
      sorter: (a, b) => a.pointsBalance - b.pointsBalance,
      render: (balance: number) => <Tag color="gold">{balance}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => router.push(`/dashboard/users/${record._id}`)}
          >
            Edit
          </Button>
          <Button
            type="default"
            icon={<PlusOutlined />}
            onClick={() =>
              router.push(`/dashboard/add-points?userId=${record._id}`)
            }
          >
            Add Points
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
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
      title="Users Management"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/dashboard/users/create")}
        >
          Create User
        </Button>
      }
      style={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Input
        placeholder="Search users"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
      />
      <Table<UserAPI>
        columns={columns}
        dataSource={users.filter(
          (user) =>
            user.username.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase())
        )}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default UsersPage;
