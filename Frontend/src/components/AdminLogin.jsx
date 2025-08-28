import { useState, useContext } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
import { FaHome } from "react-icons/fa";
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const headerVariant = {
  hidden: { y: -18, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 150, damping: 18 } }
};

const cardVariant = {
  hidden: { opacity: 0, scale: 0.98, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 140, damping: 16 } }
};

const inputVariant = {
  focus: { scale: 1.01, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' },
  rest: { scale: 1, boxShadow: 'none' }
};

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = { email, password };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admins/Admin-login`, userData);

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        navigate('/admindashboard');
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid login. Please try again.");
    }

    setEmail('');
    setPassword('');
  };

  return (
  <>
        <div className="flex flex-col h-screen bg-gradient-to-r from-slate-800 via-slate-900 to-black text-white">
          <header className="w-full absolute top-0 left-0 p-4 bg-yellow-500 text-white shadow-md flex items-center justify-between px-6">
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
            className="bg-yellow-300 text-black text-xl font-semibold text-center py-2"
          >
            Admin Login Page
          </motion.div>
  
          <main className="flex-grow flex items-center justify-center relative">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] bg-yellow-400 opacity-20 blur-[100px] rounded-full -z-20" />
  
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white text-black shadow-2xl p-8 sm:p-10 rounded-xl w-[90%] max-w-md z-10 border-t-4 border-yellow-500"
            >
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-center text-gray-800 mb-6"
              >
                Admin Login Page
              </motion.h2>
              <form onSubmit={submitHandler} className="flex flex-col gap-5">
                <motion.input
                  required
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.input
                  required
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="submit"
                  className="mt-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </form>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mt-4 text-sm text-gray-600"
              >
                New here? <Link to="/AdminSignup" className="text-yellow-600 hover:underline">Create account</Link>
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
      </>
  );
}
