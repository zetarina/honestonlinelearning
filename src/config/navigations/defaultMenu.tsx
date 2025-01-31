import { APP_PERMISSIONS } from "../permissions";
import { MenuItem } from "./menu";
export const defaultMenu: MenuItem[] = [
  {
    key: "dashboard",
    icon: "DashboardOutlined",
    label: "Dashboard",
    link: "/dashboard",
    access: [[APP_PERMISSIONS.VIEW_DASHBOARD]],
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
        access: [[APP_PERMISSIONS.MANAGE_USERS]],
      },
      {
        key: "user-list",
        label: "Users List",
        link: "/dashboard/users",
        icon: "TeamOutlined",
        access: [[APP_PERMISSIONS.MANAGE_USERS]],
      },
    ],
  },
  {
    key: "roles",
    icon: "TeamOutlined",
    label: "Roles",
    children: [
      {
        key: "create-role",
        label: "Create Role",
        link: "/dashboard/roles/create",
        icon: "UserOutlined",
        access: [[APP_PERMISSIONS.MANAGE_ROLES]],
      },
      {
        key: "role-list",
        label: "Roles List",
        link: "/dashboard/roles",
        icon: "TeamOutlined",
        access: [[APP_PERMISSIONS.MANAGE_ROLES]],
      },
    ],
  },
  {
    key: "files",
    icon: "UploadOutlined",
    label: "Files",
    children: [
      {
        key: "upload-file",
        label: "Upload File",
        link: "/dashboard/files/upload",
        icon: "UploadOutlined",
        access: [[APP_PERMISSIONS.MANAGE_FILES]],
      },
      {
        key: "files-list",
        label: "File List",
        link: "/dashboard/files",
        icon: "UploadOutlined",
        access: [[APP_PERMISSIONS.MANAGE_FILES]],
      },
    ],
  },
  {
    key: "settings",
    icon: "SettingOutlined",
    label: "Settings",
    link: "/dashboard/settings",
    access: [[APP_PERMISSIONS.EDIT_SETTINGS]],
  },
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
        access: [[APP_PERMISSIONS.MANAGE_COURSES]],
      },
      {
        key: "course-list",
        label: "Courses List",
        link: "/dashboard/courses",
        icon: "BookOutlined",
        access: [[APP_PERMISSIONS.MANAGE_COURSES]],
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
        access: [[APP_PERMISSIONS.MANAGE_ENROLLMENTS]],
      },
      {
        key: "enrollments-list",
        label: "Enrollments List",
        link: "/dashboard/enrollments",
        icon: "FileOutlined",
        access: [[APP_PERMISSIONS.MANAGE_ENROLLMENTS]],
      },
    ],
  },
  {
    key: "add-points",
    icon: "PlusOutlined",
    label: "Add Points",
    link: "/dashboard/add-points",
    access: [[APP_PERMISSIONS.ADD_POINTS]],
  },
];

export const defaultMainMenu: MenuItem[] = [
  { key: "home", icon: "HomeOutlined", label: "Home", link: "/" },
  { key: "courses", icon: "BookOutlined", label: "Courses", link: "/courses" },
  { key: "top-up", icon: "WalletOutlined", label: "Top Up", link: "/top-up" },
];
