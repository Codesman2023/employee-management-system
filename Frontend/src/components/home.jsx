import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="h-screen bg-gradient-to-l from-gray-900 via-gray-300 to-black text-white flex flex-col">
      {/* Header */}
      <header className="text-4xl font-bold py-6 text-center tracking-wide shadow-md">
        Employment Management System
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center space-y-10">
        <p className="text-xl md:text-2xl text-center max-w-2xl px-4">
          Welcome to the Employment Management System. Choose your portal to get started.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <Link to="/EmployeeLogin">
            <button className="bg-yellow-400 text-black hover:bg-yellow-300 transition duration-300 ease-in-out px-8 py-4 rounded-2xl text-xl font-semibold shadow-lg hover:scale-105">
              Login as Employee
            </button>
          </Link>

          <Link to="/AdminLogin">
            <button className="bg-red-500 hover:bg-red-400 transition duration-300 ease-in-out px-8 py-4 rounded-2xl text-xl font-semibold shadow-lg hover:scale-105">
              Login as Admin
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 text-center py-3 shadow-inner">
        &copy; {new Date().getFullYear()} Employment Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
