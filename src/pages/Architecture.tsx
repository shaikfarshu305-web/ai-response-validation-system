import {
  Network, User, Monitor, Server, Database, Bot, Gavel,
  BarChart3, FileText, ArrowDown, Layers,
} from 'lucide-react';
import { Card, CardHeader, Badge } from '@/components/ui';
import { cn } from '@/lib/cn';

const LEGEND = [
  { label: 'User Input', color: 'bg-slate-400' },
  { label: 'Processing', color: 'bg-brand-500' },
  { label: 'Knowledge Retrieval', color: 'bg-accent-500' },
  { label: 'AI Agents', color: 'bg-warning-500' },
  { label: 'Evaluation', color: 'bg-success-500' },
  { label: 'Output', color: 'bg-error-500' },
];

export function ArchitecturePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">System Architecture</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">End-to-end pipeline from user input to evaluation output.</p>
      </div>

      {/* Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-semibold text-slate-500">Legend:</span>
          {LEGEND.map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <span className={cn('h-2.5 w-2.5 rounded-full', l.color)} />
              <span className="text-xs text-slate-600 dark:text-slate-300">{l.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Architecture diagram */}
      <Card>
        <CardHeader title="Architecture Flow" subtitle="User → Input → Backend → RAG → Agents → Verdict → Output" icon={<Network className="h-4 w-4" />} />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-3">
            <ArchNode icon={User} label="User" sublabel="Submits question + AI response" color="slate" />
            <Connector />
            <ArchNode icon={Monitor} label="Evaluation Input Interface" sublabel="Web UI — form, file upload, knowledge base toggle" color="brand" />
            <Connector />
            <ArchNode icon={Server} label="Backend / API Layer" sublabel="FastAPI — request handling, orchestration" color="brand" />
            <Connector />
            <ArchNode icon={Layers} label="Input Processing" sublabel="Normalization, tokenization, claim extraction" color="brand" />
            <Connector />

            {/* RAG */}
            <div className="w-full max-w-lg rounded-2xl border-2 border-accent-300 bg-accent-50 p-4 dark:border-accent-700 dark:bg-accent-900/20">
              <div className="mb-3 flex items-center gap-2 text-accent-700 dark:text-accent-300">
                <Database className="h-5 w-5" />
                <p className="text-sm font-semibold">Reference Knowledge Base / RAG Retrieval</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {['TruthfulQA', 'SQuAD', 'HotpotQA', 'FEVER'].map((d) => (
                  <div key={d} className="rounded-lg bg-white/70 px-2 py-1.5 text-center text-xs font-medium text-accent-700 dark:bg-slate-900/50 dark:text-accent-300">
                    {d}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-center text-xs text-accent-600 dark:text-accent-400">Vector database · Embedding similarity search · Top-K retrieval</p>
            </div>

            <Connector />
            <ArchNode icon={Network} label="Evaluation Orchestrator" sublabel="Coordinates parallel agent execution" color="brand" />
            <Connector />

            {/* Agent box */}
            <div className="w-full max-w-2xl rounded-2xl border-2 border-warning-300 bg-warning-50 p-5 dark:border-warning-700 dark:bg-warning-900/20">
              <div className="mb-4 flex items-center gap-2 text-warning-700 dark:text-warning-300">
                <Bot className="h-5 w-5" />
                <p className="text-sm font-semibold">Evaluation Agent Layer</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { name: 'Relevance Judge Agent', desc: 'Does it answer the question?' },
                  { name: 'Accuracy Judge Agent', desc: 'Is it factually correct?' },
                  { name: 'Hallucination Detection', desc: 'Unsupported or fabricated claims?' },
                  { name: 'Completeness Judge Agent', desc: 'Is important info missing?' },
                ].map((a) => (
                  <div key={a.name} className="flex items-start gap-3 rounded-xl bg-white/70 p-3 dark:bg-slate-900/50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning-100 text-warning-600 dark:bg-warning-900/40 dark:text-warning-400">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{a.name}</p>
                      <p className="text-[11px] text-slate-400">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Connector />
            <ArchNode icon={Gavel} label="Verdict Agent" sublabel="Combines all evaluations → final verdict & scoring" color="success" />
            <Connector />
            <ArchNode icon={BarChart3} label="Evaluation Scoring" sublabel="Weighted scoring across dimensions" color="success" />
            <Connector />
            <ArchNode icon={FileText} label="Structured Results" sublabel="JSON report — scores, claims, evidence, verdict" color="success" />
            <Connector />
            <ArchNode icon={Monitor} label="Dashboard / Reports" sublabel="Visualization, history, downloadable reports" color="error" />
          </div>
        </div>
      </Card>

      {/* Tech stack */}
      <Card className="p-5">
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Technology Stack</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { layer: 'Frontend', tech: 'React + TypeScript + Tailwind' },
            { layer: 'Backend API', tech: 'FastAPI (Python)' },
            { layer: 'LLM Engine', tech: 'GPT-4o / GPT-4o-mini' },
            { layer: 'Embeddings', tech: 'text-embedding-3-small' },
            { layer: 'Vector DB', tech: 'FAISS / pgvector' },
            { layer: 'Knowledge Base', tech: 'TruthfulQA, SQuAD, FEVER' },
            { layer: 'Agents', tech: 'Judge-based multi-agent' },
            { layer: 'Reports', tech: 'PDF export, structured JSON' },
          ].map((s) => (
            <div key={s.layer} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{s.layer}</p>
              <p className="mt-0.5 text-xs font-medium text-slate-700 dark:text-slate-200">{s.tech}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const ARCH_COLORS: Record<string, { border: string; bg: string; text: string; icon: string }> = {
  slate: { border: 'border-slate-300 dark:border-slate-700', bg: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-200', icon: 'text-slate-400' },
  brand: { border: 'border-brand-300 dark:border-brand-700', bg: 'bg-brand-50 dark:bg-brand-900/20', text: 'text-brand-700 dark:text-brand-300', icon: 'text-brand-500' },
  accent: { border: 'border-accent-300 dark:border-accent-700', bg: 'bg-accent-50 dark:bg-accent-900/20', text: 'text-accent-700 dark:text-accent-300', icon: 'text-accent-500' },
  warning: { border: 'border-warning-300 dark:border-warning-700', bg: 'bg-warning-50 dark:bg-warning-900/20', text: 'text-warning-700 dark:text-warning-300', icon: 'text-warning-500' },
  success: { border: 'border-success-300 dark:border-success-700', bg: 'bg-success-50 dark:bg-success-900/20', text: 'text-success-700 dark:text-success-300', icon: 'text-success-500' },
  error: { border: 'border-error-300 dark:border-error-700', bg: 'bg-error-50 dark:bg-error-900/20', text: 'text-error-700 dark:text-error-300', icon: 'text-error-500' },
};

function ArchNode({ icon: Icon, label, sublabel, color }: { icon: typeof User; label: string; sublabel: string; color: string }) {
  const c = ARCH_COLORS[color];
  return (
    <div className={cn('flex w-full max-w-md items-center gap-4 rounded-xl border-2 px-5 py-3.5', c.border, c.bg)}>
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/70 dark:bg-slate-900/50', c.icon)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className={cn('text-sm font-semibold', c.text)}>{label}</p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{sublabel}</p>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex flex-col items-center">
      <div className="h-4 w-0.5 bg-slate-300 dark:bg-slate-600" />
      <ArrowDown className="h-3 w-3 text-slate-300 dark:text-slate-600" />
    </div>
  );
}
