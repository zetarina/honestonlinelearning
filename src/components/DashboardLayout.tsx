"use client";
import React, { useState, useContext } from "react";
import { Layout, Menu, Drawer, Avatar, Button } from "antd";
import {
  HomeOutlined,
  PlusOutlined,
  UploadOutlined,
  DashboardOutlined,
  BookOutlined,
  FormOutlined,
  PictureOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  FileOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import UserContext from "@/contexts/UserContext";
import { usePathname } from "next/navigation";

const { Sider, Content, Header, Footer } = Layout;

interface MenuItem {
  key: string;
  icon?: string;
  label: string;
  link?: string;
  children?: MenuItem[];
}

const menuData: MenuItem[] = [
  {
    key: "courses",
    icon: "BookOutlined",
    label: "Courses",
    children: [
      {
        key: "create-course",
        label: "Create Course",
        link: "/dashboard/courses/create",
        icon: "FormOutlined",
      },
      {
        key: "course-list",
        label: "Courses List",
        link: "/dashboard/courses",
        icon: "BookOutlined",
      },
    ],
  },
  {
    key: "users",
    icon: "TeamOutlined",
    label: "Users",
    children: [
      {
        key: "create-user",
        label: "Create User",
        link: "/dashboard/users/create",
        icon: "UserOutlined",
      },
      {
        key: "user-list",
        label: "Users List",
        link: "/dashboard/users",
        icon: "TeamOutlined",
      },
    ],
  },
  {
    key: "images",
    icon: "PictureOutlined",
    label: "Images",
    children: [
      {
        key: "upload-image",
        label: "Upload Image",
        link: "/dashboard/images/upload",
        icon: "UploadOutlined",
      },
      {
        key: "images-list",
        label: "Images List",
        link: "/dashboard/images",
        icon: "PictureOutlined",
      },
    ],
  },
  {
    key: "enrollments",
    icon: "FileOutlined",
    label: "Enrollments",
    children: [
      {
        key: "create-enrollment",
        label: "Create Enrollment",
        link: "/dashboard/enrollments/create",
        icon: "FormOutlined",
      },
      {
        key: "enrollments-list",
        label: "Enrollments List",
        link: "/dashboard/enrollments",
        icon: "FileOutlined",
      },
    ],
  },
  {
    key: "add-points",
    icon: "PlusOutlined",
    label: "Add Points",
    link: "/dashboard/add-points",
  },
  {
    key: "settings",
    icon: "SettingOutlined",
    label: "Settings",
    link: "/dashboard/settings",
  },
];

const iconMapper: { [key: string]: React.ReactNode } = {
  HomeOutlined: <HomeOutlined />,
  UserOutlined: <UserOutlined />,
  TeamOutlined: <TeamOutlined />,
  BookOutlined: <BookOutlined />,
  PictureOutlined: <PictureOutlined />,
  PlusOutlined: <PlusOutlined />,
  UploadOutlined: <UploadOutlined />,
  SettingOutlined: <SettingOutlined />,
  FormOutlined: <FormOutlined />,
  FileOutlined: <FileOutlined />,
};

const getMenuItems = (menuData: MenuItem[]) => {
  return menuData.map((menu) => {
    if (menu.children && menu.children.length > 0) {
      return {
        key: menu.key,
        icon: iconMapper[menu.icon || ""],
        label: <span style={{ color: "white" }}>{menu.label}</span>,
        children: menu.children.map((child) => ({
          key: child.key,
          icon: iconMapper[child.icon || ""],
          label: (
            <Link href={child.link || "#"} passHref>
              <Button type="link" style={{ padding: 0, color: "white" }}>
                {child.label}
              </Button>
            </Link>
          ),
        })),
      };
    } else {
      return {
        key: menu.key,
        icon: iconMapper[menu.icon || ""],
        label: (
          <Link href={menu.link || "#"} passHref>
            <Button type="link" style={{ padding: 0, color: "white" }}>
              {menu.label}
            </Button>
          </Link>
        ),
      };
    }
  });
};

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
            <div>Welcome, {user?.username || "User"}</div>
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
