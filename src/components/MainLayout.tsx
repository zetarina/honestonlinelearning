"use client";

import React, { useState, useContext } from "react";
import { Layout, Menu, Drawer, Avatar, Space, Typography } from "antd";
import {
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
  BookOutlined,
  WalletOutlined,
  FacebookOutlined,
  GithubOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { signOut } from "next-auth/react";
import UserContext from "@/contexts/UserContext";
import Image from "next/image";
import type { MenuProps } from "antd";
import { UserRole } from "@/models/UserModel";
import MessengerChat from "./MessengerChat";
import { useSettings } from "@/contexts/SettingsContext";
import { SETTINGS_KEYS } from "@/config/settingKeys";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useContext(UserContext);
  const { settings } = useSettings();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link href="/">Home</Link>,
    },
    {
      key: "courses",
      icon: <BookOutlined />,
      label: <Link href="/courses">Courses</Link>,
    },
    {
      key: "top-up",
      icon: <WalletOutlined />,
      label: <Link href="/top-up">Top Up</Link>,
    },
    ...(user && user?.role !== UserRole.STUDENT
      ? [
          {
            key: "dashboard",
            icon: <UserOutlined />,
            label: <Link href="/dashboard">Dashboard</Link>,
          },
        ]
      : []),
    ...(user
      ? [
          {
            key: "logout",
            icon: <LogoutOutlined />,
            label: (
              <Text strong onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </Text>
            ),
          },
        ]
      : [
          {
            key: "login",
            icon: <UserOutlined />,
            label: <Link href="/login">Login</Link>,
          },
        ]),
  ].flat();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#ffffff",
          justifyContent: "space-between",
          height: "80px",
          padding: "0 20px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/images/logo.png"
            alt={settings.siteName || "Site Logo"}
            width={120}
            height={120}
            priority
            style={{ objectFit: "contain" }}
          />
        </Link>

        <Space>
          {isMobile ? (
            <>
              <Avatar
                src={user?.avatar || "/images/default-avatar.webp"}
                onClick={toggleDrawer}
                style={{ cursor: "pointer" }}
              />
              <Drawer
                title="Menu"
                placement="right"
                onClose={toggleDrawer}
                open={drawerVisible}
              >
                <Menu
                  mode="vertical"
                  items={menuItems}
                  onClick={toggleDrawer}
                />
              </Drawer>
            </>
          ) : (
            <Menu mode="horizontal" items={menuItems} />
          )}
          {!isMobile && user && (
            <Space>
              <Avatar src={user.avatar || "/images/default-avatar.webp"} />
              <Text>{user.username}</Text>
              <Text>Points: {user.pointsBalance || 0}</Text>
            </Space>
          )}
        </Space>
      </Header>

      <Content>
        <div style={{ minHeight: "360px" }}>{children}</div>
        <MessengerChat />
      </Content>

      <Footer
        style={{
          backgroundColor: "#ffffff",
          textAlign: "center",
          padding: "20px",
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Space size="large" style={{ marginBottom: "20px" }}>
          {settings[SETTINGS_KEYS.FACEBOOK_URL] && (
            <Link href={settings[SETTINGS_KEYS.FACEBOOK_URL]} target="_blank">
              <FacebookOutlined />
            </Link>
          )}
          {settings[SETTINGS_KEYS.TWITTER_URL] && (
            <Link href={settings[SETTINGS_KEYS.TWITTER_URL]} target="_blank">
              <TwitterOutlined />
            </Link>
          )}
          {settings[SETTINGS_KEYS.INSTAGRAM_URL] && (
            <Link href={settings[SETTINGS_KEYS.INSTAGRAM_URL]} target="_blank">
              <InstagramOutlined />
            </Link>
          )}
          {settings[SETTINGS_KEYS.LINKEDIN_URL] && (
            <Link href={settings[SETTINGS_KEYS.LINKEDIN_URL]} target="_blank">
              <LinkedinOutlined />
            </Link>
          )}
          {settings[SETTINGS_KEYS.GITHUB_URL] && (
            <Link href={settings[SETTINGS_KEYS.GITHUB_URL]} target="_blank">
              <GithubOutlined />
            </Link>
          )}
        </Space>
        <Text>
          {settings.siteName} ©{new Date().getFullYear()} All rights reserved.
        </Text>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
