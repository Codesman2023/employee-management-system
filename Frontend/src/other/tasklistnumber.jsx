import React, { useEffect, useState } from "react";
import axios from "axios";

const tasklistnumber = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token"); // Your JWT
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/employees/tasks`, // Replace with your API URL
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Count tasks by status
  const totalNew = tasks.filter((task) => task.status === "pending").length;
  const totalCompleted = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const totalAccepted = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const totalFailed = tasks.filter((task) => task.status === "failed").length;

  return (
    <div className="flex mt-10 justify-between gap-5 ml-2 mr-2">
      <div className="rounded-xl w-[40%] py-6 px-9 bg-red-400">
        <h2 className="text-3xl font-semibold">{totalNew}</h2>
        <h3 className="text-xl font-medium">New Task</h3>
      </div>
      <div className="rounded-xl w-[40%] py-6 px-9 bg-blue-400">
        <h2 className="text-3xl font-semibold">{totalCompleted}</h2>
        <h3 className="text-xl font-medium">Completed Task</h3>
      </div>
      <div className="rounded-xl w-[40%] py-6 px-9 bg-green-400">
        <h2 className="text-3xl font-semibold">{totalAccepted}</h2>
        <h3 className="text-xl font-medium">Accepted Task</h3>
      </div>
      <div className="rounded-xl w-[40%] py-6 px-9 bg-yellow-400">
        <h2 className="text-3xl font-semibold">{totalFailed}</h2>
        <h3 className="text-xl font-medium">Failed Task</h3>
      </div>
    </div>
  );
};

export default tasklistnumber;
