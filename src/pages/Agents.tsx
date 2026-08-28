import {
  Bot, Target, ShieldCheck, Search, ListChecks, Gavel, ArrowDown,
  CircleCheck, Cpu, Weight,
} from 'lucide-react';
import { Card, CardHeader, Badge } from '@/components/ui';
import { agents } from '@/lib/demoData';
import { cn } from '@/lib/cn';

const ICON_MAP: Record<string, typeof Target> = {
  Target, ShieldCheck, Search, ListChecks, Gavel,
};

export function AgentsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Evaluation Agent Layer</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Specialized AI judge agents that evaluate responses across four dimensions.</p>
      </div>

      {/* Agent cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((a) => {
          const Icon = ICON_MAP[a.icon] ?? Bot;
          return (
            <Card key={a.id} hover className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <Badge color="success" dot>{a.status}</Badge>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{a.name}</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{a.purpose}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Cpu className="h-3.5 w-3.5" /> {a.model}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Weight className="h-3.5 w-3.5" /> Weight: {(a.weight * 100).toFixed(0)}%
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Workflow */}
      <Card>
        <CardHeader title="Agent Workflow" subtitle="How evaluation agents collaborate to produce a verdict" icon={<Bot className="h-4 w-4" />} />
        <div className="p-6">
          <div className="flex flex-col items-center gap-2">
            <WorkflowNode label="Input" sublabel="Question + AI Response" color="slate" />
            <Arrow />
            <WorkflowNode label="Orchestrator" sublabel="Coordinates agent execution" color="brand" />
            <Arrow />

            {/* Parallel agents */}
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {agents.filter((a) => a.id !== 'verdict').map((a) => {
                const Icon = ICON_MAP[a.icon] ?? Bot;
                return (
                  <div key={a.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-center dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                      <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-200">{a.name.replace(' Judge Agent', '').replace(' Agent', '').replace('Detection', 'Detect.')}</p>
                  </div>
                );
              })}
            </div>

            <Arrow />
            <WorkflowNode label="Verdict Agent" sublabel="Combines results → final verdict" color="accent" />
            <Arrow />
            <WorkflowNode label="Final Result" sublabel="Scores + Hallucination + Recommendation" color="success" />
          </div>
        </div>
      </Card>

      {/* Dimension summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { name: 'Relevance', icon: Target, color: '#3385ff', desc: 'Answers the question?' },
          { name: 'Accuracy', icon: ShieldCheck, color: '#06cf87', desc: 'Factually correct?' },
          { name: 'Hallucination', icon: Search, color: '#12b767', desc: 'Grounded in evidence?' },
          { name: 'Completeness', icon: ListChecks, color: '#f79009', desc: 'Nothing missing?' },
        ].map((d) => {
          const Icon = d.icon;
          return (
            <Card key={d.name} className="p-4 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${d.color}1a`, color: d.color }}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{d.name}</p>
              <p className="text-xs text-slate-400">{d.desc}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

const NODE_COLORS: Record<string, string> = {
  slate: 'border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
  brand: 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
  accent: 'border-accent-300 bg-accent-50 text-accent-700 dark:border-accent-700 dark:bg-accent-900/30 dark:text-accent-300',
  success: 'border-success-300 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/30 dark:text-success-300',
};

function WorkflowNode({ label, sublabel, color }: { label: string; sublabel: string; color: string }) {
  return (
    <div className={cn('w-full max-w-xs rounded-xl border-2 px-5 py-3 text-center', NODE_COLORS[color])}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-0.5 text-xs opacity-70">{sublabel}</p>
    </div>
  );
}

function Arrow() {
  return <ArrowDown className="h-6 w-6 text-slate-300 dark:text-slate-600" />;
}
