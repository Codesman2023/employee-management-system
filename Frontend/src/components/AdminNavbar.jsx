import { NavLink } from "react-router-dom";
import { Menu, Plus } from "lucide-react";

export default function AdminNavbar({ title, adminName, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-slate-200 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              {title}
            </p>
            <h2 className="truncate text-xl font-semibold text-white">
              Welcome, {adminName}
            </h2>
          </div>
        </div>

        <NavLink
          to="/admin/add-employee"
          className="hidden min-h-10 items-center gap-2 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 sm:inline-flex"
        >
          <Plus size={17} />
          Add Employee
        </NavLink>
      </div>
    </header>
  );
}
