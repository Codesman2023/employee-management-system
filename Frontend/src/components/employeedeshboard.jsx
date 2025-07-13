import React from "react";
import EmployeeHeader from "../other/EmployeeHeader";
import TaskListNumber from "../other/tasklistnumber";
import TaskList from "../other/tasklist/tasklist";

const employeedeshboard = () => {
  return (
    <div className="absolute inset-0 -z-10 h-screen w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px] p-10">Employee Dashboard</div>
      <EmployeeHeader />
      <TaskListNumber />
      <TaskList />
    </div>
  );
};

export default employeedeshboard;
