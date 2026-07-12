import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inputClass =
  "min-h-11 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-300";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");
  const [taskLinks, setTaskLinks] = useState([""]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admins/employees`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmployees(res.data.employees || []);
      } catch {
        toast.error("Failed to fetch employees.");
      }
    };

    fetchEmployees();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!title || !dueDate || !assignedTo || !category) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admins/tasks`,
        {
          title,
          dueDate,
          assignedTo,
          category,
          description,
          priority,
          links: taskLinks
            .filter((link) => link.trim() !== "")
            .map((link) => ({ url: link, addedBy: "admin" })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.msg || "Task created successfully.");
      setTitle("");
      setDueDate("");
      setAssignedTo("");
      setCategory("");
      setDescription("");
      setPriority("medium");
      setTaskLinks([""]);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error creating task.");
    }
  };

  return (
    <div>
      <form onSubmit={handleCreateTask} className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className={labelClass}>Task Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            type="text"
            placeholder="Make a UI design"
          />
        </div>

        <div>
          <label className={labelClass}>Due Date</label>
          <input
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputClass}
            type="date"
          />
        </div>

        <div>
          <label className={labelClass}>Assign To</label>
          <select
            onChange={(e) => setAssignedTo(e.target.value)}
            value={assignedTo}
            className={inputClass}
          >
            <option value="" className="bg-slate-950">
              Select employee
            </option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id} className="bg-slate-950">
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={inputClass}
          >
            <option value="low" className="bg-slate-950">Low</option>
            <option value="medium" className="bg-slate-950">Medium</option>
            <option value="high" className="bg-slate-950">High</option>
            <option value="critical" className="bg-slate-950">Critical</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
            type="text"
            placeholder="Design, development, support"
          />
        </div>

        <div className="lg:row-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} min-h-36 resize-y`}
            placeholder="Add task details"
          />
        </div>

        <div>
          <label className={labelClass}>Reference Links</label>
          <div className="space-y-2">
            {taskLinks.map((link, idx) => (
              <input
                key={idx}
                value={link}
                onChange={(e) => {
                  const nextLinks = [...taskLinks];
                  nextLinks[idx] = e.target.value;
                  setTaskLinks(nextLinks);
                }}
                placeholder="https://github.com/... or docs link"
                className={inputClass}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setTaskLinks([...taskLinks, ""])}
            className="mt-3 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            Add another link
          </button>
        </div>

        <button className="min-h-11 rounded-lg bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 lg:col-span-2">
          Create Task
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
    </div>
  );
};

export default CreateTask;
