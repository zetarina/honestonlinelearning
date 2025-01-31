"use client";

import React, { useState, useContext } from "react";
import { Layout, Menu, Drawer, Typography } from "antd";
import { DashboardOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import UserContext from "@/contexts/UserContext";
import { usePathname } from "next/navigation";
import {
  getDashboardDesktopMenu,
  getDashboardMobileMenu,
  getSelectedKey,
} from "@/config/navigations";
import { useSettings } from "@/contexts/SettingsContext";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import UserAvatar from "../components/UserAvatar";
import {
  GLOBAL_SETTINGS,
  GLOBAL_SETTINGS_KEYS,
} from "@/config/settings/GLOBAL_SETTINGS_KEYS";

const { Sider, Content, Header, Footer } = Layout;
const { Text } = Typography;
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, logout } = useContext(UserContext);
  const { settings } = useSettings();

  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const currency = settings[SETTINGS_KEYS.CURRENCY]?.toUpperCase() || "USD";
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const pathname = usePathname();
  const selectedKey = getSelectedKey(user, pathname, true);

  const handleDrawerToggle = () => setDrawerVisible(!drawerVisible);
  const handleLogout = async () => {
    await logout();
  };

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
                    src={
                      settings[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS].siteLogo
                        ? encodeURI(
                            settings[
                              GLOBAL_SETTINGS_KEYS.SITE_SETTINGS
                            ].siteLogo.trim()
                          )
                        : "/images/logo.png"
                    }
                    alt={
                      settings[
                        GLOBAL_SETTINGS_KEYS.SITE_SETTINGS
                      ].siteName?.trim() || "Site Logo"
                    }
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

          <Menu
            mode="inline"
            selectedKeys={[selectedKey || ""]}
            theme="dark"
            items={getDashboardMobileMenu(user, logout)}
            onClick={handleDrawerToggle}
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
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              paddingBlock: "1px",
            }}
          >
            <Link href="/" passHref>
              <img
                src={
                  settings[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS].siteLogo
                    ? encodeURI(
                        settings[
                          GLOBAL_SETTINGS_KEYS.SITE_SETTINGS
                        ].siteLogo.trim()
                      )
                    : "/images/logo.png"
                }
                alt={
                  settings[
                    GLOBAL_SETTINGS_KEYS.SITE_SETTINGS
                  ].siteName?.trim() || "Site Logo"
                }
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "auto",
                }}
              />
            </Link>
          </div>

          <Menu
            mode="inline"
            selectedKeys={[selectedKey || ""]}
            items={getDashboardDesktopMenu(user)}
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
          <Text style={{ fontSize: "18px", fontWeight: "bold" }}>
            {settings[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS].siteName?.trim()}
          </Text>

          <UserAvatar
            user={user}
            currency={currency}
            isMobile={isMobile}
            handleLogout={handleLogout}
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
          <Text>
            {settings[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS].siteName?.trim()} ©{" "}
            {new Date().getFullYear()} All rights reserved.
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
