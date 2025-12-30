import React, { useState, useContext } from "react";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";


export default function AddEmployee() {
  const { adminToken } = useContext(UserDataContext);
  const token = adminToken || localStorage.getItem("token");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  const [msg, setMsg] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const newEmployee = { name, email, password, department, designation };

    try {
      if (!token) {
        setType("error");
        setMsg("Unauthorized: please login as admin");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admins/create-employee`,
        newEmployee,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201 || response.status === 200) {
        setType("success");
        setMsg("🎉 Employee Added Successfully!");

        setName("");
        setEmail("");
        setPassword("");
        setDepartment("");
        setDesignation("");

        setTimeout(() => {
        navigate("/admin/employees"); 
        }, 1500);
      }
    } catch (err) {
      setType("error");
      setMsg(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center 
    bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 text-gray-200">

      <div className="w-[450px] backdrop-blur-xl bg-[#0f172a]/70
      border border-gray-700/40 shadow-2xl rounded-2xl p-8">

        <h2 className="text-3xl font-extrabold text-center mb-6 text-white tracking-wide">
          Add New Employee
        </h2>

        {msg && (
          <div
            className={`p-3 mb-4 rounded-md text-center font-semibold border
            ${type === "success"
              ? "bg-emerald-800/40 text-emerald-300 border-emerald-600"
              : "bg-red-800/40 text-red-300 border-red-600"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={submitHandler} className="flex flex-col gap-4">

          <input
            required
            type="text"
            placeholder="Employee Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 outline-none transition"
          />

          <input
            required
            type="email"
            placeholder="Employee Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 outline-none transition"
          />

          <input
            required
            type="password"
            placeholder="Temporary Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 outline-none transition"
          />

          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 outline-none transition"
          />

          <input
            type="text"
            placeholder="Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 outline-none transition"
          />

          <button
            type="submit"
            className="mt-2 bg-indigo-700 hover:bg-indigo-800 transition 
            text-white py-2 rounded-lg font-bold shadow-lg"
          >
            ➕ Add Employee
          </button>
        </form>
      </div>
    </div>
  );
}
