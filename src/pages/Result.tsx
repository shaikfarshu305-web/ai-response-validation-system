import {
  ArrowLeft, Target, ShieldCheck, Search, ListChecks, Gavel, CheckCircle2,
  XCircle, AlertTriangle, FileText, Database, ThumbsUp, ThumbsDown,
  Eye, ChevronDown, ChevronRight, Lightbulb, Quote,
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardHeader, Badge, Button, ScoreRing, ProgressBar } from '@/components/ui';
import type { Evaluation, Claim, Evidence } from '@/lib/types';
import { VERDICT_META, RISK_META, CLAIM_STATUS_META } from '@/lib/types';
import { cn } from '@/lib/cn';

export function ResultPage({ evaluation, onBack }: { evaluation: Evaluation; onBack: () => void }) {
  const [showComparison, setShowComparison] = useState(false);
  const meta = VERDICT_META[evaluation.verdict];
  const risk = RISK_META[evaluation.hallucinationRisk];
  const scores = evaluation.scores;

  const dimensionCards = [
    { name: 'Relevance', score: scores.relevance, icon: Target, color: '#3385ff', desc: 'Measures how directly the response addresses the question.' },
    { name: 'Accuracy', score: scores.accuracy, icon: ShieldCheck, color: '#06cf87', desc: 'Measures factual correctness against available evidence.' },
    { name: 'Hallucination', score: scores.hallucination, icon: Search, color: '#12b767', desc: 'Measures how well the response is grounded in reliable evidence.' },
    { name: 'Completeness', score: scores.completeness, icon: ListChecks, color: '#f79009', desc: 'Measures whether important information is missing.' },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Top result summary */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:gap-8">
          <div className="flex flex-col items-center">
            <ScoreRing score={scores.overall} size={140} stroke={12} />
            <p className="mt-2 text-xs text-slate-400">Overall Score</p>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Evaluation Result</h2>
              <span className={cn('rounded-full px-3 py-1 text-sm font-semibold', meta.bg, meta.text)}>
                {evaluation.verdict} Response
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{evaluation.summary}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <FileText className="h-3.5 w-3.5" /> ID: <span className="font-mono text-slate-600 dark:text-slate-300">{evaluation.id}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                Confidence: <span className="font-semibold text-slate-600 dark:text-slate-300">{(evaluation.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                Duration: <span className="font-semibold text-slate-600 dark:text-slate-300">{(evaluation.durationMs / 1000).toFixed(1)}s</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 lg:flex-col">
            <Button variant="outline" size="sm" icon={<FileText className="h-4 w-4" />}>Download Report</Button>
            <Button variant="secondary" size="sm" icon={<Eye className="h-4 w-4" />} onClick={() => setShowComparison((s) => !s)}>Compare</Button>
          </div>
        </div>
      </Card>

      {/* Score cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dimensionCards.map((d) => {
          const Icon = d.icon;
          return (
            <Card key={d.name} hover className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${d.color}1a`, color: d.color }}>
                    <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{d.name}</h3>
                </div>
                <span className="text-xl font-bold" style={{ color: d.color }}>{d.score.toFixed(1)}<span className="text-xs text-slate-400">/10</span></span>
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{d.desc}</p>
              <ProgressBar value={d.score} max={10} color={d.score >= 8 ? 'success' : d.score >= 6.5 ? 'brand' : d.score >= 5 ? 'warning' : 'error'} className="mt-3" />
            </Card>
          );
        })}
      </div>

      {/* Comparison view */}
      {showComparison && (
        <Card className="animate-fade-in">
          <CardHeader title="AI Response Analysis" subtitle="Compare question, response, reference, and evidence side by side" icon={<Eye className="h-4 w-4" />} />
          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
            <CompareBlock label="Question" content={evaluation.question} color="brand" />
            <CompareBlock label="AI Response" content={evaluation.response} color="accent" />
            {evaluation.referenceAnswer && <CompareBlock label="Reference Answer" content={evaluation.referenceAnswer} color="success" />}
            <CompareBlock label="Retrieved Evidence" content={evaluation.evidence.map((e) => e.text).join('\n\n')} color="warning" />
          </div>
        </Card>
      )}

      {/* Hallucination Analysis */}
      <Card>
        <CardHeader
          title="Hallucination Analysis"
          subtitle="Detailed claim-by-claim verification against retrieved evidence"
          icon={<Search className="h-4 w-4" />}
          action={
            <div className="flex items-center gap-2">
              {evaluation.hallucination ? (
                <Badge color="error" dot>Hallucination Detected: Yes</Badge>
              ) : (
                <Badge color="success" dot>Hallucination Detected: No</Badge>
              )}
            </div>
          }
        />
        <div className="space-y-5 p-5">
          {/* Risk indicator */}
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Hallucination Risk:</span>
              <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1', risk.text, risk.ring)}>
                <span className={cn('h-2 w-2 rounded-full', risk.bg)} />
                {evaluation.hallucinationRisk}
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2">
              <ProgressBar value={evaluation.hallucinationRisk === 'Low' ? 25 : evaluation.hallucinationRisk === 'Medium' ? 60 : 90} color={evaluation.hallucinationRisk === 'Low' ? 'success' : evaluation.hallucinationRisk === 'Medium' ? 'warning' : 'error'} />
              <span className="shrink-0 text-xs text-slate-400">{evaluation.claims.length} claims analyzed</span>
            </div>
          </div>

          {/* Claims */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Detected Claims</h4>
            {evaluation.claims.map((claim, i) => (
              <ClaimCard key={claim.id} claim={claim} index={i} />
            ))}
          </div>
        </div>
      </Card>

      {/* Retrieved Evidence */}
      <Card>
        <CardHeader title="Retrieved Evidence" subtitle="Reference information used during evaluation (RAG)" icon={<Database className="h-4 w-4" />} />
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
          {evaluation.evidence.map((ev) => (
            <EvidenceCard key={ev.id} evidence={ev} />
          ))}
        </div>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader title="Strengths" icon={<ThumbsUp className="h-4 w-4" />} />
          <div className="space-y-2 p-5">
            {evaluation.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-success-50/60 p-3 dark:bg-success-900/15">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-success-500" style={{ width: 18, height: 18 }} />
                <p className="text-sm text-slate-700 dark:text-slate-200">{s}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Areas for Improvement" icon={<ThumbsDown className="h-4 w-4" />} />
          <div className="space-y-2 p-5">
            {evaluation.weaknesses.map((w, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-warning-50/60 p-3 dark:bg-warning-900/15">
                <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-warning-500" style={{ width: 18, height: 18 }} />
                <p className="text-sm text-slate-700 dark:text-slate-200">{w}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Final Verdict */}
      <Card className="overflow-hidden">
        <div className={cn('flex flex-col items-center gap-4 p-6 text-center', meta.bg)}>
          <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl', meta.text)}>
            <Gavel className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider opacity-70">Final Verdict</p>
            <h2 className={cn('mt-1 text-3xl font-bold', meta.text)}>{evaluation.verdict.toUpperCase()}</h2>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{scores.overall.toFixed(1)}</p>
              <p className="text-xs text-slate-500">Overall Score</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{(evaluation.confidence * 100).toFixed(0)}%</p>
              <p className="text-xs text-slate-500">Confidence</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{evaluation.hallucination ? 'Yes' : 'No'}</p>
              <p className="text-xs text-slate-500">Hallucination</p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 p-5 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-warning-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recommendation</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{evaluation.recommendation}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function CompareBlock({ label, content, color }: { label: string; content: string; color: string }) {
  const colors: Record<string, string> = {
    brand: 'border-l-brand-500 bg-brand-50/40 dark:bg-brand-900/10',
    accent: 'border-l-accent-500 bg-accent-50/40 dark:bg-accent-900/10',
    success: 'border-l-success-500 bg-success-50/40 dark:bg-success-900/10',
    warning: 'border-l-warning-500 bg-warning-50/40 dark:bg-warning-900/10',
  };
  return (
    <div className={cn('rounded-xl border border-slate-200 border-l-4 p-4 dark:border-slate-800', colors[color])}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{content}</p>
    </div>
  );
}

function ClaimCard({ claim, index }: { claim: Claim; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const meta = CLAIM_STATUS_META[claim.status];
  const problematic = claim.status === 'Contradicted' || claim.status === 'Potential Hallucination';

  return (
    <div className={cn('rounded-xl border p-4 transition-colors', problematic ? 'border-error-200 bg-error-50/30 dark:border-error-800/50 dark:bg-error-900/10' : 'border-slate-200 dark:border-slate-800')}>
      <div className="flex items-start gap-3">
        <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold', problematic ? 'bg-error-100 text-error-600 dark:bg-error-900/40 dark:text-error-400' : 'bg-success-100 text-success-600 dark:bg-success-900/40 dark:text-success-400')}>
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{claim.text}</p>
            <span className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', meta.bg, meta.text)}>
              <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />
              {claim.status}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span>Confidence: <span className="font-semibold text-slate-700 dark:text-slate-200">{(claim.confidence * 100).toFixed(0)}%</span></span>
            <button onClick={() => setExpanded((e) => !e)} className="inline-flex items-center gap-1 text-brand-600 hover:underline dark:text-brand-400">
              {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              {expanded ? 'Hide details' : 'View evidence & explanation'}
            </button>
          </div>
          {expanded && (
            <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="flex items-start gap-2">
                <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-500">Evidence</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{claim.evidence}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-500">Explanation</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{claim.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EvidenceCard({ evidence }: { evidence: Evidence }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge color="brand">{evidence.source}</Badge>
          <Badge color="accent">{evidence.dataset}</Badge>
        </div>
        <span className="text-xs text-slate-400">Chunk {evidence.chunkId}</span>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{evidence.text}</p>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-slate-400">Similarity:</span>
        <ProgressBar value={evidence.similarity * 100} color={evidence.similarity >= 0.85 ? 'success' : 'warning'} className="flex-1" />
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{(evidence.similarity * 100).toFixed(0)}%</span>
      </div>
      <div className="mt-3 flex gap-2">
        <Button variant="ghost" size="sm" icon={<Eye className="h-3.5 w-3.5" />}>View Source</Button>
        <Button variant="ghost" size="sm" icon={<FileText className="h-3.5 w-3.5" />}>View Context</Button>
      </div>
    </div>
  );
}
