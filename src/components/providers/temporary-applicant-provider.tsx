"use client";

import { createContext, useContext, type ReactNode } from "react";

const TemporaryApplicantContext = createContext(false);

export function TemporaryApplicantProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: boolean;
}) {
  return (
    <TemporaryApplicantContext.Provider value={value}>
      {children}
    </TemporaryApplicantContext.Provider>
  );
}

export function useTemporaryApplicant() {
  return useContext(TemporaryApplicantContext);
}