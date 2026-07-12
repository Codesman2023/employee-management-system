import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Users,
} from "lucide-react";
import CreateTask from "../other/createtask";
import AllTask from "../other/alltask";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartColors = ["#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

const riskStyles = {
  red: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  yellow: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  orange: "border-orange-500/30 bg-orange-500/10 text-orange-300",
};

function formatLabel(value) {
  return String(value)
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const [summary, setSummary] = useState(null);
  const [taskData, setTaskData] = useState(null);
  const [productivity, setProductivity] = useState(null);
  const [risk, setRisk] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAnalytics() {
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [summaryRes, tasksRes, productivityRes, riskRes] =
          await Promise.all([
            fetch(`${import.meta.env.VITE_BASE_URL}/analytics/summary`, {
              headers,
            }),
            fetch(`${import.meta.env.VITE_BASE_URL}/analytics/tasks`, {
              headers,
            }),
            fetch(`${import.meta.env.VITE_BASE_URL}/analytics/productivity`, {
              headers,
            }),
            fetch(`${import.meta.env.VITE_BASE_URL}/analytics/risk`, { headers }),
          ]);

        if (
          ![summaryRes, tasksRes, productivityRes, riskRes].every((res) => res.ok)
        ) {
          throw new Error("Analytics request failed");
        }

        const [summaryJson, tasksJson, productivityJson, riskJson] =
          await Promise.all([
            summaryRes.json(),
            tasksRes.json(),
            productivityRes.json(),
            riskRes.json(),
          ]);

        if (!active) return;
        setSummary(summaryJson);
        setTaskData(tasksJson);
        setProductivity(productivityJson);
        setRisk(riskJson);
        setError("");
      } catch {
        if (active) setError("Dashboard analytics could not be loaded.");
      }
    }

    loadAnalytics();

    return () => {
      active = false;
    };
  }, [token]);

  const summaryCards = useMemo(() => {
    const icons = [Users, ClipboardList, CheckCircle2, AlertTriangle, BarChart3];

    return Object.entries(summary || {}).map(([key, value], index) => ({
      label: formatLabel(key),
      value,
      Icon: icons[index % icons.length],
    }));
  }, [summary]);

  return (
    <div className="flex flex-col gap-6">
      
          {error && (
            <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summary ? (
              summaryCards.map(({ label, value, Icon }) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-lg shadow-black/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-slate-400">{label}</p>
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
                      {React.createElement(Icon, { size: 18 })}
                    </span>
                  </div>
                  <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-lg border border-white/10 bg-white/[0.06] p-5 text-sm text-slate-400">
                Loading analytics...
              </div>
            )}
          </section>

          {taskData && (
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ChartPanel title="Task Status">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taskData.status || []}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      innerRadius="42%"
                      outerRadius="72%"
                      paddingAngle={3}
                    >
                      {(taskData.status || []).map((entry, index) => (
                        <Cell
                          key={entry._id || index}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartPanel>

              <ChartPanel title="Task Priority">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={taskData.priority || []}>
                    <CartesianGrid stroke="rgba(148,163,184,.18)" vertical={false} />
                    <XAxis dataKey="_id" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                    <Tooltip cursor={{ fill: "rgba(148,163,184,.08)" }} contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartPanel>
            </section>
          )}

          {productivity && (
            <ChartPanel title="Employee Productivity">
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={productivity} margin={{ bottom: 34 }}>
                  <CartesianGrid stroke="rgba(148,163,184,.18)" vertical={false} />
                  <XAxis
                    dataKey="_id"
                    stroke="#94a3b8"
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    height={72}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(148,163,184,.08)" }} contentStyle={tooltipStyle} />
                  <Bar dataKey="productivity" fill="#22c55e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>
          )}

          {risk && (
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <RiskBox title="Overdue Tasks" data={risk.overdue} color="red" />
              <RiskBox
                title="Near Deadline"
                subtitle="Due within 48 hours"
                data={risk.nearDeadline}
                color="yellow"
              />
              <RiskBox title="High Risk Tasks" data={risk.highRisk} color="orange" />
            </section>
          )}

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
            <Panel eyebrow="Task Management" title="Create Task">
              <CreateTask />
            </Panel>
            <Panel eyebrow="Work Queue" title="All Tasks">
              <AllTask />
            </Panel>
          </section>
    </div>
  );
}

const tooltipStyle = {
  background: "#0f172a",
  border: "1px solid rgba(255,255,255,.14)",
  borderRadius: "8px",
  color: "#f8fafc",
};

function Panel({ eyebrow, title, children }) {
  return (
    <section className="min-w-0 rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-lg shadow-black/10 sm:p-6">
      <div className="mb-4">
        <p className="text-sm font-medium text-cyan-300">{eyebrow}</p>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ChartPanel({ title, children }) {
  return (
    <section className="min-w-0 rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-lg shadow-black/10 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 size={19} className="text-cyan-300" />
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function RiskBox({ title, subtitle, data, color }) {
  return (
    <section
      className={`rounded-lg border p-5 ${riskStyles[color] || riskStyles.red}`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle size={19} className="mt-0.5 shrink-0" />
        <div>
          <h3 className="font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        </div>
      </div>

      {!data?.length && (
        <p className="mt-4 rounded-lg bg-slate-950/40 px-3 py-2 text-sm text-slate-400">
          No tasks to review.
        </p>
      )}

      <div className="mt-4 space-y-3">
        {data?.map((task) => (
          <div key={task._id} className="border-t border-white/10 pt-3">
            <p className="font-medium text-white">{task.title}</p>
            <p className="mt-1 text-sm text-slate-400">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
