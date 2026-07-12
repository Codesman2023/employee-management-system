import { useEffect, useState } from "react";
import axios from "axios";

const formatLinkLabel = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkInput, setLinkInput] = useState({});

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/employees/tasks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(res.data.tasks || []);
      setLoading(false);
    } catch (err) {
      console.log("Task fetch failed", err);
      setLoading(false);
    }
  }

  async function submitLink(taskId) {
    const link = linkInput[taskId];

    if (!link || link.trim() === "") {
      alert("Please enter a link");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/employee-tasks/tasks/${taskId}/add-link`,
        { link },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Link submitted successfully!");

      setLinkInput((prev) => ({ ...prev, [taskId]: "" }));

      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to submit link");
    }
  }

  async function updateStatus(taskId, status) {
    const link = linkInput[taskId];

    if (!link || link.trim() === "") {
      alert("Please enter your work link before marking status");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/employees/tasks/${taskId}`,
        { status, link },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Task marked as ${status}`);
      setLinkInput((prev) => ({ ...prev, [taskId]: "" }));
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to update status");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-blue-300 shadow-inner">
        Loading tasks...
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-cyan-400/30 bg-slate-900/60 p-8 text-center text-blue-300 shadow-inner">
        No tasks assigned yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="flex h-full flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_18px_45px_rgba(2,8,23,0.35)] backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:border-cyan-400/40"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-cyan-300">
                {task.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {task.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              <span className="rounded-full border border-purple-400/30 bg-purple-700/30 px-3 py-1 text-xs font-medium text-purple-200">
                {task.status}
              </span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-700/30 px-3 py-1 text-xs font-medium text-emerald-200">
                {task.priority}
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Due date
              </p>
              <p className="mt-1 font-medium text-slate-200">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString("en", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "No due date"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Task status
              </p>
              <p className="mt-1 font-medium text-slate-200">
                {task.status === "completed"
                  ? "Completed"
                  : task.status === "failed"
                    ? "Needs revision"
                    : "In progress"}
              </p>
            </div>
          </div>

          {task.links && task.links.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-cyan-300">
                Shared links
              </p>

              <div className="space-y-2">
                {task.links.map((l, index) => (
                  <a
                    key={index}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2.5 text-sm text-slate-200 transition hover:border-cyan-400/40 hover:bg-slate-700/80"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {formatLinkLabel(l.url)}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-400">
                        {l.url}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-cyan-600/20 px-2.5 py-1 text-[11px] font-medium text-cyan-200">
                      {l.addedBy}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/50 p-3">
            <p className="mb-2 text-sm font-semibold text-cyan-300">
              Submit your work link
            </p>

            <input
              value={linkInput[task._id] || ""}
              onChange={(e) =>
                setLinkInput({ ...linkInput, [task._id]: e.target.value })
              }
              placeholder="https://github.com/... or Google Docs"
              className="w-full rounded-xl border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400"
            />

            <button
              onClick={() => submitLink(task._id)}
              className="mt-3 w-full rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Submit Link
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => updateStatus(task._id, "completed")}
              disabled={!linkInput[task._id]?.trim()}
              className="flex-1 rounded-xl bg-cyan-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark Completed
            </button>

            <button
              onClick={() => updateStatus(task._id, "failed")}
              disabled={!linkInput[task._id]?.trim()}
              className="flex-1 rounded-xl bg-rose-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark Failed
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
