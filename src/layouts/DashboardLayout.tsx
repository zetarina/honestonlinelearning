"use client";

import React, { useState } from "react";
import { Layout, Menu, Drawer, Typography } from "antd";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { usePathname } from "next/navigation";
import { useSettings } from "@/hooks/useSettings";
import { SETTINGS_KEYS, SettingsInterface } from "@/config/settingKeys";
import UserAvatar from "../components/UserAvatar";
import { GLOBAL_SETTINGS_KEYS } from "@/config/settings/GLOBAL_SETTINGS_KEYS";
import { useUser } from "@/hooks/useUser";
import AppMenu, { getSelectedKey } from "@/config/navigationMenu";

const { Sider, Content, Header, Footer } = Layout;
const { Text } = Typography;
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, logout } = useUser();

  const { settings, xcolor } = useSettings();

  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleDrawerToggle = () => setDrawerVisible(!drawerVisible);
  const handleLogout = async () => {
    logout();
  };
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

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isMobile ? (
        <Drawer
          placement="right"
          closable={false}
          styles={{
            body: { padding: 0 },
          }}
          onClose={handleDrawerToggle}
          open={drawerVisible}
          width={220}
        >
          <div
            className="logo"
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              // background: logoBackground,
            }}
          >
            <Link href="/" passHref>
              {!collapsed && (
                <div
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={siteLogo}
                    alt={siteName}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}
            </Link>
          </div>

          <AppMenu
            isDashboard={true}
            isMobile={true}
            onMenuClick={handleDrawerToggle}
          />
        </Drawer>
      ) : (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220}
          collapsedWidth={80}
          theme="dark"
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            className="logo"
            style={{
              margin: "0",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              paddingBlock: "1px",
              // background: logoBackground,
            }}
          >
            <Link href="/" passHref>
              <img
                src={siteLogo}
                alt={
                  settings?.[
                    GLOBAL_SETTINGS_KEYS.SITE_SETTINGS
                  ]?.siteName?.trim() ?? "Site Logo"
                }
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "auto",
                }}
              />
            </Link>
          </div>
          <AppMenu
            menuMode="vertical"
            isDashboard={true}
            isMobile={true}
            onMenuClick={handleDrawerToggle}
          />
        </Sider>
      )}
      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 220,
          transition: "margin-left 0.2s ease",
        }}
      >
        <Header
          style={{
            padding: isMobile ? "0 12px" : "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Text
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: xcolor.interface.text.default,
            }}
          >
            {siteName}
          </Text>
          <UserAvatar
            currency={currency}
            isMobile={isMobile}
            toggleDrawer={handleDrawerToggle}
          />
        </Header>
        <Content
          style={{
            padding: isMobile ? "12px" : "24px",
            margin: 0,
            minHeight: "calc(100vh - 134px)",

            width: "100%",
            overflow: "auto",
          }}
        >
          {children}
        </Content>
        <Footer
          style={{
            textAlign: "center",
            padding: "12px 24px",
          }}
        >
          <Text style={{ color: xcolor.interface.text.default }}>
            {siteName} © {new Date().getFullYear()} All rights reserved.
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
