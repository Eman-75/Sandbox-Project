import React, { useContext, useMemo, useRef, useState, useEffect } from "react";
import { Bot, Send, X } from "lucide-react";
import { ChatContext } from "../../../context/ChatContext";

export default function MiniAiWidget() {
  const {
    askAssistant,
    assistantMessages,
    assistantLoading,
  } = useContext(ChatContext);

  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const scrollRef = useRef(null);

  const recentMessages = useMemo(
    () => assistantMessages.slice(-8),
    [assistantMessages]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [recentMessages, isOpen, assistantLoading]);

  const handleSend = async () => {
    const text = prompt.trim();
    if (!text || assistantLoading) return;
    setPrompt("");
    await askAssistant(text);
  };

  return (
    <div className="fixed bottom-24 right-6 z-[1200]">
      {isOpen && (
        <div className="absolute bottom-0 right-16 w-[320px] h-[430px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-12 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#e39622] to-[#ffb347] flex items-center justify-center">
                <Bot className="w-4 h-4 text-slate-900" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">SandBox AI</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              aria-label="Close AI chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div ref={scrollRef} className="h-[310px] overflow-y-auto p-3 space-y-2 bg-[#fffaf0] dark:bg-slate-900">
            {recentMessages.length === 0 && (
              <div className="text-xs text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                Ask anything about proposals, outreach, decks, and strategy.
              </div>
            )}

            {recentMessages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}`}
                className={`max-w-[92%] text-xs px-3 py-2 rounded-xl whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "ml-auto bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900"
                    : "mr-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {assistantLoading && (
              <div className="mr-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 text-xs px-3 py-2 rounded-xl">
                Thinking...
              </div>
            )}
          </div>

          <div className="h-[58px] p-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center gap-2">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Ask SandBox AI..."
              className="flex-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#e39622]"
            />
            <button
              onClick={handleSend}
              disabled={assistantLoading || !prompt.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 flex items-center justify-center disabled:opacity-50"
              aria-label="Send AI prompt"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 shadow-xl hover:scale-105 transition-transform flex items-center justify-center"
        aria-label="Open AI assistant"
      >
        <Bot className="w-6 h-6" />
      </button>
    </div>
  );
}