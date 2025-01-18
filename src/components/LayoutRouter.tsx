"use client";

import React, { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "./DashboardLayout";
import MainLayout from "./MainLayout";
import LoadingSpinner from "./LoadingSpinner";
import UserContext from "@/contexts/UserContext";
import { UserRole } from "@/models/UserModel";
import { useSettings } from "@/contexts/SettingsContext";

interface LayoutRouterProps {
  children: React.ReactNode;
}
const LayoutRouter: React.FC<LayoutRouterProps> = ({ children }) => {
  const { user, initialLoading } = useContext(UserContext);
  const pathname = usePathname();
  const router = useRouter();
  const isDashboardRoute = pathname?.startsWith("/dashboard");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 300); // Short debounce
    };
    handleRouteChange();
  }, [pathname]);

  useEffect(() => {
    if (!initialLoading) {
      console.log(user);
      if (isDashboardRoute && !user) {
        router.push("/login");
      } else if (
        isDashboardRoute &&
        user &&
        !["ADMIN", "INSTRUCTOR"].includes(user.role.toUpperCase())
      ) {
        router.push("/profile");
      }
    }
  }, [initialLoading, isDashboardRoute, user, router]);
  

  if (initialLoading || loading) {
    return <LoadingSpinner />;
  }

  return isDashboardRoute && user ? (
    <DashboardLayout>{children}</DashboardLayout>
  ) : (
    <MainLayout>{children}</MainLayout>
  );
};

export default LayoutRouter;
