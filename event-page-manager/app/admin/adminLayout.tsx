"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function EventSyncLogo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5b6ef5" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="lg2" x1="34" y1="0" x2="0" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22d3a0" />
          <stop offset="100%" stopColor="#5b6ef5" />
        </linearGradient>
      </defs>
      <rect width="34" height="34" rx="10" fill="#0c1120" />
      <path d="M6 17 Q6 8 17 8 Q23 8 27 14" stroke="url(#lg1)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M28 17 Q28 26 17 26 Q11 26 7 20" stroke="url(#lg2)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M23.5 11 L27 14 L23 16.5" stroke="url(#lg1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M10.5 23 L7 20 L11 17.5" stroke="url(#lg2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="17" cy="17" r="2.8" fill="#22d3a0" />
    </svg>
  );
}

const NAV_ITEMS = [
  {
    group: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="6" height="6" rx="1" />
            <rect x="9" y="1" width="6" height="6" rx="1" />
            <rect x="1" y="9" width="6" height="6" rx="1" />
            <rect x="9" y="9" width="6" height="6" rx="1" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "Content",
    items: [
      {
        label: "Events",
        href: "/admin/events",
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="12" height="11" rx="1.5" />
            <path d="M5 1v4M11 1v4M2 7h12" />
          </svg>
        ),
      },
      {
        label: "Sessions",
        href: "/admin/sessions",
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="6" />
            <path d="M8 5v3l2 2" />
          </svg>
        ),
      },
      {
        label: "Speakers",
        href: "/admin/speakers",
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="5" y="1" width="6" height="9" rx="3" />
            <path d="M2 8a6 6 0 0012 0M8 14v2M5 16h6" />
          </svg>
        ),
      },
      {
        label: "Rooms",
        href: "/admin/rooms",
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="12" height="11" rx="1" />
            <path d="M5 14V9h6v5M5 3V1h6v2" />
          </svg>
        ),
      },
      {
        label: "Questions",
        href: "/admin/questions",
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2v6z" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "Site",
    items: [
      {
        label: "Back to site",
        href: "/",
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 3L2 8l5 5M2 8h12" />
          </svg>
        ),
      },
    ],
  },
];

function SidebarLink({ item, collapsed }: { item: { label: string; href: string; icon: React.ReactNode }; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all no-underline group relative ${
        isActive
          ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
          : "text-[#6b7280] hover:text-white hover:bg-white/5"
      }`}
    >
      <span className={`flex-shrink-0 transition-colors ${isActive ? "text-indigo-400" : "text-[#4b5563] group-hover:text-white"}`}>
        {item.icon}
      </span>
      {!collapsed && <span>{item.label}</span>}
      {isActive && !collapsed && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
      )}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <aside
      className={`flex flex-col h-full bg-[#080d1a] border-r border-white/7 transition-all duration-300 ${
        collapsed ? "w-[64px]" : "w-[220px]"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/7 ${collapsed ? "justify-center" : ""}`}>
        <EventSyncLogo size={30} />
        {!collapsed && (
          <div>
            <div className="text-white font-black text-[15px] leading-none tracking-tight">EventSync</div>
            <div className="text-[#4b5563] text-[10px] font-semibold uppercase tracking-widest mt-0.5">Admin</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV_ITEMS.map((group) => (
          <div key={group.group} className="mb-5">
            {!collapsed && (
              <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#374151] px-3 mb-1.5">
                {group.group}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <SidebarLink key={item.href} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-4 border-t border-white/7">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#4b5563] hover:text-white hover:bg-white/5 transition-all text-[12px] font-medium ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M10 12L6 8l4-4" />
          </svg>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#030711] flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0 h-screen sticky top-0">{sidebar}</div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative flex-shrink-0 h-full">{sidebar}</div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-4 border-b border-white/7 bg-[#080d1a]">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-[#6b7280] hover:text-white hover:bg-white/5 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 4h12M2 8h12M2 12h12" />
            </svg>
          </button>
          <EventSyncLogo size={24} />
          <span className="text-white font-bold text-sm">Admin</span>
        </div>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}