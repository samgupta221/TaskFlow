import { useState, useEffect, useRef } from 'react';
import useAuthStore, { api } from '../store/authStore.js';
import useThemeStore from '../store/themeStore.js';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Moon, 
  Sun, 
  FolderKanban, 
  CheckSquare,
  Menu,
  X,
  Target,
  Zap,
  LayoutGrid
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  const searchInputRef = useRef(null);



  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const [projRes, taskRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks/all')
        ]);
        
        const filteredProjs = projRes.data.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
        const filteredTasks = taskRes.data.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
        
        setSearchResults([
          ...filteredProjs.map(p => ({ ...p, type: 'Project' })),
          ...filteredTasks.map(t => ({ ...t, type: 'Task' }))
        ]);
        setShowResults(true);
      } catch (error) {
        console.error('Search error', error);
      }
    } else {
      setShowResults(false);
    }
  };

  const notifications = [
    { id: 1, text: 'New task assigned: Homepage Redesign', time: '2m ago', icon: LayoutGrid, color: 'text-indigo-500' },
    { id: 2, text: 'Project "TaskFlow" reached 50% completion', time: '1h ago', icon: Target, color: 'text-indigo-500' },
    { id: 3, text: 'System update completed successfully', time: '3h ago', icon: Zap, color: 'text-violet-500' },
  ];

  return (
    <header className="glass-card dark:bg-[#0f172a]/80 border-b border-white/20 dark:border-slate-800 sticky top-0 z-40 h-16 px-6 flex items-center justify-between transition-colors backdrop-blur-lg">
      {/* Search Bar */}
      <div className="flex-1 max-w-lg hidden md:block relative">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-slate-50 dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all dark:text-white"
            placeholder="Quick search..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery.length > 2 && setShowResults(true)}
          />
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && searchResults.length > 0 && (
            <>
              <div className="fixed inset-0" onClick={() => setShowResults(false)} />
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-3 z-50 overflow-hidden"
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Search Results</span>
                  <button onClick={() => setShowResults(false)} className="text-slate-400 hover:text-indigo-600 text-xs font-bold transition-colors">Clear</button>
                </div>
                <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                  {searchResults.map((res) => (
                    <Link 
                      key={res._id} 
                      to={res.type === 'Project' ? `/project/${res._id}` : '/tasks'}
                      onClick={() => setShowResults(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${res.type === 'Project' ? 'bg-indigo-100 text-indigo-600' : 'bg-violet-100 text-violet-600'}`}>
                        {res.type === 'Project' ? <FolderKanban size={16} /> : <CheckSquare size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{res.name || res.title}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{res.type}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 md:hidden">
        <span className="font-bold font-outfit text-slate-800 dark:text-white text-xl">TaskFlow</span>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
          className="md:hidden p-2 text-slate-400 hover:text-indigo-600 transition-all hover:scale-110 active:scale-95"
        >
          <Menu size={20} />
        </button>
        
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-indigo-600 transition-all hover:scale-110 active:scale-95 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-indigo-600 transition-all hover:scale-110 active:scale-95 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-[#020617]"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowNotifications(false)}
                  className="fixed inset-0 z-40"
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 glass-card dark:bg-slate-900/90 rounded-2xl border border-white/20 dark:border-slate-800 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Notifications</h3>
                    <span className="text-[10px] font-bold text-indigo-500 hover:underline cursor-pointer">Mark all read</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto py-2">
                    {notifications.map(n => (
                      <div key={n.id} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex gap-3 cursor-pointer group">
                        <div className={`mt-1 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 ${n.color}`}>
                          <n.icon size={14} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-2">{n.text}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-slate-50/50 dark:bg-slate-800/50 text-center border-t border-slate-100 dark:border-slate-800">
                    <button className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">View all activity</button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white text-xs">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user?.name}</p>
              <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest leading-tight">{user?.role}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowProfileMenu(false)}
                  className="fixed inset-0 z-40"
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 overflow-hidden"
                >
                  <Link to="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <User size={16} /> Profile
                  </Link>
                  <Link to="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Settings size={16} /> Settings
                  </Link>
                  <div className="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
