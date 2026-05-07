import { useState, useEffect } from 'react';
import { X, Calendar, Flag, MessageSquare, CheckCircle2, Layout, Tag, User, Plus, Target, Zap, Clock } from 'lucide-react';
import { api } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    priority: 'MEDIUM',
    status: 'TO DO',
    dueDate: '',
    assignee: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      fetchUsers();
    }
  }, [isOpen]);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
      if (data.length > 0 && !formData.project) {
        setFormData(prev => ({ ...prev, project: data[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching projects', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.project) {
      return toast.error('Required fields: Title, Project');
    }

    setLoading(true);
    try {
      await api.post('/tasks', formData);
      toast.success('Task strand initialized');
      onTaskCreated();
      onClose();
      setFormData({
        title: '',
        description: '',
        project: projects[0]?._id || '',
        priority: 'MEDIUM',
        status: 'TO DO',
        dueDate: '',
        assignee: ''
      });
    } catch (error) {
      toast.error('Initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card dark:bg-slate-900 rounded-[48px] w-full max-w-xl shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800"
          >
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                    <Plus size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter">Construct Strata</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Operational Task Deployment</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400 hover:text-rose-500">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Objective Title</label>
                  <input
                    type="text"
                    placeholder="Enter objective..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-[22px] text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Workspace Hub</label>
                    <div className="relative">
                      <Layout className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        value={formData.project}
                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-[22px] text-xs focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white font-black uppercase tracking-widest appearance-none"
                        required
                      >
                        <option value="" disabled>Select Core</option>
                        {projects.map(p => (
                          <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Agent</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        value={formData.assignee}
                        onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-[22px] text-xs focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white font-black uppercase tracking-widest appearance-none"
                      >
                        <option value="">Neural Select</option>
                        {users.map(u => (
                          <option key={u._id} value={u._id}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Strata</label>
                    <div className="relative">
                      <Zap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-[22px] text-xs focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white font-black uppercase tracking-widest appearance-none"
                      >
                        <option value="LOW">Optimized</option>
                        <option value="MEDIUM">Standard</option>
                        <option value="HIGH">Critical</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sync Deadline</label>
                    <div className="relative">
                      <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-[22px] text-xs focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white font-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Strategic Context</label>
                  <textarea
                    placeholder="Describe execution path..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-[22px] text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white font-medium resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4"
                >
                  {loading ? 'Initializing...' : 'Deploy Strata'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateTaskModal;
