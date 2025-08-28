import React from "react";
import { motion } from "framer-motion";
import AdminHeader from "../other/AdminHeader";
import Createtask from "../other/createtask";
import AllTask from "../other/alltask";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, when: "beforeChildren" } }
};

const sectionVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 130, damping: 16 } }
};

const headerVariant = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 160, damping: 18 } }
};

export default function AdminDashboard() {
  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white relative"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <motion.div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]"
        aria-hidden
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0.75 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] bg-amber-400 opacity-20 blur-[100px] rounded-full -z-20"
        aria-hidden
        initial={{ scale: 0.98, opacity: 0.14 }}
        animate={{ scale: 1.02, opacity: 0.22 }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
      />

      <motion.header variants={headerVariant} className="sticky top-0 z-10 w-full p-4 bg-blue-600 text-white flex items-center justify-center text-2xl font-bold tracking-wide">
        Admin Dashboard
      </motion.header>

      <main className="flex flex-col gap-6 px-4 py-8">
        <motion.section variants={sectionVariant} className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/20">
          <AdminHeader />
        </motion.section>

        <motion.section variants={sectionVariant} className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/20">
          <h2 className="text-2xl font-semibold text-amber-300 mb-4">Create Task</h2>

          {/* subtle lift effect on the create task area */}
          <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
            <Createtask />
          </motion.div>
        </motion.section>

        <motion.section variants={sectionVariant} className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/20 mb-10">
          <h2 className="text-2xl font-semibold text-amber-300 mb-4">All Tasks</h2>

          {/* fade in the task list; for per-item animations update AllTask's list items */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <AllTask />
          </motion.div>
        </motion.section>
      </main>

      <motion.footer className="bg-gray-950 text-gray-400 text-center py-3 shadow-inner" variants={sectionVariant}>
        &copy; {new Date().getFullYear()} Employment Management System. All rights reserved.
      </motion.footer>
    </motion.div>
  );
}
