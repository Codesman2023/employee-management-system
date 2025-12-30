import { useEffect, useState } from "react";

export default function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadLeaves() {
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

        // Server sometimes returns the array directly, or an object like { success: true, leaves: [...] }
        if (res.ok) {
          if (Array.isArray(data)) setLeaves(data);
          else if (Array.isArray(data.leaves)) setLeaves(data.leaves);
          else {
            console.warn('Unexpected leaves response:', data);
            setLeaves([]);
          }
        } else {
          console.error('Failed to fetch leaves:', data);
          setLeaves([]);
        }
      } catch (err) {
        console.error('Network error while fetching leaves', err);
        setLeaves([]);
      } finally {
        setLoading(false);
      }
    }

    loadLeaves();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center px-6 bg-gradient-to-br from-[#050B18] via-[#0A1436] to-[#0E1629] text-white">
      <div className="w-full max-w-6xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-3xl p-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
            📄
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-300 tracking-wide">
              My Leave Requests
            </h1>
            <p className="text-gray-300 text-sm">
              Track your leave application history
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10 text-gray-300 text-lg">
            Loading your leaves...
          </div>
        )}

        {/* Empty */}
        {!loading && leaves.length === 0 && (
          <div className="text-center py-14 text-gray-300 text-lg">
            😕 No leave records found
          </div>
        )}

        {/* Table */}
        {!loading && leaves.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-white/20 shadow-xl">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-800 to-indigo-700 text-white">
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Reason</th>
                  <th className="py-3 px-4 text-left">From</th>
                  <th className="py-3 px-4 text-left">To</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody className="bg-white/10">
                {leaves.map((l) => (
                  <tr
                    key={l._id}
                    className="border-b border-white/10 hover:bg-white/10 transition"
                  >
                    <td className="py-3 px-4 font-semibold text-blue-200">
                      {l.type}
                    </td>

                    <td className="py-3 px-4 text-gray-300">
                      {l.reason}
                    </td>

                    <td className="py-3 px-4 text-gray-200">
                      {l.fromDate.slice(0, 10)}
                    </td>

                    <td className="py-3 px-4 text-gray-200">
                      {l.toDate.slice(0, 10)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold
                          ${
                            l.status === "Approved"
                              ? "bg-green-500/20 text-green-300 border border-green-500/40"
                              : l.status === "Rejected"
                              ? "bg-red-500/20 text-red-300 border border-red-500/40"
                              : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
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
  );
}
