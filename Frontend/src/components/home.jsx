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

const highlights = [
  {
    title: 'Attendance',
    text: 'Track daily check-ins and keep records accurate.'
  },
  {
    title: 'Leave requests',
    text: 'Approve time-off requests with clear visibility.'
  },
  {
    title: 'Task updates',
    text: 'Keep employees aligned with daily priorities.'
  }
];

export default function Home() {
  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.2),_transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_45%,rgba(255,255,255,0.03))]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <motion.header
          variants={dropIn}
          className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
              EMS
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Employee portal</p>
              <p className="text-base font-semibold text-white">Management System</p>
            </div>
          </div>

          <Link
            to="/login"
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Access portal
          </Link>
        </motion.header>

        <main className="flex flex-1 items-center px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.section variants={fadeUp} className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-sm font-medium text-amber-200">
                Modern HR operations made simple
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                  Keep your team organized with one smart workspace.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                  From attendance and leave requests to employee task updates, this platform helps admins and employees stay connected and productive.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-lg shadow-black/20 backdrop-blur">
                    <h2 className="text-sm font-semibold text-white">{item.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section variants={fadeUp} className="mx-auto w-full max-w-xl">
              <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Welcome back</p>
                    <h2 className="mt-1 text-2xl font-semibold text-white">Sign in to continue</h2>
                  </div>
                  <div className="rounded-2xl bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300">
                    Secure access
                  </div>
                </div>

                <p className="text-base leading-7 text-slate-300">
                  Use your employee credentials to access the dashboard, review updates, and manage your day efficiently.
                </p>

                <div className="mt-6 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                    <span className="text-lg text-emerald-300">•</span>
                    <span>Quick sign-in for employees and admins</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                    <span className="text-lg text-emerald-300">•</span>
                    <span>Track daily activities from one place</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                    <span className="text-lg text-emerald-300">•</span>
                    <span>Stay updated on leaves, tasks, and attendance</span>
                  </div>
                </div>

                <Link to="/login" className="mt-7 block">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-500 px-6 py-3.5 text-lg font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
                  >
                    Login to dashboard
                  </motion.button>
                </Link>

                <p className="mt-4 text-center text-sm text-slate-400">
                  Don’t have an account? Contact your administrator for access.
                </p>
              </div>
            </motion.section>
          </div>
        </main>

        <motion.footer
          variants={fadeUp}
          className="border-t border-white/10 bg-slate-950/70 px-4 py-4 text-center text-sm text-slate-400 sm:px-6 lg:px-8"
        >
          &copy; {new Date().getFullYear()} Employment Management System. All rights reserved.
        </motion.footer>
      </div>
    </motion.div>
  );
}
