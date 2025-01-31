"use client";

import React, { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/loaders/LoadingSpinner";
import UserContext from "@/contexts/UserContext";
import "@/styles/globals.css";
import { APP_PERMISSIONS } from "@/config/permissions";
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
  console.log()
  useEffect(() => {
    if (!initialLoading) {
      console.log(user)
      if (isDashboardRoute && !user) {
        router.push("/login");
      } else if (
        isDashboardRoute &&
        user &&
        !user.roles.some((role) =>
          role.permissions.includes(APP_PERMISSIONS.VIEW_DASHBOARD)
        )
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
