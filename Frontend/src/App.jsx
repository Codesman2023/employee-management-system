import React from 'react'
import {Route, Routes} from 'react-router-dom'
import EmployeeLogin from './components/EmployeeLogin'
import Home from './components/home'
import Admin from './components/admindashboard'
import Employee from './components/employeedeshboard'
import AdminProtectWrapper from './components/AdminProtectWrapper'
import EmployeeProtectWrapper from './components/EmployeeProtectWrapper'
import EmployeeSignup from './components/EmployeeSignup'
import AdminLogin from './components/AdminLogin'
import AdminSignup from './components/AdminSignup'
import AdminDashboard from './components/admindashboard'
import AdminLogout from './components/AdminLogout'
import EmployeeLogout from './components/EmployeeLogout'

const App = () => {
  return (
  
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/EmployeeLogin" element={<EmployeeLogin/>} />
        <Route path="/AdminLogin" element={<AdminLogin/>} />
        <Route path="/AdminSignup" element={<AdminSignup/>} />
        <Route path="/EmployeeSignup" element={<EmployeeSignup/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/admindashboard" element={<AdminProtectWrapper>
          <Admin/>
        </AdminProtectWrapper>} />
        <Route path="/employeedashboard" element={<EmployeeProtectWrapper>
          <Employee/>
        </EmployeeProtectWrapper>} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/logout" element={<AdminProtectWrapper>
          <AdminLogout />
        </AdminProtectWrapper>} />
        <Route path="/employee/logout" element={<EmployeeProtectWrapper>
          <EmployeeLogout />
        </EmployeeProtectWrapper>} />
      </Routes>
  )
}

export default App