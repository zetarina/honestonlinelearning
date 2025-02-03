import React from "react";
import Link from "next/link";
import { Menu, MenuProps } from "antd";
import { useUser } from "@/hooks/useUser";
import { UserAPI } from "@/models/UserModel";
import {
  APP_PERMISSIONS,
  AppPermissionType,
  hasPermission,
} from "../config/permissions";
import { iconMapper } from "../config/navigations/IconMappter";
import { usePathname } from "next/navigation";

export interface MenuItem {
  key: string;
  icon?: string;
  label: string;
  link?: string;
  children?: MenuItem[];
  access?: AppPermissionType[];
}

const dashboardMenu: MenuItem[] = [
  {
    key: "dashboard",
    icon: "DashboardOutlined",
    label: "Dashboard",
    link: "/dashboard",
    access: [APP_PERMISSIONS.VIEW_DASHBOARD],
  },
  {
    key: "courses",
    icon: "BookOutlined",
    label: "Courses",
    access: [APP_PERMISSIONS.MANAGE_COURSES, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: "create-course",
        label: "Create Course",
        link: "/dashboard/courses/create",
        icon: "FormOutlined",
        access: [APP_PERMISSIONS.MANAGE_COURSES, APP_PERMISSIONS.ADMIN],
      },
      {
        key: "course-list",
        label: "Courses List",
        link: "/dashboard/courses",
        icon: "BookOutlined",
        access: [APP_PERMISSIONS.MANAGE_COURSES, APP_PERMISSIONS.ADMIN],
      },
    ],
  },
  {
    key: "users",
    icon: "TeamOutlined",
    label: "Users",
    access: [APP_PERMISSIONS.MANAGE_USERS, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: "create-user",
        label: "Create User",
        link: "/dashboard/users/create",
        icon: "UserOutlined",
        access: [APP_PERMISSIONS.MANAGE_USERS, APP_PERMISSIONS.ADMIN],
      },
      {
        key: "user-list",
        label: "Users List",
        link: "/dashboard/users",
        icon: "TeamOutlined",
        access: [APP_PERMISSIONS.MANAGE_USERS, APP_PERMISSIONS.ADMIN],
      },
    ],
  },
  {
    key: "roles",
    icon: "TeamOutlined",
    label: "Roles",
    access: [APP_PERMISSIONS.MANAGE_ROLES, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: "create-role",
        label: "Create Role",
        link: "/dashboard/roles/create",
        icon: "FormOutlined",
        access: [APP_PERMISSIONS.MANAGE_ROLES, APP_PERMISSIONS.ADMIN],
      },
      {
        key: "roles-list",
        label: "Roles List",
        link: "/dashboard/roles",
        icon: "TeamOutlined",
        access: [APP_PERMISSIONS.MANAGE_ROLES, APP_PERMISSIONS.ADMIN],
      },
    ],
  },
  {
    key: "files",
    icon: "UploadOutlined",
    label: "Files",
    access: [APP_PERMISSIONS.MANAGE_FILES, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: "upload-file",
        label: "Upload File",
        link: "/dashboard/files/upload",
        icon: "UploadOutlined",
        access: [APP_PERMISSIONS.MANAGE_FILES, APP_PERMISSIONS.ADMIN],
      },
      {
        key: "files-list",
        label: "File List",
        link: "/dashboard/files",
        icon: "UploadOutlined",
        access: [APP_PERMISSIONS.MANAGE_FILES, APP_PERMISSIONS.ADMIN],
      },
    ],
  },
  {
    key: "enrollments",
    icon: "FileOutlined",
    label: "Enrollments",
    access: [APP_PERMISSIONS.MANAGE_ENROLLMENTS, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: "create-enrollment",
        label: "Create Enrollment",
        link: "/dashboard/enrollments/create",
        icon: "FormOutlined",
        access: [APP_PERMISSIONS.MANAGE_ENROLLMENTS, APP_PERMISSIONS.ADMIN],
      },
      {
        key: "enrollments-list",
        label: "Enrollments List",
        link: "/dashboard/enrollments",
        icon: "FileOutlined",
        access: [APP_PERMISSIONS.MANAGE_ENROLLMENTS, APP_PERMISSIONS.ADMIN],
      },
    ],
  },

  {
    key: "add-points",
    icon: "PlusOutlined",
    label: "Add Points",
    link: "/dashboard/add-points",
    access: [APP_PERMISSIONS.ADD_POINTS, APP_PERMISSIONS.ADMIN],
  },
  {
    key: "settings",
    icon: "SettingOutlined",
    label: "Settings",
    link: "/dashboard/settings",
    access: [APP_PERMISSIONS.EDIT_SETTINGS, APP_PERMISSIONS.ADMIN],
  },
];

