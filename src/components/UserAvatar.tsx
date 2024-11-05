import React from "react";
import { Avatar, Tooltip, Typography, Dropdown, Menu } from "antd";
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
  const menu = (
    <Menu>
      {user && user.role !== UserRole.STUDENT && (
        <Menu.Item key="dashboard">
          <Link href="/dashboard">Dashboard</Link>
        </Menu.Item>
      )}
      <Menu.Item key="profile">
        <Link href="/profile">Profile</Link>
      </Menu.Item>
      {user ? (
        <Menu.Item key="logout" onClick={handleLogout}>
          Logout
        </Menu.Item>
      ) : (
        <Menu.Item key="login">
          <Link href="/login">Login</Link>
        </Menu.Item>
      )}
    </Menu>
  );

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
            <Text type="secondary" style={{ fontSize: "14px" }}>
              {user ? `${user.pointsBalance || 0} ${currency}` : "0"}
            </Text>
          </div>
        </div>
      ) : (
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
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
              <Text type="secondary" style={{ fontSize: "14px" }}>
                {user ? `${user.pointsBalance || 0} ${currency}` : "0"}{" "}
                {/* Show points balance if user is logged in */}
              </Text>
            </div>
          </div>
        </Dropdown>
      )}
    </>
  );
};

export default UserAvatar;
