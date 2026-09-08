// Thin API client. Keeps the rest of the frontend free of fetch details and
// makes it easy to swap to a generated SDK later.
import type {
  Activity, AiRun, Conversation, ConversationAnalysis, ConversationMessage,
  DashboardSummary, FollowUp, ListProspectsResponse, PipelineStage, Prospect,
  ProspectTag, Service, Tag, User, WebsiteAnalysis,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(opts.headers ?? {}),
  };
  let body: BodyInit | undefined;
  if (opts.body !== undefined) {
    if (opts.body instanceof FormData) {
      body = opts.body;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(opts.body);
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? 'GET',
    credentials: 'include',
    headers,
    body,
  });

  const contentType = res.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      (payload && typeof payload === 'object' && 'error' in payload && typeof (payload as { error: unknown }).error === 'string'
        ? (payload as { error: string }).error
        : null) ??
      (typeof payload === 'string' && payload ? payload : null) ??
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status, payload);
  }
  return payload as T;
}

// ---------- Auth ----------
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    request<{ user: User }>('/api/auth/register', { method: 'POST', body: data }),
  login: (data: { email: string; password: string }) =>
    request<{ user: User }>('/api/auth/login', { method: 'POST', body: data }),
  logout: () => request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
  me: () => request<{ user: User }>('/api/auth/me'),
};

// ---------- Prospects ----------
export interface ListFilters {
  stage?: string;
  industry?: string;
  classification?: string;
  aiRelevance?: string;
  source?: string;
  q?: string;
  drafts?: boolean;
  limit?: number;
  offset?: number;
  tags?: string[];
  relationshipType?: string;
  hasFollowUp?: 'due' | 'overdue' | 'upcoming' | 'any';
}

function toQuery(f: ListFilters): string {
  const sp = new URLSearchParams();
  Object.entries(f).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) {
      v.forEach((item) => sp.append(k, String(item)));
    } else {
      sp.set(k, String(v));
    }
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export const prospectsApi = {
  list: (filters: ListFilters = {}) =>
    request<ListProspectsResponse>(`/api/prospects${toQuery(filters)}`),
  create: (data: Partial<Prospect> & { rawInput?: string; sourceType?: string }) =>
    request<{ prospect: Prospect }>('/api/prospects', { method: 'POST', body: data }),
  get: (id: string) => request<{ prospect: Prospect }>(`/api/prospects/${id}`),
  update: (id: string, data: Partial<Prospect> & { pipelineStageKey?: string }) =>
    request<{ prospect: Prospect }>(`/api/prospects/${id}`, { method: 'PATCH', body: data }),
  save: (id: string) => request<{ ok: boolean; isDraft: boolean }>(`/api/prospects/${id}/save`, { method: 'POST' }),
  remove: (id: string) => request<{ ok: boolean }>(`/api/prospects/${id}`, { method: 'DELETE' }),
  addNote: (id: string, content: string) =>
    request<{ note: { id: string; content: string; createdAt: string } }>(`/api/prospects/${id}/notes`, {
      method: 'POST',
      body: { content },
    }),
  websiteAnalysis: {
    get: (id: string) => request<{ analysis: WebsiteAnalysis | null }>(`/api/prospects/${id}/website-analysis`),
    run: (id: string, websiteUrl?: string) =>
      request<{ ok: boolean; prospect: Prospect; analysis: WebsiteAnalysis }>(`/api/prospects/${id}/website-analysis`, {
        method: 'POST',
        body: websiteUrl ? { websiteUrl } : {},
      }),
    reanalyze: (id: string, websiteUrl?: string) =>
      request<{ ok: boolean; prospect: Prospect; analysis: WebsiteAnalysis }>(`/api/prospects/${id}/website-analysis/reanalyze`, {
        method: 'POST',
        body: websiteUrl ? { websiteUrl } : {},
      }),
  },
};

// ---------- AI (Phase 1) ----------
export interface ProcessInput {
  sourceType: 'image' | 'text' | 'manual';
  sourceLabel?: string;
  rawText?: string;
  imageDataUrl?: string;
}

export interface OutreachInput {
  tone?: 'professional' | 'shorter' | 'casual';
}

export const aiApi = {
  process: (id: string, input: ProcessInput) =>
    request<{ ok: boolean; prospect: Prospect }>(`/api/ai/prospects/${id}/process`, { method: 'POST', body: input }),
  extract: (id: string, input: ProcessInput) =>
    request<{ ok: boolean; prospect: Prospect }>(`/api/ai/prospects/${id}/extract`, { method: 'POST', body: input }),
  analyze: (id: string) =>
    request<{ ok: boolean; prospect: Prospect }>(`/api/ai/prospects/${id}/analyze`, { method: 'POST' }),
  score: (id: string) =>
    request<{ ok: boolean; prospect: Prospect }>(`/api/ai/prospects/${id}/score`, { method: 'POST' }),
  opportunities: (id: string) =>
    request<{ ok: boolean; prospect: Prospect }>(`/api/ai/prospects/${id}/opportunities`, { method: 'POST' }),
  outreach: (id: string, input: OutreachInput = {}) =>
    request<{ ok: boolean; prospect: Prospect }>(`/api/ai/prospects/${id}/outreach`, { method: 'POST', body: input }),
};

// ---------- AI2 (Phase 2) ----------
export interface ConversationAnalysisInput { prospectId: string }
export interface NextActionInput { prospectId: string }

