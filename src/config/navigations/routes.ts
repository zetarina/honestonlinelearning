import { APP_PERMISSIONS, AppPermissionType } from "../permissions";

export const PARENT_KEYS = {
  COURSES: { key: "courses", icon: "BookOutlined", label: "Courses" },
  USERS: { key: "users", icon: "TeamOutlined", label: "Users" },
  ROLES: { key: "roles", icon: "TeamOutlined", label: "Roles" },
  FILES: { key: "files", icon: "UploadOutlined", label: "Files" },
  ENROLLMENTS: {
    key: "enrollments",
    icon: "FileOutlined",
    label: "Enrollments",
  },
} as const;

export const ROUTE_KEYS = {
  DASHBOARD: "dashboard",
  COURSE_LIST: "course-list",
  CREATE_COURSE: "create-course",
  EDIT_COURSE: "edit-course",
  USER_LIST: "user-list",
  CREATE_USER: "create-user",
  EDIT_USER: "edit-user",
  ROLES_LIST: "roles-list",
  CREATE_ROLE: "create-role",
  EDIT_ROLE: "edit-role",
  FILES_LIST: "files-list",
  UPLOAD_FILE: "upload-file",
  ENROLLMENTS_LIST: "enrollments-list",
  CREATE_ENROLLMENT: "create-enrollment",
  ADD_POINTS: "add-points",
  SETTINGS: "settings",
  HOME: "home",
  COURSES_PUBLIC: "courses-public",
  TOP_UP: "top-up",
  LOGIN: "login",
  REGISTER: "register",
  FORGOT_PASSWORD: "forgot-password",
  PROFILE: "profile",
} as const;

export type RouteKey = (typeof ROUTE_KEYS)[keyof typeof ROUTE_KEYS];

export const dashboardRoute = "/dashboard";
export type RouteConfig = {
  key: RouteKey;
  path: string;
  label?: string;
  icon?: string | null;
  access?: AppPermissionType[]; // ⬅️ Only checked if user is logged in
  loginRequired?: boolean; // ⬅️ If true, user must be logged in
  IfNotLoggedInRedirectUrl?: string; // ⬅️ Redirect when not logged in
  IfLoggedInRedirectUrl?: string; // ⬅️ Redirect when logged in (e.g., login page)
  noAccessMessage?: string; // ⬅️ Message if user lacks permissions
  exactMatch?: boolean;
};

