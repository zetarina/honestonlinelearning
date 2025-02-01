import Link from "next/link";

import { iconMapper } from "./navigations/IconMappter";
import { MenuItem } from "./navigations/menu";
import { buildMenu } from "./navigations/menuBuilder";
import { UserAPI } from "@/models/UserModel";
import { MenuProps } from "antd";

export const generateMenuItems = (menuData: MenuItem[]): MenuProps["items"] => {
  return menuData.map((menu) => ({
    key: menu.key,
    icon: iconMapper[menu.icon || ""] ?? null,
    label: menu.link ? (
      <Link href={menu.link} passHref>
        {menu.label}
      </Link>
    ) : (
      <span>{menu.label}</span>
    ),
    children: menu.children?.length
      ? generateMenuItems(menu.children)
      : undefined,
  }));
};
export const getDashboardDesktopMenu = (user: UserAPI | null) =>
  generateMenuItems(buildMenu(user, true));

export const getDashboardMobileMenu = (
  user: UserAPI | null,
  logout: () => void
) => {
  const baseMenu = buildMenu(user, true);
  const mobileMenu = generateMenuItems(baseMenu) ?? [];
  if (user) {
    mobileMenu.push({
      key: "logout",
      icon: iconMapper["LogoutOutlined"],
      label: <span onClick={logout}>Logout</span>,
    });
  }
  return mobileMenu;
};

export const getMainDesktopMenu = (user: UserAPI | null) =>
  generateMenuItems(buildMenu(user, false));

export const getMainMobileMenu = (user: UserAPI | null, logout: () => void) => {
  const baseMenu = buildMenu(user, false);
  const mobileMenu = generateMenuItems(baseMenu) ?? [];
  if (user) {
    mobileMenu.push({
      key: "logout",
      icon: iconMapper["LogoutOutlined"],
      label: <span onClick={logout}>Logout</span>,
    });
  }
  return mobileMenu;
};
export const getSelectedKey = (
  user: UserAPI | null,
  pathname: string,
  isDashboard: boolean
) => {
  const menuData = buildMenu(user, isDashboard);

  return menuData
    .flatMap((item) => [item, ...(item.children || [])])
    .find((item) => item.link === pathname)?.key;
};
