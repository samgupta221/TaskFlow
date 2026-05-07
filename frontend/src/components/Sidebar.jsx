import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart2,
  MessageSquare,
  Settings,
  LogOut,
  X,
  Menu,
  Command,
  Plus,
  Zap
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import useAuthStore from '../store/authStore.js';

const Sidebar = () => {
  const { user, logout } = useAuthStore();

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/'
    },
    {
      name: 'Projects',
      icon: FolderKanban,
      path: '/projects'
    },
    {
      name: 'Tasks',
      icon: CheckSquare,
      path: '/tasks'
    },
    {
      name: 'Team',
      icon: Users,
      path: '/team'
    },
    {
      name: 'Reports',
      icon: BarChart2,
      path: '/reports'
    },
    {
      name: 'Messages',
      icon: MessageSquare,
      path: '/messages'
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings'
    }
  ];

  return (
    <>
      {/* MOBILE BUTTON */}
      <div className="lg:hidden fixed top-4 left-4 z-[100]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg text-indigo-600"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 260 : 80,
          x: isOpen || window.innerWidth >= 1024 ? 0 : -260
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 120
        }}
        className="fixed lg:sticky top-0 left-0 h-screen bg-white/80 dark:bg-[#020617]/80 backdrop-blur-2xl border-r border-slate-100 dark:border-slate-800/50 z-[90] flex flex-col shadow-2xl lg:shadow-none"
      >

        {/* LOGO */}
        <div className="p-6 flex items-center justify-between mb-4">

          <Link
            to="/"
            className="flex items-center gap-3 overflow-hidden"
          >

            <div className="min-w-[42px] h-[42px] bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap
                size={22}
                className="text-white"
              />
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-xl font-black text-slate-900 dark:text-white tracking-tight"
                >
                  TaskFlow
                </motion.span>
              )}
            </AnimatePresence>

          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">

          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
            >
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all relative group ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  } ${!isOpen && 'justify-center'}`}
                >

                  {/* ICON */}
                  <item.icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {/* TEXT */}
                  {isOpen && (
                    <span className="text-xs font-black uppercase tracking-widest">
                      {item.name}
                    </span>
                  )}

                  {/* TOOLTIP */}
                  {!isOpen && (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all uppercase tracking-widest whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>



        {/* USER */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">

          <div
            className={`flex items-center gap-3 p-2 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 ${
              !isOpen && 'justify-center'
            }`}
          >

            {/* AVATAR */}
            <div className="relative min-w-[36px] h-[36px]">

              <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xs shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>

              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>

            {/* USER INFO */}
            {isOpen && (
              <>
                <div className="flex-1 min-w-0">

                  <p className="text-[11px] font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">
                    {user?.name || 'User'}
                  </p>

                  <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">
                    Enterprise
                  </p>
                </div>

                {/* LOGOUT */}
                <button
                  onClick={logout}
                  className="text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;