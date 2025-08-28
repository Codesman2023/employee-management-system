import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { FaHome } from "react-icons/fa";
import { motion } from "framer-motion";

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { setUser } = useContext(UserDataContext);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password
    }
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/employees/Employee-register`, newUser)
    if(response.status===201){
      const data = response.data
      localStorage.setItem('token', data.token)
      setUser(data.user)
      navigate('/employeedashboard')
    }
    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-slate-800 via-slate-900 to-black text-white">
      <header className="w-full absolute top-0 left-0 p-4 bg-blue-600 text-white shadow-md flex items-center justify-between px-6">
        <Link to="/home" className="text-white text-xl md:text-2xl hover:text-gray-200 transition">
          <FaHome className="text-3xl" />
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-3xl font-bold tracking-wide"
          >
            Employment Management System
          </motion.h1>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-blue-300 text-black text-xl font-semibold text-center py-2"
      >
        Employee Signup Page
      </motion.div>

      <main className="flex-grow flex items-center justify-center relative">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] bg-blue-400 opacity-20 blur-[100px] rounded-full -z-20" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white text-black shadow-2xl p-8 sm:p-10 rounded-xl w-[90%] max-w-md z-10 border-t-4 border-blue-500"
        >
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-center text-gray-800 mb-6"
          >
            Sign Up
          </motion.h2>
          <form onSubmit={submitHandler} className="flex flex-col gap-5">
            <motion.input
              required
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.input
              required
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button
              type="submit"
              className="mt-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </form>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-4 text-sm text-gray-600"
          >
            Already have an account? <Link to="/EmployeeLogin" className="text-blue-600 hover:underline">Login here</Link>
          </motion.p>
        </motion.div>
      </main>

      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-950 text-gray-400 text-center py-3 shadow-inner"
      >
        &copy; {new Date().getFullYear()} Employment Management System. All rights reserved.
      </motion.footer>
    </div>
  );
};

export default UserSignup;
