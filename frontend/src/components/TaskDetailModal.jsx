import { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Flag,
  MessageSquare,
  Paperclip,
  CheckSquare,
  MoreHorizontal,
  Edit2,
  Trash2,
  Star,
  Users,
  Clock,
  Plus,
  ChevronDown,
  Share2,
  Copy,
  Archive,
  Download,
  Zap,
  TrendingUp,
  AlertCircle,
  Hash,
  Send,
  MoreVertical,
  Maximize2,
  Minimize2,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../store/authStore';
import toast from 'react-hot-toast';

const TaskDetailModal = ({ task, isOpen, onClose, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isFavorite, setIsFavorite] = useState(task?.isFavorite || false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState('');
  const [localSubtasks, setLocalSubtasks] = useState(task?.subtasks || []);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  useEffect(() => {
    if (task) {
      setLocalSubtasks(task.subtasks || []);
      setIsFavorite(task.isFavorite || false);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const priorityColors = {
    HIGH: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    MEDIUM: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    LOW: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  };

  const statusColors = {
    'TO DO': 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    'IN PROGRESS': 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    'REVIEW': 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    'DONE': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  };

  const toggleSubtask = async (index) => {
    const updated = [...localSubtasks];
    updated[index].completed = !updated[index].completed;
    setLocalSubtasks(updated);
    try {
      await api.put(`/tasks/${task._id}`, { subtasks: updated });
      onUpdate();
    } catch (error) {
      toast.error('Sync failed');
    }
  };

  const calculateProgress = () => {
    if (!localSubtasks.length) return 0;
    const completed = localSubtasks.filter(s => s.completed).length;
    return Math.round((completed / localSubtasks.length) * 100);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
      setIsEditingStatus(false);
      onUpdate();
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const tabs = [
    { name: 'Overview', icon: Layout },
    { name: 'Subtasks', icon: CheckSquare, count: localSubtasks.length },
    { name: 'Attachments', icon: Paperclip, count: task.attachments?.length || 0 },
    { name: 'Comments', icon: MessageSquare, count: task.comments?.length || 0 },
    { name: 'Activity', icon: Clock },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-end z-[100]">
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`${isExpanded ? 'w-full' : 'w-full max-w-2xl'} bg-white dark:bg-[#0f172a] h-full shadow-[-20px_0_50px_rgba(0,0,0,0.2)] flex flex-col transition-all duration-500`}
        >
          {/* Top Bar - Sticky Actions */}
          <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsFavorite(!isFavorite)} className={`p-2 rounded-xl transition-all ${isFavorite ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-slate-500'}`}>
                <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Hash size={12} className="text-indigo-500" />
                TASK-{task._id?.substring(0, 5)}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => setIsExpanded(!isExpanded)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all">
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all">
                <Share2 size={18} />
              </button>
              <div className="relative group">
                <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all">
                  <MoreHorizontal size={20} />
                </button>
                {/* Custom Context Menu could go here */}
              </div>
              <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all ml-2">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {/* Main Header Area */}
            <div className="px-10 pt-8 pb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <button 
                    onClick={() => setIsEditingStatus(!isEditingStatus)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${statusColors[task.status] || statusColors['TO DO']}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full bg-current`}></div>
                    {task.status}
                    <ChevronDown size={12} />
                  </button>
                  <AnimatePresence>
                    {isEditingStatus && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-30"
                      >
                        {['TO DO', 'IN PROGRESS', 'REVIEW', 'DONE'].map(s => (
                          <button 
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors flex items-center gap-3"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${statusColors[s]?.split(' ')[0]}`}></div>
                            {s}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${priorityColors[task.priority] || priorityColors.MEDIUM}`}>
                  <Flag size={12} />
                  {task.priority} Priority
                </div>
              </div>

              <h1 className="text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter mb-4 leading-tight">
                {task.title}
              </h1>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-y border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignee</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
                      {task.assignee?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{task.assignee?.name || 'Unassigned'}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline</p>
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400">
                      <Calendar size={14} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Set date'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Estimate</p>
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400">
                      <Clock size={14} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">4.5 hours</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</p>
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                      <Zap size={14} />
                    </div>
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">High Volatility</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Tabs */}
            <div className="px-10 border-b border-slate-100 dark:border-slate-800 sticky top-[72px] bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md z-10 flex items-center gap-8">
              {tabs.map(tab => (
                <button 
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 ${
                    activeTab === tab.name 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.name}
                  {tab.count !== undefined && (
                    <span className="bg-slate-50 dark:bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md text-[9px]">{tab.count}</span>
                  )}
                  {activeTab === tab.name && (
                    <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-10">
              <AnimatePresence mode="wait">
                {activeTab === 'Overview' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                  >
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Archive size={12} /> Strategic Intent
                      </h3>
                      <div className="prose dark:prose-invert prose-sm max-w-none">
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                          {task.description || 'Enterprise-grade task description required. Define technical constraints and business logic for optimization.'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <TrendingUp size={12} /> Performance Progress
                      </h3>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <p className="text-2xl font-black text-slate-900 dark:text-white font-outfit">{calculateProgress()}%</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Operational Readiness</p>
                          </div>
                          <AlertCircle size={20} className="text-indigo-500 opacity-20" />
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${calculateProgress()}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Users size={12} /> Watchers
                      </h3>
                      <div className="flex -space-x-2">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="w-10 h-10 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden shadow-xl hover:translate-y-1 transition-transform cursor-pointer">
                            <img src={`https://i.pravatar.cc/100?u=${i+40}`} alt="watcher" />
                          </div>
                        ))}
                        <button className="w-10 h-10 rounded-2xl border-4 border-white dark:border-slate-900 bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-xl hover:scale-110 transition-transform">
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'Subtasks' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Checklist — {localSubtasks.filter(s=>s.completed).length}/{localSubtasks.length}</h3>
                      <button className="text-indigo-600 hover:text-indigo-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Plus size={14} /> Add Strata
                      </button>
                    </div>
                    <div className="space-y-3">
                      {localSubtasks.length === 0 ? (
                        <div className="py-20 text-center opacity-30">
                          <CheckSquare size={48} className="mx-auto mb-4" />
                          <p className="text-xs font-black uppercase tracking-[0.2em]">Zero Strands</p>
                        </div>
                      ) : (
                        localSubtasks.map((sub, idx) => (
                          <motion.div 
                            key={idx}
                            layout
                            className={`p-4 rounded-2xl border flex items-center gap-4 transition-all group ${sub.completed ? 'bg-slate-50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800 opacity-60' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-500/30'}`}
                          >
                            <button 
                              onClick={() => toggleSubtask(idx)}
                              className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${sub.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-500'}`}
                            >
                              {sub.completed && <X size={12} strokeWidth={4} />}
                            </button>
                            <span className={`flex-1 text-sm font-bold transition-all ${sub.completed ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                              {sub.title}
                            </span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                              <button className="p-1.5 text-slate-400 hover:text-indigo-600"><Edit2 size={14} /></button>
                              <button className="p-1.5 text-slate-400 hover:text-rose-500"><Trash2 size={14} /></button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'Comments' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col h-[500px]"
                  >
                    <div className="flex-1 overflow-y-auto pr-4 space-y-8 scrollbar-hide">
                      {task.comments?.length === 0 ? (
                        <div className="py-20 text-center opacity-30">
                          <MessageSquare size={48} className="mx-auto mb-4" />
                          <p className="text-xs font-black uppercase tracking-[0.2em]">Silent Feed</p>
                        </div>
                      ) : (
                        task.comments?.map((c, i) => (
                          <div key={i} className="flex gap-4 group">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                              {c.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1.5">
                                <span className="text-sm font-black text-slate-800 dark:text-white">{c.user?.name || 'System'}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                {c.text}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-8 relative">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Synthesize input..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[32px] p-6 text-sm dark:text-white focus:ring-4 focus:ring-indigo-500/10 min-h-[120px] resize-none outline-none transition-all pr-20"
                      />
                      <button className="absolute bottom-4 right-4 p-4 bg-indigo-600 text-white rounded-[24px] shadow-2xl shadow-indigo-500/30 hover:scale-110 active:scale-95 transition-all">
                        <Send size={20} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'Activity' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    {[
                      { type: 'Status Change', text: 'Migrated to IN PROGRESS', user: 'Architect', time: '12m ago', icon: Activity },
                      { type: 'Strata Update', text: 'Added 3 performance strands', user: 'Admin', time: '1h ago', icon: Plus },
                      { type: 'Collaboration', text: 'Socialized with 4 contributors', user: 'Engineer', time: '3h ago', icon: Users },
                      { type: 'Optimization', text: 'Enhanced description metadata', user: 'Admin', time: '1d ago', icon: Edit2 },
                    ].map((act, idx) => (
                      <div key={idx} className="flex gap-6 relative group">
                        {idx !== 3 && <div className="absolute left-5 top-10 bottom-0 w-px bg-slate-100 dark:border-slate-800 border-dashed border-l-2"></div>}
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <act.icon size={16} />
                        </div>
                        <div className="pb-8">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{act.type}</span>
                            <span className="text-[9px] font-bold text-slate-400">{act.time}</span>
                          </div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {act.user} <span className="font-medium text-slate-400">{act.text}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0f172a]/50 flex justify-between items-center">
            <button 
              onClick={() => {
                if(window.confirm('Terminate this task?')) onDelete(task._id);
              }}
              className="px-6 py-3 rounded-2xl bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
            >
              <Trash2 size={16} /> Terminate
            </button>
            <div className="flex items-center gap-4">
              <button className="p-3 text-slate-400 hover:text-indigo-600 bg-white dark:bg-slate-800 rounded-2xl shadow-sm transition-all">
                <Copy size={20} />
              </button>
              <button className="p-3 text-slate-400 hover:text-indigo-600 bg-white dark:bg-slate-800 rounded-2xl shadow-sm transition-all">
                <Archive size={20} />
              </button>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
              <button className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all">
                Finalize
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskDetailModal;
