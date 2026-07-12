import { motion } from "framer-motion";
import TaskListNumber from "../other/tasklistnumber";
import TaskList from "../other/tasklist/tasklist";

const Employeedeshboard = () => {
  return (
    <motion.div
      className="space-y-6 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-white/10 bg-gray-900/70 p-6 shadow-lg backdrop-blur-xl"
      >
        <h2 className="mb-4 text-xl font-semibold text-blue-300">Overview</h2>
        <TaskListNumber />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-white/10 bg-gray-900/70 p-6 shadow-lg backdrop-blur-xl"
      >
        <h2 className="mb-4 text-xl font-semibold text-blue-300">
          Your Tasks
        </h2>
        <TaskList />
      </motion.section>
    </motion.div>
  );
};

export default Employeedeshboard;
