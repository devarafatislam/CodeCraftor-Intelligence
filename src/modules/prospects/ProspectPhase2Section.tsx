'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/Card';
import { Spinner } from '@/components/Spinner';
import { Badge } from '@/components/Badge';
import { cn } from '@/lib/cn';
import { conversationsApi, followUpsApi, tagsApi, activitiesApi, ai2Api, prospectsApi } from '@/lib/api';
import type { Conversation, ConversationMessage, FollowUp, ProspectTag, Activity, Tag, ConversationAnalysis } from '@/lib/types';
import { toast } from '@/components/Toaster';
import Link from 'next/link';

type Tab = 'conversations' | 'followups' | 'tags' | 'activity';

export function ProspectPhase2Section({ prospectId, onUpdated }: { prospectId: string; onUpdated: () => void }) {
  const [tab, setTab] = useState<Tab>('conversations');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [thread, setThread] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [prospectTags, setProspectTags] = useState<ProspectTag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<ConversationAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [msgContent, setMsgContent] = useState('');
  const [msgDirection, setMsgDirection] = useState<'INBOUND' | 'OUTBOUND'>('OUTBOUND');
  const [sending, setSending] = useState(false);
  const [analysis, setAnalysis] = useState<{ interestLevel: string; relationshipType: string; recommendedNextAction: string; summary: string } | null>(null);
  const [nextAction, setNextAction] = useState<{ action: string; category: string; suggestedMessage?: string } | null>(null);
  const [newChannel, setNewChannel] = useState('LINKEDIN');
  const [newSubject, setNewSubject] = useState('');
  const [creatingConv, setCreatingConv] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [prospectRes, convRes, fuRes, actsRes, tagsRes] = await Promise.all([
        prospectsApi.get(prospectId),
        conversationsApi.list(prospectId),
        followUpsApi.list({ prospectId }),
        activitiesApi.forProspect(prospectId, 50),
        tagsApi.list(),
      ]);
      setConversations(convRes.conversations);
      setFollowUps(fuRes.followUps);
      setActivities(actsRes.activities);
      setLatestAnalysis(prospectRes.prospect.conversationAnalyses?.[0] ?? null);
      setProspectTags(prospectRes.prospect.prospectTags ?? []);
      setAllTags(tagsRes.tags);
    } catch {
      toast('Failed to load Phase 2 data', 'error');
    } finally {
      setLoading(false);
    }
  }, [prospectId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function openThread(conv: Conversation) {
    setThread(conv);
    setMessages(conv.messages);
  }

  async function sendMessage() {
    if (!msgContent.trim() || !thread) return;
    setSending(true);
    try {
      const res = await conversationsApi.addMessage(thread.id, { direction: msgDirection, content: msgContent.trim() });
      setMessages((prev) => [...prev, res.message]);
      setMsgContent('');
      toast('Message sent', 'success');
    } catch {
      toast('Failed to send', 'error');
    } finally {
      setSending(false);
    }
  }

  async function createConversation() {
    if (creatingConv) return;
    setCreatingConv(true);
    try {
      const { conversation } = await conversationsApi.create(prospectId, {
        channel: newChannel,
        subject: newSubject.trim() || undefined,
      });
      setConversations((prev) => [conversation, ...prev]);
      setThread(conversation);
      setMessages(conversation.messages);
      setNewSubject('');
      toast('Conversation created', 'success');
      onUpdated();
    } catch {
      toast('Failed to create conversation', 'error');
    } finally {
      setCreatingConv(false);
    }
  }

  async function attachTag(tagId: string) {
    try {
      await tagsApi.attach(prospectId, tagId);
      toast('Tag attached', 'success');
      loadAll();
      onUpdated();
    } catch {
      toast('Attach failed', 'error');
    }
  }

  async function detachTag(tagId: string) {
    try {
      await tagsApi.detach(prospectId, tagId);
      toast('Tag detached', 'success');
      loadAll();
      onUpdated();
    } catch {
      toast('Detach failed', 'error');
    }
  }

  async function completeFollowUp(id: string) {
    try {
      await followUpsApi.update(id, { status: 'COMPLETED' });
      toast('Follow-up completed', 'success');
      loadAll();
      onUpdated();
    } catch {
      toast('Update failed', 'error');
    }
  }

  async function runAnalysis() {
    setLoading(true);
    try {
      const res = await ai2Api.analyzeConversation(prospectId);
      setAnalysis(res.analysis);
      setLatestAnalysis(res.analysis as ConversationAnalysis);
      toast('Analysis updated', 'success');
    } catch {
      toast('Analysis failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function runNextAction() {
    setLoading(true);
    try {
      const res = await ai2Api.nextBestAction(prospectId);
      setNextAction(res.recommendation);
      toast('Next action refreshed', 'success');
    } catch {
      toast('Failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="section-title">Conversations, follow-ups &amp; activity</p>
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {([
            { key: 'conversations', label: 'Conversations' },
            { key: 'followups', label: 'Follow-ups' },
            { key: 'tags', label: 'Tags' },
            { key: 'activity', label: 'Activity' },
          ] as { key: Tab; label: string }[]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition',
                tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading && tab === 'conversations' ? (
        <div className="py-6 flex justify-center"><Spinner /></div>
      ) : (
        <>
          {tab === 'conversations' && (
            <div className="space-y-4">
              {latestAnalysis && (
                <div className="rounded-2xl border border-brand-200 bg-brand-50/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">AI conversation intelligence</p>
                    <Badge value={latestAnalysis.relationshipType} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge value={latestAnalysis.interestLevel} />
                    <span className="chip bg-slate-100 text-slate-700">Decision maker: {latestAnalysis.decisionMakerStatus || 'Unknown'}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{latestAnalysis.summary || 'No summary available yet.'}</p>
                  <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                    <div className="rounded-xl bg-white/70 p-2">
                      <p className="font-medium text-slate-700">Recommended next action</p>
                      <p className="mt-1">{latestAnalysis.recommendedNextAction || '—'}</p>
                    </div>
                    <div className="rounded-xl bg-white/70 p-2">
                      <p className="font-medium text-slate-700">Services discussed</p>
                      <p className="mt-1">{latestAnalysis.servicesDiscussed?.length ? latestAnalysis.servicesDiscussed.join(', ') : '—'}</p>
                    </div>
                  </div>
                </div>
              )}

              {!thread ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">Conversations ({conversations.length})</p>
                    <Link href={`/conversations?prospectId=${prospectId}`} className="text-xs text-brand-700 hover:underline">View all</Link>
                  </div>
                  <div className="flex flex-wrap gap-2 items-end">
                    <div>
                      <label className="label" htmlFor="pp2-channel">Channel</label>
                      <select id="pp2-channel" className="input w-auto text-xs" value={newChannel} onChange={(e) => setNewChannel(e.target.value)}>
                        <option value="LINKEDIN">LinkedIn</option>
                        <option value="EMAIL">Email</option>
                        <option value="WHATSAPP">WhatsApp</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="flex-1 min-w-[180px]">
                      <label className="label" htmlFor="pp2-subject">Subject (optional)</label>
                      <input id="pp2-subject" className="input text-xs" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="e.g. First outreach discussion" />
                    </div>
                    <button className="btn-primary text-xs" onClick={createConversation} disabled={creatingConv}>
                      {creatingConv ? <Spinner /> : 'New conversation'}
                    </button>
                  </div>
                  {conversations.length === 0 && (
                    <p className="empty-state">No conversations yet.</p>
                  )}
                  <ul className="space-y-2">
                    {conversations.map((c) => (
                      <li key={c.id}>
                        <button onClick={() => openThread(c)} className="w-full text-left card p-3 hover:bg-slate-50">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-900">{c.subject || 'Conversation'}</p>
                            <span className="chip bg-slate-100 text-slate-700">{c.channel}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{c.messages.length} messages · {new Date(c.startedAt).toLocaleDateString()}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">{thread.subject || 'Conversation'}</p>
                    <button className="btn-ghost text-xs" onClick={() => setThread(null)}>← Back</button>
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {messages.length === 0 && <p className="empty-state">No messages.</p>}
                    {messages.map((m) => (
                      <div key={m.id} className={`flex ${m.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.direction === 'OUTBOUND' ? 'bg-brand-600 text-white rounded-br-md' : 'bg-slate-100 text-slate-800 rounded-bl-md'}`}>
                          <p className="whitespace-pre-wrap">{m.content}</p>
                          <p className={`text-xs mt-1 ${m.direction === 'OUTBOUND' ? 'text-brand-200' : 'text-slate-400'}`}>{new Date(m.sentAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <select value={msgDirection} onChange={(e) => setMsgDirection(e.target.value as 'INBOUND' | 'OUTBOUND')} className="input w-auto" aria-label="Message direction">
                      <option value="OUTBOUND">Outbound</option>
                      <option value="INBOUND">Inbound</option>
                    </select>
                    <input className="input" placeholder="Message…" aria-label="Message" value={msgContent} onChange={(e) => setMsgContent(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
                    <button className="btn-primary" onClick={sendMessage} disabled={sending || !msgContent.trim()}>{sending ? <Spinner /> : 'Send'}</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'followups' && (
            <div className="space-y-3">
              {followUps.length === 0 ? (
                <p className="empty-state">No follow-ups scheduled.</p>
              ) : (
                <ul className="space-y-2">
                  {followUps.map((f) => (
                    <li key={f.id} className="card p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-slate-900">{f.reason}</p>
                            <Badge value={f.status} />
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Due {new Date(f.dueAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-1">
                          {f.status !== 'COMPLETED' && f.status !== 'CANCELLED' && (
                            <button className="btn-ghost text-xs" onClick={() => completeFollowUp(f.id)}>Complete</button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'tags' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <select className="input w-auto" onChange={(e) => e.target.value && attachTag(e.target.value)} defaultValue="" aria-label="Attach tag">
                  <option value="">Attach tag…</option>
                  {allTags.filter((t) => !prospectTags.some((pt) => pt.tagId === t.id)).map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              {prospectTags.length === 0 ? (
                <p className="empty-state">No tags attached.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {prospectTags.map((pt) => (
                    <span key={pt.id} className="chip bg-brand-100 text-brand-700">
                      {pt.tag.name}
                      <button onClick={() => detachTag(pt.tagId)} className="ml-1 hover:text-red-600" aria-label={`Remove ${pt.tag.name}`}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'activity' && (
            <div className="space-y-2">
              {activities.length === 0 ? (
                <p className="empty-state">No activity yet.</p>
              ) : (
                <ul className="space-y-2">
                  {activities.map((a) => (
                    <li key={a.id} className="flex items-start gap-3 text-sm">
                      <span className={`chip mt-0.5 ${a.actor === 'AI' ? 'bg-brand-100 text-brand-700' : a.actor === 'USER' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-700'}`}>{a.actor}</span>
                      <div>
                        <p className="text-slate-700">{a.description}</p>
                        <p className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
