import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

import {
  CheckSquare,
  Mail,
  Lock,
  ArrowRight,
  Cpu,
  Globe,
  Code
} from 'lucide-react';


import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, socialLogin, loading, error } = useAuthStore();

  const navigate = useNavigate();

  const handleSocialLogin = async (provider) => {
    await socialLogin(provider);
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);

    if (!useAuthStore.getState().error) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#020617] transition-colors relative overflow-hidden">

      {/* Ambient Glow */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] -z-10"></div>

      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >

          {/* LOGO */}
          <div className="flex items-center gap-3 mb-16">

            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center rounded-2xl shadow-2xl shadow-indigo-500/30">
              <CheckSquare size={24} strokeWidth={3} />
            </div>

            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              TaskFlow
            </span>
          </div>

          {/* HEADING */}
          <div className="mb-12">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tight">
              WELCOME <br />
              <span className="text-indigo-600 dark:text-indigo-500">
                BACK.
              </span>
            </h2>

            <p className="mt-4 text-slate-500 dark:text-slate-400 font-semibold text-sm tracking-wide uppercase">
              Sign in to continue your productivity workflow.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 p-5 rounded-2xl mb-6"
            >
              <p className="text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={14} />
                {error}
              </p>
            </motion.div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <div className="relative group">

              <Mail
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                size={18}
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white font-semibold text-sm shadow-sm"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative group">

              <Lock
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                size={18}
              />

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white font-semibold text-sm shadow-sm"
              />
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end px-2">
              <Link
                to="/forgot-password"
                className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] text-[11px] font-black flex items-center justify-center gap-3 transition-all shadow-2xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 uppercase tracking-widest"
            >
              {loading ? 'Signing In...' : 'Login'}

              {!loading && (
                <ArrowRight size={18} strokeWidth={3} />
              )}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="mt-12">

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
              </div>

              <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-[0.3em]">
                <span className="px-6 bg-white dark:bg-[#020617] text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="mt-8 grid grid-cols-2 gap-4">

              {/* GOOGLE */}
              <button
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-3 py-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm uppercase tracking-widest"
              >
                <Globe size={16} />
                Google
              </button>

              {/* GITHUB */}
              <button
                onClick={() => handleSocialLogin('GitHub')}
                className="flex items-center justify-center gap-3 py-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm uppercase tracking-widest"
              >
                <Code size={16} />
                GitHub
              </button>
            </div>
          </div>

          {/* REGISTER */}
          <p className="mt-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Don&apos;t have an account?{' '}

            <Link
              to="/register"
              className="text-indigo-600 dark:text-indigo-500 hover:underline"
            >
              Register
            </Link>
          </p>

        </motion.div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">

        <div className="absolute inset-0 bg-slate-950"></div>

        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-violet-950 opacity-90"></div>

        {/* Grid Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(99,102,241,0.08) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        ></div>

        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full"></div>

        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/10 blur-[120px] rounded-full"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 p-20 max-w-2xl text-center"
        >

          {/* ICON */}
          <div className="w-24 h-24 bg-white/5 backdrop-blur-2xl rounded-[32px] flex items-center justify-center mx-auto mb-12 border border-white/10 shadow-2xl">
            <Cpu
              size={48}
              className="text-indigo-400"
              strokeWidth={1.5}
            />
          </div>

          {/* TITLE */}
          <h1 className="text-6xl font-black text-white mb-8 leading-[1] tracking-tight">
            Strategic <br />
            <span className="text-indigo-500">
              Flow.
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="text-indigo-100/50 text-sm font-bold uppercase tracking-[0.4em] leading-relaxed max-w-sm mx-auto">
            Organize projects, teams, and workflows with intelligent productivity systems.
          </p>

          {/* STATS */}
          <div className="mt-16 flex justify-center gap-10">

            <div className="text-center">
              <p className="text-2xl font-black text-white tracking-tight">
                12ms
              </p>

              <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1">
                Latency
              </p>
            </div>

            <div className="w-px h-10 bg-white/10"></div>

            <div className="text-center">
              <p className="text-2xl font-black text-white tracking-tight">
                99.9%
              </p>

              <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1">
                Uptime
              </p>
            </div>

            <div className="w-px h-10 bg-white/10"></div>

            <div className="text-center">
              <p className="text-2xl font-black text-white tracking-tight">
                E2E
              </p>

              <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1">
                Security
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;