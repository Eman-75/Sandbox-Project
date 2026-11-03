import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bot,
  BrainCircuit,
  Check,
  CheckCheck,
  FileText,
  FileUp,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ChatContext } from '../../../context/ChatContext';
import { AuthContext } from '../../../context/AuthContext';
import NDAViewModal from '../pages/NDA/NDAViewModal';
import NDASignModal from '../pages/NDA/NDASignModal';
import InvestorNdaLockOverlay from '../proposals/InvestorNdaLockOverlay';
import useInvestorMasterNda from '../../hooks/useInvestorMasterNda';

const AI_THREAD = {
  _id: 'sandbox-ai',
  name: 'SandBox AI',
  role: 'assistant',
};

const statusStyles = {
  sent: 'bg-amber-100 text-amber-700',
  viewed: 'bg-sky-100 text-sky-700',
  under_review: 'bg-indigo-100 text-indigo-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
};

const emptyProposal = {
  title: '',
  summary: '',
  amount: '',
  equity: '',
  stage: '',
  timeline: '',
};

const allowedDocTypes = '.pdf,.ppt,.pptx';

function DocumentReviewComposer({ open, onClose, onSubmit, loading }) {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!open) {
      setDescription('');
      setFile(null);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await onSubmit({ file, description });
    if (result?.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">AI Document Review</h3>
            <p className="text-sm text-slate-500">Upload PDF/PPT and get improvements + mistakes from SandBox AI.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
              <FileUp className="h-4 w-4" />
              <span>{file ? file.name : 'Choose PDF or PPT file'}</span>
              <input
                type="file"
                className="hidden"
                accept={allowedDocTypes}
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
            </label>
            <p className="mt-2 text-xs text-slate-500">Supported: .pdf, .ppt, .pptx</p>
          </div>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add context: objective, audience, tone, and what should be improved."
            className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-600">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Review & Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProposalComposer({ open, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(emptyProposal);

  useEffect(() => {
    if (!open) {
      setForm(emptyProposal);
    }
  }, [open]);

  if (!open) return null;

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await onSubmit(form);
    if (result?.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Send Proposal</h3>
            <p className="text-sm text-slate-500">This creates a real proposal record and sends it as a chat card.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={updateField}
            placeholder="Proposal title"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            required
          />
          <textarea
            name="summary"
            value={form.summary}
            onChange={updateField}
            placeholder="Summary, terms, and what you’re offering"
            className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="amount"
              type="number"
              min="0"
              value={form.amount}
              onChange={updateField}
              placeholder="Amount (USD)"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              required
            />
            <input
              name="equity"
              type="number"
              min="0"
              max="100"
              value={form.equity}
              onChange={updateField}
              placeholder="Equity %"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
            <input
              name="stage"
              value={form.stage}
              onChange={updateField}
              placeholder="Stage"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
            <input
              name="timeline"
              value={form.timeline}
              onChange={updateField}
              placeholder="Timeline"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-600">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProposalCard({ proposal, isOwn, locked = false, ndaLoading = false, onUnlock }) {
  if (!proposal) return null;

  const statusClass = statusStyles[proposal.status] || 'bg-slate-100 text-slate-700';

  return (
    <div className={`relative w-full max-w-md rounded-3xl border p-4 shadow-sm ${isOwn ? 'border-orange-300 bg-orange-50 text-slate-900' : 'border-slate-200 bg-white text-slate-900'}`}>
      <div className={locked ? 'pointer-events-none select-none blur-sm' : ''}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Proposal</p>
            <h4 className="text-lg font-bold">{proposal.title}</h4>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
            {proposal.status.replace('_', ' ')}
          </span>
        </div>
        <p className="mb-4 text-sm text-slate-600">{proposal.summary}</p>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-100 px-3 py-2">
            <p className="text-xs text-slate-500">Amount</p>
            <p className="font-semibold">${Number(proposal.amount || 0).toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-3 py-2">
            <p className="text-xs text-slate-500">Equity</p>
            <p className="font-semibold">{proposal.equity || 0}%</p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-3 py-2">
            <p className="text-xs text-slate-500">Stage</p>
            <p className="font-semibold">{proposal.stage || 'Not specified'}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-3 py-2">
            <p className="text-xs text-slate-500">Timeline</p>
            <p className="font-semibold">{proposal.timeline || 'Flexible'}</p>
          </div>
        </div>
      </div>
      {locked && (
        <InvestorNdaLockOverlay loading={ndaLoading} onSignClick={onUnlock} compact />
      )}
    </div>
  );
}

function ChatWorkspace() {
  const location = useLocation();
  const { authUser, onlineUsers, axios } = useContext(AuthContext);
  const { isRestricted: proposalRestricted, loading: ndaLoading, handleSignComplete } = useInvestorMasterNda();
  const {
    assistantLoading,
    assistantMessages,
    askAssistant,
    askAssistantWithDocument,
    getMessages,
    getUsers,
    messages,
    selectedUser,
    sendMessage,
    sendDocumentReview,
    sendProposal,
    setAssistantMessages,
    setMessages,
    setSelectedUser,
    setUnseenMessages,
    unseenMessages,
    users,
  } = useContext(ChatContext);

  const [search, setSearch] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [assistantMode, setAssistantMode] = useState(false);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [proposalSending, setProposalSending] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docSending, setDocSending] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeNDA, setActiveNDA] = useState(null);
  const [showProposalNdaModal, setShowProposalNdaModal] = useState(false);
  const scrollRef = useRef(null);

  const filteredUsers = useMemo(
    () =>
      users
        .filter((user) => user.role !== 'admin')
        .filter((user) => (search ? (user.name || '').toLowerCase().includes(search.toLowerCase()) : true)),
    [search, users]
  );

  const canSendProposal =
    !assistantMode &&
    authUser &&
    selectedUser &&
    ['investor', 'startup', 'student'].includes(authUser.role) &&
    ['investor', 'startup', 'student'].includes(selectedUser.role) &&
    String(authUser._id) !== String(selectedUser._id);

  useEffect(() => {
    getUsers();
  }, [onlineUsers, getUsers]);

  useEffect(() => {
    if (location.state?.selectedUser?._id) {
      handleSelectThread(location.state.selectedUser);
    }
  }, [location.state]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, assistantMessages, assistantLoading]);

  const loadNDA = async (threadUser) => {
    try {
      const { data } = await axios.get(`/nda/status/${threadUser._id}`);
      setActiveNDA(data.isSigned ? data.nda : null);
    } catch (error) {
      setActiveNDA(null);
    }
  };

  const handleSelectThread = async (threadUser) => {
    setAssistantMode(false);
    setSelectedUser(threadUser);
    setMessageText('');
    setMessages([]);
    setIsChatOpen(true);
    getMessages(threadUser._id);
    setUnseenMessages((prev) => ({ ...prev, [threadUser._id]: 0 }));
    loadNDA(threadUser);
  };

  const handleOpenAssistant = () => {
    setAssistantMode(true);
    setSelectedUser(null);
    setIsChatOpen(true);
    setMessageText('');
    if (!assistantMessages.length) {
      setAssistantMessages([
        {
          role: 'assistant',
          content: 'Ask me about investor outreach, proposal writing, startup positioning, or how to use SandBox features.',
        },
      ]);
    }
  };

  const handleSubmitMessage = async (event) => {
    event.preventDefault();
    if (!messageText.trim()) return;

    const prompt = messageText;
    setMessageText('');

    if (assistantMode) {
      await askAssistant(prompt);
      return;
    }

    await sendMessage({ text: prompt });
  };

  const handleProposalSubmit = async (form) => {
    setProposalSending(true);
    const result = await sendProposal(form);
    setProposalSending(false);
    return result;
  };

  const handleDocumentReviewSubmit = async ({ file, description }) => {
    setDocSending(true);
    const result = assistantMode
      ? await askAssistantWithDocument({ file, description })
      : await sendDocumentReview({ file, description });
    setDocSending(false);
    return result;
  };

  const activeThread = assistantMode ? AI_THREAD : selectedUser;
  const visibleMessages = assistantMode ? assistantMessages : messages.filter(Boolean);

  return (
    <>
      <div className="flex h-[85vh] lg:h-[75vh] overflow-hidden rounded-3xl border border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80">
        <div className={`${isChatOpen ? 'hidden' : 'flex'} w-full flex-col border-r border-slate-200/50 lg:flex lg:w-80 dark:border-slate-700/50`}>
          <div className="border-b border-slate-200/50 p-5 dark:border-slate-700/50">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h3>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search chats..."
                className="w-full rounded-xl bg-slate-100 py-2 pl-9 pr-4 text-sm outline-none dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <button
              onClick={handleOpenAssistant}
              className={`m-3 flex w-[calc(100%-24px)] items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                assistantMode
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900'
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-300 text-white">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">SandBox AI</p>
                <p className="truncate text-xs text-slate-500">Groq-powered assistant board</p>
              </div>
              <Sparkles className="h-4 w-4 text-orange-500" />
            </button>

            {filteredUsers.map((thread) => (
              <button
                key={thread._id}
                onClick={() => handleSelectThread(thread)}
                className={`w-full p-4 text-left transition-all ${
                  !assistantMode && selectedUser?._id === thread._id
                    ? 'bg-orange-50 dark:bg-orange-900/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-500 dark:bg-slate-700">
                    {(thread.name || '').charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{thread.name}</p>
                    <p className="truncate text-xs text-slate-500">{thread.role}</p>
                  </div>
                  {unseenMessages[thread._id] > 0 && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {unseenMessages[thread._id]}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={`${isChatOpen ? 'flex' : 'hidden'} flex-1 flex-col bg-slate-50/50 lg:flex dark:bg-slate-950/20`}>
          {activeThread ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-200/50 bg-white p-4 dark:border-slate-700/50 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsChatOpen(false)} className="rounded-full p-2 hover:bg-slate-100 lg:hidden">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${assistantMode ? 'bg-gradient-to-br from-orange-500 to-amber-300 text-white' : 'bg-orange-100 text-orange-600'}`}>
                    {assistantMode ? <Bot className="h-5 w-5" /> : (activeThread.name || '').charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold">{activeThread.name}</h3>
                      {!assistantMode && activeNDA && (
                        <button
                          onClick={() => setIsViewModalOpen(true)}
                          className="flex items-center gap-1 rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600"
                        >
                          <ShieldCheck className="h-3 w-3" />
                          NDA PROTECTED
                        </button>
                      )}
                    </div>
                    <p className={`text-[10px] ${assistantMode || onlineUsers.includes(activeThread._id) ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {assistantMode ? 'Online now' : onlineUsers.includes(activeThread._id) ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>

                {assistantMode && (
                  <button
                    onClick={() => setDocModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    <FileUp className="h-4 w-4" />
                    Upload Document
                  </button>
                )}

                {canSendProposal && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setDocModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      <FileUp className="h-4 w-4" />
                      Review Document
                    </button>
                    <button
                      onClick={() => setProposalModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700"
                    >
                      <FileText className="h-4 w-4" />
                      Send Proposal
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {visibleMessages.map((msg, idx) => {
                  if (assistantMode) {
                    const isOwn = msg.role === 'user';
                    return (
                      <div key={`${msg.role}-${idx}`} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${isOwn ? 'rounded-tr-none bg-orange-500 text-white' : 'rounded-tl-none bg-white text-slate-900 dark:bg-slate-800 dark:text-white'}`}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    );
                  }

                  const isOwn = String(msg.senderId) === String(authUser?._id);
                  const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

                  if (msg.messageType === 'proposal' && msg.proposalId) {
                    return (
                      <div key={msg._id || idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div>
                          <ProposalCard
                            proposal={msg.proposalId}
                            isOwn={isOwn}
                            locked={proposalRestricted}
                            ndaLoading={ndaLoading}
                            onUnlock={() => setShowProposalNdaModal(true)}
                          />
                          <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-400">
                            <span>{time}</span>
                            {isOwn && (msg.seen ? <CheckCheck className="h-3 w-3 text-emerald-400" /> : <Check className="h-3 w-3" />)}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={msg._id || idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${isOwn ? 'rounded-tr-none bg-orange-500 text-white' : 'rounded-tl-none bg-white dark:bg-slate-800'}`}>
                        {msg.text ? <p className="whitespace-pre-wrap">{msg.text}</p> : null}
                        {msg.image ? <img src={msg.image} alt="message" className="mt-2 rounded-2xl" /> : null}
                        <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isOwn ? 'text-orange-100' : 'text-slate-400'}`}>
                          <span>{time}</span>
                          {isOwn && (msg.seen ? <CheckCheck className="h-3 w-3 text-emerald-300" /> : <Check className="h-3 w-3" />)}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {assistantLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-tl-none bg-white px-4 py-3 text-sm text-slate-500 dark:bg-slate-800">
                      SandBox AI is thinking...
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>

              <form onSubmit={handleSubmitMessage} className="border-t border-slate-200/50 bg-white p-4 dark:border-slate-700/50 dark:bg-slate-900">
                <div className="mx-auto flex max-w-4xl items-center gap-2">
                  <input
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none dark:bg-slate-800"
                    placeholder={assistantMode ? 'Ask SandBox AI anything...' : 'Write a message...'}
                  />
                  <button type="submit" className="rounded-2xl bg-orange-500 p-3 text-white">
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-slate-400">
              <Send className="mb-4 h-12 w-12 opacity-20" />
              <p>Select a user or open SandBox AI to start chatting</p>
            </div>
          )}
        </div>
      </div>

      <ProposalComposer
        open={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        onSubmit={handleProposalSubmit}
        loading={proposalSending}
      />

      <DocumentReviewComposer
        open={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        onSubmit={handleDocumentReviewSubmit}
        loading={docSending}
      />

      <NDAViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        nda={activeNDA}
        senderName={authUser?.name}
        receiverName={selectedUser?.name}
      />

      <NDASignModal
        isOpen={showProposalNdaModal}
        onClose={() => setShowProposalNdaModal(false)}
        receiver={authUser}
        onSignComplete={() => {
          handleSignComplete();
          setShowProposalNdaModal(false);
        }}
      />
    </>
  );
}

export default ChatWorkspace;
