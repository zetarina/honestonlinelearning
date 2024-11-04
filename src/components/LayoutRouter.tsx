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
  const { settings } = useSettings(); 
  const pathname = usePathname();
  const router = useRouter();
  const isDashboardRoute = pathname?.startsWith("/dashboard");

  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true);
    const handleRouteChangeComplete = () => setLoading(false);

    
    setLoading(true);
    handleRouteChangeStart();

    const timeoutId = setTimeout(() => {
      handleRouteChangeComplete();
    }, 500); 

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname]);

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

  if (!initialCheckDone && initialLoading) {
    return <LoadingSpinner />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isDashboardRoute && user) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default LayoutRouter;
