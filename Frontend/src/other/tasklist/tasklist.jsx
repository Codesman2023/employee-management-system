import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';

const EmployeeTaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/employees/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (taskId, status) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/employees/tasks/${taskId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update local state immediately
      setTasks(prev =>
        prev.map(task =>
          task._id === taskId ? { ...task, status: response.data.task.status } : task
        )
      );

   // ✅ Show a success toast instead of alert
      toast.success(`Task marked as ${status}!`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status!');
    }
  };
  return (
    <div>
      <h2 className=" text-2xl font-bold mb-4 ml-2 mt-10">My Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
       <div className="rounded-xl overflow-hidden border-2 border-amber-100 mt-6">
        <table border="1"  cellPadding="10" className=" w-full mt-6">
          <thead>
            <tr>
              <th>Title</th>
              <th>Assign Date</th>
              <th>Due Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th> {/* ✅ */}
            </tr>
          </thead>
          <tbody className='text-center '>
            {tasks.map(task => (
              <tr key={task._id} className='h-15'>
                <td>{task.title}</td>
                <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>{task.category}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => handleUpdateStatus(task._id, 'completed')}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2 cursor-pointer hover:bg-green-700"
                    >
                      Mark Completed
                    </button>
                  )}
                  {task.status !== 'failed' && (
                    <button
                      onClick={() => handleUpdateStatus(task._id, 'failed')}
                      className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer hover:bg-red-700"
                    >
                      Mark Failed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       </div> 
      )}
      

    </div>
  );
};

export default EmployeeTaskList;
