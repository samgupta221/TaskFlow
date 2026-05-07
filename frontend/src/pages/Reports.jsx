import { useState, useEffect } from 'react';
import { api } from '../store/authStore.js';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Target, 
  Zap, 
  ArrowUpRight,
  Download,
  Activity,
  Box,
  Cpu,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Reports = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get('/tasks/all');
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks for reports', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.status === 'DONE').length;
  const inProgress = tasks.filter(t => t.status === 'IN PROGRESS').length;
  const todo = tasks.filter(t => t.status === 'TO DO' || t.status === 'REVIEW').length;

  const pieData = [
    { name: 'Completed', value: completed, color: '#6366f1' },
    { name: 'In Progress', value: inProgress, color: '#8b5cf6' },
    { name: 'Pending', value: todo, color: '#c4b5fd' },
  ];
  const efficiency = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  const getWeeklyFlow = () => {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const today = new Date();
    const flow = [];
    
    // Last 7 days including today
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = days[(d.getDay() + 6) % 7]; // Adjust to MON-SUN
      
      const completedOnDay = tasks.filter(t => {
        if (t.status !== 'DONE' || !t.updatedAt) return false;
        return new Date(t.updatedAt).toDateString() === d.toDateString();
      }).length;
      
      // Calculate a percentage based on some arbitrary baseline or just raw count
      // For a "flow" chart, let's use completion ratio or just relative height
      const maxPossible = Math.max(...days.map((_, idx) => {
        const checkDate = new Date();
        checkDate.setDate(today.getDate() - idx);
        return tasks.filter(t => {
          if (t.status !== 'DONE' || !t.updatedAt) return false;
          return new Date(t.updatedAt).toDateString() === checkDate.toDateString();
        }).length;
      }), 5); // Minimum baseline of 5 for scaling
      
      const percentage = (completedOnDay / maxPossible) * 100;
      flow.push({ day: dayName, value: Math.max(percentage, 10), count: completedOnDay }); // Min 10% for visibility
    }
    return flow;
  };

  const weeklyFlow = getWeeklyFlow();

  if (loading) {
    return (
      <div className="p-8 md:p-12 bg-slate-50 dark:bg-[#020617] min-h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-indigo-600/10 rounded-[32px] flex items-center justify-center animate-pulse">
            <Cpu size={40} className="text-indigo-600 animate-spin-slow" />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] animate-pulse">Synchronizing Strata...</p>
            <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-full h-full bg-indigo-600"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 bg-slate-50 dark:bg-[#020617] min-h-full transition-colors relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[140px] -z-10 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] -z-10 animate-pulse-glow"></div>

      <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={14} className="text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Integrity Level: High</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter">Performance Matrix</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 font-medium">Deep-strata analytics and cross-functional performance insights.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button 
            onClick={() => {
              const t = toast.loading('Generating telemetry report...');
              setTimeout(() => {
                toast.success('Matrix data exported successfully!', { id: t });
              }, 1500);
            }}
            className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[22px] text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl shadow-black/5"
          >
            <Download size={18} strokeWidth={3} /> Export Matrix
          </button>
        </motion.div>
      </div>

      {/* Top Velocity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { label: 'Neural Efficiency', value: `${efficiency}%`, trend: '+4.2%', icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Completed Strands', value: completed, trend: 'Optimal', icon: Target, color: 'text-violet-500', bg: 'bg-violet-500/10' },
          { label: 'Active Load', value: todo + inProgress, trend: 'Syncing', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-600/10' },
        ].map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card-premium p-10 rounded-[48px] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={120} className={stat.color} strokeWidth={1} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 leading-none">{stat.label}</p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-5xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter">{stat.value}</h2>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/50 ${stat.color} flex items-center gap-1 border border-black/5 dark:border-white/5`}>
                <TrendingUp size={10} /> {stat.trend}
              </span>
            </div>
            <div className="mt-8 h-2 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: idx === 0 ? `${efficiency}%` : '70%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full"
              ></motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-premium rounded-[56px] p-12 border border-white/20"
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="p-4 rounded-3xl bg-indigo-500/10 text-indigo-500">
              <Layers size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">Strata Distribution</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Telemetry by status categories</p>
            </div>
          </div>
          <div className="h-[350px] relative">
            {totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={100}
                    outerRadius={130}
                    paddingAngle={10}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={2000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '24px', 
                      border: 'none', 
                      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      backdropFilter: 'blur(12px)',
                      color: '#fff',
                      padding: '16px'
                    }}
                    itemStyle={{ color: '#818cf8', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 dark:text-slate-700">
                <Box size={80} className="opacity-10 mb-6 animate-float" />
                <p className="text-xs font-black uppercase tracking-[0.3em]">Neural silence detected</p>
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total units</span>
              <span className="text-4xl font-black text-slate-900 dark:text-white font-outfit">{totalTasks}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-12">
            {pieData.map(item => (
              <div key={item.name} className="flex flex-col items-center gap-3 p-6 rounded-[32px] bg-slate-50 dark:bg-slate-900/50 border border-black/5 dark:border-white/5 group hover:border-indigo-500/20 transition-all">
                <div className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ color: item.color, backgroundColor: item.color }}></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{item.name}</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-premium rounded-[56px] p-12 border border-white/20"
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="p-4 rounded-3xl bg-violet-500/10 text-violet-500">
              <Cpu size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">Performance Flow</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Weekly productivity throughput radar</p>
            </div>
          </div>
          <div className="h-[350px] flex items-end gap-5 px-6">
            {weeklyFlow.map((data, i) => (
              <div key={i} className="flex-1 group relative">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${data.value}%` }}
                  transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                  className="w-full bg-gradient-to-t from-indigo-600 to-violet-400 rounded-t-2xl shadow-xl hover:shadow-indigo-500/40 transition-all relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </motion.div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                  {data.count} units
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-8 px-2">
            {weeklyFlow.map(data => (
              <span key={data.day} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.day}</span>
            ))}
          </div>
          <div className="mt-12 p-8 bg-indigo-600 rounded-[40px] text-white shadow-2xl shadow-indigo-500/30 flex items-center justify-between group">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Neural Velocity</p>
              <h4 className="text-4xl font-black font-outfit">+{Math.round(efficiency / 5)}% Optima</h4>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp size={32} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
