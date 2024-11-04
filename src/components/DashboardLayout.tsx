"use client";
import React, { useState, useContext } from "react";
import {
  Layout,
  Menu,
  Drawer,
  Avatar,
  Button,
  Dropdown,
  Space,
  Typography,
} from "antd";
import { DashboardOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import UserContext from "@/contexts/UserContext";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { getHeaderItems, getMenuItems, menuData } from "@/config/navigations";
import Image from "next/image";
import { useSettings } from "@/contexts/SettingsContext";

const { Sider, Content, Header, Footer } = Layout;
const { Text } = Typography;

const DashboardLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children}) => {
  const { user } = useContext(UserContext);
  const { settings } = useSettings();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const pathname = usePathname();
  const selectedKey = menuData
    .flatMap((item) => [item, ...(item.children || [])])
    .find((item) => pathname.startsWith(item.link || ""))?.key;
  const handleDrawerToggle = () => {
    setDrawerVisible((prevState) => !prevState);
  };
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "none" }}>
      {isMobile && (
        <Drawer
          title={settings.siteName}
          placement="left"
          closable={true}
          onClose={handleDrawerToggle}
          open={drawerVisible}
          styles={{ body: { padding: 0, backgroundColor: "#001529" } }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey || ""]}
            theme="dark"
            style={{ backgroundColor: "#001529" }}
            items={getMenuItems(menuData)}
          />
        </Drawer>
      )}
      {!isMobile && (
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
              margin: "0", // Remove outer margins
              padding: "16px 0", // Optional: add padding only on top and bottom
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              backgroundColor: "#f1f1f1",
              paddingBlock: "1px",
            }}
          >
            <Link href="/" passHref>
              {collapsed ? (
                <DashboardOutlined
                  style={{
                    fontSize: "24px",
                    color: "#fff",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%", // Ensure inner div also spans full width
                  }}
                >
                  <Image
                    src="/images/logo.png"
                    alt={settings.siteName || "Site Logo"}
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
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey || ""]}
            items={getMenuItems(menuData)}
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
            {settings.siteName}
          </div>

          {isMobile ? (
            <Avatar
              src={user?.avatar || "/images/default-avatar.png"}
              style={{ cursor: "pointer" }}
              onClick={handleDrawerToggle}
            />
          ) : (
            <Dropdown
              menu={{ items: getHeaderItems(handleLogout) }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Space style={{ cursor: "pointer" }}>
                <Avatar src={user?.avatar || "/images/default-avatar.webp"} />
                <Text>{user?.name || user?.username || "User"}</Text>
              </Space>
            </Dropdown>
          )}
        </Header>
        <Content
          style={{
            padding: isMobile ? "12px" : "24px",
            margin: 0,
            minHeight: "calc(100vh - 134px)",
            background: "#fff",
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
          ©2024 My Dashboard - All Rights Reserved
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
