export type Verdict = 'Excellent' | 'Good' | 'Acceptable' | 'Needs Improvement' | 'Poor';
export type ClaimStatus = 'Supported' | 'Unsupported' | 'Contradicted' | 'Potential Hallucination';
export type Risk = 'Low' | 'Medium' | 'High';
export type PageKey =
  | 'dashboard'
  | 'evaluate'
  | 'history'
  | 'knowledge'
  | 'agents'
  | 'architecture'
  | 'analytics'
  | 'reports'
  | 'settings';

export interface ScoreSet {
  relevance: number;
  accuracy: number;
  hallucination: number;
  completeness: number;
  overall: number;
}

export interface Claim {
  id: string;
  text: string;
  status: ClaimStatus;
  evidence: string;
  confidence: number;
  explanation: string;
}

export interface Evidence {
  id: string;
  source: string;
  dataset: string;
  text: string;
  similarity: number;
  chunkId: string;
}

export interface Evaluation {
  id: string;
  question: string;
  response: string;
  referenceAnswer?: string;
  scores: ScoreSet;
  verdict: Verdict;
  hallucination: boolean;
  hallucinationRisk: Risk;
  claims: Claim[];
  evidence: Evidence[];
  strengths: string[];
  weaknesses: string[];
  confidence: number;
  summary: string;
  recommendation: string;
  date: string;
  durationMs: number;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  records: number;
  status: 'Active' | 'Indexing' | 'Idle';
  lastUpdated: string;
  chunks: number;
  embeddings: number;
}

export interface KBStats {
  totalDocuments: number;
  totalChunks: number;
  totalEmbeddings: number;
  datasets: number;
  lastUpdated: string;
}

export interface Agent {
  id: string;
  name: string;
  purpose: string;
  status: 'Active' | 'Idle';
  icon: string;
  model: string;
  weight: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
}

export const VERDICT_META: Record<Verdict, { color: string; bg: string; text: string }> = {
  Excellent: { color: 'success', bg: 'bg-success-50 dark:bg-success-900/20', text: 'text-success-700 dark:text-success-400' },
  Good: { color: 'brand', bg: 'bg-brand-50 dark:bg-brand-900/20', text: 'text-brand-700 dark:text-brand-400' },
  Acceptable: { color: 'accent', bg: 'bg-accent-50 dark:bg-accent-900/20', text: 'text-accent-700 dark:text-accent-400' },
  'Needs Improvement': { color: 'warning', bg: 'bg-warning-50 dark:bg-warning-900/20', text: 'text-warning-700 dark:text-warning-400' },
  Poor: { color: 'error', bg: 'bg-error-50 dark:bg-error-900/20', text: 'text-error-700 dark:text-error-400' },
};

export const RISK_META: Record<Risk, { bg: string; text: string; ring: string }> = {
  Low: { bg: 'bg-success-500', text: 'text-success-700 dark:text-success-400', ring: 'ring-success-500/30' },
  Medium: { bg: 'bg-warning-500', text: 'text-warning-700 dark:text-warning-400', ring: 'ring-warning-500/30' },
  High: { bg: 'bg-error-500', text: 'text-error-700 dark:text-error-400', ring: 'ring-error-500/30' },
};

export const CLAIM_STATUS_META: Record<ClaimStatus, { bg: string; text: string; dot: string }> = {
  Supported: { bg: 'bg-success-50 dark:bg-success-900/20', text: 'text-success-700 dark:text-success-400', dot: 'bg-success-500' },
  Unsupported: { bg: 'bg-warning-50 dark:bg-warning-900/20', text: 'text-warning-700 dark:text-warning-400', dot: 'bg-warning-500' },
  Contradicted: { bg: 'bg-error-50 dark:bg-error-900/20', text: 'text-error-700 dark:text-error-400', dot: 'bg-error-500' },
  'Potential Hallucination': { bg: 'bg-error-50 dark:bg-error-900/20', text: 'text-error-700 dark:text-error-400', dot: 'bg-error-500' },
};
