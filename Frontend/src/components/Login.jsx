import { useContext, useState, useEffect } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Clock3 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } }
};

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const now = useClock();
  const prefersReduced = useReducedMotion();

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { token, role, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      setUser(user);

      navigate(role === "admin" ? "/admindashboard" : "/employeedashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const motionProps = prefersReduced ? { initial: "visible", animate: "visible" } : { initial: "hidden", animate: "visible" };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono-ems { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.2),_transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_45%,rgba(255,255,255,0.03))]" />

        <div className="relative z-10 flex min-h-screen flex-col">
          <motion.header
            {...motionProps}
            variants={container}
            className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <Link
                to="/"
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
                aria-label="Back to home"
              >
                <FaHome className="text-base" />
              </Link>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">Employee portal</p>
                <p className="text-sm font-semibold text-white">Management System</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[11px] font-medium text-slate-300 backdrop-blur sm:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="hidden sm:inline">{date}</span>
              <span>{time}</span>
            </motion.div>
          </motion.header>

          <main className="flex flex-1 items-center px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
              <motion.section variants={fadeUp} className="space-y-6">
                <div className="inline-flex items-center rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-sm font-medium text-amber-200">
                  Secure, fast access for your team
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                    Sign in and keep work moving.
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                    Access attendance, leave updates, and employee tasks in one streamlined workspace.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { title: "Attendance", text: "Track check-ins in real time" },
                    { title: "Leave", text: "Manage requests quickly" },
                    { title: "Tasks", text: "Stay aligned with priorities" }
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-lg shadow-black/20 backdrop-blur">
                      <h2 className="text-sm font-semibold text-white">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{item.text}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={fadeUp} className="mx-auto w-full max-w-xl">
                <motion.div
                  variants={badgeInline}
                  initial={prefersReduced ? "visible" : "hidden"}
                  animate="visible"
                  className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Welcome back</p>
                      <h2 className="mt-1 text-2xl font-semibold text-white">Sign in to continue</h2>
                    </div>
                    <div className="flex items-center gap-1 rounded-2xl border border-emerald-400/25 bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300">
                      <ShieldCheck className="h-4 w-4" />
                      Secure
                    </div>
                  </div>

                  <form onSubmit={submitHandler} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-3 pl-10 pr-4 text-sm text-slate-100 transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-3 pl-10 pr-11 text-sm text-slate-100 transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {error && (
                      <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                        {error}
                      </p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -1 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                      className="mt-1 w-full rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-500 px-6 py-3.5 text-lg font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                    >
                      {isSubmitting ? "Signing in�" : "Log in"}
                    </motion.button>
                  </form>

                  <p className="mt-5 text-center text-sm text-slate-400">
                    Need access? <span className="font-medium text-slate-200">Contact your administrator.</span>
                  </p>
                  <p className="mt-2 text-center text-sm">
                    <Link to="/forgot-password" className="font-semibold text-amber-400 hover:text-amber-300 hover:underline">
                      Forgot password?
                    </Link>
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-dashed border-white/10 pt-4 text-[10px] uppercase tracking-[0.25em] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock3 className="h-3 w-3" /> {time}
                    </span>
                    <span>ID: EMS-LOGIN-002</span>
                  </div>
                </motion.div>
              </motion.section>
            </div>
          </main>

          <motion.footer
            {...motionProps}
            variants={fadeUp}
            className="border-t border-white/10 bg-slate-950/70 px-4 py-4 text-center text-sm text-slate-400 sm:px-6 lg:px-8"
          >
            &copy; {now.getFullYear()} Employment Management System. All rights reserved.
          </motion.footer>
        </div>
      </div>
    </div>
  );
}

const badgeInline = {
  hidden: { opacity: 0, y: -24, rotate: -6 },
  visible: { opacity: 1, y: 0, rotate: 0, transition: { type: "spring", stiffness: 110, damping: 13, delay: 0.1 } }
};