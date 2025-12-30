import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminHeader from "../other/AdminHeader";
import Createtask from "../other/createtask";
import AllTask from "../other/alltask";
import { Link } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, when: "beforeChildren" },
  },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 130, damping: 16 },
  },
};

const headerVariant = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 160, damping: 18 },
  },
};

export default function AdminDashboard() {
  // =================== ANALYTICS STATES ===================
  const token = localStorage.getItem("token");

  const [summary, setSummary] = useState(null);
  const [taskData, setTaskData] = useState(null);
  const [productivity, setProductivity] = useState(null);
  const [risk, setRisk] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const headers = { Authorization: `Bearer ${token}` };

    const s = await fetch(
      `${import.meta.env.VITE_BASE_URL}/analytics/summary`,
      { headers }
    );
    const t = await fetch(`${import.meta.env.VITE_BASE_URL}/analytics/tasks`, {
      headers,
    });
    const p = await fetch(
      `${import.meta.env.VITE_BASE_URL}/analytics/productivity`,
      { headers }
    );
    const r = await fetch(`${import.meta.env.VITE_BASE_URL}/analytics/risk`, {
      headers,
    });

    setSummary(await s.json());
    setTaskData(await t.json());
    setProductivity(await p.json());
    setRisk(await r.json());
  };

  // =================== UI ===================
  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white relative"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {/* Background Effects */}
      <motion.div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]"
        aria-hidden
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0.75 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] bg-amber-400 opacity-20 blur-[100px] rounded-full -z-20"
        aria-hidden
        initial={{ scale: 0.98, opacity: 0.14 }}
        animate={{ scale: 1.02, opacity: 0.22 }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* HEADER */}
      <motion.header
        variants={headerVariant}
        className="sticky top-0 z-10 w-full p-4 bg-blue-600 text-white flex items-center justify-center text-2xl font-bold tracking-wide"
      >
        Admin Dashboard
      </motion.header>

      <motion.section
        variants={sectionVariant}
        className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/20"
      >
        <AdminHeader />
      </motion.section>

      <div className="flex gap-4 p-4">
        <Link
          to="/admin/employees"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center"
        >
          📋 Employee List
        </Link>

        <Link
          to="/admin/leave-panel"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center"
        >
          📝 Manage Leave Requests
        </Link>
        <Link
          href="/admin/attendance-dashboard"
          className="py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
        >
          ⏰ Attendance Dashboard
        </Link>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      {summary ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 px-6">
          {Object.entries(summary).map(([k, v], i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow"
            >
              <p className="text-sm capitalize">{k}</p>
              <h2 className="text-2xl font-bold">{v}</h2>
            </div>
          ))}
        </div>
      ) : (
        <p className="px-6 py-4 text-gray-300">Loading Analytics...</p>
      )}

      {/* ================= CHARTS ================= */}
      {taskData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 px-6">
          {/* Status Chart */}
          <motion.section
            variants={sectionVariant}
            className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20"
          >
            <h2 className="text-xl font-semibold mb-3 text-amber-300">
              Task Status
            </h2>

            <PieChart width={360} height={300}>
              <Pie
                data={taskData.status}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                <Cell fill="#22c55e" />
                <Cell fill="#eab308" />
                <Cell fill="#ef4444" />
                <Cell fill="#3b82f6" />
              </Pie>
              <Tooltip />
            </PieChart>
          </motion.section>

          {/* Priority Chart */}
          <motion.section
            variants={sectionVariant}
            className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20"
          >
            <h2 className="text-xl font-semibold mb-3 text-amber-300">
              Task Priority
            </h2>

            <BarChart width={380} height={300} data={taskData.priority}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#38bdf8" />
            </BarChart>
          </motion.section>
        </div>
      )}

      {/* ================= PRODUCTIVITY ================= */}
      {productivity && (
        <motion.section
          variants={sectionVariant}
          className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 mt-10 mx-6"
        >
          <h2 className="text-xl font-semibold mb-3 text-amber-300">
            Employee Productivity
          </h2>

          <BarChart width={700} height={330} data={productivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="_id"
              interval={0}
              angle={-35}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="productivity" fill="#22c55e" />
          </BarChart>
        </motion.section>
      )}

      {/* ================= RISK ================= */}
      {risk && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 px-6 mb-10">
          <RiskBox title="Overdue Tasks" data={risk.overdue} color="red" />
          <RiskBox
            title="Near Deadline (48H)"
            data={risk.nearDeadline}
            color="yellow"
          />
          <RiskBox
            title="High Risk Tasks"
            data={risk.highRisk}
            color="orange"
          />
        </div>
      )}

      {/* ================= EXISTING CONTENT ================= */}
      <main className="flex flex-col gap-6 px-4 py-8">
        <motion.section
          variants={sectionVariant}
          className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/20"
        >
          <h2 className="text-2xl font-semibold text-amber-300 mb-4">
            Create Task
          </h2>
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Createtask />
          </motion.div>
        </motion.section>

        <motion.section
          variants={sectionVariant}
          className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/20 mb-10"
        >
          <h2 className="text-2xl font-semibold text-amber-300 mb-4">
            All Tasks
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <AllTask />
          </motion.div>
        </motion.section>
      </main>

      {/* FOOTER */}
      <motion.footer
        className="bg-gray-950 text-gray-400 text-center py-3 shadow-inner"
        variants={sectionVariant}
      >
        &copy; {new Date().getFullYear()} Employment Management System. All
        rights reserved.
      </motion.footer>
    </motion.div>
  );
}

// RISK BOX UI
function RiskBox({ title, data, color }) {
  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
      <p className={`font-semibold text-${color}-400`}>{title}</p>

      {!data?.length && <p className="text-gray-400 mt-2">No tasks 🎉</p>}

      {data?.map((task) => (
        <div key={task._id} className="border-b border-gray-700 py-2">
          <p className="font-semibold">{task.title}</p>
          <p className="text-sm text-gray-400">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