export const ai2Api = {
  analyzeConversation: (prospectId: string) =>
    request<{ analysis: ConversationAnalysis }>(`/api/ai2/prospects/${prospectId}/analyze-conversation`, { method: 'POST' }),
  nextBestAction: (prospectId: string) =>
    request<{ recommendation: { action: string; category: string; reasoning: string; suggestedMessage?: string } }>(`/api/ai2/prospects/${prospectId}/next-action`, { method: 'POST' }),
  followUpSuggestions: (prospectId: string) =>
    request<{ items: Array<{ title: string; reason: string; priority: string; suggestedAt: string }> }>(`/api/ai2/prospects/${prospectId}/follow-up-suggestions`, { method: 'GET' }),
};

// ---------- Conversations (Phase 2) ----------
export const conversationsApi = {
  list: (prospectId: string) =>
    request<{ conversations: Conversation[] }>(`/api/prospects/${prospectId}/conversations`),
  get: (id: string) =>
    request<{ conversation: Conversation }>(`/api/conversations/${id}`),
  create: (prospectId: string, data: { channel: string; subject?: string }) =>
    request<{ conversation: Conversation }>(`/api/prospects/${prospectId}/conversations`, { method: 'POST', body: data }),
  addMessage: (conversationId: string, data: { direction: 'INBOUND' | 'OUTBOUND'; content: string }) =>
    request<{ message: ConversationMessage }>(`/api/conversations/${conversationId}/messages`, { method: 'POST', body: data }),
  removeMessage: (conversationId: string, messageId: string) =>
    request<{ ok: boolean }>(`/api/conversations/${conversationId}/messages/${messageId}`, { method: 'DELETE' }),
};

// ---------- Follow-ups (Phase 2) ----------
export interface FollowUpFilters {
  status?: string;
  prospectId?: string;
}

export const followUpsApi = {
  list: (filters: FollowUpFilters = {}) => {
    const sp = new URLSearchParams();
    if (filters.status) sp.set('status', filters.status);
    if (filters.prospectId) sp.set('prospectId', filters.prospectId);
    const qs = sp.toString();
    return request<{ followUps: FollowUp[]; total: number }>(`/api/follow-ups${qs ? `?${qs}` : ''}`);
  },
  get: (id: string) =>
    request<{ followUp: FollowUp }>(`/api/follow-ups/${id}`),
  create: (data: { prospectId: string; reason: string; dueAt: string; notes?: string }) =>
    request<{ followUp: FollowUp }>('/api/follow-ups', { method: 'POST', body: data }),
  update: (id: string, data: { status?: string; dueAt?: string; reason?: string; notes?: string }) =>
    request<{ followUp: FollowUp }>(`/api/follow-ups/${id}`, { method: 'PATCH', body: data }),
  remove: (id: string) =>
    request<{ ok: boolean }>(`/api/follow-ups/${id}`, { method: 'DELETE' }),
  suggest: (prospectId: string) =>
    request<{ suggestions: Array<{ title: string; reason: string; priority: string; suggestedAt: string }> }>(`/api/follow-ups/prospects/${prospectId}/suggest`),
};

// ---------- Tags (Phase 2) ----------
export const tagsApi = {
  list: () =>
    request<{ tags: Tag[] }>('/api/tags'),
  create: (data: { name: string; color?: string }) =>
    request<{ tag: Tag }>('/api/tags', { method: 'POST', body: data }),
  remove: (id: string) =>
    request<{ ok: boolean }>(`/api/tags/${id}`, { method: 'DELETE' }),
  attach: (prospectId: string, tagId: string) =>
    request<{ prospectTag: ProspectTag }>(`/api/tags/prospects/${prospectId}/tags`, { method: 'POST', body: { tagId } }),
  detach: (prospectId: string, tagId: string) =>
    request<{ ok: boolean }>(`/api/tags/prospects/${prospectId}/tags/${tagId}`, { method: 'DELETE' }),
};

// ---------- Activities (Phase 2) ----------
export interface ActivityFilters {
  prospectId?: string;
  limit?: number;
}

export const activitiesApi = {
  list: (filters: ActivityFilters = {}) => {
    const sp = new URLSearchParams();
    if (filters.prospectId) sp.set('prospectId', filters.prospectId);
    if (filters.limit) sp.set('limit', String(filters.limit));
    const qs = sp.toString();
    return request<{ activities: Activity[]; total: number }>(`/api/activities${qs ? `?${qs}` : ''}`);
  },
  forProspect: (prospectId: string, limit = 50) =>
    request<{ activities: Activity[] }>(`/api/activities/prospects/${prospectId}?limit=${limit}`),
};

// ---------- Reference ----------
export const referenceApi = {
  services: () => request<{ services: Service[] }>('/api/services'),
  stages: () => request<{ stages: PipelineStage[] }>('/api/pipeline-stages'),
};

// ---------- Dashboard ----------
// Phase 1 dashboard is derived client-side from the prospects list endpoint.
// This keeps the dashboard responsive without requiring a separate analytics
// service that belongs to Phase 2.
export const dashboardApi = {
  async summary() {
    const { items, total } = await prospectsApi.list({ limit: 200 });
    return items;
  },
  _total: async () => {
    const { total } = await prospectsApi.list({ limit: 1 });
    return total;
  },
};
