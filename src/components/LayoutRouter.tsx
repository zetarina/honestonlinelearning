"use client";

import React, { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "./DashboardLayout";
import MainLayout from "./MainLayout";
import LoadingSpinner from "./LoadingSpinner";
import UserContext from "@/contexts/UserContext";
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

  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Log the current pathname, user, and loading state
  console.log("Current Pathname:", pathname);
  console.log("User Context:", user);
  console.log("Initial Loading State:", initialLoading);
  console.log("Is Dashboard Route:", isDashboardRoute);

  useEffect(() => {
    if (!initialLoading) {
      if (isDashboardRoute && !user) {
        console.log("Redirecting to /login");
        router.push("/login");
        return;
      }

      if (
        isDashboardRoute &&
        user &&
        ![UserRole.ADMIN, UserRole.INSTRUCTOR].includes(user.role)
      ) {
        console.log("User doesn't have access. Redirecting to /profile");
        router.push("/profile");
        return;
      }

      setInitialCheckDone(true);
    }
  }, [initialLoading, user, isDashboardRoute, router]);

  if (!initialCheckDone && initialLoading) {
    console.log("Showing Loading Spinner during initial check");
    return <LoadingSpinner />;
  }

  // Log which layout is being rendered
  if (isDashboardRoute && user) {
    console.log("Rendering Dashboard Layout");
    return <DashboardLayout settings={settings}>{children}</DashboardLayout>;
  }

  console.log("Rendering Main Layout");
  return <MainLayout settings={settings}>{children}</MainLayout>;
};

export default LayoutRouter;
