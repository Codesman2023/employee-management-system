import { useEffect, useState } from "react";
import axios from "axios";
import { Clock, LogIn, LogOut, CalendarDays, CheckCircle, History } from "lucide-react";

export default function EmployeeAttendance() {
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);

  const formatTime = (value) => {
    if (!value) return "--:--";
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (value) => {
    if (!value) return "--";
    return new Date(value).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getHoursValue = (record) => {
    if (record?.totalHours) {
      return `${Number(record.totalHours).toFixed(2)} hrs`;
    }

    if (record?.clockIn && record?.clockOut) {
      const workedHours =
        (new Date(record.clockOut) - new Date(record.clockIn)) / 3600000;
      return `${workedHours.toFixed(2)} hrs`;
    }

    return "--";
  };

  async function fetchAttendance() {
    try {
      const token = localStorage.getItem("token");

      const [todayRes, historyRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/attendance/today`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${import.meta.env.VITE_BASE_URL}/attendance/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setStatus(todayRes.data);
      setHistory(historyRes.data?.attendance || []);
    } catch (err) {
      setStatus(null);
      setHistory([]);
    }
  }

  useEffect(() => {
    fetchAttendance();
  }, []);

  async function clockIn() {
    const token = localStorage.getItem("token");

    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/attendance/clock-in`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    fetchAttendance();
  }

  async function clockOut() {
    const token = localStorage.getItem("token");

    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/attendance/clock-out`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    fetchAttendance();
  }

  const todayHours = getHoursValue(status || {});
  const statusLabel = status?.status || (status ? (status.clockOut ? "Completed" : "Present") : "Not Marked");

  return (
    <div className="min-h-screen text-white px-5 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold">Attendance</h1>

          <p className="text-blue-100 mt-2 flex items-center gap-2">
            <CalendarDays size={18} />
            {new Date().toDateString()}
          </p>
        </div>

        <div className="mt-8 grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Today's Status</p>
                <h2 className="text-2xl font-bold mt-2">{statusLabel}</h2>
              </div>

              <div
                className={`h-14 w-14 rounded-full flex items-center justify-center ${
                  statusLabel === "Completed" || statusLabel === "Present"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-600/30 text-gray-300"
                }`}
              >
                <CheckCircle size={30} />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Clock In</p>
                <h2 className="text-xl font-semibold mt-2">{formatTime(status?.clockIn)}</h2>
              </div>
              <LogIn className="text-green-400" size={34} />
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Clock Out</p>
                <h2 className="text-xl font-semibold mt-2">{formatTime(status?.clockOut)}</h2>
              </div>
              <LogOut className="text-red-400" size={34} />
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Working Hours</p>
                <h2 className="text-xl font-semibold mt-2">{todayHours}</h2>
              </div>
              <Clock className="text-blue-400" size={34} />
            </div>
          </div>
        </div>

        <div className="mt-8 bg-slate-800 border border-slate-700 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="text-blue-400" />
                Attendance Action
              </h2>
              <p className="text-gray-400 mt-2">Mark your attendance for today.</p>
            </div>

            <div>
              {!status && (
                <button
                  onClick={clockIn}
                  className="bg-green-600 hover:bg-green-700 transition px-8 py-3 rounded-xl font-semibold shadow-lg"
                >
                  Clock In
                </button>
              )}

              {status && !status.clockOut && (
                <button
                  onClick={clockOut}
                  className="bg-red-600 hover:bg-red-700 transition px-8 py-3 rounded-xl font-semibold shadow-lg"
                >
                  Clock Out
                </button>
              )}

              {status?.clockOut && (
                <button
                  disabled
                  className="bg-gray-700 px-8 py-3 rounded-xl cursor-not-allowed"
                >
                  Attendance Completed
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-slate-800 border border-slate-700 rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-4">
            <History className="text-blue-400" size={20} />
            <h2 className="text-xl font-semibold">Attendance History</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-gray-400 border-b border-slate-700">
                <tr>
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Clock In</th>
                  <th className="py-3 pr-4">Clock Out</th>
                  <th className="py-3 pr-4">Hours</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((record) => (
                    <tr key={record._id} className="border-b border-slate-700/70">
                      <td className="py-3 pr-4">{formatDate(record.date)}</td>
                      <td className="py-3 pr-4">{formatTime(record.clockIn)}</td>
                      <td className="py-3 pr-4">{formatTime(record.clockOut)}</td>
                      <td className="py-3 pr-4">{getHoursValue(record)}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            record.status === "Completed"
                              ? "bg-green-500/15 text-green-400"
                              : record.status === "Present"
                                ? "bg-blue-500/15 text-blue-400"
                                : "bg-gray-600/40 text-gray-300"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-gray-400">
                      No attendance history yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
