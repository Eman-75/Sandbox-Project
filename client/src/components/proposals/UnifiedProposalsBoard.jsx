import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import NDASignModal from '../pages/NDA/NDASignModal';
import InvestorNdaLockOverlay from './InvestorNdaLockOverlay';
import useInvestorMasterNda from '../../hooks/useInvestorMasterNda';

const statusStyles = {
  sent: 'bg-amber-100 text-amber-700',
  viewed: 'bg-sky-100 text-sky-700',
  under_review: 'bg-indigo-100 text-indigo-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
};

const emptyForm = {
  recipientId: '',
  title: '',
  summary: '',
  amount: '',
  equity: '',
  stage: '',
  timeline: '',
  documentSummary: '',
};

function UnifiedProposalsBoard() {
  const { axios, authUser } = useContext(AuthContext);
  const { isInvestor, isRestricted, loading: ndaLoading, handleSignComplete } = useInvestorMasterNda();
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('received');
  const [form, setForm] = useState(emptyForm);
  const [documentFile, setDocumentFile] = useState(null);
  const [showNdaModal, setShowNdaModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [sentRes, receivedRes, recipientRes] = await Promise.all([
          axios.get('/proposals/sent'),
          axios.get('/proposals/received'),
          axios.get('/proposals/eligible-recipients'),
        ]);

        if (sentRes.data?.success) setSent(sentRes.data.proposals || []);
        if (receivedRes.data?.success) setReceived(receivedRes.data.proposals || []);
        if (recipientRes.data?.success) setRecipients(recipientRes.data.recipients || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [axios]);

  const eligibleUsers = useMemo(() => {
    return recipients
      .filter((user) => String(user._id) !== String(authUser?._id))
      .filter((user) => ['investor', 'startup'].includes(user.role));
  }, [recipients, authUser?._id]);

  const activeItems = activeTab === 'received' ? received : sent;

  const tabs = useMemo(
    () => [
      { key: 'received', label: `Received (${received.length})` },
      { key: 'sent', label: `Sent (${sent.length})` },
    ],
    [received.length, sent.length]
  );

  const updateStatus = async (proposalId, status) => {
    const { data } = await axios.patch(`/proposals/${proposalId}/status`, { status });
    if (!data?.success) return;

    setReceived((prev) =>
      prev.map((item) => (item._id === proposalId ? { ...item, status } : item))
    );
  };

  const handleSendProposal = async (event) => {
    event.preventDefault();
    if (!form.recipientId) {
      toast.error('Please select a recipient');
      return;
    }

    if (!form.title.trim() || !form.summary.trim() || !form.amount) {
      toast.error('Title, summary, and amount are required');
      return;
    }

    setSending(true);
    try {
      const payload = {
        recipientId: form.recipientId,
        title: form.title.trim(),
        summary: form.summary.trim(),
        amount: Number(form.amount),
        equity: Number(form.equity || 0),
        stage: form.stage.trim(),
        timeline: form.timeline.trim(),
        documentSummary: form.documentSummary.trim(),
      };
      let requestBody = payload;
      if (documentFile) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => formData.append(key, String(value ?? '')));
        formData.append('document', documentFile);
        requestBody = formData;
      }

      const { data } = await axios.post('/proposals/send', requestBody);

      if (!data?.success) {
        toast.error(data?.message || 'Failed to send proposal');
        return;
      }

      if (data.proposal) {
        setSent((prev) => [data.proposal, ...prev]);
      }
      setForm(emptyForm);
      setDocumentFile(null);
      setActiveTab('sent');
      toast.success('Proposal sent successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to send proposal');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Proposals</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Send proposals on this screen and pick from your eligible connected investors/startups.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <form
          onSubmit={handleSendProposal}
          className="space-y-3 rounded-2xl border border-slate-200/50 bg-white/80 p-4 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80 lg:col-span-2"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Send Proposal</h2>

          <select
            value={form.recipientId}
            onChange={(event) => setForm((prev) => ({ ...prev, recipientId: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
            required
          >
            <option value="">Select recipient</option>
            {eligibleUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>

          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Proposal title"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
            required
          />
          <textarea
            value={form.summary}
            onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
            placeholder="Summary"
            className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
            required
          />
          <div className="space-y-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Attach Document (Optional)
            </label>
            <input
              type="file"
              accept=".pdf,.ppt,.pptx"
              onChange={(event) => setDocumentFile(event.target.files?.[0] || null)}
              className="w-full text-sm"
            />
            {documentFile ? (
              <p className="text-xs text-slate-600">Selected: {documentFile.name}</p>
            ) : (
              <p className="text-xs text-slate-400">Supported: PDF, PPT, PPTX</p>
            )}
          </div>
          <textarea
            value={form.documentSummary}
            onChange={(event) => setForm((prev) => ({ ...prev, documentSummary: event.target.value }))}
            placeholder="Document summary (optional)"
            className="min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
              placeholder="Amount (USD)"
              type="number"
              min="0"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              required
            />
            <input
              value={form.equity}
              onChange={(event) => setForm((prev) => ({ ...prev, equity: event.target.value }))}
              placeholder="Equity %"
              type="number"
              min="0"
              max="100"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
            />
            <input
              value={form.stage}
              onChange={(event) => setForm((prev) => ({ ...prev, stage: event.target.value }))}
              placeholder="Stage"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
            />
            <input
              value={form.timeline}
              onChange={(event) => setForm((prev) => ({ ...prev, timeline: event.target.value }))}
              placeholder="Timeline"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending || eligibleUsers.length === 0}
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? 'Sending...' : 'Send Proposal'}
          </button>
        </form>

        <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-4 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80">
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Eligible Recipients</h2>
          {eligibleUsers.length === 0 ? (
            <p className="text-sm text-slate-500">No connected investors/startups available yet.</p>
          ) : (
            <div className="space-y-2">
              {eligibleUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => setForm((prev) => ({ ...prev, recipientId: user._id }))}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                    form.recipientId === user._id
                      ? 'border-orange-300 bg-orange-50 text-orange-700'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{user.role}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
              activeTab === tab.key
                ? 'bg-orange-500 text-white'
                : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80">
        {loading && <div className="p-5 text-sm text-slate-500">Loading proposals...</div>}
        {!loading && activeItems.length === 0 && (
          <div className="p-5 text-sm text-slate-500">No proposals found in this tab.</div>
        )}

        <div className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
          {activeItems.map((item) => {
            const sender = item.investor;
            const receiver = item.startup;
            const canRespond =
              activeTab === 'received' &&
              String(item.startup?._id || item.startup) === String(authUser?._id);

            return (
              <div key={item._id} className="relative space-y-3 p-5">
                <div className={isRestricted ? 'pointer-events-none select-none blur-sm' : ''}>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        From {sender?.name || 'User'} to {receiver?.name || 'User'}
                      </p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.summary}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[item.status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {String(item.status || 'sent').replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                    <span>${Number(item.amount || 0).toLocaleString()}</span>
                    <span>{item.equity || 0}% equity</span>
                    <span>{item.stage || 'No stage provided'}</span>
                    <span>{item.timeline || 'No timeline'}</span>
                  </div>

                  {item.documentUrl ? (
                    <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                      <p className="font-semibold">{item.documentName || 'Attached document'}</p>
                      <a
                        href={item.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 underline"
                      >
                        Open document
                      </a>
                      {item.documentSummary ? (
                        <p className="mt-2 text-xs text-slate-600">{item.documentSummary}</p>
                      ) : null}
                    </div>
                  ) : null}

                  {canRespond && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => updateStatus(item._id, 'under_review')}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                      >
                        Mark Review
                      </button>
                      <button
                        onClick={() => updateStatus(item._id, 'accepted')}
                        className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(item._id, 'rejected')}
                        className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                {isRestricted && isInvestor && (
                  <InvestorNdaLockOverlay
                    loading={ndaLoading}
                    onSignClick={() => setShowNdaModal(true)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <NDASignModal
        isOpen={showNdaModal}
        onClose={() => setShowNdaModal(false)}
        receiver={authUser}
        onSignComplete={() => {
          handleSignComplete();
          setShowNdaModal(false);
        }}
      />
    </div>
  );
}

export default UnifiedProposalsBoard;
