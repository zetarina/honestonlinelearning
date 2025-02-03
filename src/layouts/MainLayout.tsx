"use client";

import React, { useState } from "react";
import { Layout, Menu, Drawer, Space, Typography } from "antd";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";
import { SETTINGS_KEYS, SettingsInterface } from "@/config/settingKeys";
import UserAvatar from "../components/UserAvatar";
import SocialLinks from "../components/SocialLinks";
import { GLOBAL_SETTINGS_KEYS } from "@/config/settings/GLOBAL_SETTINGS_KEYS";
import { usePathname } from "next/navigation";

import { useUser } from "@/hooks/useUser";
import AppMenu from "@/components/navigationMenu";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { settings, xcolor } = useSettings();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [drawerVisible, setDrawerVisible] = useState(false);
  const siteSettings: SettingsInterface[typeof GLOBAL_SETTINGS_KEYS.SITE_SETTINGS] =
    settings?.[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS] ||
    ({
      siteName: "",
      siteUrl: "",
      siteBanner: "",
      siteLogo: "",
      logoBackground: "",
      useBackground: false,
    } as SettingsInterface[typeof GLOBAL_SETTINGS_KEYS.SITE_SETTINGS]);

  const siteLogo = siteSettings.siteLogo?.trim() || "/images/logo.png";
  const siteName = siteSettings.siteName?.trim() || "Site Logo";
  const logoBackground =
    siteSettings.useBackground && siteSettings.logoBackground?.trim()
      ? siteSettings.logoBackground
      : "transparent";
  const currency = settings?.[SETTINGS_KEYS.CURRENCY]?.toUpperCase() || "USD";

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

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
            // background: logoBackground,
          }}
        >
          <img
            src={siteLogo}
            alt={siteName}
            style={{
              maxHeight: "80px",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Link>

        <Space>
          {!isMobile && (
            <AppMenu
              menuMode="horizontal"
              isDashboard={false}
              isMobile={false}
            />
          )}
          <UserAvatar
            currency={currency}
            isMobile={isMobile}
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
            styles={{ body: { padding: "24px 0" } }}
          >
            <AppMenu
              menuMode="vertical"
              isDashboard={false}
              isMobile={true}
              onMenuClick={toggleDrawer}
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
        <Text style={{ color: xcolor.interface.text.default }}>
          {siteName} © {new Date().getFullYear()} All rights reserved.
        </Text>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
