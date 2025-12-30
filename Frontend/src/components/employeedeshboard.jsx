import React, { useState } from "react";
import { motion } from "framer-motion";
import EmployeeHeader from "../other/EmployeeHeader";
import { useNavigate } from "react-router-dom";
import TaskListNumber from "../other/tasklistnumber";
import TaskList from "../other/tasklist/tasklist";
import EmployeeAttendance from "../other/EmployeeAttendance";

const Employeedeshboard = () => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="relative min-h-screen overflow-y-auto text-white flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:18px_28px]" />
      </div>

      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900/95 backdrop-blur-xl border-r border-white/10 w-64 z-30 transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold p-6 text-blue-400">
          Employee Dashboard
        </h2>

        <nav className="flex flex-col gap-3 px-6 mt-2">
          <button
            onClick={() => navigate("/employee/apply-leave")}
            className="py-3 px-4 rounded-lg bg-gray-800 hover:bg-blue-600/80 transition flex items-center gap-3 border border-white/10"
          >
            📝 Apply Leave
          </button>

          <button
            onClick={() => navigate("/employee/my-leaves")}
            className="py-3 px-4 rounded-lg bg-gray-800 hover:bg-green-600/80 transition flex items-center gap-3 border border-white/10"
          >
            📄 My Leaves
          </button>
          <a
            href="/employee/attendance"
            className="py-3 px-4 rounded-lg bg-gray-800 hover:bg-purple-600/80 transition flex items-center gap-3 border border-white/10"
          >
            ⏰ Attendance
          </a>

          {/* SETTINGS */}
          <div className="relative mt-2">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="py-3 px-4 rounded-lg bg-gray-800 hover:bg-yellow-600/80 transition w-full flex justify-between items-center border border-white/10"
            >
              <span className="flex items-center gap-2">⚙️ Settings</span>
              <span>{settingsOpen ? "▲" : "▼"}</span>
            </button>

            {settingsOpen && (
              <div className="mt-2 bg-gray-800 border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => navigate("/employee/profile")}
                  className="block w-full px-4 py-3 hover:bg-gray-700 text-left"
                >
                  👤 Profile
                </button>

                <button
                  onClick={() => navigate("/employee/change-password")}
                  className="block w-full px-4 py-3 hover:bg-gray-700 text-left"
                >
                  🔐 Change Password
                </button>
              </div>
            )}
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/EmployeeLogin");
            }}
            className="py-3 px-4 mt-4 rounded-lg bg-red-600 hover:bg-red-700 transition border border-white/10"
          >
            🚪 Logout
          </button>
        </nav>
      </div>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 md:ml-64">
        {/* NAVBAR */}
        <div className="flex items-center justify-between bg-gray-900/80 backdrop-blur-xl border-b border-white/10 py-4 px-6 shadow-lg">
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1"
          >
            <span className="w-7 h-1 bg-white rounded"></span>
            <span className="w-7 h-1 bg-white rounded"></span>
            <span className="w-7 h-1 bg-white rounded"></span>
          </button>

          <EmployeeHeader />
        </div>

        {/* OVERVIEW */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/70 backdrop-blur-xl border border-white/10 my-6 mx-4 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-blue-300">Overview</h2>
          <TaskListNumber />
        </motion.section>

        {/* TASKS */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/70 backdrop-blur-xl border border-white/10 mx-4 mb-10 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-blue-300">
            Your Tasks
          </h2>
          <TaskList />
        </motion.section>
      </div>
    </motion.div>
  );
};

export default Employeedeshboard;
