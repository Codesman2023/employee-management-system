import { useState } from "react";
import axios from "axios";

export default function EmployeeChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/employee/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.msg);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.msg || "Something went wrong");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-b from-[#050B18] to-[#0E1629] text-white">
      <div className="w-full md:w-[520px] bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] p-8">

        {/* Header */}
        <h2 className="text-3xl font-bold text-blue-300 mb-6 tracking-wide">
          Change Password
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-white">

          <div>
            <label className="text-sm text-blue-300">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e)=> setOldPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-black/40 border border-white/30 outline-none focus:border-blue-400 transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-blue-300">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e)=> setNewPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-black/40 border border-white/30 outline-none focus:border-blue-400 transition"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 transition shadow-md hover:shadow-green-500/40 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>

        </form>
      </div>
    </div>
  );
}
