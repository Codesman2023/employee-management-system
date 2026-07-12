import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const pageTitles = {
  "/admindashboard": "Admin Dashboard",
  "/admin/add-employee": "Add Employee",
  "/admin/employees": "Employee Management",
  "/admin/leave-panel": "Leave Panel",
  "/admin/attendance-dashboard": "Attendance Dashboard",
};

export default function AdminLayout({ children }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    let active = true;

    async function loadAdmin() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/admins/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const user = data?.user;

        if (!active || !user) return;

        if (user.name) setAdminName(user.name);
        else if (user.fullname) {
          setAdminName(`${user.fullname.firstname} ${user.fullname.lastname}`);
        } else if (user.email) setAdminName(user.email);
      } catch {
        if (active) setAdminName("Admin");
      }
    }

    loadAdmin();

    return () => {
      active = false;
    };
  }, [token]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  }

  const title =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith("/admin/employees/")
      ? "Employee Profile"
      : "Admin Console");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden"
        />
      )}

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="lg:pl-72">
        <AdminNavbar
          title={title}
          adminName={adminName}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
