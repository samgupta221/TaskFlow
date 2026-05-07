import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Mail, 
  ArrowLeft, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  ShieldAlert,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore.js';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { forgotPassword, loading } = useAuthStore();
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await forgotPassword(email);
    if (success) {
      setSent(true);
      toast.success('Recovery cipher transmitted');
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#020617] transition-colors relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] -z-10 animate-float"></div>

      {/* Form Container */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Logo */}
          <Link to="/login" className="flex items-center gap-3 mb-16 group inline-flex">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center rounded-2xl shadow-2xl shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <CheckSquare size={24} strokeWidth={3} />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter uppercase">
              TaskFlow
            </span>
          </Link>

          {!sent ? (
            <>
              {/* Heading */}
              <div className="mb-12">
                <h2 className="text-5xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter leading-[0.9]">
                  LOST <br/><span className="text-indigo-600 dark:text-indigo-500">CIPHER.</span>
                </h2>
                <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide uppercase leading-relaxed">
                  Initiate neural recovery sequence to restore uplink access.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Registered Neural ID (Email)"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all dark:text-white font-bold text-sm shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[24px] text-[10px] font-black flex items-center justify-center gap-3 transition-all shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 uppercase tracking-widest"
                >
                  {loading ? 'TRANSMITTING...' : 'INITIATE RECOVERY'}
                  {!loading && <Zap size={18} fill="currentColor" />}
                </button>
              </form>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto mb-10 border border-emerald-500/20">
                <ShieldCheck size={48} className="text-emerald-500" strokeWidth={2} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter mb-4 uppercase">Transmission Sent.</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide uppercase leading-relaxed mb-10 max-w-sm mx-auto">
                Check your primary neural inbox for recovery instructions.
              </p>
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
              >
                <ArrowLeft size={16} strokeWidth={3} /> Return to Uplink
              </Link>
            </motion.div>
          )}

          <div className="mt-16">
            <Link 
              to="/login" 
              className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              <ChevronLeft size={16} strokeWidth={3} /> Back to Login
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right side - Visual Matrix */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-950"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-emerald-950 opacity-80"></div>
        
        {/* Animated Grid Elements */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full animate-float"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 p-20 max-w-2xl text-center"
        >
          <div className="w-24 h-24 bg-white/5 backdrop-blur-2xl rounded-[32px] flex items-center justify-center mx-auto mb-12 border border-white/10 shadow-2xl">
            <ShieldAlert size={48} className="text-emerald-400 animate-pulse" strokeWidth={1.5} />
          </div>
          <h1 className="text-6xl font-black text-white font-outfit mb-8 leading-[1] tracking-tighter uppercase">
            SECURE <br/><span className="text-emerald-500">RECOVERY.</span>
          </h1>
          <p className="text-emerald-100/40 text-sm font-black uppercase tracking-[0.4em] leading-relaxed max-w-sm mx-auto">
            High-integrity protocols for identity restoration.
          </p>
        </motion.div>
      </div>

    </div>
  );
};

export default ForgotPassword;
