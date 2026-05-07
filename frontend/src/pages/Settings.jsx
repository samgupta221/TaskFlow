import { useState } from 'react';
import useAuthStore from '../store/authStore.js';
import useThemeStore from '../store/themeStore.js';
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Moon, 
  Shield, 
  Sun, 
  Check, 
  Camera, 
  Zap, 
  Target, 
  Activity, 
  Globe2,
  Cpu,
  Layers,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    notifications: {
      email: true,
      push: true,
      mentions: true
    },
    privacy: {
      publicProfile: true,
      showActivity: true
    }
  });

  const tabs = [
    { id: 'profile', name: 'Identity Matrix', icon: User },
    { id: 'notifications', name: 'Neural Alerts', icon: Bell },
    { id: 'security', name: 'Encryption', icon: Lock },
    { id: 'appearance', name: 'Optics', icon: Moon },
    { id: 'privacy', name: 'Stealth', icon: Shield },
  ];

  const handleSave = () => {
    const t = toast.loading('Synchronizing preferences...');
    setTimeout(() => {
      toast.success('Core settings updated', { id: t });
    }, 1000);
  };

  return (
    <div className="p-8 md:p-12 bg-slate-50 dark:bg-[#020617] min-h-full transition-colors relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10 animate-float"></div>

      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={14} className="text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">System Preferences Active</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter">Command Center</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">Configure your professional identity and neural workspace optics.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Settings Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-2"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-[22px] transition-all group ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30'
                    : 'bg-white dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-black/5 dark:hover:border-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <tab.icon size={18} strokeWidth={activeTab === tab.id ? 3 : 2} />
                  <span className="text-[11px] font-black uppercase tracking-widest">{tab.name}</span>
                </div>
                {activeTab === tab.id && <ChevronRight size={16} strokeWidth={3} />}
              </button>
            ))}
          </motion.div>

          {/* Settings Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-3 glass-card-premium rounded-[48px] p-10 md:p-14 min-h-[600px] flex flex-col"
          >
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-12"
                >
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-500/20 group-hover:rotate-3 transition-transform">
                        {formData.name.charAt(0).toUpperCase()}
                      </div>
                      <button className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 text-indigo-600 hover:scale-110 transition-transform">
                        <Camera size={20} strokeWidth={2.5} />
                      </button>
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit uppercase tracking-tighter mb-2">{formData.name}</h3>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-500/20 inline-block">Enterprise Contributor</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agent Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-6 py-4 bg-white dark:bg-slate-950 border border-indigo-100/50 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Neural ID (Email)</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-6 py-4 bg-white dark:bg-slate-950 border border-indigo-100/50 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold shadow-sm"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategic Bio</label>
                      <textarea 
                        rows="4" 
                        placeholder="Define your strategic context..."
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="w-full px-6 py-4 bg-white dark:bg-slate-950 border border-indigo-100/50 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none resize-none font-medium leading-relaxed shadow-sm"
                      ></textarea>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'appearance' && (
                <motion.div 
                  key="appearance"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit uppercase tracking-tighter mb-8">Optics Configuration</h2>
                  <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[32px] border border-slate-100 dark:border-white/5 flex items-center justify-between group cursor-pointer" onClick={toggleTheme}>
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-2xl transition-all group-hover:scale-110 group-hover:rotate-6 ${isDarkMode ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30' : 'bg-amber-100 text-amber-600'}`}>
                        {isDarkMode ? <Moon size={24} strokeWidth={2.5} /> : <Sun size={24} strokeWidth={2.5} />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">System Depth</p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Switch between Photon and Void themes.</p>
                      </div>
                    </div>
                    <div className={`w-14 h-8 rounded-full relative transition-all ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                      <motion.div 
                        animate={{ x: isDarkMode ? 24 : 4 }}
                        className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-xl"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div 
                  key="notifications"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit uppercase tracking-tighter mb-8">Neural Alerts</h2>
                  {Object.keys(formData.notifications).map((key) => (
                    <div key={key} className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-black/5 dark:border-white/5 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">{key} Notifications</span>
                      <button 
                        onClick={() => setFormData({...formData, notifications: {...formData.notifications, [key]: !formData.notifications[key]}})}
                        className={`w-12 h-6 rounded-full relative transition-all ${formData.notifications[key] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                      >
                        <motion.div 
                          animate={{ x: formData.notifications[key] ? 24 : 4 }}
                          className="absolute top-1 w-4 h-4 rounded-full bg-white"
                        />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}

              {['security', 'privacy'].includes(activeTab) && (
                <motion.div 
                  key="other"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center opacity-30"
                >
                  <ShieldCheck size={80} className="mb-6 animate-float text-indigo-500" />
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit uppercase tracking-tighter">{activeTab} Lockdown</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-2">Neural strata protected. Configuration coming soon.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto pt-10 border-t border-slate-50 dark:border-slate-800/50 flex justify-end gap-6">
              <button className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">Discard</button>
              <button 
                onClick={handleSave}
                className="px-10 py-4 bg-indigo-600 text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all"
              >
                Sync Changes
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
