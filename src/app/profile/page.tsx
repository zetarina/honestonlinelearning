"use client";

import React, { useState, useEffect, useContext } from "react";
import { Button, Card, Descriptions, Alert } from "antd";

import ProfileUpdateForm from "@/components/forms/ProfileUpdateForm";
import UserContext from "@/contexts/UserContext";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import SubLoader from "@/components/loaders/SubLoader";

const UserProfile: React.FC = () => {
  const { user, refreshUser } = useContext(UserContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, redirect, router]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get("/me", {
        withCredentials: true,
      });
      refreshUser();
    } catch (error: any) {
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
    fetchUserData();
  };

  if (loading) {
    return <SubLoader tip="Loading user profile..." />;
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

  if (!user) {
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
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Username">
            {user.username}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Roles">
            {user?.roles?.length
              ? user.roles.map((role) => role.name).join(", ")
              : "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Points Balance">
            {user.pointsBalance || 0}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <ProfileUpdateForm
        user={user}
        visible={isModalVisible}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default UserProfile;
