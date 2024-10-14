"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

const ClientSessionProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      {children}
    </SessionProvider>
  );
};

export default ClientSessionProvider;
