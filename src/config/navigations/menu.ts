import { AppPermissionType } from "../permissions";

export interface MenuItem {
  key: string;
  icon?: string;
  label: string;
  link?: string;
  children?: MenuItem[];
  access?: (AppPermissionType | AppPermissionType[])[];
}
