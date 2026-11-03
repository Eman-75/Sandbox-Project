import React, { useState } from 'react';
import { BookOpen, ArrowRight, Send, FileText, GraduationCap, TrendingUp, Target, Users } from 'lucide-react';

const resources = [
  {
    id: 1,
    title: 'Startup Fundamentals',
    description: 'Essential guide to building your first startup from the ground up',
    type: 'Article',
    readTime: '15 min read',
  },
  {
    id: 2,
    title: 'Fundraising 101',
    description: 'Complete guide to raising capital for your startup',
    type: 'Guide',
    readTime: '20 min read',
  },
  {
    id: 3,
    title: 'Pitch Deck Essentials',
    description: 'Learn how to create a compelling pitch deck that gets investors excited',
    type: 'Article',
    readTime: '12 min read',
  },
  {
    id: 4,
    title: 'Market Research Strategies',
    description: 'Master the art of market research and validation',
    type: 'Guide',
    readTime: '18 min read',
  },
  {
    id: 5,
    title: 'Building an MVP',
    description: 'Step-by-step guide to building your minimum viable product',
    type: 'Tutorial',
    readTime: '25 min read',
  },
  {
    id: 6,
    title: 'Growth Hacking Tactics',
    description: 'Proven strategies to grow your startup quickly and efficiently',
    type: 'Article',
    readTime: '15 min read',
  },
];

const tips = [
  {
    icon: Target,
    title: 'Start Small, Think Big',
    description: 'Focus on solving one problem exceptionally well before expanding.',
  },
  {
    icon: Users,
    title: 'Validate Early',
    description: 'Talk to potential customers before building your product.',
  },
  {
    icon: TrendingUp,
    title: 'Network Actively',
    description: 'Build relationships with mentors, investors, and fellow entrepreneurs.',
  },
  {
    icon: GraduationCap,
    title: 'Iterate Quickly',
    description: 'Embrace feedback and continuously improve your product.',
  },
];

function LearningHub() {
  const [activeTab, setActiveTab] = useState('resources');
  const [message, setMessage] = useState('');
  const [assistantLog, setAssistantLog] = useState([
    {
      id: 'welcome',
      from: 'Assistant',
      text: "Hello! I'm your AI learning assistant. Ask me anything about startups, fundraising, business planning, or any other topic!",
    },
  ]);

  const handleReadNow = (title) => {
    window.alert(`Opening resource: ${title}`);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setAssistantLog((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, from: 'You', text: message.trim() },
      {
        id: `assistant-${Date.now()}`,
        from: 'Assistant',
        text: 'Thanks for your question! In production this would provide a contextual answer.',
      },
    ]);
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Learning Hub</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Expand your knowledge and grow your business
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200/50 dark:border-slate-700/50">
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'resources'
              ? 'bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 rounded-t-xl'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Reading Resources
        </button>
        <button
          onClick={() => setActiveTab('assistant')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'assistant'
              ? 'bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 rounded-t-xl'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          AI Assistant
        </button>
      </div>

      {activeTab === 'resources' ? (
        <>
          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 space-y-4 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <FileText className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 text-xs font-semibold">
                    {resource.type} • {resource.readTime}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {resource.description}
                  </p>
                </div>
                <button
                  onClick={() => handleReadNow(resource.title)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  Read Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#e39622] to-[#ffb347] bg-clip-text text-transparent mb-6">
              Quick Tips for Success
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-[#e39622] to-[#ffb347]">
                        <Icon className="w-5 h-5 text-slate-900" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {tip.title}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{tip.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 bg-gradient-to-r from-[#e39622] to-[#ffb347] bg-clip-text text-transparent" />
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                AI Learning Assistant
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ask me anything about business and startups.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6 min-h-[400px]">
            {assistantLog.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#e39622] to-[#ffb347]">
                  <BookOpen className="w-5 h-5 text-slate-900" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 flex-1">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {entry.from}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything about startups, fundraising, or business..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-3 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 rounded-xl hover:opacity-90 transition-opacity"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This is a demo AI assistant. In production, it would provide real-time, contextual
              answers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningHub;
