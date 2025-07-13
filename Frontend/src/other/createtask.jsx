import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
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
        console.error("Error fetching employees:", error);
        toast.error("Failed to fetch employees!");
      }
    };

    fetchEmployees();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();

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
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.msg || "Task created successfully!");

      // Clear form
      setTitle("");
      setDueDate("");
      setAssignedTo("");
      setCategory("");
      setDescription("");
    } catch (error) {
      console.error(error);
      toast.error("Error creating task.");
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
            <h3 className="text-sm text-black mb-0.5 font-medium">Task Title</h3>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-emerald-500 mb-4"
              type="text"
              placeholder="Make a UI design"
            />
          </div>

          <div>
            <h3 className="text-sm text-black mb-0.5 font-medium">Due Date</h3>
            <input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-emerald-500 mb-4"
              type="date"
            />
          </div>

          <div>
            <h3 className="text-sm text-black mb-0.5 font-medium">Assign to</h3>
            <select
              onChange={(e) => setAssignedTo(e.target.value)}
              value={assignedTo}
              className="text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-emerald-500 mb-4"
            >
              <option value="" className="bg-green-300">
                Select Employee
              </option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id} className="bg-green-100">
                  {emp.fullname.firstname} {emp.fullname.lastname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-sm text-black mb-0.5 font-medium">Category</h3>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-emerald-500 mb-4"
              type="text"
              placeholder="design, dev, etc"
            />
          </div>
        </div>

        <div className="w-2/5 flex flex-col items-start">
          <h3 className="text-sm text-black mb-0.5 font-medium">Description</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-44 text-sm py-2 px-4 rounded outline-none bg-transparent border-[1px] border-emerald-500"
          ></textarea>
          <button className="bg-emerald-500 py-3 hover:bg-emerald-600 px-5 rounded text-sm mt-4 w-full">
            Create Task
          </button>
        </div>
      </form>

      {/* ✅ Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default CreateTask;
