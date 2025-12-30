import { useState } from "react";

export default function ApplyLeave() {
  const [type, setType] = useState("Sick");
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

      try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/leaves/apply-leave`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type, reason, fromDate, toDate }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMsg({ text: "🎉 Leave Applied Successfully", color: "green" });
        setReason("");
        setFromDate("");
        setToDate("");
      } else {
        setMsg({ text: data.message || "❌ Failed! Try again.", color: "red" });
      }
    } catch (error) {
      setLoading(false);
      setMsg({ text: "❌ Network error. Try again.", color: "red" });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center 
    bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 p-6 text-gray-200">

      <div className="w-full max-w-3xl backdrop-blur-xl bg-[#0f172a]/70
      border border-gray-700/40 shadow-2xl rounded-3xl overflow-hidden">

        {/* Header */}
        <div className="bg-[#020617]/80 border-b border-gray-700 p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-700/50 border border-indigo-500
          rounded-full flex justify-center items-center text-white text-3xl shadow-xl">
            🗓
          </div>

          <div>
            <h1 className="text-white text-2xl font-extrabold tracking-wide">
              Apply Leave
            </h1>
            <p className="text-gray-400 text-sm">
              Fill details carefully before submitting
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">

          {msg && (
            <div
              className={`w-full mb-4 p-3 rounded-lg text-center font-semibold border
              ${
                msg.color === "green"
                  ? "bg-emerald-800/40 text-emerald-300 border-emerald-600"
                  : "bg-red-800/40 text-red-300 border-red-600"
              }`}
            >
              {msg.text}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Leave Type */}
              <div>
                <label className="font-semibold text-gray-300">
                  Leave Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl 
                  bg-gray-900 border border-gray-700 
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600
                  outline-none transition"
                >
                  <option value="Sick">😷 Sick Leave</option>
                  <option value="Casual">🌴 Casual Leave</option>
                  <option value="Paid">💰 Paid Leave</option>
                  <option value="Unpaid">❌ Unpaid Leave</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="font-semibold text-gray-300">Reason</label>
                <input
                  type="text"
                  required
                  placeholder="Short reason for leave"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl 
                  bg-gray-900 border border-gray-700
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600
                  outline-none transition"
                />
              </div>

              {/* From Date */}
              <div>
                <label className="font-semibold text-gray-300">
                  From Date
                </label>
                <input
                  type="date"
                  required
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl
                  bg-gray-900 border border-gray-700
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600
                  outline-none transition"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="font-semibold text-gray-300">
                  To Date
                </label>
                <input
                  type="date"
                  required
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl
                  bg-gray-900 border border-gray-700
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600
                  outline-none transition"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-lg 
              shadow-lg bg-indigo-700 hover:bg-indigo-800 active:scale-95 transition"
            >
              {loading ? "Submitting..." : "Submit Leave Request"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
