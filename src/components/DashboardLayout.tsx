"use client";

import React, { useState, useContext } from "react";
import { Layout, Menu, Drawer } from "antd";
import { DashboardOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import UserContext from "@/contexts/UserContext";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  getMobileDashboardMenuItems,
  dashboardMenuData,
  getDashboardMenuItems,
} from "@/config/navigations";
import Image from "next/image";
import { useSettings } from "@/contexts/SettingsContext";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import UserAvatar from "./UserAvatar";

const { Sider, Content, Header, Footer } = Layout;

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useContext(UserContext);
  const { settings } = useSettings();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const currency = settings[SETTINGS_KEYS.CURRENCY]?.toUpperCase() || "USD";
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const pathname = usePathname();
  const selectedKey = dashboardMenuData
    .flatMap((item) => [item, ...(item.children || [])])
    .find((item) => pathname.startsWith(item.link || ""))?.key;

  const handleDrawerToggle = () => setDrawerVisible(!drawerVisible);
  const handleLogout = async () => await signOut({ callbackUrl: "/" });

  return (
    <Layout style={{ minHeight: "100vh", background: "none" }}>
      {isMobile ? (
        <Drawer
          placement="right"
          closable={false}
          onClose={handleDrawerToggle}
          open={drawerVisible}
          styles={{
            body: { padding: 2, backgroundColor: "#001529" },
            header: {
              backgroundColor: "#001529",
              borderBottom: "1px solid #ffffff",
            },
          }}
          width={220}
        >
          <div
            className="logo"
            style={{
              margin: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Link href="/" passHref>
              {!collapsed && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Image
                    src="/images/logo.png"
                    alt={
                      settings[SETTINGS_KEYS.SITE_NAME]?.trim() || "Site Logo"
                    }
                    width={240}
                    height={96}
                    priority
                    style={{
                      objectFit: "contain",
                      maxWidth: "200px",
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
            style={{
              backgroundColor: "#001529",
              color: "#ffffff",
              padding: "16px 0",
            }}
            items={getMobileDashboardMenuItems(user)}
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
            backgroundColor: "#001529",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            className="logo"
            style={{
              margin: "0",
              padding: "16px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              backgroundColor: "#FFFFFF",
              border: "6px solid #001529",
              paddingBlock: "1px",
            }}
          >
            <Link href="/" passHref>
              {collapsed ? (
                <DashboardOutlined
                  style={{ fontSize: "24px", color: "#001529" }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Image
                    src="/images/logo.png"
                    alt={
                      settings[SETTINGS_KEYS.SITE_NAME]?.trim() || "Site Logo"
                    }
                    width={240}
                    height={96}
                    priority
                    style={{
                      objectFit: "contain",
                      marginRight: "10px",
                      maxWidth: "200px",
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
            style={{
              backgroundColor: "#001529",
              color: "#ffffff",
            }}
            items={getDashboardMenuItems()}
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
            backgroundColor: "#fff",
            padding: isMobile ? "0 12px" : "0 24px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
            {settings[SETTINGS_KEYS.SITE_NAME]?.trim()}
          </div>

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
            background: "#fff",
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
            backgroundColor: "#fff",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          {settings[SETTINGS_KEYS.SITE_NAME]?.trim()} ©{" "}
          {new Date().getFullYear()} All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
