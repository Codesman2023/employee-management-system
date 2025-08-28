import React from "react";
import { motion } from "framer-motion";
import EmployeeHeader from "../other/EmployeeHeader";
import TaskListNumber from "../other/tasklistnumber";
import TaskList from "../other/tasklist/tasklist";

const container = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12, when: "beforeChildren" }
  }
};

const sectionVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
};

const pulse = {
  hidden: { scale: 1 },
  visible: { scale: 1, transition: { repeat: Infinity, repeatType: "reverse", duration: 6 } }
};

const Employeedeshboard = () => {
  return (
    <motion.div
      className="relative min-h-screen overflow-y-auto text-white"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="h-full w-full bg-gradient-to-r from-sky-800 via-sky-900 to-gray-900"
          variants={pulse}
          aria-hidden
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)] bg-[size:14px_24px]" />

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] bg-blue-300 opacity-20 blur-[100px] rounded-full"
          initial={{ scale: 0.95, opacity: 0.18 }}
          animate={{ scale: 1.03, opacity: 0.22 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
          aria-hidden
        />
      </div>

      <motion.section
        variants={sectionVariant}
        className="backdrop-blur-sm bg-white/10 shadow-md border-b border-white/20 py-4 px-6"
      >
        <EmployeeHeader />
      </motion.section>

      <motion.section
        variants={sectionVariant}
        className="backdrop-blur-sm bg-white/10 shadow-md border-y border-white/10 my-6 mx-4 rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-blue-200">Overview</h2>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <TaskListNumber />
        </motion.div>
      </motion.section>

      <motion.section
        variants={sectionVariant}
        className="backdrop-blur-sm bg-white/10 shadow-md border border-white/10 mx-4 mb-10 rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-blue-200">Your Tasks</h2>

        {/* Wrap TaskList so it fades in. If you want per-item animation, update TaskList to use framer-motion on its list items. */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <TaskList />
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default Employeedeshboard;
