// Domain types mirroring backend response shapes.

export type ICPClassification = 'A' | 'B' | 'C' | 'Not a Fit' | string;
export type AIRelevance = 'High' | 'Medium' | 'Low' | 'Not Relevant' | string;
export type SourceType = 'image' | 'text' | 'manual';
export type MessageDirection = 'INBOUND' | 'OUTBOUND';
export type FollowUpStatus = 'PENDING' | 'DUE' | 'OVERDUE' | 'COMPLETED' | 'SKIPPED' | 'CANCELLED';
export type ConversationChannel = 'LINKEDIN' | 'EMAIL' | 'WHATSAPP' | 'OTHER';
export type ActivityType = 
  | 'PROSPECT_CREATED' | 'PROSPECT_UPDATED' | 'PROSPECT_DELETED'
  | 'NOTE_ADDED' | 'STAGE_CHANGED'
  | 'MESSAGE_SENT' | 'MESSAGE_RECEIVED'
  | 'FOLLOWUP_CREATED' | 'FOLLOWUP_COMPLETED' | 'FOLLOWUP_SKIPPED'
  | 'TAG_ADDED' | 'TAG_REMOVED'
  | 'AI_ANALYSIS_RUN' | 'AI_SCORE_RUN' | 'AI_OUTREACH_GENERATED'
  | 'CONVERSATION_ANALYSED';
export type ActivityActor = 'USER' | 'AI' | 'SYSTEM';
export type RelationshipType = 'CLIENT' | 'PARTNER' | 'FUTURE' | 'NOT_FIT' | 'PROSPECT' | 'UNKNOWN';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface PipelineStage {
  id: number;
  key: string;
  name: string;
  description?: string | null;
  kind: 'pipeline' | 'status';
  order: number;
  isDefault: boolean;
}

export interface Service {
  id: number;
  key: string;
  name: string;
  description: string;
  category?: string | null;
  order: number;
  active: boolean;
}

export interface Opportunity {
  id: string;
  prospectId: string;
  category: string;
  description?: string | null;
  whyItMatters?: string | null;
  evidence?: string | null;
  recommendedService?: string | null;
  priority?: string | null;
  confidence?: number | null;
  status: string;
  createdAt: string;
}

export interface ProspectService {
  id: string;
  serviceId: number;
  status: string;
  reason?: string | null;
  service: Service;
}

export interface OutreachMessage {
  id: string;
  content: string;
  tone: string;
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export interface ProspectAnalysis {
  id: string;
  prospectId: string;
  businessModel?: string | null;
  targetCustomer?: string | null;
  businessStage?: string | null;
  decisionMakerLikelihood?: string | null;
  digitalPresence?: string | null;
  operationalComplexity?: string | null;
  observableSystems?: unknown;
  businessOpportunities?: unknown;
  analysisSummary?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  color?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProspectTag {
  id: string;
  prospectId: string;
  tagId: string;
  tag: Tag;
  createdAt: string;
}

export interface Conversation {
  id: string;
  prospectId: string;
  channel: ConversationChannel;
  subject?: string | null;
  startedAt: string;
  lastMessageAt?: string | null;
  createdAt: string;
  updatedAt: string;
  messages: ConversationMessage[];
  prospect?: { id: string; name?: string | null; company?: string | null };
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  prospectId: string;
  direction: MessageDirection;
  content: string;
  sentAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  id: string;
  userId: string;
  prospectId: string;
  dueAt: string;
  reason: string;
  notes?: string | null;
  status: FollowUpStatus;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  prospect?: { id: string; name?: string | null; company?: string | null; pipelineStage: { id: number; key: string; name: string } };
}

export interface Activity {
  id: string;
  userId: string;
  prospectId: string;
  type: ActivityType;
  actor: ActivityActor;
  description: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface ConversationAnalysis {
  id: string;
  prospectId: string;
  interestLevel: string;
  painPoints: Record<string, unknown>[];
  objections: Record<string, unknown>[];
  requirements: Record<string, unknown>[];
  buyingSignals: Record<string, unknown>[];
  timeline: string;
  budget: string;
  decisionMakerStatus: string;
  servicesDiscussed: Record<string, unknown>[];
  recommendedNextAction: string;
  nextActionReasoning: string;
  riskConcerns: Record<string, unknown>[];
  relationshipType: RelationshipType;
  partnerReason: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteAnalysis {
  id: string;
  prospectId: string;
  url: string;
  status: string;
  title?: string | null;
  summary?: string | null;
  score?: number | null;
  grade?: string | null;
  strengths: string[];
  risks: string[];
  opportunities: string[];
  recommendedActions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AiRun {
  id: string;
  operation: string;
  userId: string;
  prospectId: string;
  status: string;
  model: string;
  error?: string | null;
  startedAt: string;
  completedAt?: string | null;
}

export interface Prospect {
  id: string;
  name?: string | null;
  company?: string | null;
  role?: string | null;
  location?: string | null;
  industry?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  businessModel?: string | null;
  targetCustomer?: string | null;
  businessStage?: string | null;
  source?: string | null;
  sourceType?: string | null;
  decisionMakerLikelihood?: string | null;
  digitalPresence?: string | null;
  operationalComplexity?: string | null;
  buyingSignals: string[];
  notes?: string | null;
  isDraft: boolean;
  icpScore?: number | null;
  icpClassification?: ICPClassification | null;
  icpReasoning?: string | null;
  icpManualOverride: boolean;
  aiRelevance?: AIRelevance | null;
  pipelineStageId: number;
  pipelineStage: PipelineStage;
  pipelineChangedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  analysis?: ProspectAnalysis | null;
  analyses?: ProspectAnalysis[];
  opportunities: Opportunity[];
  prospectServices: ProspectService[];
  outreachMessages: OutreachMessage[];
  notesList: Note[];
  prospectTags: ProspectTag[];
  followUps: FollowUp[];
  conversationAnalyses: ConversationAnalysis[];
  activities: Activity[];
  conversations: Conversation[];
  aiRuns: AiRun[];
  websiteAnalyses?: WebsiteAnalysis[];
}

export interface ListProspectsResponse {
  items: Prospect[];
  total: number;
}

export interface DashboardSummary {
  total: number;
  aCount: number;
  bCount: number;
  warm: number;
  hot: number;
  won: number;
  lost: number;
  byStage: Array<{ key: string; name: string; count: number }>;
}

// kept for type compatibility — not currently exposed by API
export type _DashboardSummary = DashboardSummary;
