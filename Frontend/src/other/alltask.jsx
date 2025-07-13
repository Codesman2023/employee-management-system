import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskUpdateModal from '../components/TaskUpdateModel';  // ✅ Create this

const AllTask = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null); // ✅ For modal

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admins/tasks`, // ✅ your GET all tasks endpoint
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const openModal = (task) => {
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev =>
      prev.map(task => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm('Delete this task?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admins/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='p-5 rounded mt-5'>
      {/* Your header */}
      <div className='bg-red-400 mb-2 py-2 px-4 flex justify-between rounded'>
        <h2 className='text-lg font-medium w-1/5'>Employee Name</h2>
        <h3 className='text-lg font-medium w-1/5'>Assigned Task</h3>
        <h5 className='text-lg font-medium w-1/5'>Task Status</h5>
        <h5 className='text-lg font-medium w-1/5'>Due Date</h5>
        <h5 className='text-lg font-medium w-1/5'>Actions</h5>
      </div>

      {/* Your task rows */}
      {tasks.map((task) => (
        <div key={task._id} className='border-2 border-emerald-500 mb-2 py-2 px-4 flex justify-between rounded'>
          <h2 className='text-lg font-medium w-1/5'>
            {task.assignedTo && task.assignedTo.fullname
              ? `${task.assignedTo.fullname.firstname} ${task.assignedTo.fullname.lastname}`
              : 'N/A'}
          </h2>
          <h3 className='text-lg font-medium w-1/5 text-blue-600'>{task.title}</h3>
          <h3 className='text-lg font-medium w-1/5 text-yellow-400'>{task.status}</h3>
          <h5 className='text-lg font-medium w-1/5 text-red-500'>
            {task.dueDate && !isNaN(new Date(task.dueDate))
              ? new Date(task.dueDate).toLocaleDateString('en-CA') // outputs YYYY-MM-DD
              : 'N/A'}
          </h5>
          <div className='w-1/5 flex gap-2'>
            <button
              onClick={() => openModal(task)}
              className='bg-blue-500 text-white px-2 py-1 rounded cursor-pointer hover:bg-blue-700'
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className='bg-red-500 text-white px-2 py-1 rounded cursor-pointer hover:bg-red-700'
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* ✅ Modal */}
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
