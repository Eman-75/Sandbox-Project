import React, { useContext, useEffect, useState } from 'react';
import { ArrowLeft, Send, MoreVertical, Search } from 'lucide-react';
import { ChatContext } from '../../../../../context/ChatContext';
import { AuthContext } from '../../../../../context/AuthContext';

function Messages() {
  // 1. Consolidate all Context data at the top
  const { user, onlineUsers } = useContext(AuthContext);
  const { 
    getUsers, 
    users, 
    selectedUser, 
    setSelectedUser, 
    messages, 
    getMessages, 
    sendMessage 
  } = useContext(ChatContext);

  const [input, setInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  // 2. Logic for filtering
  const filteredUsers = input 
    ? users.filter((u) => u.fullName.toLowerCase().includes(input.toLowerCase())) 
    : users;

  // 3. Fetch users on mount or when online status changes
  useEffect(() => {
    getUsers();
  }, [onlineUsers, getUsers]);

  const handleSelectThread = (threadUser) => {
    setSelectedUser(threadUser);
    getMessages(threadUser._id);
    setIsChatOpen(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendMessage({ text: messageText });
    setMessageText("");
  };

  return (
    <div className="flex h-[85vh] lg:h-[75vh] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
      
      {/* 1. THREAD LIST (Sidebar) */}
      <div className={`
        ${isChatOpen ? 'hidden' : 'flex'} 
        lg:flex flex-col w-full lg:w-80 border-r border-slate-200/50 dark:border-slate-700/50
      `}>
        <div className="p-5 border-b border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h3>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search chats..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((thread) => (
            <button
              key={thread._id}
              onClick={() => handleSelectThread(thread)}
              className={`w-full text-left p-4 flex items-center gap-3 transition-all ${
                selectedUser && selectedUser._id === thread._id ? 'bg-orange-50 dark:bg-orange-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex-shrink-0 flex items-center justify-center font-bold text-slate-500">
                {thread.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{thread.name}</p>
                  <span className="text-[10px] text-slate-400">{thread.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{thread.preview}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. MESSAGE SCREEN (Content) */}
      <div className={`
        ${isChatOpen ? 'flex' : 'hidden'} 
        lg:flex flex-col flex-1 bg-slate-50/50 dark:bg-slate-950/20
      `}>

        {selectedUser ? (
        <>
        
        {/* Chat Header */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back Arrow - Visible only on Mobile */}
            <button 
              onClick={() => setIsChatOpen(false)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              {selectedUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedUser.name}</h3>
              {
                onlineUsers.includes(selectedUser._id)
                ? <p className="text-[10px] text-emerald-500 font-medium">Online</p>
                : <p className="text-[10px] text-gray-500 font-medium">Offline</p>
              }
            </div>
          </div>
          <button className="p-2 text-slate-400"><MoreVertical className="w-5 h-5" /></button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {selectedUser.messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === 'You' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm
                ${msg.from === 'You' 
                  ? 'bg-amber-500 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50 rounded-tl-none'}
              `}>
                <p>{msg.text}</p>
                <p className={`text-[9px] mt-1 text-right ${msg.from === 'You' ? 'text-orange-100' : 'text-slate-400'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <input 
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-sm focus:ring-2 focus:ring-orange-500/50" 
              placeholder="Write a message..." 
            />
            <button className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:bg-orange-600 text-white rounded-2xl shadow-lg shadow-orange-500/30 transition-all">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
               <Send className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm font-medium">Select a conversation to start chatting</p>
          </div>

        )}
      </div>
    </div>
  );
}
export default Messages;