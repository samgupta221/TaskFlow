import { useState, useEffect, useMemo } from 'react';
import { api } from '../store/authStore.js';
import { 
  Search, 
  Plus, 
  Filter, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar as CalendarIcon,
  Activity,
  Zap,
  Target,
  ArrowRight,
  MoreHorizontal,
  PlusCircle,
  FolderOpen
} from 'lucide-react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import CreateTaskModal from '../components/CreateTaskModal';
import TaskDetailModal from '../components/TaskDetailModal';

const SortableTaskCard = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const priorityClasses = {
    HIGH: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    MEDIUM: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    LOW: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  };

  return (
    <motion.div 
      ref={setNodeRef}
      style={style}
      layout
      whileHover={{ y: -4, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="glass-card dark:bg-slate-900/60 p-5 rounded-[24px] border border-white/20 dark:border-slate-800 shadow-sm hover:border-indigo-500/40 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden"
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border ${priorityClasses[task.priority]}`}>
          {task.priority}
        </div>
        <button className="text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>
      
      <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2 line-clamp-2 font-outfit leading-snug">{task.title}</h4>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-5 line-clamp-2 font-medium leading-relaxed">{task.description || 'Focus on strategic execution and high-fidelity output.'}</p>
      
      <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400">
            <CalendarIcon size={12} />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg uppercase">
            {task.assignee?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
      
      {/* Background Ambient Glow on Hover */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks/all');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks', error);
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const taskId = active.id;
    const overId = over.id;
    const columns = ['TO DO', 'IN PROGRESS', 'REVIEW', 'DONE'];
    const overColumn = columns.find(col => col === overId);
    let newStatus = overColumn;
    
    if (!newStatus) {
      const overTask = tasks.find(t => t._id === overId);
      if (overTask) newStatus = overTask.status;
    }

    const currentTask = tasks.find(t => t._id === taskId);
    if (newStatus && newStatus !== currentTask.status) {
      try {
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
        await api.put(`/tasks/${taskId}`, { status: newStatus });
        toast.success(`Relocated to ${newStatus}`);
      } catch (error) {
        toast.error('Reversion error');
        fetchTasks();
      }
    }
  };

  const filteredTasks = useMemo(() => 
    tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [tasks, searchQuery]);

  const stats = [
    { title: 'Total Strands', value: tasks.length, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-600/10' },
    { title: 'Active Strategy', value: tasks.filter(t => t.status === 'IN PROGRESS').length, icon: Zap, color: 'text-violet-600', bg: 'bg-violet-600/10' },
    { title: 'Operational', value: tasks.filter(t => t.status === 'DONE').length, icon: CheckCircle2, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { title: 'Criticality', value: tasks.filter(t => t.priority === 'HIGH').length, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="p-8 md:p-12 bg-slate-50 dark:bg-[#020617] min-h-full transition-colors relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8"
      >
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter flex items-center gap-4">
            Productivity Board
            <div className="px-4 py-1.5 bg-indigo-500/10 text-indigo-500 text-[10px] font-black rounded-xl uppercase tracking-[0.2em] border border-indigo-500/20">Operational</div>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 font-medium">Enterprise-level task orchestration and management matrix.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <div className="relative flex-1 xl:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Query task matrix..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-sm font-bold"
            />
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-[20px] font-black flex items-center gap-2.5 text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <PlusCircle size={20} />
            INITIALIZE STRATA
          </button>
        </div>
      </motion.div>

      {/* Analytics Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={stat.title} 
            className="glass-card dark:bg-slate-900/40 p-6 rounded-[28px] border border-white/20 flex items-center gap-6 group hover:border-indigo-500/30 transition-all shadow-sm"
          >
            <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform shadow-sm`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.title}</p>
              <h4 className="text-2xl font-black text-slate-800 dark:text-white font-outfit">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => <div key={i} className="h-96 bg-slate-100 dark:bg-slate-900/50 rounded-[32px] animate-pulse border border-slate-200 dark:border-slate-800"></div>)}
          </div>
        ) : tasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-32 text-center glass-card dark:bg-slate-900/40 rounded-[48px] border border-white/20"
          >
            <div className="w-24 h-24 bg-indigo-500/10 text-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Target size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">Zero Strategy Detected</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-sm mx-auto font-medium">Initialize your first task strand to start the productivity flow.</p>
            <button onClick={() => setIsCreateModalOpen(true)} className="mt-10 px-8 py-4 bg-indigo-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/40 hover:scale-105 transition-all">Add First Task</button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {['TO DO', 'IN PROGRESS', 'REVIEW', 'DONE'].map(column => (
              <div key={column} className="flex flex-col gap-6 h-full min-h-[600px] bg-slate-50/50 dark:bg-slate-900/20 rounded-[40px] p-4 border border-white/5">
                <div className="flex justify-between items-center px-4 py-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      column === 'TO DO' ? 'bg-slate-400' :
                      column === 'IN PROGRESS' ? 'bg-indigo-500' :
                      column === 'REVIEW' ? 'bg-violet-500' : 'bg-indigo-600'
                    }`}></div>
                    <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-[0.2em]">{column}</h3>
                    <span className="bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black px-2.5 py-1 rounded-xl border border-slate-100 dark:border-slate-800">
                      {filteredTasks.filter(t => t.status === column).length}
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <PlusCircle size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  <SortableContext items={filteredTasks.filter(t => t.status === column).map(t => t._id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-5 px-1 pb-4">
                      {filteredTasks.filter(t => t.status === column).map(task => (
                        <SortableTaskCard 
                          key={task._id} 
                          task={task} 
                          onClick={(t) => { setSelectedTask(t); setIsDetailModalOpen(true); }}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              </div>
            ))}
          </div>
        )}

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.4' } }
          })
        }}>
          {activeId ? (
            <div className="glass-card dark:bg-slate-800 p-6 rounded-[24px] border-2 border-indigo-500 shadow-2xl scale-105 rotate-2">
              <h4 className="text-sm font-black text-slate-900 dark:text-white font-outfit">{tasks.find(t => t._id === activeId)?.title}</h4>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onTaskCreated={fetchTasks} 
      />

      <AnimatePresence>
        {isDetailModalOpen && selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            onUpdate={fetchTasks}
            onDelete={fetchTasks}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
