'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { Card } from '@/components/Card';
import { Spinner } from '@/components/Spinner';
import { Badge } from '@/components/Badge';
import { conversationsApi, ai2Api, prospectsApi } from '@/lib/api';
import type { Conversation, ConversationMessage, Prospect } from '@/lib/types';
import { toast } from '@/components/Toaster';
import Protected from '@/modules/auth/Protected';
import { AppShell } from '@/components/AppShell';
import Link from 'next/link';

type View = 'search' | 'list' | 'thread';

function ConversationsInner() {
  const [view, setView] = useState<View>('search');
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [thread, setThread] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [analysis, setAnalysis] = useState<{ interestLevel: string; relationshipType: string; recommendedNextAction: string; summary: string } | null>(null);
  const [nextAction, setNextAction] = useState<{ action: string; category: string; suggestedMessage?: string } | null>(null);
  const [content, setContent] = useState('');
  const [direction, setDirection] = useState<'INBOUND' | 'OUTBOUND'>('OUTBOUND');
  const [params, setParams] = useState<{ prospectId?: string; conversationId?: string }>({});
  const [newChannel, setNewChannel] = useState('LINKEDIN');
  const [newSubject, setNewSubject] = useState('');
  const [creatingConv, setCreatingConv] = useState(false);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const p = sp.get('prospectId');
    const c = sp.get('conversationId');
    setParams({ prospectId: p || undefined, conversationId: c || undefined });
  }, []);

  useEffect(() => {
    if (params.prospectId) {
      setView('list');
      loadConversations(params.prospectId);
    }
  }, [params.prospectId]);

  useEffect(() => {
    if (params.conversationId && view === 'list') {
      loadThread(params.conversationId);
    }
  }, [params.conversationId, view]);

  async function searchProspects(q: string) {
    setLoading(true);
    try {
      const res = await prospectsApi.list({ q, limit: 20 });
      setProspects(res.items);
      setView('search');
    } catch {
      toast('Search failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadConversations(pid: string) {
    setLoading(true);
    try {
      const res = await conversationsApi.list(pid);
      setConversations(res.conversations);
      setView('list');
    } catch {
      toast('Failed to load conversations', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadThread(cid: string) {
    setLoading(true);
    setAnalysis(null);
    setNextAction(null);
    try {
      const res = await conversationsApi.get(cid);
      setThread(res.conversation);
      setMessages(res.conversation.messages);
      setView('thread');
    } catch {
      toast('Failed to load conversation', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!content.trim() || !thread) return;
    setSending(true);
    try {
      const res = await conversationsApi.addMessage(thread.id, { direction, content: content.trim() });
      setMessages((prev) => [...prev, res.message]);
      setContent('');
      toast('Message sent', 'success');
    } catch {
      toast('Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  }

  async function analyze() {
    if (!params.prospectId) return;
    setLoading(true);
    try {
      const res = await ai2Api.analyzeConversation(params.prospectId);
      setAnalysis(res.analysis);
      toast('Analysis updated', 'success');
    } catch {
      toast('Analysis failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function getNextAction() {
    if (!params.prospectId) return;
    setLoading(true);
    try {
      const res = await ai2Api.nextBestAction(params.prospectId);
      setNextAction(res.recommendation);
      toast('Next action refreshed', 'success');
    } catch {
      toast('Failed to get next action', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_46px_rgba(15,23,42,0.04)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Conversation CRM</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Conversations</h1>
        <p className="mt-1 text-sm text-slate-500">Thread, summarize, and act on outreach in one place.</p>
      </div>

      {view === 'search' && (
        <Card className="p-5">
          <label className="label" htmlFor="conv-search">Find a prospect</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="conv-search"
              className="input"
              placeholder="Search by name or company…"
              onKeyDown={(e) => {
                if (e.key === 'Enter') searchProspects((e.target as HTMLInputElement).value);
              }}
            />
            <button className="btn-secondary sm:w-auto" onClick={() => searchProspects((document.activeElement as HTMLInputElement).value)}>
              Search
            </button>
          </div>
          {prospects.length > 0 && (
            <ul className="mt-4 space-y-2">
              {prospects.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set('prospectId', p.id);
                      url.searchParams.delete('conversationId');
                      window.location.href = url.toString();
                    }}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-brand-200 hover:bg-brand-50/30"
                  >
                    <p className="text-sm font-medium text-slate-900">{p.name || 'Unnamed'}</p>
                    <p className="text-xs text-slate-500">{p.company || '—'}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {view === 'list' && (
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="section-title">Threads</p>
              <p className="text-xs text-slate-500">Active conversations for this prospect</p>
            </div>
            <button className="btn-ghost text-xs" onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete('prospectId');
              url.searchParams.delete('conversationId');
              window.location.href = url.toString();
            }}>
              ← Back to search
            </button>
          </div>

          <form
            className="mb-5 flex flex-wrap items-end gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!params.prospectId || creatingConv) return;
              setCreatingConv(true);
              try {
                const { conversation } = await conversationsApi.create(params.prospectId, {
                  channel: newChannel,
                  subject: newSubject.trim() || undefined,
                });
                const url = new URL(window.location.href);
                url.searchParams.set('conversationId', conversation.id);
                window.location.href = url.toString();
              } catch {
                toast('Failed to create conversation', 'error');
              } finally {
                setCreatingConv(false);
              }
            }}
          >
            <div>
              <label className="label" htmlFor="conv-channel">Channel</label>
              <select id="conv-channel" className="input w-auto" value={newChannel} onChange={(e) => setNewChannel(e.target.value)}>
                <option value="LINKEDIN">LinkedIn</option>
                <option value="EMAIL">Email</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="min-w-[220px] flex-1">
              <label className="label" htmlFor="conv-subject">Subject (optional)</label>
              <input id="conv-subject" className="input" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="e.g. First outreach discussion" />
            </div>
            <button type="submit" className="btn-primary text-xs" disabled={creatingConv}>
              {creatingConv ? <Spinner /> : 'New conversation'}
            </button>
          </form>

          {conversations.length === 0 ? (
            <p className="empty-state">No conversations yet.</p>
          ) : (
            <ul className="space-y-2">
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set('conversationId', c.id);
                      window.location.href = url.toString();
                    }}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-brand-200 hover:bg-brand-50/30"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-slate-900">{c.subject || 'Conversation'}</p>
                      <span className="chip bg-slate-100 text-slate-700">{c.channel}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{c.messages.length} messages · {new Date(c.startedAt).toLocaleDateString()}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {view === 'thread' && thread && (
        <div className="grid gap-4 xl:grid-cols-[1.5fr_0.8fr]">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">{thread.channel}</p>
                <h2 className="text-lg font-semibold text-slate-900">{thread.subject || 'Conversation'}</h2>
              </div>
              <button className="btn-ghost text-xs" onClick={() => setView('list')}>← Back</button>
            </div>

            <div className="space-y-3">
              {messages.length === 0 && (
                <p className="empty-state">No messages yet.</p>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      m.direction === 'OUTBOUND'
                        ? 'bg-brand-600 text-white rounded-br-md'
                        : 'bg-slate-100 text-slate-800 rounded-bl-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    <p className={`mt-1 text-[11px] ${m.direction === 'OUTBOUND' ? 'text-brand-100' : 'text-slate-400'}`}>
                      {new Date(m.sentAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value as 'INBOUND' | 'OUTBOUND')}
                  className="input w-auto"
                  aria-label="Message direction"
                >
                  <option value="OUTBOUND">Outbound</option>
                  <option value="INBOUND">Inbound</option>
                </select>
                <input
                  className="input"
                  placeholder="Write a message…"
                  aria-label="Message"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                />
                <button className="btn-primary" onClick={sendMessage} disabled={sending || !content.trim()}>
                  {sending ? <Spinner /> : 'Send'}
                </button>
              </div>
            </div>
          </Card>

          {params.prospectId && (
            <div className="space-y-4">
              <Card className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="section-title">AI conversation analysis</p>
                  <button className="btn-secondary text-xs" onClick={analyze} disabled={loading}>
                    {loading ? <Spinner /> : 'Refresh'}
                  </button>
                </div>
                {analysis ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                      <span className="text-slate-500">Interest</span>
                      <Badge value={analysis.interestLevel} />
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                      <span className="text-slate-500">Relationship</span>
                      <Badge value={analysis.relationshipType} />
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Summary</p>
                      <p className="mt-1 text-slate-700">{analysis.summary || '—'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Recommended next action</p>
                      <p className="mt-1 text-slate-700">{analysis.recommendedNextAction || '—'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="empty-state">No analysis yet.</p>
                )}
              </Card>

              <Card className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="section-title">Next best action</p>
                  <button className="btn-secondary text-xs" onClick={getNextAction} disabled={loading}>
                    {loading ? <Spinner /> : 'Refresh'}
                  </button>
                </div>
                {nextAction ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge value={nextAction.category} />
                    </div>
                    <p className="text-slate-700">{nextAction.action}</p>
                    {nextAction.suggestedMessage && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700 whitespace-pre-wrap">
                        {nextAction.suggestedMessage}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="empty-state">No recommendation yet.</p>
                )}
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ConversationsPage() {
  return (
    <Protected>
      <AppShell>
        <Suspense fallback={<div className="py-10 flex justify-center"><Spinner /></div>}>
          <ConversationsInner />
        </Suspense>
      </AppShell>
    </Protected>
  );
}
