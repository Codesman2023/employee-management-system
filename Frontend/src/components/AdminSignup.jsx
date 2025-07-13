import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ userData, setUserData ] = useState({})

  const navigate = useNavigate()

  const {user, setUser} = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    
    const newUser = {
        fullname:{
          firstname: firstName,
          lastname: lastName
        },
        email: email,
        password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admins/Admin-register`, newUser)

    if(response.status===201){
      const data = response.data
      localStorage.setItem('token', data.token)
      setUser(data.user)
      navigate('/admindashboard')
    }

    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')

  }

  return (
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
    
          <div className="bg-green-100 h-10 text-2xl font-medium pl-2 flex justify-center">Admin Signup-Page</div>
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center relative bg-green-50">
        {/* Background grid and blur */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[310px] w-[310px] bg-green-400 opacity-20 blur-[100px] rounded-full -z-20" />

        {/* Signup Card */}
        <div className="bg-white shadow-lg border-2 border-green-600 p-8 sm:p-12 rounded-xl w-[90%] max-w-md z-10">
          <h2 className="text-3xl font-semibold text-center mb-8 text-green-700">Sign Up</h2>
          <form onSubmit={submitHandler} className="flex flex-col gap-5">
            <input
              required
              type="text"
              placeholder="Enter your name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="px-4 py-3 border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            <input
              required
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="px-4 py-3 border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
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
              Sign Up
            </button>
          </form>
          <p className='text-center py-2'>Already have a account? <Link to='/AdminLogin' className='text-blue-600'>Login here</Link></p>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-600 text-white font-medium text-center py-3 shadow-inner">
        &copy; {new Date().getFullYear()}  Employement Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default UserSignup;
