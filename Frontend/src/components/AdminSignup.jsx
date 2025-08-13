import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { FaHome } from "react-icons/fa";

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admins/Admin-register`, newUser);

      if (response.status === 201) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate('/admindashboard');
      }
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Error during signup. Try again.");
    }

    setEmail('');
    setFirstName('');
    setLastName('');
    setPassword('');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="w-full absolute top-0 left-0 p-4 bg-blue-600 text-white shadow-md flex items-center justify-between px-6">
       <Link to="/home" className="text-white text-xl md:text-2xl hover:text-gray-200 transition">
         <FaHome className="text-3xl" />
       </Link>
       <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
         <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
           Employment Management System
         </h1>
       </div>
     </header>

      {/* Sub-header */}
      <div className="bg-amber-300 text-black text-xl font-semibold text-center py-2">
        Admin Signup Page
      </div>

      {/* Main Form */}
      <main className="flex-grow flex items-center justify-center relative">
        {/* Grid + Blur background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] bg-amber-400 opacity-20 blur-[100px] rounded-full -z-20" />

        <div className="bg-white text-black shadow-2xl p-8 sm:p-10 rounded-xl w-[90%] max-w-md z-10 border-t-4 border-amber-400">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
          <form onSubmit={submitHandler} className="flex flex-col gap-5">
            <input
              required
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
            <input
              required
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
            <input
              required
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
            <input
              required
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
            <button
              type="submit"
              className="mt-4 py-2 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-300 transition duration-300"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account? <Link to="/AdminLogin" className="text-blue-600 hover:underline">Login here</Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 text-center py-3 shadow-inner">
        &copy; {new Date().getFullYear()} Employment Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default UserSignup;
