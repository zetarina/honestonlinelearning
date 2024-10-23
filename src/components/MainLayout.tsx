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
        <Link href="/" passHref legacyBehavior>
          <Text strong style={{ cursor: "pointer" }}>
            Home
          </Text>
        </Link>
      ),
    },
    {
      key: "courses",
      icon: <BookOutlined />,
      label: (
        <Link href="/courses" passHref legacyBehavior>
          <Text strong style={{ cursor: "pointer" }}>
            Courses
          </Text>
        </Link>
      ),
    },
    {
      key: "top-up",
      icon: <WalletOutlined />,
      label: (
        <Link href="/top-up" passHref legacyBehavior>
          <Text strong style={{ cursor: "pointer" }}>
            Top Up
          </Text>
        </Link>
      ),
    },
    ...(user
      ? [
          {
            key: "dashboard",
            icon: <UserOutlined />,
            label: (
              <Link href="/dashboard" passHref legacyBehavior>
                <Text strong style={{ cursor: "pointer" }}>
                  Dashboard
                </Text>
              </Link>
            ),
          },
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
            label: (
              <Link href="/login" passHref legacyBehavior>
                <Text strong style={{ cursor: "pointer" }}>
                  Login
                </Text>
              </Link>
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
          background: "#ffffff",
          justifyContent: "space-between",
          height: "100px",
          padding: "0 20px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ color: "#000", fontSize: "18px", textAlign: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/images/logo.png"
              alt={settings.siteName || "Site Logo"}
              width={150}
              height={150}
              priority
              style={{ objectFit: "contain" }}
            />
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
              theme="light"
              items={menuItems}
              style={{ background: "#ffffff", color: "#000" }}
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
          backgroundColor: "#ffffff",
          color: "#000",
          textAlign: "center",
          padding: "20px 20px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <Space size="large">
            <Link href="https://facebook.com" passHref legacyBehavior>
              <Text strong style={{ cursor: "pointer" }}>
                <FacebookOutlined style={{ marginRight: "8px" }} />
                Facebook
              </Text>
            </Link>
            <Link href="https://twitter.com" passHref legacyBehavior>
              <Text strong style={{ cursor: "pointer" }}>
                <TwitterOutlined style={{ marginRight: "8px" }} />
                Twitter
              </Text>
            </Link>
            <Link href="https://instagram.com" passHref legacyBehavior>
              <Text strong style={{ cursor: "pointer" }}>
                <InstagramOutlined style={{ marginRight: "8px" }} />
                Instagram
              </Text>
            </Link>
            <Link href="https://linkedin.com" passHref legacyBehavior>
              <Text strong style={{ cursor: "pointer" }}>
                <LinkedinOutlined style={{ marginRight: "8px" }} />
                LinkedIn
              </Text>
            </Link>
            <Link href="https://github.com" passHref legacyBehavior>
              <Text strong style={{ cursor: "pointer" }}>
                <GithubOutlined style={{ marginRight: "8px" }} />
                GitHub
              </Text>
            </Link>
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
