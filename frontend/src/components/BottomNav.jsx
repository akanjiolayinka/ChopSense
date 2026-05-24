import { MessageCircle, Settings, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export const NAV_ITEMS = [
  { to: "/app", label: "Chat", icon: MessageCircle, end: true },
  { to: "/app/profile", label: "Profile", icon: User },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

// Mobile bottom tab bar. The desktop sidebar lives in AppLayout.
export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-line bg-navy/95 backdrop-blur md:hidden">
      <div className="flex">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors ${
                isActive ? "text-gold" : "text-blue-gray"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
