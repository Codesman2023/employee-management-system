import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EmployeeNavbar from "./EmployeeNavbar";
import EmployeeSidebar from "./EmployeeSidebar";

const pageTitles = {
  "/employeedashboard": "Employee Dashboard",
  "/employee/apply-leave": "Apply Leave",
  "/employee/my-leaves": "My Leaves",
  "/employee/attendance": "Attendance",
  "/employee/profile": "Profile",
  "/employee/change-password": "Change Password",
};

export default function EmployeeLayout({ children }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState("Employee");

  useEffect(() => {
    let active = true;

    async function loadEmployee() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/employees/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const user = data?.user || data?.employee;

        if (!active || !user) return;

        if (user.name) setEmployeeName(user.name);
        else if (user.fullname) {
          setEmployeeName(`${user.fullname.firstname} ${user.fullname.lastname}`);
        } else if (user.email) setEmployeeName(user.email);
      } catch {
        if (active) setEmployeeName("Employee");
      }
    }

    loadEmployee();

    return () => {
      active = false;
    };
  }, [token]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  }

  const title = pageTitles[location.pathname] || "Employee Panel";
  const fixedPagePaths = ["/employee/profile", "/employee/change-password"];
  const isFixedPage = fixedPagePaths.includes(location.pathname);

  return (
    <div className={`${isFixedPage ? "h-screen overflow-hidden" : "min-h-screen"} bg-slate-950 text-slate-100`}>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden"
        />
      )}

      <EmployeeSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="lg:pl-72">
        <EmployeeNavbar
          title={title}
          employeeName={employeeName}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main
          className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${
            isFixedPage ? "h-[calc(100vh-4rem)] overflow-hidden py-3" : "py-6"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
