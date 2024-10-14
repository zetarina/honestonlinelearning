"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Descriptions, Spin, Alert } from "antd";
import axios from "axios";
import { User } from "@/models/UserModel";
import ProfileUpdateForm from "@/components/forms/ProfileUpdateForm";

const UserProfile: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/me", { withCredentials: true });
      setCurrentUser(data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user data.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSuccess = () => {
    setIsModalVisible(false);
    fetchUserData(); // Refresh user data after update
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin size="large" tip="Loading user profile...">
                    <div style={{ height: "100px" }}></div>
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: "50px auto" }}>
        <Alert message="Error" description={error} type="error" showIcon />
        <Button
          type="primary"
          onClick={fetchUserData}
          style={{ marginTop: 20 }}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div style={{ maxWidth: 600, margin: "50px auto" }}>
        <Alert
          message="User Not Found"
          description="No user data available."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <Card
        title="User Profile"
        extra={
          <Button type="primary" onClick={showModal}>
            Edit Profile
          </Button>
        }
        style={{
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
        styles={{
          body: {
            padding: "20px 40px",
          },
        }}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Name">{currentUser.name}</Descriptions.Item>
          <Descriptions.Item label="Username">
            {currentUser.username}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {currentUser.email}
          </Descriptions.Item>
          <Descriptions.Item label="Role">{currentUser.role}</Descriptions.Item>
          <Descriptions.Item label="Points Balance">
            {currentUser.pointsBalance || 0}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <ProfileUpdateForm
        user={currentUser}
        visible={isModalVisible}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default UserProfile;
