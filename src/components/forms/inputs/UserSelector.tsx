import React, { useEffect, useState } from "react";
import { Select, Spin, message } from "antd";
import apiClient from "@/utils/api/apiClient";

const { Option } = Select;

interface UserSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ value, onChange }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/users");
        setUsers(response.data);
      } catch (error) {
        message.error("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="Select a user"
      notFoundContent="No users found"
    >
      {users.map((user: any) => (
        <Option key={user._id} value={user._id}>
          {user.username} - ({user.email})
        </Option>
      ))}
    </Select>
  );
};

export default UserSelector;
