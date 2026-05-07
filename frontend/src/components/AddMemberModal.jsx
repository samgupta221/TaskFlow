import { useState, useEffect } from 'react';
import { api } from '../store/authStore.js';
import { X, Search, UserPlus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AddMemberModal = ({ isOpen, onClose, projectId, onMemberAdded, existingMembers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 2) {
      const searchUsers = async () => {
        setLoading(true);
        try {
          const { data } = await api.get(`/users?email=${searchTerm}`);
          setUsers(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      const delayDebounceFn = setTimeout(() => {
        searchUsers();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  const handleAddMember = async (userId) => {
    try {
      await api.post(`/projects/${projectId}/members`, { userId });
      toast.success('Member added to strategy');
      onMemberAdded();
      setSearchTerm('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Strategic error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[110] p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-card-premium dark:bg-slate-900 rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20"
      >
        <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600">
              <UserPlus size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">Expand Team</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-xl">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-10">
          <div className="relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by email..."
              className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[24px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide">
            {loading ? (
              <div className="py-10 text-center text-slate-400 animate-pulse font-black uppercase tracking-widest text-[10px]">Searching Neural Net...</div>
            ) : users.length === 0 ? (
              <div className="py-10 text-center text-slate-400 opacity-50 font-bold text-sm">
                {searchTerm.length > 2 ? 'No operatives found' : 'Enter at least 3 characters'}
              </div>
            ) : (
              users.map(user => {
                const isMember = existingMembers?.some(m => m._id === user._id);
                return (
                  <div key={user._id} className="flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-indigo-500">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white">{user.name}</h4>
                        <p className="text-[10px] font-bold text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    {isMember ? (
                      <div className="p-2 text-emerald-500 bg-emerald-500/10 rounded-xl">
                        <Check size={18} />
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleAddMember(user._id)}
                        className="p-2 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all"
                      >
                        <UserPlus size={18} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddMemberModal;
