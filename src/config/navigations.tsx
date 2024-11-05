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
  LogoutOutlined,
  LoginOutlined,
  WalletOutlined,
} from "@ant-design/icons";

import { Button, Menu } from "antd";
import { ItemType } from "antd/es/menu/interface";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { User, UserRole } from "@/models/UserModel";
interface MenuItem {
  key: string;
  icon?: string;
  label: string;
  link?: string;
  children?: MenuItem[];
}
export const iconMapper: { [key: string]: React.ReactNode } = {
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
  WalletOutlined: <WalletOutlined />,
  DashboardOutlined: <DashboardOutlined />,
  LogoutOutlined: <LogoutOutlined />,
  LoginOutlined: <LoginOutlined />,
};
export const dashboardMenuData: MenuItem[] = [
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

export const mainMenuData: MenuItem[] = [
  { key: "home", icon: "HomeOutlined", label: "Home", link: "/" },
  { key: "courses", icon: "BookOutlined", label: "Courses", link: "/courses" },
  { key: "top-up", icon: "WalletOutlined", label: "Top Up", link: "/top-up" },
];
// Common function to generate menu items for both desktop and mobile
export const generateMenuItems = (menuData) => {
  return menuData.map((menu) => {
    if (menu.children && menu.children.length > 0) {
      // For items with nested children (submenus)
      return {
        key: menu.key,
        icon: iconMapper[menu.icon || ""],
        label: <span style={{ color: "white" }}>{menu.label}</span>,
        children: menu.children.map((child) => ({
          key: child.key,
          icon: iconMapper[child.icon || ""],
          label: (
            <Link href={child.link || "#"} passHref>
              <span style={{ color: "white" }}>{child.label}</span>
            </Link>
          ),
        })),
      };
    } else {
      // For single-level items
      return {
        key: menu.key,
        icon: iconMapper[menu.icon || ""],
        label: (
          <Link href={menu.link || "#"} passHref>
            <span style={{ color: "white" }}>{menu.label}</span>
          </Link>
        ),
      };
    }
  });
};

// Desktop Menu Items
export const getDashboardMenuItems = () => generateMenuItems(dashboardMenuData);

// Mobile Menu Items - with uniform styling
export const getMobileDashboardMenuItems = (user: User) => {
  const mobileMenuData = generateMenuItems(dashboardMenuData);

  // Add additional mobile-only items if necessary (e.g., logout or profile)
  if (user) {
    mobileMenuData.push({
      key: "logout",
      icon: iconMapper["LogoutOutlined"],
      label: (
        <span onClick={() => signOut({ callbackUrl: "/" })} style={{ color: "white" }}>
          Logout
        </span>
      ),
    });
  }

  return mobileMenuData;
};

export const getMainMenuItems = () => {
  return mainMenuData.map((menu) => ({
    key: menu.key,
    icon: iconMapper[menu.icon] || null,
    label: (
      <Link href={menu.link || "#"} passHref>
        <Button type="link" style={{ padding: 0, color: "black" }}>
          {menu.label}
        </Button>
      </Link>
    ),
  }));
};

export const mobileMenuData = (user: User): MenuItem[] => [
  ...mainMenuData,
  ...(user && user.role !== UserRole.STUDENT
    ? [
        {
          key: "dashboard",
          icon: "DashboardOutlined",
          label: "Dashboard",
          link: "/dashboard",
        },
      ]
    : []),
  {
    key: "profile",
    icon: "UserOutlined",
    label: "Profile",
    link: "/profile",
  },
  user
    ? {
        key: "logout",
        icon: "LogoutOutlined",
        label: "Logout",
      }
    : {
        key: "login",
        icon: "LoginOutlined",
        label: "Login",
        link: "/login",
      },
];

export const getMobileMenuItems = (user: User) =>
  mobileMenuData(user).map((menu) => ({
    key: menu.key,
    icon: iconMapper[menu.icon || ""] || null,
    label: menu.link ? (
      <Link href={menu.link} passHref>
        <Button type="link" style={{ padding: 0, color: "black" }}>
          {menu.label}
        </Button>
      </Link>
    ) : (
      <span
        onClick={
          menu.key === "logout"
            ? () => signOut({ callbackUrl: "/" })
            : undefined
        }
      >
        <Button type="link" style={{ padding: 0, color: "black" }}>
          {menu.label}
        </Button>
      </span>
    ),
  }));
export const mobileDashboardMenuData = (user: User): MenuItem[] => [
  ...dashboardMenuData,
  {
    key: "profile",
    icon: "UserOutlined",
    label: "Profile",
    link: "/profile",
  },
  {
    key: "logout",
    icon: "LogoutOutlined",
    label: "Logout",
  },
];
