import React from "react";
import { Table, Button, Popconfirm, Space } from "antd";
import { Setting } from "@/models/SettingModel";

interface SettingsTableProps {
  settings: Setting[];
  loading: boolean;
  onEdit: (setting: Setting) => void;
  onDelete: (id: string) => void;
  onOpenModal: () => void;
}

const SettingsTable: React.FC<SettingsTableProps> = ({
  settings,
  loading,
  onEdit,
  onDelete,
  onOpenModal,
}) => {
  const columns = [
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Environment",
      dataIndex: "environment",
      key: "environment",
    },
    {
      title: "Public",
      dataIndex: "isPublic",
      key: "isPublic",
      render: (isPublic: boolean) => (isPublic ? "Yes" : "No"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Setting) => (
        <Space>
          <Button onClick={() => onEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this setting?"
            onConfirm={() => onDelete(record._id as string)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <Table bordered dataSource={settings} columns={columns} rowKey="_id" loading={loading} />;
};

export default SettingsTable;
