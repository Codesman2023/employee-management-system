import { useState, useEffect } from "react";
import axios from "axios";

export default function EmployeeProfile() {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/employees/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data.user);
    } catch (err) {
      console.log("Profile Fetch Failed", err);
      if (err?.response?.status === 401) window.location.href = "/EmployeeLogin";
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/employees/profile`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditMode(false);
      alert("Profile Updated Successfully!");
    } catch (err) {
      console.log("Update failed", err);
      alert("Update failed");
    }
  }

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c] text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-b from-[#050B18] to-[#0E1629] px-4">
      <div className="w-full md:w-[750px] bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.7)] p-8 transition-all duration-300">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-blue-300 tracking-wide">
            Employee Profile
          </h2>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-5 py-2 rounded-lg bg-blue-400 hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-500/40"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setEditMode(false)}
              className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://i.ibb.co/YZC4BrR/user.png"
            className="h-28 w-28 rounded-full border-2 border-blue-400 shadow-xl"
          />
          <p className="mt-3 text-xl font-semibold text-white">{profile.name}</p>
          <span className="text-sm text-blue-300">
            {profile.role || "Employee"}
          </span>
        </div>

        {/* Form */}
        <form
          onSubmit={saveProfile}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 text-white"
        >
          <div>
            <label className="text-sm text-blue-300">Full Name</label>
            <input
              disabled={!editMode}
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 rounded bg-black/40 border border-white/30 outline-none focus:border-blue-400 transition"
              type="text"
            />
          </div>

          <div>
            <label className="text-sm text-blue-300">Email</label>
            <input
              disabled
              value={profile.email}
              className="w-full mt-1 px-3 py-2 rounded bg-gray-700/50 border border-white/30 outline-none"
              type="text"
            />
          </div>

          <div>
            <label className="text-sm text-blue-300">Department</label>
            <input
              disabled={!editMode}
              value={profile.department || ""}
              onChange={(e) =>
                setProfile({ ...profile, department: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 rounded bg-black/40 border border-white/30 outline-none focus:border-blue-400 transition"
              type="text"
            />
          </div>

          <div>
            <label className="text-sm text-blue-300">Phone</label>
            <input
              disabled={!editMode}
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 rounded bg-black/40 border border-white/30 outline-none focus:border-blue-400 transition"
              type="text"
            />
          </div>

          {editMode && (
            <div className="col-span-2 mt-4">
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 transition shadow-md hover:shadow-green-500/40"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
