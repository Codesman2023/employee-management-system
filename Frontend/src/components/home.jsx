import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.15 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } }
};

const dropIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 140, damping: 16 } }
};

export default function Home() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <motion.header
        variants={dropIn}
        className="py-8 text-center shadow-md"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-red-500">Employment</span>{' '}
          <span className="text-white">Management System</span>
        </h1>
        <motion.div
          className="mx-auto mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-red-400"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.25 }}
        />
      </motion.header>

      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          variants={fadeUp}
          className="w-full max-w-3xl"
        >
          <motion.div
            variants={fadeUp}
            className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl"
            whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.35)" }}
          >
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-center text-gray-200"
            >
              Welcome to the Employment Management System. Choose your portal to get started.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col md:flex-row items-center justify-center gap-5"
            >
              <Link to="/EmployeeLogin" className="w-full md:w-auto">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full md:w-auto bg-blue-400 text-black px-8 py-4 rounded-2xl text-lg md:text-xl font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300/70 focus:ring-offset-2 focus:ring-offset-gray-900 hover:bg-blue-300 transition"
                >
                  Login as Employee
                </motion.button>
              </Link>

              <Link to="/AdminLogin" className="w-full md:w-auto">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full md:w-auto bg-yellow-500 px-8 py-4 rounded-2xl text-lg md:text-xl font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400/70 focus:ring-offset-2 focus:ring-offset-gray-900 hover:bg-yellow-400 transition"
                >
                  Login as Admin
                </motion.button>
              </Link>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-center text-sm text-gray-400"
            >
              Don’t have an account? Contact your administrator for access.
            </motion.p>
          </motion.div>
        </motion.div>
      </main>

      <motion.footer
        variants={fadeUp}
        className="bg-black/60 backdrop-blur border-t border-white/10 text-gray-400 text-center py-4"
      >
        &copy; {new Date().getFullYear()} Employment Management System. All rights reserved.
      </motion.footer>
    </motion.div>
  );
}