export const ROUTES: Record<RouteKey, RouteConfig> = {
  /** 🔹 DASHBOARD */
  [ROUTE_KEYS.DASHBOARD]: {
    key: ROUTE_KEYS.DASHBOARD,
    path: dashboardRoute,
    label: "Dashboard",
    icon: "DashboardOutlined",
    access: [APP_PERMISSIONS.VIEW_DASHBOARD],
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/dashboard",
  },

  [ROUTE_KEYS.PROFILE]: {
    key: ROUTE_KEYS.PROFILE,
    path: "/profile",
    label: "Profile",
    icon: "UserOutlined",
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/profile",
  },

  [ROUTE_KEYS.COURSE_LIST]: {
    key: ROUTE_KEYS.COURSE_LIST,
    path: `${dashboardRoute}/courses`,
    label: "Courses List",
    icon: "BookOutlined",
    access: [APP_PERMISSIONS.MANAGE_COURSES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.CREATE_COURSE]: {
    key: ROUTE_KEYS.CREATE_COURSE,
    path: `${dashboardRoute}/courses/create`,
    label: "Create Course",
    icon: "FormOutlined",
    access: [APP_PERMISSIONS.MANAGE_COURSES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.EDIT_COURSE]: {
    key: ROUTE_KEYS.EDIT_COURSE,
    path: `${dashboardRoute}/courses/edit/:id`,
    label: "Edit Course",
    icon: null,
    access: [APP_PERMISSIONS.MANAGE_COURSES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    exactMatch: true,
    noAccessMessage: "You do not have permission to edit this course.",
  },

  [ROUTE_KEYS.USER_LIST]: {
    key: ROUTE_KEYS.USER_LIST,
    path: `${dashboardRoute}/users`,
    label: "Users List",
    icon: "TeamOutlined",
    access: [APP_PERMISSIONS.MANAGE_USERS, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.CREATE_USER]: {
    key: ROUTE_KEYS.CREATE_USER,
    path: `${dashboardRoute}/users/create`,
    label: "Create User",
    icon: "UserOutlined",
    access: [APP_PERMISSIONS.MANAGE_USERS, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.EDIT_USER]: {
    key: ROUTE_KEYS.EDIT_USER,
    path: `${dashboardRoute}/users/edit/:id`,
    label: "Edit User",
    icon: null,
    access: [APP_PERMISSIONS.MANAGE_USERS, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    exactMatch: true,
    noAccessMessage: "You do not have permission to edit this user.",
  },

  [ROUTE_KEYS.ROLES_LIST]: {
    key: ROUTE_KEYS.ROLES_LIST,
    path: `${dashboardRoute}/roles`,
    label: "Roles List",
    icon: "TeamOutlined",
    access: [APP_PERMISSIONS.MANAGE_ROLES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.CREATE_ROLE]: {
    key: ROUTE_KEYS.CREATE_ROLE,
    path: `${dashboardRoute}/roles/create`,
    label: "Create Role",
    icon: "FormOutlined",
    access: [APP_PERMISSIONS.MANAGE_ROLES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.EDIT_ROLE]: {
    key: ROUTE_KEYS.EDIT_ROLE,
    path: `${dashboardRoute}/roles/edit/:id`,
    label: "Edit Role",
    icon: null,
    access: [APP_PERMISSIONS.MANAGE_ROLES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    exactMatch: true,
  },

  [ROUTE_KEYS.FILES_LIST]: {
    key: ROUTE_KEYS.FILES_LIST,
    path: `${dashboardRoute}/files`,
    label: "Files List",
    icon: "FolderOutlined",
    access: [APP_PERMISSIONS.MANAGE_FILES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/dashboard/files",
    noAccessMessage: "You do not have permission to access files.",
  },
  [ROUTE_KEYS.UPLOAD_FILE]: {
    key: ROUTE_KEYS.UPLOAD_FILE,
    path: `${dashboardRoute}/files/upload`,
    label: "Upload File",
    icon: "UploadOutlined",
    access: [APP_PERMISSIONS.MANAGE_FILES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/dashboard/files/upload",
    noAccessMessage: "You do not have permission to upload files.",
  },

  [ROUTE_KEYS.ENROLLMENTS_LIST]: {
    key: ROUTE_KEYS.ENROLLMENTS_LIST,
    path: `${dashboardRoute}/enrollments`,
    label: "Enrollments List",
    icon: "FileOutlined",
    access: [APP_PERMISSIONS.MANAGE_ENROLLMENTS, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.CREATE_ENROLLMENT]: {
    key: ROUTE_KEYS.CREATE_ENROLLMENT,
    path: `${dashboardRoute}/enrollments/create`,
    label: "Create Enrollment",
    icon: "FormOutlined",
    access: [APP_PERMISSIONS.MANAGE_ENROLLMENTS, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },

  [ROUTE_KEYS.ADD_POINTS]: {
    key: ROUTE_KEYS.ADD_POINTS,
    path: `${dashboardRoute}/add-points`,
    label: "Add Points",
    icon: "PlusOutlined",
    access: [APP_PERMISSIONS.ADD_POINTS, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },

  [ROUTE_KEYS.SETTINGS]: {
    key: ROUTE_KEYS.SETTINGS,
    path: `${dashboardRoute}/settings`,
    label: "Settings",
    icon: "SettingOutlined",
    access: [APP_PERMISSIONS.EDIT_SETTINGS, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },

  [ROUTE_KEYS.HOME]: {
    key: ROUTE_KEYS.HOME,
    path: "/",
    label: "Home",
    icon: "HomeOutlined",
    loginRequired: false,
  },

  [ROUTE_KEYS.LOGIN]: {
    key: ROUTE_KEYS.LOGIN,
    path: "/login",
    IfLoggedInRedirectUrl: "/profile",
  },
  [ROUTE_KEYS.REGISTER]: {
    key: ROUTE_KEYS.REGISTER,
    path: "/signup",
    IfLoggedInRedirectUrl: "/profile",
  },

  [ROUTE_KEYS.COURSES_PUBLIC]: {
    key: ROUTE_KEYS.COURSES_PUBLIC,
    path: "/courses",
    label: "Courses",
    icon: "BookOutlined",
    loginRequired: false,
  },

  [ROUTE_KEYS.TOP_UP]: {
    key: ROUTE_KEYS.TOP_UP,
    path: "/top-up",
    label: "Top Up",
    icon: "WalletOutlined",
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/top-up",
  },

  [ROUTE_KEYS.FORGOT_PASSWORD]: {
    key: ROUTE_KEYS.FORGOT_PASSWORD,
    path: "/forget-password",
    label: "Forgot Password",
    icon: "KeyOutlined",
    IfLoggedInRedirectUrl: "/dashboard",
  },
};
