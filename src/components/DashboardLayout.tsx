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
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import UserContext from "@/contexts/UserContext";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { getHeaderItems, getMenuItems, menuData } from "@/config/navigations";

const { Sider, Content, Header, Footer } = Layout;
const { Text } = Typography;

const DashboardLayout: React.FC<{
  children: React.ReactNode;
  settings: Record<string, any>;
}> = ({ children, settings }) => {
  const { user } = useContext(UserContext);
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
              height: "64px",
              margin: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "center",
              transition: "all 0.2s",
              cursor: "pointer",
              padding: "0 16px",
            }}
          >
            <Link href="/" passHref>
              <Button
                type="link"
                aria-label="Go to Home"
                style={{ padding: 0 }}
              >
                {collapsed ? (
                  <DashboardOutlined
                    style={{ fontSize: "24px", color: "#fff" }}
                  />
                ) : (
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "18px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {settings.siteName}
                  </span>
                )}
              </Button>
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
