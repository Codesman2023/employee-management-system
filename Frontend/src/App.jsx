import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Home from "./components/home";
import Employee from "./components/employeedeshboard";
import AdminProtectWrapper from "./components/AdminProtectWrapper";
import EmployeeProtectWrapper from "./components/EmployeeProtectWrapper";
import AdminDashboard from "./components/admindashboard";
import AdminLogout from "./components/AdminLogout";
import EmployeeLogout from "./components/EmployeeLogout";
import AddEmployee from "./other/AddEmployee";
import EmployeeList from "./other/EmployeeList";
import EmployeeProfile from "./other/EmployeeProfile";
import ApplyLeave from "./components/ApplyLeave";
import AdminLeavePanel from "./components/AdminLeavePanel";
import EmpProfile from "./other/EmpProfile";
import EmployeeChangePassword from "./other/EmployeeChangePassword";
import EmployeeAttendance from "./other/EmployeeAttendance";
import AdminAttendanceDashboard from "./other/AdminAttendanceDashboard";
import AdminLayout from "./components/AdminLayout";
import EmployeeLayout from "./components/EmployeeLayout";

const App = () => {
  const adminPage = (children) => (
    <AdminProtectWrapper>
      <AdminLayout>{children}</AdminLayout>
    </AdminProtectWrapper>
  );

  const employeePage = (children) => (
    <EmployeeProtectWrapper>
      <EmployeeLayout>{children}</EmployeeLayout>
    </EmployeeProtectWrapper>
  );

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/set-password/:token" element={<ResetPassword mode="setup" />} />
      <Route path="/EmployeeLogin" element={<Navigate to="/login" replace />} />
      <Route path="/AdminLogin" element={<Navigate to="/login" replace />} />
      <Route path="/AdminSignup" element={<Navigate to="/login" replace />} />
      <Route
        path="/admindashboard"
        element={adminPage(<AdminDashboard />)}
      />
      <Route
        path="/employeedashboard"
        element={employeePage(<Employee />)}
      />
      <Route path="/employee/profile" element={
        employeePage(<EmpProfile />)
      } />
      <Route path="/employee/change-password" element={
        employeePage(<EmployeeChangePassword />)
      } />
      <Route
        path="/admin/logout"
        element={
          <AdminProtectWrapper>
            <AdminLogout />
          </AdminProtectWrapper>
        }
      />
      <Route
        path="/employee/logout"
        element={
          <EmployeeProtectWrapper>
            <EmployeeLogout />
          </EmployeeProtectWrapper>
        }
      />
      <Route
        path="/admin/add-employee"
        element={adminPage(<AddEmployee />)}
      />
      <Route
        path="/admin/employees"
        element={adminPage(<EmployeeList />)}
      />
      <Route
        path="/admin/employees/:id"
        element={adminPage(<EmployeeProfile />)}
      />
      <Route
        path="/employee/apply-leave"
        element={employeePage(<ApplyLeave />)}
      />
      <Route
        path="/employee/attendance"
        element={employeePage(<EmployeeAttendance />)}
      />  
      <Route
        path="/admin/leave-panel"
        element={adminPage(<AdminLeavePanel />)}
      />
      <Route
        path="/admin/attendance-dashboard"
        element={adminPage(<AdminAttendanceDashboard />)}
      />
    </Routes>
  );
};

export default App;
