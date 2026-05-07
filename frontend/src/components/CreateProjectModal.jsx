import { useState } from 'react';
import { api } from '../store/authStore.js';
import { X, FolderPlus, Info, Type } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/projects', { name, description });
      toast.success('Project created successfully!');
      onProjectCreated(data);
      onClose();
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating project', error);
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
      <div className="glass-card dark:bg-slate-900 rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 dark:border-slate-800 animate-in zoom-in duration-300">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
              <FolderPlus size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white font-outfit">New Project</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-2">
                  <Type size={14} /> Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Marketing Campaign"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-2">
                  <Info size={14} /> Description
                </label>
                <textarea
                  rows="4"
                  placeholder="What is this project about? Define the primary goals..."
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white font-medium resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 px-6 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 px-6 btn-primary rounded-2xl text-sm font-black shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    CREATING...
                  </>
                ) : (
                  'CREATE PROJECT'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
