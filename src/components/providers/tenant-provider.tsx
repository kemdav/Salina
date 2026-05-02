"use client";

import { createContext, useContext, ReactNode } from "react";
import type { TenantContext as ServerTenantContext } from "@/lib/supabase/server";

export type TenantContext = ServerTenantContext;

const TenantReactContext = createContext<TenantContext | undefined>(undefined);

export function TenantProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: TenantContext;
}) {
  return (
    <TenantReactContext.Provider value={value}>
      {children}
    </TenantReactContext.Provider>
  );
}

export function useTenant(): TenantContext {
  const context = useContext(TenantReactContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
