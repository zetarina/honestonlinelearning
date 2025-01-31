"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Role } from "@/models/RoleModel";
import { message, Result, Button } from "antd";
import RoleForm from "@/components/forms/RoleForm";
import apiClient from "@/utils/api/apiClient";
import SubLoader from "@/components/loaders/SubLoader";

const EditRolePage: React.FC = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const roleId = params?.id;

  useEffect(() => {
    if (roleId) {
      const fetchRole = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await apiClient.get(`/roles/${roleId}`);
          if (response.status === 200) {
            setRole(response.data);
          } else {
            setError("Failed to fetch role details.");
          }
        } catch (error) {
          console.error("Error fetching role:", error);
          setError("An error occurred while fetching role details.");
        } finally {
          setLoading(false);
        }
      };

      fetchRole();
    } else {
      setError("Invalid role ID.");
      setLoading(false);
    }
  }, [roleId]);

  if (loading) {
    return <SubLoader tip="Loading role details..." />;
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
              onClick={() => router.push("/dashboard/roles")}
            >
              Back to Roles
            </Button>
          }
        />
      </div>
    );
  }

  return role ? (
    <RoleForm role={role} />
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
        title="No Role Found"
        subTitle="The role does not exist or has been removed."
        extra={
          <Button
            type="primary"
            onClick={() => router.push("/dashboard/roles")}
          >
            Back to Roles
          </Button>
        }
      />
    </div>
  );
};

export default EditRolePage;
