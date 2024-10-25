interface MenuItem {
  key: string;
  icon?: string;
  label: string;
  link?: string;
  children?: MenuItem[];
}
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
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import { ItemType } from "antd/es/menu/interface";
import Link from "next/link";

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
};
export const menuData: MenuItem[] = [
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

export const getMenuItems = (menuData: MenuItem[]) => {
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
export const getHeaderItems = (
  handleLogout: () => Promise<void>
): ItemType[] => [
  {
    key: "profile",
    icon: <UserOutlined />,
    label: <Link href="/profile">Profile</Link>,
  },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: (
      <Button
        type="text"
        onClick={async () => await handleLogout()} // Call logout correctly
        style={{ padding: 0, width: "100%", textAlign: "left" }}
      >
        Logout
      </Button>
    ),
  },
];
