import { useState, useEffect } from 'react';
import { api } from '../store/authStore.js';
import { 
  Mail, 
  Shield, 
  User, 
  MoreVertical, 
  MessageSquare, 
  Phone, 
  Video, 
  Plus, 
  Search, 
  Filter, 
  Zap, 
  Target, 
  Activity,
  Globe,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileModal from '../components/ProfileModal';
import toast from 'react-hot-toast';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await api.get('/auth/users');
        setMembers(data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const openProfile = (member) => {
    setSelectedMember(member);
    setIsProfileModalOpen(true);
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 md:p-12 bg-slate-50 dark:bg-[#020617] min-h-full transition-colors relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] -z-10 animate-pulse-glow"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={14} className="text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Neural Network Active</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter">Contributor Matrix</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">Manage and synchronize your elite team of professionals.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-wrap items-center gap-4"
        >
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search agents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-sm font-bold"
            />
          </div>
          <button className="px-6 py-3 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            <Plus size={18} strokeWidth={3} /> INVITE AGENT
          </button>
        </motion.div>
      </div>

      {/* Analytics Bento Grid for Team */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Agents', value: members.length, icon: User, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Neural Sync', value: '98.4%', icon: Zap, color: 'text-violet-500', bg: 'bg-violet-500/10' },
          { label: 'Active Strands', value: '42', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-600/10' },
          { label: 'Global Load', value: 'Low', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card-premium p-6 rounded-[32px] flex items-center gap-5 group hover:border-indigo-500/30 transition-all"
          >
            <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-outfit">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-slate-100 dark:bg-slate-900/50 rounded-[40px] animate-pulse border border-white/10"></div>
          ))
        ) : filteredMembers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-24 text-center glass-card-premium rounded-[48px]"
          >
            <Search size={64} className="mx-auto text-slate-200 dark:text-slate-800 mb-6 animate-float" />
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit">No agents detected.</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto text-sm">Expand your network or refine your telemetry search.</p>
          </motion.div>
        ) : (
          filteredMembers.map((member, idx) => (
            <motion.div 
              key={member._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -8 }}
              className="glass-card-premium rounded-[40px] p-8 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -z-10 group-hover:opacity-100 opacity-0 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-[32px] bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-violet-500/20 group-hover:scale-105 group-hover:rotate-3 transition-all">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full shadow-lg"></div>
                </div>
                <button className="text-slate-300 hover:text-indigo-600 transition-colors p-2.5 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={12} className="text-indigo-500" />
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{member.role || 'Agent'}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-tight group-hover:text-indigo-600 transition-colors">
                  {member.name}
                </h3>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 group/mail cursor-pointer hover:border-indigo-500/30 transition-all">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-400 group-hover/mail:text-indigo-500 transition-colors">
                    <Mail size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">{member.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-50 dark:border-slate-800/50">
                <button 
                  onClick={() => window.location.href = `/messages?userId=${member._id}`}
                  className="flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-[22px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <MessageSquare size={14} strokeWidth={3} /> COMMUNICATE
                </button>
                <button 
                  onClick={() => openProfile(member)}
                  className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 rounded-[22px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  <User size={14} strokeWidth={3} /> TELEMETRY
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {isProfileModalOpen && (
        <ProfileModal 
          user={selectedMember} 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Team;
