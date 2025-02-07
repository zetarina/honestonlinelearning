"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import "@/styles/globals.css";
import { useUser } from "@/hooks/useUser";
import LoadingSpin from "@/components/loaders/LoadingSpin";
import { ROUTES } from "@/config/navigations/routes";
import { hasPermission } from "@/config/permissions";

interface LayoutRouterProps {
  children: React.ReactNode;
}

const LayoutRouter: React.FC<LayoutRouterProps> = ({ children }) => {
  const { user, initialLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const isDashboardRoute = pathname?.startsWith("/dashboard");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, [pathname]);

  // ✅ Get current route configuration
  const routeConfig = useMemo(() => {
    return (
      Object.values(ROUTES).find((route) => {
        const regexPath = new RegExp(
          `^${route.path.replace(/:\w+/g, "\\w+")}$`
        );
        return regexPath.test(pathname);
      }) || null
    );
  }, [pathname]);

  // ✅ Determine if the user has access
  const hasAccess = useMemo(() => {
    if (!routeConfig) return true; // Assume public route if no config
    if (!routeConfig.access && !routeConfig.loginRequired) return true; // No restrictions, allow access
    return hasPermission(user, routeConfig.access || []);
  }, [user, routeConfig, pathname]);

  useEffect(() => {
    if (initialLoading) return; // Wait for user data before checking

    const redirectTo = (target: string) => {
      if (pathname !== target) router.replace(target);
    };

    // 🚀 If user is NOT logged in and login is required, redirect
    if (!user && routeConfig?.loginRequired) {
      redirectTo(routeConfig.IfNotLoggedInRedirectUrl || "/login");
      return;
    }

    // 🚀 If user is logged in and visits the login page, redirect to the dashboard
    if (user && pathname === "/login") {
      redirectTo(routeConfig?.IfLoggedInRedirectUrl || "/dashboard");
      return;
    }
  }, [initialLoading, user, routeConfig, pathname, router]);

  // ✅ Show loading while checking user state
  if (initialLoading || loading) {
    return <LoadingSpin message="Building Theme..." />;
  }

  // ✅ If user lacks permission, show the error **inside the layout**
  const content = user && routeConfig?.access && !hasAccess ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "20px",
        color: "white",
      }}
    >
      ❌ {routeConfig?.noAccessMessage || "You do not have permission to view this page."}
    </div>
  ) : (
    children
  );

  return isDashboardRoute && user ? (
    <DashboardLayout>{content}</DashboardLayout>
  ) : (
    <MainLayout>{content}</MainLayout>
  );
};

export default LayoutRouter;
