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
    { key: "home", icon: <HomeOutlined />, label: <Link href="/">Home</Link> },
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
    ...(user
      ? [
          {
            key: "dashboard",
            icon: <UserOutlined />,
            label: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            key: "logout",
            icon: <LogoutOutlined />,
            label: <span onClick={handleLogout}>Logout</span>,
          },
        ]
      : [
          {
            key: "login",
            icon: <UserOutlined />,
            label: <Link href="/login">Login</Link>,
          },
        ]),
  ];

  console.log("Menu Items:", menuItems);

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
                Points: {user?.pointsBalance || 0}
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
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="link"
                icon={<FacebookOutlined />}
                style={{ color: "#000" }}
              />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="link"
                icon={<TwitterOutlined />}
                style={{ color: "#000" }}
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="link"
                icon={<InstagramOutlined />}
                style={{ color: "#000" }}
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="link"
                icon={<LinkedinOutlined />}
                style={{ color: "#000" }}
              />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="link"
                icon={<GithubOutlined />}
                style={{ color: "#000" }}
              />
            </a>
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
