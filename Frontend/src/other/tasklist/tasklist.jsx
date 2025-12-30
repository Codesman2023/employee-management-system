import { useEffect, useState } from "react";
import axios from "axios";

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

  // ================= SUBMIT EMPLOYEE LINK =================
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

  // ================= MARK COMPLETED / FAILED =================
  async function updateStatus(taskId, status) {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/employees/tasks/${taskId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Task marked as ${status}`);
      fetchTasks();

    } catch (err) {
      alert(err.response?.data?.msg || "Failed to update status");
    }
  }

  if (loading) return <p className="text-blue-300">Loading tasks...</p>;

  if (tasks.length === 0)
    return <p className="text-blue-300">No tasks assigned yet.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white/10 border border-white/20 rounded-xl p-5 backdrop-blur-md shadow-xl"
        >
          <h3 className="text-lg font-semibold text-blue-300">
            {task.title}
          </h3>

          <p className="text-sm mt-1 text-gray-300">
            {task.description}
          </p>

          <div className="mt-3 flex gap-2 text-sm">
            <span className="px-2 py-1 bg-purple-700/50 rounded">
              Status: {task.status}
            </span>

            <span className="px-2 py-1 bg-emerald-700/50 rounded">
              Priority: {task.priority}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-300">
            Due: {new Date(task.dueDate).toDateString()}
          </p>

          {/* ================= ADMIN + EMPLOYEE LINKS ================= */}
          {task.links && task.links.length > 0 && (
            <div className="mt-4">
              <p className="text-blue-300 font-medium mb-1">
                Links (Admin / You):
              </p>

              <div className="space-y-2">
                {task.links.map((l, index) => (
                  <a
                    key={index}
                    href={l.url}
                    target="_blank"
                    className="block px-3 py-2 bg-gray-800 hover:bg-gray-700 duration-200 rounded border border-white/10 text-sm"
                  >
                    {l.url}
                    <span className="ml-2 px-2 py-1 text-xs rounded bg-blue-700/40">
                      {l.addedBy}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ================= SUBMIT WORK LINK ================= */}
          <div className="mt-5">
            <p className="text-blue-300 mb-1 text-sm">
              Submit Your Work Link
            </p>

            <input
              value={linkInput[task._id] || ""}
              onChange={(e) =>
                setLinkInput({ ...linkInput, [task._id]: e.target.value })
              }
              placeholder="https://github.com/... , Google Docs , Drive etc"
              className="w-full px-3 py-2 rounded bg-transparent border border-white/30 outline-none"
            />

            <button
              onClick={() => submitLink(task._id)}
              className="mt-3 w-full py-2 rounded bg-green-600 hover:bg-green-700 transition"
            >
              Submit Link
            </button>
          </div>

          {/* ================= COMPLETE / FAILED BUTTONS ================= */}
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => updateStatus(task._id, "completed")}
              className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-700 transition"
            >
              Mark Completed
            </button>

            <button
              onClick={() => updateStatus(task._id, "failed")}
              className="flex-1 py-2 rounded bg-red-600 hover:bg-red-700 transition"
            >
              Mark Failed
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
