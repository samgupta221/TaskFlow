import { create } from 'zustand';
import { io } from 'socket.io-client';
import { api } from './authStore';

const SOCKET_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : window.location.origin;

const useChatStore = create((set, get) => ({
  socket: null,
  messages: [],
  activeChat: null,
  
  initSocket: (userId) => {
    if (get().socket) return;
    
    const socket = io(SOCKET_URL);
    socket.emit('join', userId);
    
    socket.on('receive_message', (message) => {
      const { activeChat } = get();
      if (activeChat && (message.sender === activeChat._id || message.receiver === activeChat._id)) {
        set((state) => ({ messages: [...state.messages, message] }));
      }
    });
    
    set({ socket });
  },
  
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
  
  setActiveChat: async (contact) => {
    set({ activeChat: contact, messages: [] });
    if (contact) {
      try {
        const { data } = await api.get(`/messages/${contact._id}`);
        set({ messages: data });
      } catch (error) {
        console.error('Error fetching messages', error);
      }
    }
  },
  
  sendMessage: async (receiverId, text) => {
    try {
      const { data } = await api.post('/messages', { receiverId, text });
      set((state) => ({ messages: [...state.messages, data] }));
      
      const { socket } = get();
      if (socket) {
        socket.emit('send_message', { receiverId, message: data });
      }
      return data;
    } catch (error) {
      console.error('Error sending message', error);
      throw error;
    }
  },
}));

export default useChatStore;
