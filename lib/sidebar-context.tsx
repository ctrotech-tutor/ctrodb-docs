"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type SidebarCtx = {
  collapsed: boolean
  toggle: () => void
  setCollapsed: (v: boolean) => void
}

const Ctx = createContext<SidebarCtx>({
  collapsed: false,
  toggle: () => {},
  setCollapsed: () => {},
})

export function useSidebar() {
  return useContext(Ctx)
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Ctx.Provider value={{ collapsed, toggle: () => setCollapsed((p) => !p), setCollapsed }}>
      {children}
    </Ctx.Provider>
  )
}
