import { APP_PERMISSIONS } from "../permissions";
import { ROUTES, ROUTE_KEYS, PARENT_KEYS } from "./routes"; // Import structured routes

export interface NavigationMenuItem {
  key: string;
  icon?: string;
  label: string;
  link?: string;
  children?: NavigationMenuItem[];
  access?: (typeof APP_PERMISSIONS)[keyof typeof APP_PERMISSIONS][];
}

// 📌 Dashboard Menu
export const dashboardMenu: NavigationMenuItem[] = [
  {
    key: ROUTE_KEYS.DASHBOARD,
    icon: ROUTES[ROUTE_KEYS.DASHBOARD].icon!,
    label: ROUTES[ROUTE_KEYS.DASHBOARD].label!,
    link: ROUTES[ROUTE_KEYS.DASHBOARD].path,
    access: ROUTES[ROUTE_KEYS.DASHBOARD].access,
  },
  {
    key: PARENT_KEYS.COURSES.key,
    icon: PARENT_KEYS.COURSES.icon!,
    label: PARENT_KEYS.COURSES.label,
    access: [APP_PERMISSIONS.MANAGE_COURSES, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: ROUTE_KEYS.CREATE_COURSE,
        label: ROUTES[ROUTE_KEYS.CREATE_COURSE].label!,
        link: ROUTES[ROUTE_KEYS.CREATE_COURSE].path,
        icon: ROUTES[ROUTE_KEYS.CREATE_COURSE].icon!,
        access: ROUTES[ROUTE_KEYS.CREATE_COURSE].access,
      },
      {
        key: ROUTE_KEYS.COURSE_LIST,
        label: ROUTES[ROUTE_KEYS.COURSE_LIST].label!,
        link: ROUTES[ROUTE_KEYS.COURSE_LIST].path,
        icon: ROUTES[ROUTE_KEYS.COURSE_LIST].icon!,
        access: ROUTES[ROUTE_KEYS.COURSE_LIST].access,
      },
    ],
  },
  {
    key: PARENT_KEYS.USERS.key,
    icon: PARENT_KEYS.USERS.icon!,
    label: PARENT_KEYS.USERS.label,
    access: [APP_PERMISSIONS.MANAGE_USERS, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: ROUTE_KEYS.CREATE_USER,
        label: ROUTES[ROUTE_KEYS.CREATE_USER].label!,
        link: ROUTES[ROUTE_KEYS.CREATE_USER].path,
        icon: ROUTES[ROUTE_KEYS.CREATE_USER].icon!,
        access: ROUTES[ROUTE_KEYS.CREATE_USER].access,
      },
      {
        key: ROUTE_KEYS.USER_LIST,
        label: ROUTES[ROUTE_KEYS.USER_LIST].label!,
        link: ROUTES[ROUTE_KEYS.USER_LIST].path,
        icon: ROUTES[ROUTE_KEYS.USER_LIST].icon!,
        access: ROUTES[ROUTE_KEYS.USER_LIST].access,
      },
    ],
  },
  {
    key: PARENT_KEYS.ROLES.key,
    icon: PARENT_KEYS.ROLES.icon!,
    label: PARENT_KEYS.ROLES.label,
    access: [APP_PERMISSIONS.MANAGE_ROLES, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: ROUTE_KEYS.CREATE_ROLE,
        label: ROUTES[ROUTE_KEYS.CREATE_ROLE].label!,
        link: ROUTES[ROUTE_KEYS.CREATE_ROLE].path,
        icon: ROUTES[ROUTE_KEYS.CREATE_ROLE].icon!,
        access: ROUTES[ROUTE_KEYS.CREATE_ROLE].access,
      },
      {
        key: ROUTE_KEYS.ROLES_LIST,
        label: ROUTES[ROUTE_KEYS.ROLES_LIST].label!,
        link: ROUTES[ROUTE_KEYS.ROLES_LIST].path,
        icon: ROUTES[ROUTE_KEYS.ROLES_LIST].icon!,
        access: ROUTES[ROUTE_KEYS.ROLES_LIST].access,
      },
    ],
  },
  {
    key: PARENT_KEYS.FILES.key,
    icon: PARENT_KEYS.FILES.icon!,
    label: PARENT_KEYS.FILES.label,
    access: [APP_PERMISSIONS.MANAGE_FILES, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: ROUTE_KEYS.UPLOAD_FILE,
        label: ROUTES[ROUTE_KEYS.UPLOAD_FILE].label!,
        link: ROUTES[ROUTE_KEYS.UPLOAD_FILE].path,
        icon: ROUTES[ROUTE_KEYS.UPLOAD_FILE].icon!,
        access: ROUTES[ROUTE_KEYS.UPLOAD_FILE].access,
      },
      {
        key: ROUTE_KEYS.FILES_LIST,
        label: ROUTES[ROUTE_KEYS.FILES_LIST].label!,
        link: ROUTES[ROUTE_KEYS.FILES_LIST].path,
        icon: ROUTES[ROUTE_KEYS.FILES_LIST].icon!,
        access: ROUTES[ROUTE_KEYS.FILES_LIST].access,
      },
    ],
  },
  {
    key: PARENT_KEYS.ENROLLMENTS.key,
    icon: PARENT_KEYS.ENROLLMENTS.icon!,
    label: PARENT_KEYS.ENROLLMENTS.label,
    access: [APP_PERMISSIONS.MANAGE_ENROLLMENTS, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: ROUTE_KEYS.CREATE_ENROLLMENT,
        label: ROUTES[ROUTE_KEYS.CREATE_ENROLLMENT].label!,
        link: ROUTES[ROUTE_KEYS.CREATE_ENROLLMENT].path,
        icon: ROUTES[ROUTE_KEYS.CREATE_ENROLLMENT].icon!,
        access: ROUTES[ROUTE_KEYS.CREATE_ENROLLMENT].access,
      },
      {
        key: ROUTE_KEYS.ENROLLMENTS_LIST,
        label: ROUTES[ROUTE_KEYS.ENROLLMENTS_LIST].label!,
        link: ROUTES[ROUTE_KEYS.ENROLLMENTS_LIST].path,
        icon: ROUTES[ROUTE_KEYS.ENROLLMENTS_LIST].icon!,
        access: ROUTES[ROUTE_KEYS.ENROLLMENTS_LIST].access,
      },
    ],
  },
  {
    key: ROUTE_KEYS.ADD_POINTS,
    icon: ROUTES[ROUTE_KEYS.ADD_POINTS].icon!,
    label: ROUTES[ROUTE_KEYS.ADD_POINTS].label!,
    link: ROUTES[ROUTE_KEYS.ADD_POINTS].path,
    access: ROUTES[ROUTE_KEYS.ADD_POINTS].access,
  },
  {
    key: ROUTE_KEYS.SETTINGS,
    icon: ROUTES[ROUTE_KEYS.SETTINGS].icon!,
    label: ROUTES[ROUTE_KEYS.SETTINGS].label!,
    link: ROUTES[ROUTE_KEYS.SETTINGS].path,
    access: ROUTES[ROUTE_KEYS.SETTINGS].access,
  },
];

// 📌 Main Public Menu
export const mainMenu: NavigationMenuItem[] = [
  {
    key: ROUTE_KEYS.HOME,
    icon: ROUTES[ROUTE_KEYS.HOME].icon!,
    label: ROUTES[ROUTE_KEYS.HOME].label!,
    link: ROUTES[ROUTE_KEYS.HOME].path,
  },
  {
    key: ROUTE_KEYS.COURSES_PUBLIC,
    icon: ROUTES[ROUTE_KEYS.COURSES_PUBLIC].icon!,
    label: ROUTES[ROUTE_KEYS.COURSES_PUBLIC].label!,
    link: ROUTES[ROUTE_KEYS.COURSES_PUBLIC].path,
  },
  {
    key: ROUTE_KEYS.TOP_UP,
    icon: ROUTES[ROUTE_KEYS.TOP_UP].icon!,
    label: ROUTES[ROUTE_KEYS.TOP_UP].label!,
    link: ROUTES[ROUTE_KEYS.TOP_UP].path,
  },
];
