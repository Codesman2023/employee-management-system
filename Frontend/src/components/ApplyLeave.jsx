import { useEffect, useState } from "react";

export default function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState("Sick");
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [msg, setMsg] = useState("");

  const token = localStorage.getItem("token");

  const loadLeaves = async () => {
    setLoading(true);

    if (!token) {
      setLeaves([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/leaves/my-leaves`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        if (Array.isArray(data)) setLeaves(data);
        else if (Array.isArray(data.leaves)) setLeaves(data.leaves);
        else {
          console.warn("Unexpected leaves response:", data);
          setLeaves([]);
        }
      } else {
        console.error("Failed to fetch leaves:", data);
        setLeaves([]);
      }
    } catch (err) {
      console.error("Network error while fetching leaves", err);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, [token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/leaves/apply-leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, reason, fromDate, toDate }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg({ text: "🎉 Leave Applied Successfully", color: "green" });
        setReason("");
        setFromDate("");
        setToDate("");
        await loadLeaves();
      } else {
        setMsg({ text: data.message || "❌ Failed! Try again.", color: "red" });
      }
    } catch {
      setMsg({ text: "❌ Network error. Try again.", color: "red" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen from-[#050B18] via-[#0A1436] to-[#0E1629] px-4 py-8 text-white md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="rounded-3xl border border-white/20 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-3xl shadow-lg">
              📄
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-wide text-blue-300">
                My Leave Requests
              </h1>
              <p className="text-sm text-gray-300">
                Apply for leave and review your recent requests in one place.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-slate-900/70 p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-white">Apply New Leave</h2>

            {msg && (
              <div
                className={`mb-4 rounded-lg border p-3 text-center font-semibold ${
                  msg.color === "green"
                    ? "border-emerald-600 bg-emerald-800/40 text-emerald-300"
                    : "border-red-600 bg-red-800/40 text-red-300"
                }`}
              >
                {msg.text}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-semibold text-gray-300">Leave Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-900 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="Sick">😷 Sick Leave</option>
                    <option value="Casual">🌴 Casual Leave</option>
                    <option value="Paid">💰 Paid Leave</option>
                    <option value="Unpaid">❌ Unpaid Leave</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-gray-300">Reason</label>
                  <input
                    type="text"
                    required
                    placeholder="Short reason for leave"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-900 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-gray-300">From Date</label>
                  <input
                    type="date"
                    required
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-900 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-gray-300">To Date</label>
                  <input
                    type="date"
                    required
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-900 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-indigo-700 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-indigo-800 active:scale-95"
              >
                {submitting ? "Submitting..." : "Submit Leave Request"}
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-3xl border border-white/20 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-blue-300">Leave History</h2>
              <p className="text-sm text-gray-300">Track all your leave applications here.</p>
            </div>
          </div>

          {loading && (
            <div className="py-10 text-center text-lg text-gray-300">Loading your leaves...</div>
          )}

          {!loading && leaves.length === 0 && (
            <div className="py-14 text-center text-lg text-gray-300">😕 No leave records found</div>
          )}

          {!loading && leaves.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-white/20 shadow-xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-800 to-indigo-700 text-white">
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Reason</th>
                    <th className="px-4 py-3 text-left">From</th>
                    <th className="px-4 py-3 text-left">To</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody className="bg-white/10">
                  {leaves.map((l) => (
                    <tr key={l._id} className="border-b border-white/10 transition hover:bg-white/10">
                      <td className="px-4 py-3 font-semibold text-blue-200">{l.type}</td>
                      <td className="px-4 py-3 text-gray-300">{l.reason}</td>
                      <td className="px-4 py-3 text-gray-200">{l.fromDate?.slice(0, 10) || "—"}</td>
                      <td className="px-4 py-3 text-gray-200">{l.toDate?.slice(0, 10) || "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                            l.status === "Approved"
                              ? "border-green-500/40 bg-green-500/20 text-green-300"
                              : l.status === "Rejected"
                              ? "border-red-500/40 bg-red-500/20 text-red-300"
                              : "border-yellow-500/40 bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
