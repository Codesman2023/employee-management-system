import React from "react";
import EmployeeHeader from "../other/EmployeeHeader";
import TaskListNumber from "../other/tasklistnumber";
import TaskList from "../other/tasklist/tasklist";

const Employeedeshboard = () => {
  return (
    <div className="relative min-h-screen overflow-y-auto text-white">
      <div className="absolute inset-0 -z-10">
        
        <div className="h-full w-full bg-gradient-to-r from-sky-800 via-sky-900 to-gray-900" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)] bg-[size:14px_24px]" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] bg-blue-300 opacity-20 blur-[100px] rounded-full" />
      </div>

      <section className="backdrop-blur-sm bg-white/10 shadow-md border-b border-white/20 py-4 px-6">
        <EmployeeHeader />
      </section>

      <section className="backdrop-blur-sm bg-white/10 shadow-md border-y border-white/10 my-6 mx-4 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-200">Overview</h2>
        <TaskListNumber />
      </section>

      <section className="backdrop-blur-sm bg-white/10 shadow-md border border-white/10 mx-4 mb-10 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-200">Your Tasks</h2>
        <TaskList />
      </section>
    </div>
  );
};

export default Employeedeshboard;
