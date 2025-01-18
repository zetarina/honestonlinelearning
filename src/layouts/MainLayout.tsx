"use client";

import React, { useState, useContext } from "react";
import { Layout, Menu, Drawer, Space, Typography, Button } from "antd";
import { useMediaQuery } from "react-responsive";
import UserContext from "@/contexts/UserContext";
import Image from "next/image";
import Link from "next/link";
import { useSettings } from "@/contexts/SettingsContext";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import UserAvatar from "../components/UserAvatar";
import { getMainMenuItems, getMobileMenuItems } from "@/config/navigations";
import SocialLinks from "../components/SocialLinks";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useContext(UserContext);
  const { settings } = useSettings();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [drawerVisible, setDrawerVisible] = useState(false);

  const currency = settings[SETTINGS_KEYS.CURRENCY]?.toUpperCase() || "USD";
  const toggleDrawer = () => setDrawerVisible(!drawerVisible);
  const handleLogout = async () => {
    await logout();
  };

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
          borderBottom: "1px solid #f1f1f1",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={
              settings[SETTINGS_KEYS.SITE_LOGO]
                ? encodeURI(settings[SETTINGS_KEYS.SITE_LOGO].trim())
                : "/images/logo.png"
            }
            alt={settings[SETTINGS_KEYS.SITE_NAME]?.trim() || "Site Logo"}
            width={120}
            height={120}
            priority
            style={{ objectFit: "contain" }}
          />
        </Link>

        <Space>
          {isMobile ? (
            <Drawer
              title="Menu"
              placement="right"
              onClose={toggleDrawer}
              open={drawerVisible}
            >
              <Menu
                mode="vertical"
                items={getMobileMenuItems(user, logout)}
                onClick={toggleDrawer}
              />
            </Drawer>
          ) : (
            <Menu mode="horizontal" items={getMainMenuItems()} />
          )}
          <UserAvatar
            user={user}
            currency={currency}
            isMobile={isMobile}
            handleLogout={handleLogout}
            toggleDrawer={toggleDrawer}
          />
        </Space>
      </Header>

      <Content>
        <div style={{ minHeight: "360px" }}>{children}</div>
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
          <SocialLinks settings={settings} />
        </Space>
        <Text>
          {settings[SETTINGS_KEYS.SITE_NAME]?.trim()} ©{" "}
          {new Date().getFullYear()} All rights reserved.
        </Text>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
