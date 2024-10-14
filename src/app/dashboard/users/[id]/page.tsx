"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { User } from "@/models/UserModel";
import { Spin, message } from "antd";
import UserForm from "@/components/forms/UserForm";

const EditUserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/users/${userId}`);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            message.error("Failed to fetch user details");
            router.push("/dashboard/users");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          message.error("An error occurred while fetching user details");
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [userId, router]);

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "0 auto", marginTop: "100px" }}
      />
    );
  }

  return user ? <UserForm user={user} /> : null;
};

export default EditUserPage;
