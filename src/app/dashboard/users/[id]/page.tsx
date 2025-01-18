"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { User } from "@/models/UserModel";
import { message, Result, Button } from "antd";
import UserForm from "@/components/forms/UserForm";
import apiClient from "@/utils/api/apiClient";
import SubLoader from "@/components/loaders/SubLoader";

const EditUserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        setLoading(true);
        setError(null); // Reset error state
        try {
          const response = await apiClient.get(`/users/${userId}`);
          if (response.status === 200) {
            const userData = response.data;
            setUser(userData);
          } else {
            setError("Failed to fetch user details.");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setError("An error occurred while fetching user details.");
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    } else {
      setError("Invalid user ID.");
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return <SubLoader tip="Loading user details..." />;
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Result
          status="error"
          title="Error"
          subTitle={error}
          extra={
            <Button
              type="primary"
              onClick={() => router.push("/dashboard/users")}
            >
              Back to Users
            </Button>
          }
        />
      </div>
    );
  }

  return user ? (
    <UserForm user={user} />
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Result
        status="warning"
        title="No User Found"
        subTitle="The user does not exist or has been removed."
        extra={
          <Button
            type="primary"
            onClick={() => router.push("/dashboard/users")}
          >
            Back to Users
          </Button>
        }
      />
    </div>
  );
};

export default EditUserPage;
