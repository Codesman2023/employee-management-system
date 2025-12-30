import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminAttendanceDashboard() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [summary, setSummary] = useState({
    presentToday: 0,
    absentToday: 0,
    totalEmployees: 0,
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  async function fetchEmployees() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admins/employees`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmployees(res.data.employees);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchAttendance() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/attendance/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecords(res.data.attendance);
      setFilteredList(res.data.attendance);
    } catch (err) {
      console.log(err);
    }
  }

  // ✅ FIX: calculate only when BOTH data loaded
  useEffect(() => {
    if (employees.length > 0) {
      calculateSummary(records);
    }
  }, [records, employees]);

  function calculateSummary(data) {
    const todayRecords = data.filter(
      (r) => new Date(r.date).toISOString().split("T")[0] === today
    );

    const present = todayRecords.length;
    const total = employees.length;
    const absent = total - present;

    setSummary({
      presentToday: present,
      absentToday: absent >= 0 ? absent : 0,
      totalEmployees: total,
    });
  }

  // ================= SHOW ONLY PRESENT =================
  //  function showPresent() {
  //   const present = records.filter(r =>
  //     new Date(r.date).toISOString().split("T")[0] === today
  //   );
  //   setFilteredList(present);
  // }

  // ================= SHOW ONLY ABSENT =================
  function showAbsent() {
    const todayRecords = records.filter(
      (r) => new Date(r.date).toISOString().split("T")[0] === today
    );
    const presentIds = todayRecords.map((r) => r.employee?._id);

    const absent = employees
      .filter((emp) => !presentIds.includes(emp._id))
      .map((emp) => ({
        employee: emp,
        date: today,
        clockIn: null,
        clockOut: null,
        totalHours: 0,
        _id: emp._id,
      }));

    setFilteredList(absent);
  }

  function resetList() {
    setFilteredList(records);
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white px-6 py-8">
      <h2 className="text-2xl font-semibold text-blue-300 mb-6">
        Admin Attendance Dashboard
      </h2>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="cursor-pointer backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 transition">
          <h3 className="text-lg text-blue-300">Present Today</h3>
          <p className="text-3xl font-bold mt-2 text-green-400">
            {summary.presentToday}
          </p>
        </div>

        <div
          onClick={showAbsent}
          className="cursor-pointer backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 transition"
        >
          <h3 className="text-lg text-blue-300">Absent Today</h3>
          <p className="text-3xl font-bold mt-2 text-red-400">
            {summary.absentToday}
          </p>
        </div>

        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6">
          <h3 className="text-lg text-blue-300">Total Employees</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-400">
            {summary.totalEmployees}
          </p>
        </div>
      </div>

      {filteredList !== records && (
        <button
          onClick={resetList}
          className="mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded"
        >
          Reset View
        </button>
      )}

      {/* TABLE */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 overflow-x-auto">
        <h3 className="text-xl text-blue-300 mb-4">Attendance Records</h3>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/20">
              <th className="p-3">Employee</th>
              <th className="p-3">Email</th>
              <th className="p-3">Date</th>
              <th className="p-3">Clock In</th>
              <th className="p-3">Clock Out</th>
              <th className="p-3">Total Hours</th>
            </tr>
          </thead>

          <tbody>
            {filteredList.map((r) => (
              <tr key={r._id} className="border-b border-white/10">
                <td className="p-3">{r.employee?.name}</td>
                <td className="p-3">{r.employee?.email}</td>
                <td className="p-3 text-blue-300">{r.date ? new Date(r.date).toISOString().split("T")[0] : "-"}</td>

                <td className="p-3 text-green-400">
                  {r.clockIn ? new Date(r.clockIn).toLocaleTimeString() : "-"}
                </td>

                <td className="p-3 text-red-400">
                  {r.clockOut ? new Date(r.clockOut).toLocaleTimeString() : "-"}
                </td>

                <td className="p-3 text-yellow-300">
                  {r.totalHours ? `${r.totalHours} hrs` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
