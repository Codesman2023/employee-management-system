import { useEffect, useState } from "react";

export default function AdminLeavePanel() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/leaves/all-leaves`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        if (Array.isArray(data)) setLeaves(data);
        else if (Array.isArray(data.leaves)) setLeaves(data.leaves);
        else if (data.success && Array.isArray(data.leaves)) setLeaves(data.leaves);
        else {
          console.warn('Unexpected leaves response:', data);
          setLeaves([]);
        }
      } else {
        console.error('Failed to fetch leaves (admin):', data);
        setLeaves([]);
      }
    } catch (err) {
      console.error('Network error while fetching all leaves (admin):', err);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const approveLeave = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/leaves/approve-leave/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to approve leave');
      }
    } catch (err) {
      console.error('Approve leave error:', err);
      alert('Network error while approving leave');
    } finally {
      loadLeaves();
    }
  };

  const rejectLeave = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/leaves/reject-leave/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to reject leave');
      }
    } catch (err) {
      console.error('Reject leave error:', err);
      alert('Network error while rejecting leave');
    } finally {
      loadLeaves();
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);


  return (
    <div className="min-h-screen flex justify-center items-center 
    bg-gradient-to-br  from-gray-900 via-gray-900 to-gray-900 p-6 text-gray-200">

      <div className="w-full max-w-6xl backdrop-blur-xl bg-[#0f172a]/70
      border border-gray-700/40 shadow-2xl rounded-3xl p-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6 border-b border-gray-700 pb-4">
          <div className="w-14 h-14 bg-indigo-700/60 border border-indigo-500
          text-white rounded-2xl flex items-center justify-center text-3xl shadow-xl">
            🛠
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-wide text-white">
              Admin Leave Panel
            </h1>
            <p className="text-gray-400 text-sm">
              Manage all employee leave requests
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10 font-semibold text-gray-300">
            Loading leave requests...
          </div>
        )}

        {/* Empty */}
        {!loading && leaves.length === 0 && (
          <div className="text-center py-12 text-gray-400 font-semibold text-lg">
            😃 No leave requests found
          </div>
        )}

        {/* Table */}
        {!loading && leaves.length > 0 && (
          <div className="overflow-x-auto rounded-2xl shadow border border-gray-700/50">

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#020617] text-gray-300">
                  <th className="py-3 px-4 text-left">Employee</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Reason</th>
                  <th className="py-3 px-4 text-left">Dates</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((l) => (
                  <tr
                    key={l._id}
                    className="border-b border-gray-700/40 
                    hover:bg-gray-900/50 transition"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-200">
                      {l?.employee?.name || l?.employee?.email || (typeof l.employee === 'string' ? l.employee : "—")}
                    </td>

                    <td className="py-3 px-4 text-gray-300">{l.type}</td>

                    <td className="py-3 px-4 text-gray-400">
                      {l.reason || "—"}
                    </td>

                    <td className="py-3 px-4 text-gray-200 font-medium">
                      {l.fromDate ? new Date(l.fromDate).toISOString().slice(0, 10) : "—"} → {l.toDate ? new Date(l.toDate).toISOString().slice(0, 10) : "—"}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold border
                        ${
                          l.status === "Approved"
                            ? "bg-emerald-800/40 text-emerald-300 border-emerald-600"
                            : l.status === "Rejected"
                            ? "bg-red-800/40 text-red-300 border-red-600"
                            : "bg-yellow-800/40 text-yellow-300 border-yellow-600"
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 flex gap-3">
                      {l.status === "Pending" && (
                        <>
                          <button
                            onClick={() => approveLeave(l._id)}
                            className="px-4 py-2 rounded-xl bg-emerald-700 
                            hover:bg-emerald-800 text-white font-semibold shadow 
                            hover:scale-105 transition active:scale-95"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => rejectLeave(l._id)}
                            className="px-4 py-2 rounded-xl bg-red-700 
                            hover:bg-red-800 text-white font-semibold shadow 
                            hover:scale-105 transition active:scale-95"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {l.status !== "Pending" && (
                        <span className="text-gray-500 italic">
                          No action required
                        </span>
                      )}
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
