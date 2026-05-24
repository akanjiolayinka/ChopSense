import { MessageCircle, Settings, User } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import BottomNav, { NAV_ITEMS } from "./BottomNav.jsx";

const ICONS = { Chat: MessageCircle, Profile: User, Settings: Settings };

// Shared shell for every /app/* route: an icon-only sidebar on desktop, a
// bottom tab bar on mobile, with the routed page rendered in between.
export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-navy">
      <aside className="hidden w-16 shrink-0 flex-col items-center gap-2 border-r border-navy-line bg-navy py-6 md:flex">
        <NavLink to="/app" end className="mb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold font-display text-lg font-bold text-navy">
            C
          </span>
        </NavLink>
        {NAV_ITEMS.map(({ to, label, end }) => {
          const Icon = ICONS[label];
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) =>
                `flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                  isActive
                    ? "bg-navy-soft text-gold ring-1 ring-gold/40"
                    : "text-blue-gray hover:bg-navy-soft hover:text-cream"
                }`
              }
            >
              <Icon size={20} />
            </NavLink>
          );
        })}
      </aside>

      <main className="flex-1 overflow-hidden pb-16 md:pb-0">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
