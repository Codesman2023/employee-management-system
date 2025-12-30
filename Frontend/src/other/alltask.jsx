import React, { useEffect, useState } from "react";
import axios from "axios";
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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const openModal = (task) => setSelectedTask(task);
  const closeModal = () => setSelectedTask(null);

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("Delete this task?");
    if (!confirmDelete) return;

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
    <div className="p-5 rounded mt-5">
      {/* HEADER */}
      <div className="bg-red-400 mb-2 py-2 px-4 flex justify-between rounded">
        <h2 className="text-lg font-medium w-1/5">Employee Name</h2>
        <h3 className="text-lg font-medium w-1/5">Assigned Task</h3>
        <h5 className="text-lg font-medium w-1/5">Task Status</h5>
        <h5 className="text-lg font-medium w-1/5">Due Date</h5>
        <h5 className="text-lg font-medium w-1/5">Actions</h5>
      </div>

      {/* TASK ROWS */}
      {tasks.map(task => (
        <div
          key={task._id}
          className="border-2 border-emerald-500 mb-3 px-4 py-3 rounded bg-gray-900/50"
        >
          {/* ROW */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium w-1/5">
              {task.assignedTo
                ? task.assignedTo.name
                  ? task.assignedTo.name
                  : task.assignedTo.fullname
                  ? `${task.assignedTo.fullname.firstname} ${task.assignedTo.fullname.lastname}`
                  : "N/A"
                : "N/A"}
            </h2>

            <h3 className="text-lg font-medium w-1/5 text-blue-400">
              {task.title}
            </h3>

            <h3 className="text-lg font-medium w-1/5 text-yellow-400">
              {task.status}
            </h3>

            <h5 className="text-lg font-medium w-1/5 text-red-400">
              {task.dueDate && !isNaN(new Date(task.dueDate))
                ? new Date(task.dueDate).toLocaleDateString("en-CA")
                : "N/A"}
            </h5>

            <div className="w-1/5 flex gap-2">
              <button
                onClick={() => openModal(task)}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          {/* ===================== LINKS SECTION ===================== */}
          <div className="mt-3 p-3 rounded bg-gray-800 border border-emerald-600">
            <h3 className="text-sm font-semibold text-emerald-400 mb-2">
              Submitted / Attached Links
            </h3>

            {task.links && task.links.length > 0 ? (
              <div className="space-y-2">
                {task.links.map((link, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-900 px-3 py-2 rounded border border-gray-700"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline break-all hover:text-blue-300"
                    >
                      {link.url}
                    </a>

                    <div className="flex gap-3 text-xs">
                      <span
                        className={`px-2 py-1 rounded 
                          ${
                            link.addedBy === "employee"
                              ? "bg-green-700"
                              : "bg-yellow-700"
                          }
                        `}
                      >
                        {link.addedBy === "employee" ? "Employee" : "Admin"}
                      </span>

                      <span className="text-gray-400">
                        {new Date(link.addedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No links submitted yet 🚫</p>
            )}
          </div>
        </div>
      ))}

      {selectedTask && (
        <TaskUpdateModal
          task={selectedTask}
          onClose={closeModal}
          onUpdate={handleTaskUpdated}
        />
      )}
    </div>
  );
};

export default AllTask;

// <h2 className='text-lg font-medium w-1/5'>
//   {task.assignedTo
//     ? (task.assignedTo.name
//         ? task.assignedTo.name
//         : task.assignedTo.fullname
//           ? `${task.assignedTo.fullname.firstname} ${task.assignedTo.fullname.lastname}`
//           : 'N/A')
//     : 'N/A'}
// </h2>
