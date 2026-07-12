import React from "react";
import { NavLink } from "react-router-dom";
import {
  CalendarClock,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

const adminNavItems = [
  { label: "Dashboard", to: "/admindashboard", icon: LayoutDashboard },
  { label: "Employees", to: "/admin/employees", icon: Users },
  { label: "Add Employee", to: "/admin/add-employee", icon: UserPlus },
  { label: "Leave Panel", to: "/admin/leave-panel", icon: ClipboardList },
  { label: "Attendance", to: "/admin/attendance-dashboard", icon: CalendarClock },
];

export default function AdminSidebar({ open, onClose, onLogout }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-slate-950 px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-400 text-slate-950">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              EMS
            </p>
            <h1 className="text-lg font-semibold text-white">Admin Console</h1>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-slate-300 lg:hidden"
        >
          <X size={19} />
        </button>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {adminNavItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {React.createElement(Icon, { size: 18 })}
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-rose-500 px-4 text-sm font-semibold text-white transition hover:bg-rose-400"
      >
        <LogOut size={17} />
        Log out
      </button>
    </aside>
  );
}
