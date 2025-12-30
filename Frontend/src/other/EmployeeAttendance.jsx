import { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeeAttendance() {
  const [status, setStatus] = useState(null);

  async function fetchStatus() {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/attendance/today`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setStatus(res.data);
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  async function clockIn() {
    const token = localStorage.getItem("token");

    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/attendance/clock-in`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchStatus();
  }

  async function clockOut() {
    const token = localStorage.getItem("token");

    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/attendance/clock-out`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchStatus();
  }

  return (
    <div className="min-h-screen bg-gray-700 flex justify-center items-center text-white px-4">
      <div className="w-full md:w-[600px] backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8">

        <h2 className="text-2xl font-semibold text-blue-300 mb-6">
          Attendance
        </h2>

        <p className="mb-2">
          Status Today: 
          <span className="text-green-400 ml-2">
            {status ? "Clocked In" : "Not Marked"}
          </span>
        </p>

        {status && (
          <>
            <p>Clock In: {new Date(status.clockIn).toLocaleTimeString()}</p>
            {status.clockOut && (
              <p>Clock Out: {new Date(status.clockOut).toLocaleTimeString()}</p>
            )}
          </>
        )}

        <div className="flex gap-4 mt-6">
          {!status && (
            <button
              onClick={clockIn}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg"
            >
              Clock In
            </button>
          )}

          {status && !status.clockOut && (
            <button
              onClick={clockOut}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg"
            >
              Clock Out
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
