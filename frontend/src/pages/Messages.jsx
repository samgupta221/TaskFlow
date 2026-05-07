import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../store/authStore.js';
import useAuthStore from '../store/authStore.js';
import useChatStore from '../store/chatStore.js';
import { 
  Search, 
  Send, 
  Phone, 
  Video, 
  Info, 
  Paperclip, 
  Smile, 
  User as UserIcon, 
  MessageSquare, 
  MoreVertical, 
  Zap, 
  Cpu, 
  Target,
  Globe,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Messages = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { 
    messages, 
    activeChat, 
    setActiveChat, 
    initSocket, 
    sendMessage,
  } = useChatStore();
  
  const [contacts, setContacts] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchUsers();
    if (user) {
      initSocket(user._id);
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    if (userId && contacts.length > 0) {
      const contact = contacts.find(c => c._id === userId);
      if (contact) setActiveChat(contact);
    }
  }, [location.search, contacts]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setContacts(data.filter(u => u._id !== user?._id));
    } catch (error) {
      console.error('Error fetching users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    
    try {
      await sendMessage(activeChat._id, newMessage);
      setNewMessage('');
    } catch (error) {
      toast.error('Neural transmission failed');
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex overflow-hidden bg-slate-50 dark:bg-[#020617] transition-colors relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10 animate-float"></div>

      {/* Sidebar - Contacts */}
      <div className="w-80 lg:w-96 border-r border-slate-100 dark:border-slate-800/50 flex flex-col bg-white/80 dark:bg-[#020617]/80 backdrop-blur-2xl transition-all z-10">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800/50">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Communication Uplink</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter mb-6">Neural Feed</h1>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search frequencies..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white font-bold"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3 space-y-2">
          {loading ? (
            <div className="p-10 text-center flex flex-col items-center">
              <Cpu size={32} className="text-slate-200 animate-spin mb-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Nodes...</span>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-10 text-center opacity-30">
              <Globe size={40} className="mx-auto mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">No nodes active</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <motion.button 
                key={contact._id}
                whileHover={{ x: 5 }}
                onClick={() => setActiveChat(contact)}
                className={`w-full p-4 flex items-center gap-4 rounded-[24px] transition-all relative overflow-hidden group ${activeChat?._id === contact._id ? 'bg-indigo-600 shadow-2xl shadow-indigo-500/30' : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'}`}
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg ${activeChat?._id === contact._id ? 'bg-white text-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white'}`}>
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-4 rounded-full ${activeChat?._id === contact._id ? 'bg-white border-indigo-600' : 'bg-emerald-500 border-white dark:border-slate-950'}`}></div>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-black truncate uppercase tracking-tight ${activeChat?._id === contact._id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{contact.name}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${activeChat?._id === contact._id ? 'text-indigo-100' : 'text-slate-400'}`}>3m</span>
                  </div>
                  <p className={`text-[11px] font-medium truncate mt-0.5 ${activeChat?._id === contact._id ? 'text-indigo-50' : 'text-slate-500 dark:text-slate-400'}`}>Synchronizing frequency...</p>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-[#020617]/50 relative">
        <AnimatePresence mode="wait">
          {activeChat ? (
            <motion.div 
              key={activeChat._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col h-full"
            >
              {/* Chat Header */}
              <div className="h-24 px-10 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center z-20">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-xl font-black text-white shadow-2xl shadow-indigo-500/20">
                    {activeChat.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white font-outfit tracking-tight uppercase">{activeChat.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Frequency Locked</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-slate-400">
                  <button className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all hover:text-indigo-600 shadow-sm"><Phone size={22} /></button>
                  <button className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all hover:text-indigo-600 shadow-sm"><Video size={22} /></button>
                  <button className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all hover:text-indigo-600 shadow-sm"><MoreVertical size={22} /></button>
                </div>
              </div>

              {/* Messages list */}
              <div className="flex-1 p-10 overflow-y-auto space-y-8 scrollbar-hide">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-30">
                    <MessageSquare size={80} className="mb-6 animate-float" />
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit">Neural Silence.</h3>
                    <p className="text-xs font-black uppercase tracking-[0.2em] mt-2">Initialize transmission with {activeChat.name}.</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <motion.div 
                      key={msg._id || index} 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex gap-4 max-w-[80%] ${msg.sender === user?._id ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-black shadow-lg ${msg.sender === user?._id ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/5'}`}>
                        {msg.sender === user?._id ? 'Y' : activeChat.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={`flex flex-col ${msg.sender === user?._id ? 'items-end' : 'items-start'}`}>
                        <div className={`p-5 rounded-[28px] shadow-sm text-sm font-medium leading-relaxed ${msg.sender === user?._id ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-500/10' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-black/5 dark:border-white/5 shadow-xl shadow-black/5'}`}>
                          {msg.text}
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-8 px-10 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800/50 z-20">
                <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-2 pr-4 focus-within:ring-8 focus-within:ring-indigo-500/5 focus-within:border-indigo-500/50 transition-all shadow-2xl shadow-black/5">
                  <div className="flex items-center gap-1 pl-4">
                    <button type="button" className="p-2.5 text-slate-400 hover:text-indigo-600 transition-all hover:scale-110"><Paperclip size={20} /></button>
                    <button type="button" className="p-2.5 text-slate-400 hover:text-indigo-600 transition-all hover:scale-110"><Smile size={20} /></button>
                  </div>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter neural string..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-4 dark:text-white font-bold placeholder:text-slate-400"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                  >
                    <Send size={20} strokeWidth={3} />
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-20 text-center"
            >
              <div className="w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-[48px] flex items-center justify-center text-indigo-600 dark:text-indigo-500 mb-10 shadow-inner relative group">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-[48px] blur-2xl group-hover:scale-150 transition-transform duration-1000 opacity-50"></div>
                <MessageSquare size={64} className="relative z-10 animate-float" strokeWidth={1.5} />
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter mb-4">Neural Uplink</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium leading-relaxed mb-10">Initialize a connection with your network agents to begin encrypted neural synchronization.</p>
              <div className="flex gap-4">
                <div className="px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">Node Cluster: Primary</div>
                <div className="px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">Latency: 12ms</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Messages;
