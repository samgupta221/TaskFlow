import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../store/authStore.js';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  CheckSquare, 
  Search, 
  ChevronLeft, 
  LayoutGrid, 
  List, 
  Users, 
  Activity, 
  BarChart3, 
  FileText, 
  MessageSquare,
  Zap,
  Target,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  X,
  Trash2
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as ReTooltip 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore.js';
import { useDroppable } from '@dnd-kit/core';
import toast from 'react-hot-toast';
import TaskDetailModal from '../components/TaskDetailModal.jsx';
import AddMemberModal from '../components/AddMemberModal.jsx';

// Sortable Task Item Component
const SortableTask = ({ id, task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id,
    data: { type: 'Task', task }
  });

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const priorityClasses = {
    HIGH: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20',
    MEDIUM: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20',
    LOW: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      whileHover={{ y: -4, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className={`glass-card dark:bg-slate-900/60 rounded-2xl p-5 mb-4 group cursor-pointer border border-white/20 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm transition-all ${isOverdue ? 'border-red-300 dark:border-red-500/30' : ''}`}
      onClick={() => onClick(task)}
    >
      <div className="flex justify-between items-start mb-4" {...attributes} {...listeners}>
        <div className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${priorityClasses[task.priority] || priorityClasses.MEDIUM}`}>
          {task.priority}
        </div>
        <button className="text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>
      
      <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">{task.title}</h4>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">{task.description || 'Focus on high-impact deliverables.'}</p>
      
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`}>
              <Calendar size={12} />
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-[10px] font-black text-white shadow-md">
            {task.assignedTo?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Column = ({ title, tasks, id, openModal, onTaskClick }) => {
  const { setNodeRef } = useDroppable({
    id: id,
    data: { type: 'Column', columnId: id },
  });

  return (
    <div className="flex flex-col h-full min-w-[320px] bg-slate-50/50 dark:bg-slate-900/20 rounded-[32px] p-4 border border-white/10">
      <div className="px-4 py-3 flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${
            id === 'TO DO' ? 'bg-slate-400' :
            id === 'IN PROGRESS' ? 'bg-indigo-500' :
            id === 'REVIEW' ? 'bg-violet-500' : 'bg-indigo-600'
          }`}></div>
          <h3 className="font-black text-slate-800 dark:text-white text-xs font-outfit uppercase tracking-[0.2em]">{title}</h3>
          <span className="bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] py-0.5 px-2.5 rounded-lg font-black border border-slate-100 dark:border-slate-700">
            {tasks.length}
          </span>
        </div>
        <button onClick={() => openModal(id)} className="text-slate-400 hover:text-indigo-600 transition-all p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-xl">
          <Plus size={18} />
        </button>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto max-h-[calc(100vh-380px)] scrollbar-hide">
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          <div ref={setNodeRef} className="flex-1 min-h-[150px]">
            {tasks.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                <Target size={24} className="mb-2 opacity-20" />
                <span className="text-[10px] font-black uppercase tracking-widest">Waiting for input</span>
              </div>
            ) : (
              tasks.map((task) => (
                <SortableTask key={task._id} id={task._id} task={task} onClick={onTaskClick} />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('Board');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', status: 'TO DO' });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const { user } = useAuthStore();
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/${id}`)
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching details', error);
      toast.error('Failed to load workspace');
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t._id === active.id);
    if (task) setActiveTask({ ...task });
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';
    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t._id === activeId);
        const overIndex = prev.findIndex((t) => t._id === overId);
        if (prev[activeIndex].status !== prev[overIndex].status) {
          const newTasks = [...prev];
          newTasks[activeIndex] = { ...newTasks[activeIndex], status: prev[overIndex].status };
          return arrayMove(newTasks, activeIndex, overIndex);
        }
        return arrayMove(prev, activeIndex, overIndex);
      });
    }

    if (isActiveTask && isOverColumn) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t._id === activeId);
        const newTasks = [...prev];
        newTasks[activeIndex] = { ...newTasks[activeIndex], status: String(overId).toUpperCase() };
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;
    const activeTaskData = tasks.find(t => t._id === active.id);
    if (activeTask && activeTask.status !== activeTaskData.status) {
      try {
        await api.put(`/tasks/${active.id}`, { status: activeTaskData.status });
        toast.success(`Relocated to ${activeTaskData.status}`);
      } catch (error) {
        toast.error('Sync error');
        fetchProjectAndTasks();
      }
    }
  };

  const openCreateTaskModal = (statusColumn) => {
    setNewTask({ ...newTask, status: statusColumn });
    setIsModalOpen(true);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newTask, project: id };
      if (!payload.dueDate) delete payload.dueDate;
      const { data } = await api.post('/tasks', payload);
      setTasks([...tasks, data]);
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '', status: 'TO DO' });
      toast.success('Strategy created');
    } catch (error) {
      toast.error('Strategic failure');
    }
  };

  if (!project) return <div className="p-8 text-slate-500 animate-pulse bg-slate-50 dark:bg-[#020617] h-full">Synchronizing workspace...</div>;

  const statsData = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'TO DO').length, color: '#94a3b8' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'IN PROGRESS').length, color: '#6366f1' },
    { name: 'Review', value: tasks.filter(t => t.status === 'REVIEW').length, color: '#8b5cf6' },
    { name: 'Done', value: tasks.filter(t => t.status === 'DONE').length, color: '#4f46e5' },
  ];

  const tabs = [
    { name: 'Board', icon: LayoutGrid },
    { name: 'Team', icon: Users },
    { name: 'Statistics', icon: BarChart3 },
    { name: 'Overview', icon: Target },
    { name: 'Files', icon: FileText },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#020617] transition-colors relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] -z-10 animate-pulse"></div>
      
      {/* Project Header */}
      <div className="px-10 pt-12 pb-2 glass-card dark:bg-slate-950/20 backdrop-blur-xl border-b border-white/10">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-8">
            <Link to="/projects" className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] text-slate-400 hover:text-indigo-600 transition-all shadow-sm group">
              <ChevronLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/20 relative group overflow-hidden">
              <CheckSquare size={40} className="group-hover:scale-110 transition-transform z-10" />
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter">{project.name}</h1>
                <div className="px-4 py-1.5 bg-indigo-500/10 text-indigo-500 text-[10px] font-black rounded-xl uppercase tracking-[0.2em] border border-indigo-500/20 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  Active Strategy
                </div>
              </div>
              <div className="flex items-center gap-6 mt-2.5">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl truncate">{project.description || 'Enterprise workspace for mission-critical objectives.'}</p>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <Users size={14} className="text-indigo-500" />
                  <span>{(project.members?.length || 0) + 1} Contributors</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3 mr-4">
              <div className="w-10 h-10 rounded-2xl border-4 border-slate-50 dark:border-[#020617] bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-black shadow-xl">
                {project.user?.name?.charAt(0).toUpperCase()}
              </div>
              {project.members?.slice(0, 3).map((member, i) => (
                <div key={member._id} className="w-10 h-10 rounded-2xl border-4 border-slate-50 dark:border-[#020617] bg-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-black shadow-xl">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {project.members?.length > 3 && (
                <div className="w-10 h-10 rounded-2xl border-4 border-slate-50 dark:border-[#020617] bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-xl">
                  +{project.members.length - 3}
                </div>
              )}
            </div>
            {(user?.role === 'Admin' || user?.role === 'Manager') && (
              <button 
                onClick={() => setActiveTab('Team')}
                className="flex items-center gap-2.5 px-7 py-3.5 btn-primary rounded-[22px] text-xs font-black shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus size={20} /> MANAGE TEAM
              </button>
            )}
          </div>
        </div>

        {/* View Selection */}
        <div className="flex items-center gap-10 px-4">
          {tabs.map(tab => (
            <button 
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 ${
                activeTab === tab.name 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <tab.icon size={16} />
              {tab.name}
              {activeTab === tab.name && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Content */}
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 h-full overflow-hidden p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'Board' && (
              <motion.div 
                key="board"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col"
              >
                <div className="flex-1 overflow-x-auto scrollbar-hide pb-8">
                  <DndContext 
                    sensors={sensors} 
                    collisionDetection={closestCorners} 
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex gap-8 h-full min-w-max">
                      {['TO DO', 'IN PROGRESS', 'REVIEW', 'DONE'].map((status) => (
                        <Column 
                          key={status}
                          title={status} 
                          id={status}
                          tasks={tasks.filter((t) => t.status === status)} 
                          openModal={openCreateTaskModal}
                          onTaskClick={handleTaskClick}
                        />
                      ))}
                    </div>
                    <DragOverlay>
                      {activeTask ? <SortableTask id={activeTask._id} task={activeTask} /> : null}
                    </DragOverlay>
                  </DndContext>
                </div>
              </motion.div>
            )}

            {activeTab === 'Statistics' && (
              <motion.div 
                key="stats"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full overflow-y-auto pr-2"
              >
                <div className="glass-card dark:bg-slate-900/40 p-10 rounded-[40px] border border-white/20">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-outfit mb-8 tracking-tight flex items-center gap-3">
                    <TrendingUp className="text-indigo-500" /> Task Momentum
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {statsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <ReTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-8">
                    {statsData.map(item => (
                      <div key={item.name} className="flex flex-col p-4 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-50 dark:border-slate-800">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.name}</span>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black text-slate-900 dark:text-white">{item.value}</span>
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card dark:bg-slate-900/40 p-10 rounded-[40px] border border-white/20">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-outfit mb-8 tracking-tight flex items-center gap-3">
                    <Activity className="text-violet-500" /> Performance Index
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statsData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.2)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                        <ReTooltip />
                        <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-8 p-6 bg-indigo-600 rounded-[32px] text-white shadow-2xl shadow-indigo-500/20">
                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Efficiency Target</p>
                    <h4 className="text-3xl font-black font-outfit">Project {statsData.find(s => s.name === 'Done')?.value > 0 ? Math.round((statsData.find(s => s.name === 'Done').value / tasks.length) * 100) : 0}% Optima</h4>
                    <p className="text-[10px] font-medium mt-3 opacity-90 leading-relaxed">System metrics indicate operational readiness based on current task throughput.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Team' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto h-full pr-2">
              {/* Owner Card */}
              <div className="glass-card dark:bg-slate-900/40 p-6 rounded-[32px] border border-indigo-500/30 bg-indigo-500/5 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3">
                  <span className="text-[8px] font-black bg-indigo-600 text-white px-2 py-1 rounded-lg uppercase tracking-tighter">Owner</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl shadow-lg border-2 border-white dark:border-slate-800">
                    {project.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white truncate">{project.user?.name}</h4>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">{project.user?.role || 'Lead Architect'}</p>
                  </div>
                </div>
              </div>

              {/* Members Cards */}
              {project.members?.map(member => (
                <div key={member._id} className="glass-card dark:bg-slate-900/40 p-6 rounded-[32px] border border-white/10 hover:border-indigo-500/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-black text-xl shadow-lg border-2 border-white dark:border-slate-800">
                      {member.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-slate-800 dark:text-white truncate">{member.name}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Contributor</p>
                    </div>
                    {(user?.role === 'Admin' || user?.role === 'Manager') && (
                      <button 
                        onClick={async () => {
                          if (window.confirm('Remove from strategy?')) {
                            try {
                              await api.delete(`/projects/${id}/members/${member._id}`);
                              fetchProjectAndTasks();
                              toast.success('Member detached');
                            } catch (e) { toast.error('Detach failed'); }
                          }
                        }}
                        className="text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-center px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                      <span className="text-[11px] font-black text-indigo-500">Active</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Member Card */}
              {(user?.role === 'Admin' || user?.role === 'Manager') && (
                <div className="glass-card dark:bg-slate-900/20 p-6 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center group hover:border-indigo-500/50 transition-all cursor-pointer min-h-[140px]"
                  onClick={() => setIsAddMemberModalOpen(true)}>
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all mb-3">
                    <Plus size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-500 transition-all">Expand Strategy Team</span>
                </div>
              )}
            </div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Info Panel - Activity Feed */}
        <div className="hidden 2xl:flex w-96 border-l border-white/10 glass-card dark:bg-slate-950/40 flex-col overflow-hidden">
          <div className="p-8 border-b border-white/10">
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-outfit tracking-tight flex items-center gap-3">
              <Activity size={20} className="text-indigo-500" />
              Pulse Feed
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
            {[
              { type: 'Task Move', user: 'Admin', desc: 'Migrated "API Design" to REVIEW', time: 'Just now', icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
              { type: 'Update', user: 'Architect', desc: 'Updated project milestones', time: '12m ago', icon: Activity, color: 'text-violet-500', bg: 'bg-violet-500/10' },
              { type: 'Comment', user: 'Engineer', desc: 'Discussed technical constraints', time: '1h ago', icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
              { type: 'Completion', user: 'Admin', desc: 'Finalized Dashboard UI module', time: '3h ago', icon: CheckSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { type: 'Deadline', user: 'System', desc: 'Strategy review deadline approaching', time: '5h ago', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
            ].map((act, idx) => (
              <div key={idx} className="relative pl-8 pb-8 border-l-2 border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-lg ${act.bg} border-4 border-slate-50 dark:border-[#0f172a] flex items-center justify-center ${act.color}`}>
                  <act.icon size={10} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">{act.type}</p>
                    <span className="text-[9px] text-slate-400 font-bold">{act.time}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{act.user}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-8 border-t border-white/10">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-[32px] text-white shadow-2xl shadow-indigo-500/30">
              <h4 className="text-sm font-black mb-1">Sprint Efficiency</h4>
              <p className="text-3xl font-black font-outfit">8.4x</p>
              <div className="mt-4 flex items-center gap-2">
                <ArrowRight size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Optimize Workflow</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[100] p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card dark:bg-slate-900 rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden border border-white/20"
            >
              <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">Construct Strategy</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                  <X size={24} />
                </button>
              </div>
              <div className="p-10">
                <form onSubmit={handleCreateTask}>
                  <div className="space-y-8 mb-10">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Objective Title</label>
                      <input
                        type="text"
                        required
                        placeholder="Define the task objective..."
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white font-bold"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Strategic Context</label>
                      <textarea
                        rows="4"
                        placeholder="Detail the execution path..."
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white resize-none font-medium"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Priority Level</label>
                        <select
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white appearance-none font-black text-xs uppercase tracking-widest"
                          value={newTask.priority}
                          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        >
                          <option value="LOW">Optimized</option>
                          <option value="MEDIUM">Standard</option>
                          <option value="HIGH">Critical</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Deadline</label>
                        <input
                          type="date"
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white font-bold"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-5 px-8 border border-slate-200 dark:border-slate-700 rounded-[24px] text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] py-5 px-8 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-[24px] text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      INITIALIZE TASK
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Detail Modal */}
      {isDetailModalOpen && (
        <TaskDetailModal 
          task={selectedTask}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onUpdate={fetchProjectAndTasks}
          onDelete={fetchProjectAndTasks}
        />
      )}

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        projectId={id}
        existingMembers={project.members}
        onMemberAdded={fetchProjectAndTasks}
      />
    </div>
  );
};

export default ProjectDetails;
