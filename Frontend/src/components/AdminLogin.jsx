import { useState, useContext } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'

const login = () => {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [ userData, setUserData ] = useState({})

const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()  
    const userData = {
      email: email,
      password: password
    }

  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admins/Admin-login`, userData)

    if(response.status === 200) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/admindashboard')
    }

    setEmail('')
    setPassword('')
  }

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
     <div>
  <header className="h-12 relative bg-green-600 text-white font-bold text-2xl p-4 shadow-md flex items-center">
    <Link to='/home'>
   <lord-icon
    src="https://cdn.lordicon.com/jeuxydnh.json"
    trigger="hover"
    colors="primary:#000000,secondary:#000000">
</lord-icon>
</Link>
    <div className="absolute left-1/2 transform -translate-x-1/2">
      &lt;/Employee Management System/&gt;
    </div>
  </header>
</div>

      <div className="bg-green-100 h-10 text-2xl font-medium pl-2 flex justify-center">Admin Login-Page</div>
      {/* Main Body */}
      <main className="flex-grow flex items-center justify-center relative bg-green-50">
        {/* Background grid and blur effect */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[310px] w-[310px] bg-green-400 opacity-20 blur-[100px] rounded-full -z-20" />

        {/* Login Box */}
        <div className="bg-white shadow-lg border-2 border-green-600 p-8 sm:p-12 rounded-xl w-[90%] max-w-md z-10">
          <h2 className="text-3xl font-semibold text-center mb-8 text-green-700">Login</h2>
          <form onSubmit={submitHandler} className="flex flex-col gap-5">
            <input
              required
              type="email"
              placeholder="Enter your email"
               value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            <input
              required
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            <button
              type="submit"
              className="mt-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Login
            </button>
          </form>
          <p className='text-center pt-2'>Create a new account? <Link to='/AdminSignup' className='text-blue-600'>Signup</Link></p>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-600 font-medium text-white text-center py-3 shadow-inner">
        &copy; {new Date().getFullYear()}  Employement Management System. All rights reserved.
      </footer>
    </div>
   </>
  )
}

export default login