import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        setEmployees(res.data.employees);
      } catch (error) {
        toast.error("Failed to fetch employees!");
      }
    };

    fetchEmployees();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!title || !dueDate || !assignedTo || !category) {
      toast.error("Please fill all required fields!");
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

          // ⭐ send valid links only
          links: taskLinks
            .filter(link => link.trim() !== "")
            .map(link => ({
              url: link,
              addedBy: "admin"
            }))
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.msg || "Task created successfully!");

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
    <div className="p-5 mt-5 rounded">
      <form
        onSubmit={handleCreateTask}
        className="flex flex-wrap w-full items-start justify-between"
      >
        <div className="w-1/2">

          <div>
            <h3 className="text-sm mb-0.5 font-medium">Task Title</h3>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border border-emerald-500 mb-4"
              type="text"
              placeholder="Make a UI design"
            />
          </div>

          <div>
            <h3 className="text-sm mb-0.5 font-medium">Due Date</h3>
            <input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border border-emerald-500 mb-4"
              type="date"
            />
          </div>

          <div>
            <h3 className="text-sm mb-0.5 font-medium">Assign to</h3>
            <select
              onChange={(e) => setAssignedTo(e.target.value)}
              value={assignedTo}
              className="text-sm py-1 px-2 w-4/5 rounded outline-none bg-gray-600 border border-emerald-500 mb-4"
            >
              <option value="">Select Employee</option>

              {employees.map((emp) => (
                <option key={emp._id} value={emp._id} className="bg-black">
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-sm mb-0.5 font-medium">Priority</h3>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="text-sm py-1 px-2 w-4/5 rounded outline-none bg-gray-600 border border-emerald-500 mb-4"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm mb-0.5 font-medium">Category</h3>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border border-emerald-500 mb-4"
              type="text"
              placeholder="design, dev, etc"
            />
          </div>

          {/* ⭐ Links Section */}
          <div>
            <h3 className="text-sm mb-1 font-medium">Reference Links</h3>

            {taskLinks.map((link, idx) => (
              <input
                key={idx}
                value={link}
                onChange={(e) => {
                  const arr = [...taskLinks];
                  arr[idx] = e.target.value;
                  setTaskLinks(arr);
                }}
                placeholder="https://github.com/... or docs link"
                className="text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border border-emerald-500 mb-2"
              />
            ))}

            <button
              type="button"
              onClick={() => setTaskLinks([...taskLinks, ""])}
              className="text-xs text-blue-400"
            >
              + Add More Link
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-2/5 flex flex-col items-start">
          <h3 className="text-sm mb-0.5 font-medium">Description</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-44 text-sm py-2 px-4 rounded outline-none bg-transparent border border-emerald-500"
          />

          <button className="bg-emerald-500 py-3 hover:bg-emerald-600 px-5 rounded text-sm mt-4 w-full">
            Create Task
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
    </div>
  );
};

export default CreateTask;
