import React, { useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export default function ResetPassword({ mode = "reset" }) {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/reset-password/${token}`, {
        newPassword
      });
      setMessage(response.data.message);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-xl border-t-4 border-emerald-500 bg-white p-8 text-black shadow-2xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
          {mode === "setup" ? "Set Password" : "Reset Password"}
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          {mode === "setup" ? "Create your password to activate your EMS account." : "Choose a new password for your account."}
        </p>

        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <input
            required
            minLength={6}
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            required
            minLength={6}
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          {message && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:bg-gray-400"
          >
            {isSubmitting ? "Saving..." : mode === "setup" ? "Set Password" : "Reset Password"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="font-semibold text-emerald-700 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
