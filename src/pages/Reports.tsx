import { useState } from 'react';
import {
  FileText, Download, Share2, ChevronDown, ChevronRight, Target,
  ShieldCheck, Search, ListChecks, Gavel, CheckCircle2, AlertTriangle,
  Lightbulb, FileCheck2,
} from 'lucide-react';
import { Card, CardHeader, Button, Select, Badge, ScoreRing, ProgressBar } from '@/components/ui';
import { evaluations } from '@/lib/demoData';
import { VERDICT_META, RISK_META } from '@/lib/types';
import { useToast } from '@/lib/toast';
import { cn } from '@/lib/cn';

export function ReportsPage({ onView }: { onView: (id: string) => void }) {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState(evaluations[1].id);
  const evaluation = evaluations.find((e) => e.id === selectedId) ?? evaluations[0];
  const meta = VERDICT_META[evaluation.verdict];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ question: true, response: true, reference: true, scores: true, evidence: true, strengths: true, weaknesses: true, verdict: true });

  const toggle = (k: string) => setExpanded((p) => ({ ...p, [k]: !p[k] }));

  const reportSections = [
    { key: 'question', label: 'Question', icon: FileText },
    { key: 'response', label: 'AI Response', icon: FileCheck2 },
    { key: 'reference', label: 'Reference Answer', icon: FileText },
    { key: 'scores', label: 'Dimension Scores', icon: Target },
    { key: 'evidence', label: 'Retrieved Evidence', icon: Search },
    { key: 'strengths', label: 'Strengths', icon: CheckCircle2 },
    { key: 'weaknesses', label: 'Areas for Improvement', icon: AlertTriangle },
    { key: 'verdict', label: 'Final Verdict', icon: Gavel },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reports</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Generate and download detailed evaluation reports.</p>
        </div>
      </div>

      {/* Selection */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-slate-500">Select Evaluation</label>
            <Select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              {evaluations.map((e) => (
                <option key={e.id} value={e.id}>{e.id} — {e.question.slice(0, 60)}...</option>
              ))}
            </Select>
          </div>
          <div className="flex gap-2 sm:pt-6">
            <Button variant="outline" icon={<FileText className="h-4 w-4" />} onClick={() => toast({ title: 'Report generated', body: `Report for ${evaluation.id} is ready.`, type: 'success' })}>Generate Report</Button>
            <Button variant="outline" icon={<Download className="h-4 w-4" />} onClick={() => toast({ title: 'Downloading PDF', body: `${evaluation.id}.pdf is being downloaded.`, type: 'info' })}>Download PDF</Button>
            <Button icon={<Share2 className="h-4 w-4" />} onClick={() => toast({ title: 'Share link copied', body: 'Report link copied to clipboard.', type: 'success' })}>Share</Button>
          </div>
        </div>
      </Card>

      {/* Report preview */}
      <Card className="overflow-hidden">
        <div className={cn('flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800', meta.bg)}>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider opacity-70">Evaluation Report</p>
            <p className={cn('mt-0.5 text-lg font-bold', meta.text)}>{evaluation.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <ScoreRing score={evaluation.scores.overall} size={64} stroke={6} />
            <div>
              <span className={cn('inline-block rounded-full px-3 py-1 text-xs font-semibold', meta.bg, meta.text)}>{evaluation.verdict}</span>
              <p className="mt-1 text-xs opacity-70">Confidence {(evaluation.confidence * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {/* Question */}
          <ReportSection label="1. Question" icon={FileText} expanded={expanded.question} onToggle={() => toggle('question')}>
            <p className="text-sm text-slate-700 dark:text-slate-200">{evaluation.question}</p>
          </ReportSection>

          {/* Response */}
          <ReportSection label="2. AI Response" icon={FileCheck2} expanded={expanded.response} onToggle={() => toggle('response')}>
            <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{evaluation.response}</p>
          </ReportSection>

          {/* Reference */}
          <ReportSection label="3. Reference Answer" icon={FileText} expanded={expanded.reference} onToggle={() => toggle('reference')}>
            {evaluation.referenceAnswer ? <p className="text-sm text-slate-700 dark:text-slate-200">{evaluation.referenceAnswer}</p> : <p className="text-sm text-slate-400">No reference answer provided.</p>}
          </ReportSection>

          {/* Scores */}
          <ReportSection label="4. Dimension Scores" icon={Target} expanded={expanded.scores} onToggle={() => toggle('scores')}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { name: 'Relevance', score: evaluation.scores.relevance, color: '#3385ff' },
                { name: 'Accuracy', score: evaluation.scores.accuracy, color: '#06cf87' },
                { name: 'Hallucination', score: evaluation.scores.hallucination, color: '#12b767' },
                { name: 'Completeness', score: evaluation.scores.completeness, color: '#f79009' },
              ].map((d) => (
                <div key={d.name} className="rounded-lg border border-slate-200 p-3 text-center dark:border-slate-800">
                  <ScoreRing score={d.score} size={72} stroke={6} />
                  <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">{d.name}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/40">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Overall</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{evaluation.scores.overall.toFixed(1)}/10</span>
              <Badge color={meta.color as any}>{evaluation.verdict}</Badge>
            </div>
          </ReportSection>

          {/* Evidence */}
          <ReportSection label="5. Retrieved Evidence" icon={Search} expanded={expanded.evidence} onToggle={() => toggle('evidence')}>
            <div className="space-y-3">
              {evaluation.evidence.map((ev) => (
                <div key={ev.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Badge color="brand">{ev.source}</Badge>
                    <Badge color="accent">{ev.dataset}</Badge>
                    <span className="ml-auto text-xs text-slate-400">Chunk {ev.chunkId}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{ev.text}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <ProgressBar value={ev.similarity * 100} color="success" className="flex-1" />
                    <span className="text-xs font-semibold text-slate-600">{(ev.similarity * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </ReportSection>

          {/* Strengths */}
          <ReportSection label="6. Strengths" icon={CheckCircle2} expanded={expanded.strengths} onToggle={() => toggle('strengths')}>
            <ul className="space-y-2">
              {evaluation.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-500" />{s}
                </li>
              ))}
            </ul>
          </ReportSection>

          {/* Weaknesses */}
          <ReportSection label="7. Areas for Improvement" icon={AlertTriangle} expanded={expanded.weaknesses} onToggle={() => toggle('weaknesses')}>
            <ul className="space-y-2">
              {evaluation.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-500" />{w}
                </li>
              ))}
            </ul>
          </ReportSection>

          {/* Verdict */}
          <ReportSection label="8. Final Verdict" icon={Gavel} expanded={expanded.verdict} onToggle={() => toggle('verdict')}>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={cn('rounded-xl px-4 py-3', meta.bg)}>
                  <p className={cn('text-xl font-bold', meta.text)}>{evaluation.verdict}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Hallucination Risk</span>
                    <span className={RISK_META[evaluation.hallucinationRisk].text}>{evaluation.hallucinationRisk}</span>
                  </div>
                  <ProgressBar value={evaluation.hallucinationRisk === 'Low' ? 25 : evaluation.hallucinationRisk === 'Medium' ? 60 : 90} color={evaluation.hallucinationRisk === 'Low' ? 'success' : evaluation.hallucinationRisk === 'Medium' ? 'warning' : 'error'} className="mt-1" />
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/40">
                <p className="text-xs font-semibold text-slate-500">Summary</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{evaluation.summary}</p>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-warning-50/60 p-3 dark:bg-warning-900/15">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-500">Recommendation</p>
                  <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-200">{evaluation.recommendation}</p>
                </div>
              </div>
            </div>
          </ReportSection>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <Button variant="ghost" size="sm" onClick={() => onView(evaluation.id)}>View full evaluation</Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={<Download className="h-3.5 w-3.5" />} onClick={() => toast({ title: 'Downloading PDF', body: `${evaluation.id}.pdf is being downloaded.`, type: 'info' })}>Download PDF</Button>
            <Button size="sm" icon={<Share2 className="h-3.5 w-3.5" />} onClick={() => toast({ title: 'Share link copied', body: 'Report link copied to clipboard.', type: 'success' })}>Share Report</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ReportSection({ label, icon: Icon, expanded, onToggle, children }: { label: string; icon: typeof FileText; expanded: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div>
      <button onClick={onToggle} className="flex w-full items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30">
        <Icon className="h-4 w-4 text-slate-400" />
        <span className="flex-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
        {expanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
      </button>
      {expanded && <div className="px-6 pb-4 animate-fade-in">{children}</div>}
    </div>
  );
}
