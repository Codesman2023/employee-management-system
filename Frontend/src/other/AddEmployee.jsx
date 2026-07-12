import React, { useState, useContext } from "react";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, Briefcase, BadgeCheck, Sparkles } from "lucide-react";

export default function AddEmployee() {
  const { adminToken } = useContext(UserDataContext);
  const token = adminToken || localStorage.getItem("token");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  const [msg, setMsg] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const newEmployee = { name, email, department, designation };

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
        setMsg(response.data.message || "Employee added. Invitation email sent.");

        setName("");
        setEmail("");
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
    <div className="min-h-screen w-full  from-[#050B18] to-[#0E1629] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-white/20 bg-gradient-to-b from-white/10 to-white/5 shadow-[0_0_50px_rgba(0,0,0,0.7)] backdrop-blur-xl lg:flex-row">
        <div className="flex flex-1 flex-col justify-center bg-slate-950/40 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-200">
            <Sparkles className="h-4 w-4" />
            Admin workspace
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Add a new employee</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Create a profile for a new team member and send their invitation instantly from this streamlined form.
          </p>
        </div>

        <div className="flex-1 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5 shadow-2xl sm:p-7">
            {msg && (
              <div
                className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium ${
                  type === "success"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-red-500/40 bg-red-500/10 text-red-300"
                }`}
              >
                {msg}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
                    <UserPlus className="h-4 w-4" /> Full name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Employee Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
                    <Mail className="h-4 w-4" /> Email address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="Employee Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
                    <Briefcase className="h-4 w-4" /> Department
                  </label>
                  <input
                    type="text"
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
                    <BadgeCheck className="h-4 w-4" /> Designation
                  </label>
                  <input
                    type="text"
                    placeholder="Designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4" />
                Add Employee & Send Invitation
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

