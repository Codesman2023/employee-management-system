import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminToken } = useContext(UserDataContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = adminToken || localStorage.getItem("token");
      if (!token) return navigate("/AdminLogin");

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admins/employee/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData(res.data);
    } catch (err) {
      navigate("/AdminLogin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleDelete = async () => {
    if (!window.confirm("Deactivate this employee?")) return;

    try {
      const token = adminToken || localStorage.getItem("token");
      if (!token) return navigate("/AdminLogin");

      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admins/delete-employees/${data.employee._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Employee Deactivated Successfully!");
      navigate("/admin/employees");
    } catch (err) {
      alert("Failed to deactivate employee.");
    }
  };

  if (loading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center
      bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 text-gray-300">
        <div className="animate-pulse text-xl font-semibold">
          Loading Profile…
        </div>
      </div>
    );

  if (!data) return null;

  const emp = data.employee;
  const task = data.taskSummary;

  return (
    <div className="w-full min-h-screen flex justify-center py-10 
    bg-gradient-to-br from-gray-800 via-gray-9000 to-gray-700 text-gray-200">

      <div className="w-[750px] backdrop-blur-xl bg-[#0f172a]/70 
      border border-gray-700/40 shadow-2xl rounded-3xl p-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 rounded-lg bg-gray-700 hover:bg-black 
          transition text-white shadow-lg"
        >
          ⬅ Back
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center mb-6 text-white tracking-wide">
          Employee Profile
        </h2>

        <div className="flex gap-6 items-start">

          {/* Avatar */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr 
          from-indigo-600 to-purple-600 flex items-center justify-center 
          text-white text-4xl font-bold shadow-xl">
            {emp.name.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2 text-lg">
            <p><b className="text-gray-400">Name:</b> {emp.name}</p>
            <p><b className="text-gray-400">Email:</b> {emp.email}</p>
            <p><b className="text-gray-400">Department:</b> {emp.department || "—"}</p>
            <p><b className="text-gray-400">Designation:</b> {emp.designation || "—"}</p>
            <p><b className="text-gray-400">Joining Date:</b> {new Date(emp.joiningDate).toLocaleDateString()}</p>

            <p>
              <b className="text-gray-400">Status:</b>{" "}
              <span className={`px-4 py-1 rounded-full text-white text-sm font-semibold
                ${emp.status === "active"
                  ? "bg-emerald-700 border border-emerald-500"
                  : "bg-red-700 border border-red-500"
                }`}>
                {emp.status}
              </span>
            </p>
          </div>
        </div>

        {/* Task Summary */}
        <h3 className="text-xl font-bold mt-8 mb-4 text-center text-gray-300">
          Task Summary
        </h3>

        <div className="flex justify-between font-bold gap-4">

          <div className="bg-emerald-800/50 border border-emerald-600
          px-5 py-4 rounded-xl w-1/3 text-center shadow-lg hover:scale-105 transition">
            Completed
            <p className="text-3xl text-emerald-400">{task.completed}</p>
          </div>

          <div className="bg-yellow-700/50 border border-yellow-500
          px-5 py-4 rounded-xl w-1/3 text-center shadow-lg hover:scale-105 transition">
            Pending
            <p className="text-3xl text-yellow-300">{task.pending}</p>
          </div>

          <div className="bg-red-800/50 border border-red-600
          px-5 py-4 rounded-xl w-1/3 text-center shadow-lg hover:scale-105 transition">
            Failed
            <p className="text-3xl text-red-400">{task.failed}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/admin/employees")}
            className="px-6 py-2 bg-indigo-700 hover:bg-indigo-800 
            rounded-lg shadow-md transition"
          >
            ✏ Edit Employee
          </button>

          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-700 hover:bg-red-800 
            rounded-lg shadow-md transition"
          >
            🗑 Deactivate
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmployeeProfile;
