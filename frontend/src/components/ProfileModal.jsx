import { X, Mail, Shield, Calendar, MapPin, Briefcase, Award, MessageSquare } from 'lucide-react';

const ProfileModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0f172a] rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800 scale-in-center relative">
        {/* Header/Cover */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 text-white rounded-xl transition-all backdrop-blur-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-10 -mt-12 text-center">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-[32px] bg-white dark:bg-slate-950 p-1.5 shadow-xl">
              <div className="w-full h-full rounded-[28px] bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-black">
                {user.name.charAt(0)}
              </div>
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-indigo-500 border-4 border-white dark:border-slate-950 rounded-full"></div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">{user.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">{user.role}</span>
          </div>

          <p className="mt-6 text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
            Experienced professional dedicated to delivering high-quality results and fostering team collaboration at TaskFlow.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                <Mail size={14} className="text-indigo-500" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Join Date</p>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                <Calendar size={14} className="text-indigo-500" />
                <span>{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button 
              onClick={() => window.location.href = `/messages?userId=${user._id}`}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} /> Send Message
            </button>
            <button className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
