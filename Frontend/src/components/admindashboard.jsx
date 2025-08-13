import React from "react";
import AdminHeader from "../other/AdminHeader";
import Createtask from "../other/createtask";
import AllTask from "../other/alltask";

const AdminDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white relative">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] bg-amber-400 opacity-20 blur-[100px] rounded-full -z-20" />

      <header className="sticky top-0 z-10 w-full p-4 bg-blue-600 text-white flex items-center justify-center text-2xl font-bold tracking-wide">
        Admin Dashboard
      </header>

      <main className="flex flex-col gap-6 px-4 py-8">
        <section className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/20">
          <AdminHeader />
        </section>

        <section className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/20">
          <h2 className="text-2xl font-semibold text-amber-300 mb-4">
            Create Task
          </h2>
          <Createtask />
        </section>

        <section className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/20 mb-10">
          <h2 className="text-2xl font-semibold text-amber-300 mb-4">
            All Tasks
          </h2>
          <AllTask />
        </section>
      </main>

      <footer className="bg-gray-950 text-gray-400 text-center py-3 shadow-inner">
        &copy; {new Date().getFullYear()} Employment Management System. All
        rights reserved.
      </footer>
    </div>
  );
};

export default AdminDashboard;
