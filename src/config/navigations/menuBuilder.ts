import { User } from "@/models/UserModel";
import { hasPermission } from "../permissions";
import { MenuItem } from "./menu";
import { defaultMainMenu, defaultMenu } from "./defaultMenu";
import { customMainMenu, customMenu } from "./customMenu";

export const buildMenu = (
  user: User | null,
  isDashboard: boolean
): MenuItem[] => {
  const baseMenu = isDashboard
    ? [...defaultMenu, ...customMenu]
    : [...defaultMainMenu, ...customMainMenu];
  return baseMenu
    .map((menu) => filterMenuItems(menu, user))
    .filter(Boolean) as MenuItem[];
};

const filterMenuItems = (
  menu: MenuItem,
  user: User | null
): MenuItem | null => {
  if (menu.access && !hasPermission(user, menu.access)) return null;
  if (menu.children) {
    const filteredChildren = menu.children
      .map((child) => filterMenuItems(child, user))
      .filter(Boolean) as MenuItem[];
    return filteredChildren.length > 0
      ? { ...menu, children: filteredChildren }
      : null;
  }
  return menu;
};
