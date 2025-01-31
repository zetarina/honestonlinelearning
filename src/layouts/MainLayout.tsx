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
import SocialLinks from "../components/SocialLinks";
import { GLOBAL_SETTINGS_KEYS } from "@/config/settings/GLOBAL_SETTINGS_KEYS";
import { usePathname } from "next/navigation";
import {
  getMainDesktopMenu,
  getMainMobileMenu,
  getSelectedKey,
} from "@/config/navigations";

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
  const pathname = usePathname();
  const selectedKey = getSelectedKey(user, pathname, false);

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
          justifyContent: "space-between",
          height: "80px",
          padding: "0 10px 0 0",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            background:
              settings[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS].useBackground &&
              settings[
                GLOBAL_SETTINGS_KEYS.SITE_SETTINGS
              ].logoBackground?.trim()
                ? settings[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS].logoBackground
                : "transparent",
          }}
        >
          <img
            src={
              settings[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS].siteLogo
                ? encodeURI(
                    settings[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS].siteLogo.trim()
                  )
                : "/images/logo.png"
            }
            alt={
              settings[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS].siteName?.trim() ||
              "Site Logo"
            }
            style={{
              maxHeight: "80px",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Link>

        <Space>
          {!isMobile && (
            <Menu
              style={{ marginRight: "20px" }}
              mode="horizontal"
              selectedKeys={[selectedKey || ""]}
              items={getMainDesktopMenu(user)}
            />
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
        {isMobile && (
          <Drawer
            title="Menu"
            placement="right"
            onClose={toggleDrawer}
            open={drawerVisible}
          >
            <Menu
              mode="vertical"
              items={getMainMobileMenu(user, logout)}
              selectedKeys={[selectedKey || ""]}
              onClick={toggleDrawer}
            />
          </Drawer>
        )}
        <div style={{ minHeight: "360px" }}>{children}</div>
      </Content>

      <Footer
        style={{
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
          {settings[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS].siteName?.trim()} ©{" "}
          {new Date().getFullYear()} All rights reserved.
        </Text>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
