"use client";

import React, { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "./DashboardLayout";
import MainLayout from "./MainLayout";
import SetupPage from "./SetupPage";
import { Spin } from "antd";
import UserContext from "@/contexts/UserContext";
import LoadingSpinner from "./LoadingSpinner";
import { UserRole } from "@/models/UserModel";
import { GlobalSettings } from "@/config/settingKeys";

interface LayoutRouterProps {
  children: React.ReactNode;
  settings: GlobalSettings;
}

const LayoutRouter: React.FC<LayoutRouterProps> = ({ children, settings }) => {
  const { user, initialLoading } = useContext(UserContext);
  const pathname = usePathname();
  const router = useRouter();
  const isDashboardRoute = pathname?.startsWith("/dashboard");
  const isSetupRequired = !settings.siteName || !settings.siteUrl;

  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    if (!initialLoading) {
      if (isDashboardRoute && !user) {
        router.push("/login");
        return;
      }

      if (
        isDashboardRoute &&
        user &&
        ![UserRole.ADMIN, UserRole.INSTRUCTOR].includes(user.role)
      ) {
        router.push("/profile");
        return;
      }

      setInitialCheckDone(true);
    }
  }, [initialLoading, user, isDashboardRoute, router]);

  if (isSetupRequired) {
    return <SetupPage />;
  }

  if (!initialCheckDone && initialLoading) {
    return <LoadingSpinner />;
  }

  if (isDashboardRoute && user) {
    return <DashboardLayout settings={settings}>{children}</DashboardLayout>;
  }

  return <MainLayout settings={settings}>{children}</MainLayout>;
};

export default LayoutRouter;
