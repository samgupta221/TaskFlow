import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../store/authStore.js';
import useAuthStore from '../store/authStore.js';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Users,
  AlertCircle,
  Calendar as CalendarIcon,
  Star,
  CheckCircle2,
  Activity
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
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import CreateProjectModal from '../components/CreateProjectModal';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const { user } = useAuthStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks/all')
      ]);
      setProjects(projRes.data);
      setAllTasks(taskRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const getProjectProgress = (projectId) => {
    const projTasks = allTasks.filter(t => t.project?._id === projectId || t.project === projectId);
    if (projTasks.length === 0) return 0;
    const doneTasks = projTasks.filter(t => t.status === 'DONE').length;
    return Math.round((doneTasks / projTasks.length) * 100);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics Calculations
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const activeProjects = projects.filter(p => p.status === 'Active' || p.status === 'Planning').length;
  const overdueProjects = projects.filter(p => p.dueDate && new Date(p.dueDate) < new Date() && p.status !== 'Completed').length;
  const avgProgress = projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + getProjectProgress(p._id), 0) / projects.length) : 0;

  const stats = [
    { title: 'Total Projects', value: totalProjects, icon: FolderKanban, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { title: 'Active', value: activeProjects, icon: Zap, color: 'text-violet-500', bg: 'bg-violet-50' },
    { title: 'Completed', value: completedProjects, icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Overdue', value: overdueProjects, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { title: 'Efficiency', value: `${avgProgress}%`, icon: Target, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { title: 'Team Members', value: '12', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  const pieData = [
    { name: 'Completed', value: completedProjects, color: '#6366f1' },
    { name: 'Active', value: activeProjects, color: '#8b5cf6' },
    { name: 'Planning', value: projects.filter(p => p.status === 'Planning').length, color: '#c4b5fd' },
  ];

  return (
    <div className="p-8 bg-slate-50 dark:bg-[#020617] min-h-full transition-colors relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] -z-10"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter">
            SaaS Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Empower your team with elite project orchestration.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-wrap items-center gap-4 w-full lg:w-auto"
        >
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Deep search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-sm"
            />
          </div>
          {(user?.role === 'Admin' || user?.role === 'Manager') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary px-6 py-3 rounded-2xl font-black flex items-center gap-2 text-sm shadow-xl shadow-indigo-500/20"
            >
              <Plus size={20} />
              New Workspace
            </button>
          )}
        </motion.div>
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card dark:bg-slate-900/40 p-5 rounded-3xl border border-white/20 dark:border-slate-800 hover:border-indigo-500/30 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} dark:bg-slate-800/50 flex items-center justify-center ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5">{stat.title}</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter">{stat.value}</h4>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Projects Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white font-outfit tracking-tight flex items-center gap-2">
              <Star size={20} className="text-amber-400 fill-amber-400" />
              Featured Projects
            </h2>
            <div className="flex gap-2">
              {['All', 'Active', 'Review', 'Completed'].map(f => (
                <button 
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === f ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 hover:bg-slate-50'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-slate-100 dark:bg-slate-900/50 rounded-[40px] animate-pulse border border-white/20"></div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-24 text-center glass-card dark:bg-slate-900/40 rounded-[40px] border border-white/20">
              <Activity size={64} className="mx-auto text-slate-200 dark:text-slate-800 mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">Silence is golden.</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto text-sm">No projects matching your search criteria. Try a different query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredProjects.map((project) => {
                  const progress = getProjectProgress(project._id);
                  const projectTasks = allTasks.filter(t => t.project?._id === project._id || t.project === project._id);
                  const isOverdue = project.dueDate && new Date(project.dueDate) < new Date() && project.status !== 'Completed';
                  
                  return (
                    <motion.div 
                      key={project._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -8 }}
                      className="glass-card dark:bg-slate-900/60 rounded-[40px] p-7 border border-white/20 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group relative overflow-hidden"
                    >
                      {/* Background Glow */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 blur-3xl -z-10 group-hover:opacity-100 opacity-0 transition-opacity"></div>

                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                          <FolderKanban size={22} />
                        </div>
                        <div className="flex items-center gap-2">
                          {isOverdue && (
                            <span className="flex items-center gap-1 text-[9px] font-black bg-rose-50 dark:bg-rose-500/10 text-rose-500 px-2 py-1 rounded-lg uppercase tracking-widest">
                              <AlertCircle size={10} /> Overdue
                            </span>
                          )}
                          <button className="text-slate-300 hover:text-indigo-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </div>
                      
                      <Link to={`/project/${project._id}`} className="block mb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'Completed' ? 'bg-indigo-500' : 'bg-violet-500 animate-pulse'}`}></span>
                          <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">{project.status}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-outfit truncate">{project.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 min-h-[32px] font-medium leading-relaxed">{project.description || 'Professional workspace for elite project goals.'}</p>
                      </Link>

                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] mb-2.5">
                            <span className="text-slate-400">Momentum</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-black">{progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-2 overflow-hidden p-0.5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1.5, ease: 'easeOut' }}
                              className="bg-gradient-to-r from-indigo-600 to-violet-600 h-full rounded-full"
                            ></motion.div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                              <div key={i} className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-500 overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="avatar" />
                              </div>
                            ))}
                            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-black text-indigo-600 dark:text-indigo-400">
                              +5
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                              <Target size={14} className="text-indigo-500" />
                              <span>{projectTasks.length} Units</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800/50 flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <Clock size={12} />
                          <span>Last Sync: {new Date(project.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <Link 
                          to={`/project/${project._id}`}
                          className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          <ChevronRight size={18} />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-8">
          {/* Status Distribution Chart */}
          <div className="glass-card dark:bg-slate-900/40 p-8 rounded-[40px] border border-white/20 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-outfit mb-6 tracking-tight flex items-center gap-2">
              <Activity size={18} className="text-indigo-500" />
              Health Radar
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.9)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {pieData.map(item => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines Widget */}
          <div className="glass-card dark:bg-slate-900/40 p-8 rounded-[40px] border border-white/20 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-outfit mb-6 tracking-tight flex items-center gap-2">
              <CalendarIcon size={18} className="text-violet-500" />
              Deadlines
            </h3>
            <div className="space-y-5">
              {projects.filter(p => p.dueDate && p.status !== 'Completed').slice(0, 3).map(p => (
                <div key={p._id} className="flex gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700 transition-colors group-hover:border-indigo-500/50">
                    <span className="text-[8px] font-black text-slate-400 uppercase">{new Date(p.dueDate).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white">{new Date(p.dueDate).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 transition-colors">{p.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Due in {Math.ceil((new Date(p.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Efficiency Card */}
          <div className="relative glass-card dark:bg-slate-900/40 p-8 rounded-[40px] border border-white/20 dark:border-slate-800 overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600">
                <Users size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white font-outfit uppercase tracking-widest">Team Flow</h3>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white font-outfit">84%</h2>
              <span className="text-[10px] font-black text-indigo-500 flex items-center gap-0.5"><TrendingUp size={12} /> +2.4%</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">Your team is operating at peak performance this week.</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CreateProjectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onProjectCreated={fetchData}
        />
      )}

      {/* Quick Action FAB */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center z-50 md:hidden"
      >
        <Plus size={28} />
      </motion.button>
    </div>
  );
};

export default Projects;
