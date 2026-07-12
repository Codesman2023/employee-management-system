import { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const { adminToken } = useContext(UserDataContext);
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resendingId, setResendingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const token = adminToken || localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admins/employees-list`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmployees(res.data.employees);
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const secureToken = () => adminToken || localStorage.getItem("token");

  const departments = useMemo(() => {
    const departmentNames = employees
      .map((emp) => emp.department?.trim())
      .filter(Boolean);

    return [...new Set(departmentNames)].sort((a, b) => a.localeCompare(b));
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return employees.filter((emp) => {
      const matchesSearch =
        !normalizedSearch ||
        emp.name?.toLowerCase().includes(normalizedSearch) ||
        emp.email?.toLowerCase().includes(normalizedSearch);

      const matchesDepartment =
        departmentFilter === "all" ||
        emp.department?.trim().toLowerCase() === departmentFilter.toLowerCase();

      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchTerm, departmentFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate this employee?")) return;
    try {
      const token = secureToken();
      if (!token) return navigate("/login");

      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admins/delete-employees/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchEmployees();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to deactivate employee");
    }
  };

  const handleUpdate = async (id) => {
    try {
      const token = secureToken();
      if (!token) return navigate("/login");

      const targetId = id || editing;
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admins/update-employees/${targetId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditing(null);
      setForm({});
      fetchEmployees();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to update employee");
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm("Restore this employee?")) return;
    try {
      const token = secureToken();
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admins/restore-employee/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEmployees();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to restore employee");
    }
  };

  const handleResendInvitation = async (id) => {
    try {
      setMessage("");
      setError("");
      setResendingId(id);
      const token = secureToken();
      if (!token) return navigate("/login");

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admins/employees/${id}/resend-invitation`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message || "Invitation email resent");
      fetchEmployees();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to resend invitation");
    } finally {
      setResendingId(null);
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm("Permanently delete employee?")) return;
    try {
      const token = secureToken();
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admins/permanent-delete-employee/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEmployees();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to delete employee");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center py-10 
       from-gray-800 via-gray-900 to-gray-700 text-gray-200">

      <div className="w-[96%] backdrop-blur-xl bg-[#0f172a]/60 
      border border-gray-500 shadow-2xl rounded-2xl p-8">

        <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-wide text-white">
            Employee Management
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-lg border border-gray-600 bg-gray-950/70 px-4 py-2 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 sm:w-72"
            />

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-gray-950/70 px-4 py-2 text-sm text-white outline-none transition focus:border-blue-500 sm:w-56"
            >
              <option value="all">All departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <button
              onClick={() => navigate("/admin/add-employee")}
              className="px-5 py-2 rounded-lg font-semibold 
              bg-emerald-600 hover:bg-emerald-700 transition shadow-xl"
            >
              Add Employee
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-md border border-emerald-700 bg-emerald-800/40 px-4 py-3 text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md border border-red-700 bg-red-800/40 px-4 py-3 text-red-300">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#0f172a] text-gray-300">
                <th className="p-3 text-left rounded-l-xl">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Designation</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center rounded-r-xl">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length > 0 ? filteredEmployees.map(emp => (
                <tr key={emp._id}
                  className={`transition border border-gray-700/40 rounded-xl
                  ${
                    emp.status === "inactive"
                      ? "bg-gray-800/70 text-gray-300"
                      : emp.status === "pending"
                      ? "bg-amber-950/40 hover:bg-amber-950/60"
                      : "bg-[#020617]/60 hover:bg-[#020617]/90"
                  }`}
                >
                  <td className="p-3 font-semibold">
                    {editing === emp._id ? (
                      <input
                        className="bg-gray-900 border border-gray-700 p-1 rounded"
                        value={form.name || ""}
                        onChange={(e)=>setForm(p=>({...p,name:e.target.value}))}
                      />
                    ) : emp.name}
                  </td>

                  <td className="p-3">
                    {editing === emp._id ? (
                      <input
                        className="bg-gray-900 border border-gray-700 p-1 rounded"
                        value={form.email || ""}
                        onChange={(e)=>setForm(p=>({...p,email:e.target.value}))}
                      />
                    ) : emp.email}
                  </td>

                  <td className="p-3 capitalize">
                    {editing === emp._id ? (
                      <input
                        className="bg-gray-900 border border-gray-700 p-1 rounded"
                        value={form.department || ""}
                        onChange={(e)=>setForm(p=>({...p,department:e.target.value}))}
                      />
                    ) : emp.department}
                  </td>

                  <td className="p-3 capitalize">
                    {editing === emp._id ? (
                      <input
                        className="bg-gray-900 border border-gray-700 p-1 rounded"
                        value={form.designation || ""}
                        onChange={(e)=>setForm(p=>({...p,designation:e.target.value}))}
                      />
                    ) : emp.designation}
                  </td>

                  <td className="p-3 text-center">
                    <span className={`px-4 py-1 text-sm rounded-full font-semibold
                      ${emp.status === "active"
                        ? "bg-emerald-800/40 text-emerald-400 border border-emerald-700"
                        : emp.status === "pending"
                        ? "bg-amber-800/40 text-amber-300 border border-amber-700"
                        : "bg-red-800/40 text-red-400 border border-red-700"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>

                  <td className="p-3 flex justify-center gap-2">

                    {emp.status === "active" ? (
                      <>
                        <button
                          onClick={() => navigate(`/admin/employees/${emp._id}`)}
                          className="px-3 py-1 bg-blue-700 hover:bg-blue-800 rounded-md text-sm"
                        >
                          View
                        </button>

                        {editing === emp._id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(emp._id)}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 rounded-md text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => { setEditing(null); setForm({}); }}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded-md text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setEditing(emp._id);
                              setForm({
                                name: emp.name,
                                email: emp.email,
                                department: emp.department,
                                designation: emp.designation
                              });
                            }}
                            className="px-3 py-1 bg-indigo-700 hover:bg-indigo-800 rounded-md text-sm"
                          >
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="px-3 py-1 bg-red-700 hover:bg-red-800 rounded-md text-sm"
                        >
                          Deactivate
                        </button>
                      </>
                    ) : emp.status === "pending" ? (
                      /* PENDING */
                      <>
                        <button
                          onClick={() => navigate(`/admin/employees/${emp._id}`)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-800 rounded-md text-sm"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleResendInvitation(emp._id)}
                          disabled={resendingId === emp._id}
                          className="px-3 py-1 bg-amber-700 hover:bg-amber-800 disabled:bg-gray-600 rounded-md text-sm"
                        >
                          {resendingId === emp._id ? "Sending..." : "Resend Invitation"}
                        </button>

                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="px-3 py-1 bg-red-700 hover:bg-red-800 rounded-md text-sm"
                        >
                          Deactivate
                        </button>
                      </>
                    ) : (
                      /* INACTIVE */
                      <>
                        <button
                          onClick={() => navigate(`/admin/employees/${emp._id}`)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-800 rounded-md text-sm"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleRestore(emp._id)}
                          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 rounded-md text-sm"
                        >
                          Restore
                        </button>

                        <button
                          onClick={() => handlePermanentDelete(emp._id)}
                          className="px-3 py-1 bg-red-800 hover:bg-red-900 rounded-md text-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>

                </tr>
              )) : (
                <tr>
                  <td
                    colSpan="6"
                    className="rounded-xl bg-[#020617]/60 p-8 text-center text-gray-400"
                  >
                    No employees match your search or department filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default EmployeeList;

