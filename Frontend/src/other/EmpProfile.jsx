import { useState, useEffect } from "react";
import axios from "axios";
import { Camera, Edit3, Save, Upload, X, Mail, Briefcase, Phone, UserRound, Home, MapPin, Globe2, ShieldAlert } from "lucide-react";

export default function EmployeeProfile() {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewImage("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewImage(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  async function fetchProfile() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/employees/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const user = res.data.user;
      setProfile(user);
      setDraft(user);
    } catch (err) {
      console.log("Profile Fetch Failed", err);
      if (err?.response?.status === 401) window.location.href = "/login";
    }
  }

  function startEdit() {
    setDraft(profile);
    setEditMode(true);
  }

  function cancelEdit() {
    setDraft(profile);
    setEditMode(false);
  }

  async function saveProfile(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/employees/profile`,
        draft,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = res.data.user;
      setProfile(updatedUser);
      setDraft(updatedUser);
      setEditMode(false);
      alert("Profile Updated Successfully!");
    } catch (err) {
      console.log("Update failed", err);
      const message = err?.response?.data?.msg || err?.response?.data?.message || "Update failed";
      alert(message);
    }
  }

  function handleProfileImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Profile image must be 2MB or smaller.");
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
  }

  async function uploadProfileImage() {
    if (!selectedImage) {
      alert("Choose an image first.");
      return;
    }

    try {
      setIsUploadingImage(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profileImage", selectedImage);

      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/employees/profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = res.data.user;
      setProfile(updatedUser);
      setDraft(updatedUser);
      setSelectedImage(null);
      alert("Profile picture updated successfully!");
    } catch (err) {
      console.log("Profile image upload failed", err);
      const message = err?.response?.data?.msg || err?.response?.data?.message || "Upload failed";
      alert(message);
    } finally {
      setIsUploadingImage(false);
    }
  }

  if (!profile)
    return (
      <div className="flex h-full items-center justify-center bg-[#0a0f1c] text-white">
        Loading...
      </div>
    );

  const profileImageUrl = previewImage || profile.profileImage?.url;

  return (
    <div className="flex h-full w-full items-center from-[#050B18] to-[#0E1629]">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-b from-white/10 to-white/5 p-4 shadow-[0_0_50px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-5 lg:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300">Employee profile</p>
            <h2 className="mt-1 text-2xl font-bold text-white">Your account</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">
              Keep your details up to date and manage your profile with a smoother, more responsive experience.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {!editMode ? (
              <button
                onClick={startEdit}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={cancelEdit}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  form="profile-form"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mb-4 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-center sm:flex-row sm:text-left">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile avatar"
                  className="h-20 w-20 rounded-full border-2 border-blue-400 object-cover shadow-xl"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-400 bg-slate-800 text-blue-200 shadow-xl">
                  <UserRound className="h-10 w-10" />
                </div>
              )}
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-blue-500 text-white shadow-lg transition hover:bg-blue-600"
                title="Choose profile picture"
              >
                <Camera className="h-4 w-4" />
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>
            {selectedImage && (
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={uploadProfileImage}
                  disabled={isUploadingImage}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Upload className="h-4 w-4" />
                  {isUploadingImage ? "Uploading..." : "Upload"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  disabled={isUploadingImage}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <X className="h-4 w-4" />
                  Remove
                </button>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xl font-semibold text-white">{profile.name}</p>
            <p className="mt-1 text-sm text-blue-300">{profile.role || "Employee"}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Manage your personal and contact details here. Any changes will be saved once you confirm.
            </p>
          </div>
        </div>

        <form id="profile-form" onSubmit={saveProfile} className="grid min-h-0 gap-2 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
              <UserRound className="h-4 w-4" /> Full Name
            </label>
            <input
              disabled={!editMode}
              value={draft?.name || ""}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-400"
              type="text"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
              <Mail className="h-4 w-4" /> Email
            </label>
            <input
              disabled
              value={draft?.email || ""}
              className="w-full rounded-xl border border-white/10 bg-gray-700/50 px-3 py-2.5 text-sm text-slate-300 outline-none"
              type="text"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
              <Briefcase className="h-4 w-4" /> Department
            </label>
            <input
              disabled
              value={draft?.department || ""}
              className="w-full rounded-xl border border-white/10 bg-gray-700/50 px-3 py-2.5 text-sm text-slate-300 outline-none"
              type="text"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
              <Phone className="h-4 w-4" /> Phone
            </label>
            <input
              disabled={!editMode}
              value={draft?.phone || ""}
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-400"
              type="text"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 md:col-span-2">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
              <Home className="h-4 w-4" /> Address
            </label>
            <textarea
              disabled={!editMode}
              rows={3}
              value={draft?.address || ""}
              onChange={(e) => setDraft({ ...draft, address: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-400"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
              <MapPin className="h-4 w-4" /> City
            </label>
            <input
              disabled={!editMode}
              value={draft?.city || ""}
              onChange={(e) => setDraft({ ...draft, city: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-400"
              type="text"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
              <MapPin className="h-4 w-4" /> State
            </label>
            <input
              disabled={!editMode}
              value={draft?.state || ""}
              onChange={(e) => setDraft({ ...draft, state: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-400"
              type="text"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
              <MapPin className="h-4 w-4" /> PIN Code
            </label>
            <input
              disabled={!editMode}
              value={draft?.pincode || ""}
              onChange={(e) => setDraft({ ...draft, pincode: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-400"
              type="text"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
              <Globe2 className="h-4 w-4" /> Country
            </label>
            <input
              disabled={!editMode}
              value={draft?.country || ""}
              onChange={(e) => setDraft({ ...draft, country: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-400"
              type="text"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 md:col-span-2">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
              <ShieldAlert className="h-4 w-4" /> Emergency Contact
            </label>
            <input
              disabled={!editMode}
              value={draft?.emergencyContact || ""}
              onChange={(e) => setDraft({ ...draft, emergencyContact: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-400"
              type="text"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
