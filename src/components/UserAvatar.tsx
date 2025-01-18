import React from "react";
import { Avatar, Tooltip, Typography, Dropdown, Menu, MenuProps } from "antd";
import { User, UserRole } from "@/models/UserModel";
import Link from "next/link";

const { Title, Text } = Typography;

interface UserAvatarProps {
  user: User | null; // Allow user to be null when not logged in
  currency: string;
  isMobile: boolean;
  handleLogout: () => void;
  toggleDrawer: () => void; // New prop for toggling drawer
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  currency,
  isMobile,
  handleLogout,
  toggleDrawer,
}) => {
  const menuItems: MenuProps["items"] = [
    ...(user && user.role !== UserRole.STUDENT
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
          label: <div onClick={handleLogout}>Logout</div>,
        }
      : {
          key: "login",
          label: <Link href="/login">Login</Link>,
        },
  ];

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
