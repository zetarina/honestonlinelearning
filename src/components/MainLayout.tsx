"use client";

import React, { useState, useContext } from "react";
import { Layout, Menu, Drawer, Avatar, Space, Typography, Button } from "antd";
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

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
  settings: Record<string, any>;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, settings }) => {
  const { user } = useContext(UserContext);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };
  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: (
        <Button type="link" href="/" style={{ padding: 0 }}>
          Home
        </Button>
      ),
    },
    {
      key: "courses",
      icon: <BookOutlined />,
      label: (
        <Button type="link" href="/courses" style={{ padding: 0 }}>
          Courses
        </Button>
      ),
    },
    {
      key: "top-up",
      icon: <WalletOutlined />,
      label: (
        <Button type="link" href="/top-up" style={{ padding: 0 }}>
          Top Up
        </Button>
      ),
    },
    ...(user
      ? [
          {
            key: "dashboard",
            icon: <UserOutlined />,
            label: (
              <Button type="link" href="/dashboard" style={{ padding: 0 }}>
                Dashboard
              </Button>
            ),
          },
          {
            key: "logout",
            icon: <LogoutOutlined />,
            label: (
              <Button type="link" onClick={handleLogout} style={{ padding: 0 }}>
                Logout
              </Button>
            ),
          },
        ]
      : [
          {
            key: "login",
            icon: <UserOutlined />,
            label: (
              <Button type="link" href="/login" style={{ padding: 0 }}>
                Login
              </Button>
            ),
          },
        ]),
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          background: "#ffffff", // Set background to white
          justifyContent: "space-between",
          height: "100px",
          padding: "0 20px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Add shadow to give depth
        }}
      >
        <div style={{ color: "#000", fontSize: "18px", textAlign: "center" }}>
          <Link href="/" passHref>
            <a style={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/images/logo.png"
                alt={settings.siteName || "Site Logo"}
                width={150}
                height={150}
                priority
                style={{ objectFit: "contain" }}
              />
            </a>
          </Link>
        </div>

        <Space>
          {isMobile ? (
            <>
              <Avatar
                src={user?.avatar || "/images/default-avatar.webp"}
                onClick={toggleDrawer}
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
            <Menu
              mode="horizontal"
              theme="light" // Set theme to light for white background
              items={menuItems}
              style={{ background: "#ffffff", color: "#000" }} // Set menu text color
            />
          )}
          {!isMobile && user && (
            <Space>
              <Avatar src={user?.avatar || "/images/default-avatar.webp"} />
              <Text style={{ color: "#000" }}>{user.username}</Text>
              <Text style={{ color: "#000" }}>
                Points: {user.pointsBalance || 0}
              </Text>
            </Space>
          )}
        </Space>
      </Header>

      <Content>
        <div style={{ minHeight: 360 }}>{children}</div>
      </Content>

      <Footer
        style={{
          backgroundColor: "#ffffff", // Light background color for footer
          color: "#000", // Dark text color for footer
          textAlign: "center",
          padding: "20px 20px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <Space size="large">
            <Button
              type="link"
              href="https://facebook.com"
              icon={<FacebookOutlined />}
              target="_blank"
              style={{ color: "#000" }}
            />
            <Button
              type="link"
              href="https://twitter.com"
              icon={<TwitterOutlined />}
              target="_blank"
              style={{ color: "#000" }}
            />
            <Button
              type="link"
              href="https://instagram.com"
              icon={<InstagramOutlined />}
              target="_blank"
              style={{ color: "#000" }}
            />
            <Button
              type="link"
              href="https://linkedin.com"
              icon={<LinkedinOutlined />}
              target="_blank"
              style={{ color: "#000" }}
            />
            <Button
              type="link"
              href="https://github.com"
              icon={<GithubOutlined />}
              target="_blank"
              style={{ color: "#000" }}
            />
          </Space>
        </div>

        <div>
          <Text style={{ color: "#000" }}>
            {settings.siteName} ©{new Date().getFullYear()} All rights reserved.
          </Text>
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
