// import React from 'react';
// import { MessageSquare, Circle } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const messages = [
//   {
//     id: 1,
//     sender: 'Venture Capital Partners',
//     preview: 'We would like to schedule a meeting...',
//     time: '2 hours ago',
//     unread: true,
//   },
//   {
//     id: 2,
//     sender: 'Sarah Thompson',
//     preview: 'Your pitch deck looks interesting...',
//     time: '1 day ago',
//     unread: false,
//   },
// ];

// function RecentMessages() {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
//       <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
//         <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Messages</h3>
//         <button
//           onClick={() => navigate('/startup/messages')}
//           className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
//         >
//           View All Messages
//         </button>
//       </div>
//       <div className="p-6 space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
//             onClick={() => navigate('/startup/messages')}
//           >
//             <div className="flex items-start justify-between mb-2">
//               <h4 className="font-bold text-slate-900 dark:text-white">{message.sender}</h4>
//               {message.unread && (
//                 <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#e39622] to-[#ffb347]"></div>
//               )}
//             </div>
//             <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{message.preview}</p>
//             <p className="text-xs text-slate-400 dark:text-slate-500">{message.time}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default RecentMessages;








import React, { useState, useEffect } from 'react';
import { MessageSquare, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../../api/axios';

function RecentMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/dashboard/startup/dashboard');
        const data = response.data;

        if (data.recentMessages) {
          setMessages(data.recentMessages.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden animate-pulse">
        <div className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-300 dark:bg-slate-600 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Messages</h3>
        <button
          onClick={() => navigate('/startup/messages')}
          className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
        >
          View All Messages
        </button>
      </div>
      <div className="p-6 space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              onClick={() => navigate('/startup/messages')}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-slate-900 dark:text-white">{message.sender || 'Message from Contact'}</h4>
                {!message.read && (
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#e39622] to-[#ffb347]"></div>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                {(message.message || '').length > 60 ? `${message.message.substring(0, 60)}...` : (message.message || 'No message content')}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {new Date(message.date).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">No messages yet</p>
        )}
      </div>
    </div>
  );
}

export default RecentMessages;