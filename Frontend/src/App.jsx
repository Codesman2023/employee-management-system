import React from "react";
import { Route, Routes } from "react-router-dom";
import EmployeeLogin from "./components/EmployeeLogin";
import Home from "./components/home";
import Employee from "./components/employeedeshboard";
import AdminProtectWrapper from "./components/AdminProtectWrapper";
import EmployeeProtectWrapper from "./components/EmployeeProtectWrapper";
import AdminLogin from "./components/AdminLogin";
import AdminSignup from "./components/AdminSignup";
import AdminDashboard from "./components/admindashboard";
import AdminLogout from "./components/AdminLogout";
import EmployeeLogout from "./components/EmployeeLogout";
import AddEmployee from "./other/AddEmployee";
import EmployeeList from "./other/EmployeeList";
import EmployeeProfile from "./other/EmployeeProfile";
import ApplyLeave from "./components/ApplyLeave";
import MyLeaves from "./components/MyLeaves";
import AdminLeavePanel from "./components/AdminLeavePanel";
import EmpProfile from "./other/EmpProfile";
import EmployeeChangePassword from "./other/EmployeeChangePassword";
import EmployeeAttendance from "./other/EmployeeAttendance";
import AdminAttendanceDashboard from "./other/AdminAttendanceDashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/EmployeeLogin" element={<EmployeeLogin />} />
      <Route path="/AdminLogin" element={<AdminLogin />} />
      <Route path="/AdminSignup" element={<AdminSignup />} />
      <Route
        path="/admindashboard"
        element={
          <AdminProtectWrapper>
            <AdminDashboard />
          </AdminProtectWrapper>
        }
      />
      <Route
        path="/employeedashboard"
        element={
          <EmployeeProtectWrapper>
            <Employee />
          </EmployeeProtectWrapper>
        }
      />
      <Route path="/employee/profile" element={
        <EmployeeProtectWrapper>
          <EmpProfile />
        </EmployeeProtectWrapper>
      } />
      <Route path="/employee/change-password" element={
        <EmployeeProtectWrapper>
          <EmployeeChangePassword />
        </EmployeeProtectWrapper>
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
        element={
          <AdminProtectWrapper>
            <AddEmployee />
          </AdminProtectWrapper>
        }
      />
      <Route path="/admin/employees" element={<EmployeeList />} />
      <Route path="/admin/employees/:id" element={<EmployeeProfile />} />
      <Route
        path="/employee/apply-leave"
        element={
          <EmployeeProtectWrapper>
            <ApplyLeave />
          </EmployeeProtectWrapper>
        }
      />
      <Route
        path="/employee/my-leaves"
        element={
          <EmployeeProtectWrapper>
            <MyLeaves />
          </EmployeeProtectWrapper>
        }
      />
      <Route
        path="/employee/attendance"
        element={
          <EmployeeProtectWrapper>
            <EmployeeAttendance />
          </EmployeeProtectWrapper>
        }
      />  
      <Route
        path="/admin/leave-panel"
        element={
          <AdminProtectWrapper>
            <AdminLeavePanel />
          </AdminProtectWrapper>
        }
      />
      <Route
        path="/admin/attendance-dashboard"
        element={
          <AdminProtectWrapper>
            <AdminAttendanceDashboard />
          </AdminProtectWrapper>
        }
      />
    </Routes>
  );
};

export default App;
