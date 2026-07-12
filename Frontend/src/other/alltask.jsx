import React, { useEffect, useState } from "react";
import axios from "axios";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import TaskUpdateModal from "../components/TaskUpdateModel";

const AllTask = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admins/tasks`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(response.data.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admins/tasks/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-3">
      {!tasks.length && (
        <div className="rounded-lg border border-white/10 bg-slate-950/40 px-4 py-8 text-center text-sm text-slate-400">
          No tasks found.
        </div>
      )}

      {tasks.map((task) => (
        <article
          key={task._id}
          className="rounded-lg border border-white/10 bg-slate-950/45 p-4"
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr_.8fr_.8fr_auto] lg:items-center">
            <TaskField label="Employee" value={getEmployeeName(task)} />
            <TaskField label="Task" value={task.title} valueClass="text-cyan-300" />
            <TaskField
              label="Status"
              value={task.status || "N/A"}
              valueClass="text-amber-300"
            />
            <TaskField
              label="Due Date"
              value={formatDueDate(task.dueDate)}
              valueClass="text-rose-300"
            />

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <button
                onClick={() => setSelectedTask(task)}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                <Pencil size={15} />
                Edit
              </button>

              <button
                onClick={() => handleDelete(task._id)}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
            <h3 className="text-sm font-semibold text-emerald-300">
              Submitted / Attached Links
            </h3>

            {task.links && task.links.length > 0 ? (
              <div className="mt-3 space-y-2">
                {task.links.map((link, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-w-0 items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
                    >
                      <ExternalLink size={14} className="shrink-0" />
                      <span className="break-all">{link.url}</span>
                    </a>

                    <div className="flex shrink-0 flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span
                        className={`rounded-md px-2 py-1 font-medium ${
                          link.addedBy === "employee"
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-amber-400/10 text-amber-300"
                        }`}
                      >
                        {link.addedBy === "employee" ? "Employee" : "Admin"}
                      </span>
                      <span>{formatLinkDate(link.addedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-400">No links submitted yet.</p>
            )}
          </div>
        </article>
      ))}

      {selectedTask && (
        <TaskUpdateModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdated}
        />
      )}
    </div>
  );
};

function TaskField({ label, value, valueClass = "text-white" }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-1 truncate text-sm font-semibold ${valueClass}`}>
        {value || "N/A"}
      </p>
    </div>
  );
}

function getEmployeeName(task) {
  if (!task.assignedTo) return "N/A";
  if (task.assignedTo.name) return task.assignedTo.name;
  if (task.assignedTo.fullname) {
    return `${task.assignedTo.fullname.firstname} ${task.assignedTo.fullname.lastname}`;
  }
  return "N/A";
}

function formatDueDate(date) {
  return date && !Number.isNaN(new Date(date))
    ? new Date(date).toLocaleDateString("en-CA")
    : "N/A";
}

function formatLinkDate(date) {
  return date ? new Date(date).toLocaleString() : "";
}

export default AllTask;
