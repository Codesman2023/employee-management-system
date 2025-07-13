import React, { useState } from 'react';
import axios from 'axios';

const TaskUpdateModal = ({ task, onClose, onUpdate }) => {
  const [title, setTitle] = useState(task.title || '');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const [category, setCategory] = useState(task.category || '');
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status || '');
  const [assignedTo, setAssignedTo] = useState(task.assignedTo || '');

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admins/tasks/${task._id}`,
        {
          title,
          dueDate,
          category,
          description,
          status,
          assignedTo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Task updated!');
      onUpdate(response.data.task);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error updating task');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Update Task</h2>
        <label>Title</label>
        <input
          className="border p-2 w-full mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Due Date</label>
        <input
          type="date"
          className="border p-2 w-full mb-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <label>Category</label>
        <input
          className="border p-2 w-full mb-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <label>Description</label>
        <textarea
          className="border p-2 w-full mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Status</label>
        <select
          className="border p-2 w-full mb-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>

        <label>Assigned To (Employee ID)</label>
        <input
          className="border p-2 w-full mb-4"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskUpdateModal;
