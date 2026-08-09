"use client";

import React, { createContext, useContext, useState } from "react";

interface SandboxContextType {
  isSandboxOpen: boolean;
  openSandbox: () => void;
  closeSandbox: () => void;
  toggleSandbox: () => void;
}

const SandboxContext = createContext<SandboxContextType>({
  isSandboxOpen: false,
  openSandbox: () => {},
  closeSandbox: () => {},
  toggleSandbox: () => {},
});

export const SandboxProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  const openSandbox = () => {
    setIsSandboxOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeSandbox = () => {
    setIsSandboxOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSandbox = () => {
    setIsSandboxOpen((prev) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return !prev;
    });
  };

  return (
    <SandboxContext.Provider value={{ isSandboxOpen, openSandbox, closeSandbox, toggleSandbox }}>
      {children}
    </SandboxContext.Provider>
  );
};

export const useSandbox = () => useContext(SandboxContext);
