import React from "react";
import {
  Avatar,
  Tooltip,
  Typography,
  Dropdown,
  MenuProps,
  Spin,
} from "antd";
import Link from "next/link";
import { APP_PERMISSIONS } from "@/config/permissions";
import { useUser } from "@/hooks/useUser";

const { Title, Text } = Typography;

interface UserAvatarProps {
  currency: string;
  isMobile: boolean;
  toggleDrawer: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  currency,
  isMobile,
  toggleDrawer,
}) => {
  const { user, loading, logout } = useUser();

  // Make sure to handle undefined or null values gracefully
  const menuItems: MenuProps["items"] = [
    ...(user && user.roles?.some((role) =>
      role.permissions.includes(APP_PERMISSIONS.VIEW_DASHBOARD)
    )
      ? [
          {
            key: "dashboard",
            label: <Link href="/dashboard">Dashboard</Link>,
          },
        ]
      : []),
    {
      key: "profile",
      label: <Link href="/profile">Profile</Link>,
    },
    user
      ? {
          key: "logout",
          label: <div onClick={logout}>Logout</div>,
        }
      : {
          key: "login",
          label: <Link href="/login">Login</Link>,
        },
  ];

  if (loading) {
    // Show loading state (spinner or placeholder)
    return (
      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
        <Spin size="small" />
        <div
          style={{
            marginLeft: "12px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Title level={4} style={{ margin: 0, fontSize: "14px" }}>
            Loading...
          </Title>
        </div>
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={toggleDrawer}
        >
          <Tooltip title={user ? user.username : "Guest"}>
            <Avatar src={user?.avatar || "/images/default-avatar.webp"} />
          </Tooltip>

          <div
            style={{
              marginLeft: "12px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Title level={4} style={{ margin: 0, fontSize: "14px" }}>
              {user ? user.name || user.username : "Guest"}
            </Title>
            {user && (
              <Text type="secondary" style={{ fontSize: "14px" }}>
                {`${user.pointsBalance || 0} ${currency}`}
              </Text>
            )}
          </div>
        </div>
      ) : (
        <Dropdown
          menu={{ items: menuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Tooltip title={user ? user.username : "Guest"}>
              <Avatar src={user?.avatar || "/images/default-avatar.webp"} />
            </Tooltip>

            <div
              style={{
                marginLeft: "12px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Title level={4} style={{ margin: 0, fontSize: "14px" }}>
                {user ? user.name || user.username : "Guest"}
              </Title>
              {user && (
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  {`${user.pointsBalance || 0} ${currency}`}
                </Text>
              )}
            </div>
          </div>
        </Dropdown>
      )}
    </>
  );
};

export default UserAvatar;
