import { useState, useEffect } from 'react';
import useAuthStore, { api } from '../store/authStore.js';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Layout, 
  Plus, 
  TrendingUp, 
  Users,
  Calendar as CalendarIcon,
  Search,
  ChevronRight,
  MoreVertical,
  Activity,
  Zap,
  Target,
  ArrowUpRight,
  MousePointer2,
  Globe,
  Shield,
  Box,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ReTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CreateProjectModal from '../components/CreateProjectModal';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks/all')
        ]);
        setProjects(projRes.data);
        setTasks(taskRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Real Stats from Database
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { title: 'Total Strata', value: totalProjects, icon: Layers, color: 'text-indigo-500', bg: 'bg-indigo-500/10', trend: '+12.5%' },
    { title: 'Active Units', value: totalTasks - completedTasks, icon: Activity, color: 'text-violet-500', bg: 'bg-violet-500/10', trend: '+4.2%' },
    { title: 'Sync Integrity', value: `${completionRate}%`, icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-600/10', trend: '+8.1%' },
    { title: 'Network Load', value: '1.2GB', icon: Globe, color: 'text-indigo-400', bg: 'bg-indigo-400/10', trend: 'Optimal' },
  ];

  const getChartData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      const count = tasks.filter(t => {
        if (t.status !== 'DONE') return false;
        return new Date(t.updatedAt).toDateString() === d.toDateString();
      }).length;
      last7Days.push({ name: dayName, value: count });
    }
    return last7Days;
  };

  const chartData = getChartData();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="p-8 md:p-12 bg-slate-50 dark:bg-[#020617] min-h-full transition-colors relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[140px] -z-10 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] -z-10 animate-pulse-glow"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Neural Interface Active</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter flex items-center gap-3">
            Operational Hub
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 font-medium max-w-lg leading-relaxed">
            Welcome back, <span className="font-bold text-indigo-600 dark:text-indigo-400">{user?.name}</span>. Synchronizing global workspace telemetry and performance strands.
          </p>
        </div>
        {(user?.role === 'Admin' || user?.role === 'Manager') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative px-8 py-4 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            <div className="relative z-10 flex items-center gap-2.5">
              <Plus size={20} strokeWidth={3} /> INITIALIZE STRATA
            </div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        )}
      </motion.div>

      {/* Futuristic Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
      >
        {stats.map((stat) => (
          <motion.div 
            key={stat.title} 
            variants={item}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-card-premium rounded-[40px] p-8 group transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -z-10 group-hover:opacity-100 opacity-0 transition-opacity"></div>
            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 rounded-[22px] ${stat.bg} ${stat.color} transition-all group-hover:scale-110 group-hover:rotate-6 duration-500 shadow-sm`}>
                <stat.icon size={28} strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800/50 shadow-sm">
                <TrendingUp size={10} className="text-indigo-500" />
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-2">{stat.title}</p>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter">{stat.value}</h2>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 mb-12">
        {/* Main Analytics Card - Bento Style */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-2 glass-card-premium rounded-[48px] p-12 relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-12 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-tight flex items-center gap-3">
                <BarChart3 className="text-indigo-500" size={24} /> Velocity Matrix
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Real-time task completion throughput & efficiency</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"></div>
                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Global Efficiency</span>
              </div>
            </div>
          </div>
          
          <div className="h-[400px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.1)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                  dy={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                />
                <ReTooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(12px)',
                    color: '#fff',
                    padding: '16px'
                  }}
                  itemStyle={{ color: '#818cf8', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  strokeWidth={5} 
                  fillOpacity={1} 
                  fill="url(#velocityGrad)" 
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Project Health / Active Feed - Bento Style */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card-premium rounded-[48px] p-12 flex flex-col relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-tight flex items-center gap-3">
              <Target className="text-violet-500" size={24} /> Active Strands
            </h3>
            <Link to="/projects" className="p-3 bg-white dark:bg-slate-800/50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 dark:border-slate-800 shadow-sm">
              <ChevronRight size={22} />
            </Link>
          </div>
          
          <div className="space-y-6 flex-1 overflow-y-auto scrollbar-hide pr-2">
            {loading ? (
              <div className="space-y-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-24 bg-slate-100 dark:bg-slate-900/50 rounded-[32px] animate-pulse"></div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-30">
                <Box size={64} className="text-slate-400 mb-6 animate-float" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Zero telemetry detected</p>
              </div>
            ) : (
              projects.slice(0, 5).map((project) => (
                <Link 
                  key={project._id} 
                  to={`/project/${project._id}`}
                  className="block p-6 rounded-[32px] bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 hover:border-indigo-500/40 transition-all group shadow-sm hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-[13px] font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{project.name}</h4>
                    <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                      72% Readiness
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden mb-5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '72%' }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2.5">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-xl border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden shadow-lg">
                          <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="user" />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-xl border-2 border-white dark:border-slate-900 bg-indigo-600 flex items-center justify-center text-white text-[9px] font-black shadow-lg">
                        +5
                      </div>
                    </div>
                    <ArrowUpRight size={18} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                </Link>
              ))
            )}
          </div>
          
          <div className="mt-10 p-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[40px] text-white shadow-2xl shadow-indigo-500/30 relative group overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2">Neural Synergy</h4>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black font-outfit tracking-tighter">+14.8%</p>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Efficiency Shift</span>
              </div>
            </div>
            <Zap className="absolute top-8 right-8 opacity-20 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" size={48} fill="currentColor" />
          </div>
        </motion.div>
      </div>

      {isModalOpen && (
        <CreateProjectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onProjectCreated={() => {
            api.get('/projects').then(res => setProjects(res.data));
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
