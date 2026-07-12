import { useState } from "react";
import axios from "axios";
import { Lock, Eye, EyeOff, ShieldCheck, KeyRound } from "lucide-react";

export default function EmployeeChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

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
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
    <div className="flex h-full items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-2xl sm:p-8">
        {/* Header */}

        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-600 p-3">
            <ShieldCheck size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Change Password
            </h1>

            <p className="mt-1 text-sm text-gray-400 sm:text-base">
              Update your password to keep your account secure.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:space-y-5">

          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Old Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-3.5 text-gray-400"
              />

              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-blue-500"
                required
              />

              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-4 top-3.5 text-gray-400"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              New Password
            </label>

            <div className="relative">
              <KeyRound
                size={18}
                className="absolute left-4 top-3.5 text-gray-400"
              />

              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-blue-500"
                required
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-3.5 text-gray-400"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

            <button
              type="reset"
              onClick={() => {
                setOldPassword("");
                setNewPassword("");
              }}
              className="flex-1 bg-slate-700 hover:bg-slate-600 transition py-3 rounded-xl"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
