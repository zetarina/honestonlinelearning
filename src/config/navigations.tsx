import Link from "next/link";

import { iconMapper } from "./navigations/IconMappter";
import { MenuItem } from "./navigations/menu";
import { buildMenu } from "./navigations/menuBuilder";
import { User } from "@/models/UserModel";

export const generateMenuItems = (menuData: MenuItem[]) => {
  return menuData.map((menu) => ({
    key: menu.key,
    icon: iconMapper[menu.icon || ""],
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

export const getDashboardDesktopMenu = (user: User | null) =>
  generateMenuItems(buildMenu(user, true));

export const getDashboardMobileMenu = (
  user: User | null,
  logout: () => void
) => {
  const baseMenu = buildMenu(user, true);
  const mobileMenu = generateMenuItems(baseMenu);
  if (user) {
    mobileMenu.push({
      key: "logout",
      icon: iconMapper["LogoutOutlined"],
      label: <span onClick={logout}>Logout</span>,
    });
  }
  return mobileMenu;
};

export const getMainDesktopMenu = (user: User | null) =>
  generateMenuItems(buildMenu(user, false));

export const getMainMobileMenu = (user: User | null, logout: () => void) => {
  const baseMenu = buildMenu(user, false);
  const mobileMenu = generateMenuItems(baseMenu);
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
  user: User | null,
  pathname: string,
  isDashboard: boolean
) => {
  const menuData = buildMenu(user, isDashboard);

  return menuData
    .flatMap((item) => [item, ...(item.children || [])])
    .find((item) => item.link === pathname)?.key;
};