const mainMenu: MenuItem[] = [
  { key: "home", icon: "HomeOutlined", label: "Home", link: "/" },
  { key: "courses", icon: "BookOutlined", label: "Courses", link: "/courses" },
  { key: "top-up", icon: "WalletOutlined", label: "Top Up", link: "/top-up" },
];

const buildMenu = (
  user: UserAPI | null,
  menuConfig: MenuItem[]
): MenuItem[] => {
  const filterMenuItems = (menu: MenuItem): MenuItem | null => {
    if (menu.access && !hasPermission(user, menu.access)) return null;
    if (menu.children) {
      const filteredChildren = menu.children
        .map(filterMenuItems)
        .filter((item): item is MenuItem => item !== null);
      return filteredChildren.length > 0
        ? { ...menu, children: filteredChildren }
        : null;
    }
    return menu;
  };

  return menuConfig
    .map(filterMenuItems)
    .filter((item): item is MenuItem => item !== null);
};
const generateMenuItems = (menuData: MenuItem[]): MenuProps["items"] => {
  return menuData.map((menu) => ({
    key: menu.key,
    icon: menu.icon ? iconMapper[menu.icon] : null,
    label: menu.link ? (
      <Link href={menu.link} passHref>
        {menu.label}
      </Link>
    ) : (
      <span>{menu.label}</span>
    ),
    children: menu.children ? generateMenuItems(menu.children) : undefined,
  }));
};
export const getSelectedKey = (
  user: UserAPI | null,
  pathname: string,
  isDashboard: boolean
): string | undefined => {
  const menuData = buildMenu(user, isDashboard ? dashboardMenu : mainMenu);

  return menuData
    .flatMap((item) => [item, ...(item.children || [])])
    .find((item) => item.link === pathname)?.key;
};

interface AppMenuProps {
  menuMode?: MenuProps["mode"];
  isDashboard: boolean;
  isMobile: boolean;
  onMenuClick?: MenuProps["onClick"];
}
const AppMenu: React.FC<AppMenuProps> = ({
  menuMode = "vertical",
  isDashboard,
  isMobile,
  onMenuClick,
}) => {
  const { user, logout } = useUser();
  const pathname = usePathname();

  const menuConfig = isDashboard ? dashboardMenu : mainMenu;
  const menuItems = buildMenu(user, menuConfig);
  const items = generateMenuItems(menuItems) ?? [];

  const selectedKey = getSelectedKey(user, pathname, isDashboard);

  if (isMobile) {
    if (user) {
      items.push({
        key: "logout",
        icon: iconMapper["LogoutOutlined"],
        label: <span onClick={logout}>Logout</span>,
      });
    } else {
      items.push({
        key: "login",
        icon: iconMapper["LoginOutlined"],
        label: (
          <Link href="/login" passHref>
            Login
          </Link>
        ),
      });
    }
  }

  return (
    <Menu
      mode={menuMode}
      items={items}
      onClick={onMenuClick}
      selectedKeys={selectedKey ? [selectedKey] : []}
    />
  );
};

export default AppMenu;
