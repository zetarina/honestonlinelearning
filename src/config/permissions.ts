import AddPointsPage from "@/app/dashboard/add-points/page";
import { User, UserAPI } from "@/models/UserModel";

export const APP_PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",
  ADMIN: "admin",
  MANAGE_COURSES: "manage_courses",
  MANAGE_ENROLLMENTS: "manage_enrollments",
  MANAGE_FILES: "manage_files",
  MANAGE_ROLES: "manage_roles",
  MANAGE_USERS: "manage_users",
  EDIT_SETTINGS: "edit_settings",
  MANAGE_PAYMENTS: "manage_payments",
  ADD_POINTS: "add_points",
  ENROLL_IN_COURSES: "enroll_in_courses",
} as const;

export type AppPermissionType =
  (typeof APP_PERMISSIONS)[keyof typeof APP_PERMISSIONS];
export const GUEST_APP_PERMISSIONS = [APP_PERMISSIONS.ENROLL_IN_COURSES];

export const ALL_PERMISSIONS = Object.values(APP_PERMISSIONS);

export const PERMISSION_GUIDE: Record<AppPermissionType, string> = {
  [APP_PERMISSIONS.VIEW_DASHBOARD]: "Allows access to the dashboard.",
  [APP_PERMISSIONS.ADMIN]:
    "Allows viewing selection values and read-only admin data.",
  [APP_PERMISSIONS.MANAGE_COURSES]:
    "Allows creating, editing, deleting, and viewing courses.",
  [APP_PERMISSIONS.MANAGE_ENROLLMENTS]:
    "Allows creating, editing, deleting, and viewing enrollments.",
  [APP_PERMISSIONS.MANAGE_FILES]: "Allows managing file uploads and storage.",
  [APP_PERMISSIONS.MANAGE_ROLES]: "Allows managing user roles and permissions.",
  [APP_PERMISSIONS.MANAGE_USERS]:
    "Allows managing users, including editing and deleting accounts.",
  [APP_PERMISSIONS.EDIT_SETTINGS]: "Allows editing global platform settings.",
  [APP_PERMISSIONS.MANAGE_PAYMENTS]:
    "Allows managing payment settings and transactions.",
  [APP_PERMISSIONS.ADD_POINTS]: "Allows adding points to user accounts.",
  [APP_PERMISSIONS.ENROLL_IN_COURSES]: "Allows enrolling users into courses.",
};

export function getPermissionGuide(permission: AppPermissionType): string {
  return PERMISSION_GUIDE[permission] || "No description available.";
}
export const hasPermission = (
  user: UserAPI | null,
  requiredPermissions: (AppPermissionType | AppPermissionType[])[]
) => {
  if (!user || !user.roles) return false;
  return requiredPermissions.some((orGroup) =>
    Array.isArray(orGroup)
      ? orGroup.every((andPerm) =>
          user.roles.some((role) => role.permissions.includes(andPerm))
        )
      : user.roles.some((role) => role.permissions.includes(orGroup))
  );
};
