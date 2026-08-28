import {
  FileCheck2, TrendingUp, Target, ShieldCheck, AlertTriangle, ListChecks,
  ArrowRight, ArrowUpRight, ArrowDownRight, Calendar, History,
} from 'lucide-react';
import { Card, CardHeader, Badge, Button, ScoreRing, ProgressBar } from '@/components/ui';
import { LineChart, BarChart, DonutChart, Sparkline } from '@/components/charts';
import { evaluations, performanceTrend, verdictDistribution, hallucinationStats } from '@/lib/demoData';
import { VERDICT_META } from '@/lib/types';
import type { PageKey } from '@/lib/types';
import { cn } from '@/lib/cn';

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export function DashboardPage({ onNavigate, onView }: { onNavigate: (p: PageKey) => void; onView: (id: string) => void }) {
  const total = evaluations.length + 603;
  const avgOverall = 8.0;
  const avgAccuracy = 7.8;
  const avgRelevance = 8.4;
  const hallucinationFreeRate = Math.round((hallucinationStats.free / hallucinationStats.total) * 100);
  const avgCompleteness = 7.9;

  const summaryCards = [
    { label: 'Total Evaluations', value: total.toLocaleString(), icon: FileCheck2, color: 'brand', trend: '+12.4%', up: true, spark: [5, 6, 5, 7, 8, 7, 9, 10, 9, 11] },
    { label: 'Average Overall Score', value: `${avgOverall.toFixed(1)}`, suffix: '/10', icon: TrendingUp, color: 'accent', trend: '+0.3', up: true, spark: [7.5, 7.6, 7.8, 7.7, 7.9, 8.0, 8.1, 8.0, 8.2, 8.0] },
    { label: 'Accuracy Score', value: avgAccuracy.toFixed(1), suffix: '/10', icon: Target, color: 'brand', trend: '+0.2', up: true, spark: [7.4, 7.5, 7.6, 7.7, 7.8, 7.7, 7.9, 7.8, 7.9, 7.8] },
    { label: 'Relevance Score', value: avgRelevance.toFixed(1), suffix: '/10', icon: Target, color: 'accent', trend: '+0.1', up: true, spark: [8.1, 8.2, 8.3, 8.4, 8.3, 8.5, 8.4, 8.5, 8.4, 8.4] },
    { label: 'Hallucination-Free Rate', value: `${hallucinationFreeRate}%`, icon: ShieldCheck, color: 'success', trend: '+2.1%', up: true, spark: [84, 85, 84, 86, 85, 86, 87, 86, 87, 86] },
    { label: 'Completeness Score', value: avgCompleteness.toFixed(1), suffix: '/10', icon: ListChecks, color: 'warning', trend: '-0.1', up: false, spark: [8.0, 7.9, 8.0, 7.9, 7.8, 7.9, 8.0, 7.9, 7.9, 7.9] },
  ];

  const colorMap: Record<string, string> = { brand: '#3385ff', accent: '#06cf87', success: '#12b767', warning: '#f79009', error: '#f04438' };

  const dimData = [
    { label: 'Relevance', value: avgRelevance, color: '#3385ff' },
    { label: 'Accuracy', value: avgAccuracy, color: '#06cf87' },
    { label: 'Hallucination', value: 8.6, color: '#12b767' },
    { label: 'Completeness', value: avgCompleteness, color: '#f79009' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">AI Evaluation Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Monitor and analyze the quality of AI-generated responses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md" icon={<Calendar className="h-4 w-4" />}>Last 30 days</Button>
          <Button size="md" icon={<FileCheck2 className="h-4 w-4" />} onClick={() => onNavigate('evaluate')}>New Evaluation</Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((c) => {
          const Icon = c.icon;
          const cColor = colorMap[c.color];
          return (
            <Card key={c.label} hover className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${cColor}1a`, color: cColor }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{c.label}</p>
                    <p className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {c.value}<span className="text-sm font-medium text-slate-400">{c.suffix}</span>
                    </p>
                  </div>
                </div>
                <div className={cn('flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold', c.up ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400' : 'bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400')}>
                  {c.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {c.trend}
                </div>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <Sparkline values={c.spark} color={cColor} width={140} height={32} />
                <span className="text-[10px] text-slate-400">vs last month</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Evaluation Performance" subtitle="Average scores over the last 14 days" icon={<TrendingUp className="h-4 w-4" />}
            action={<Badge color="brand" dot>Live demo data</Badge>} />
          <div className="p-5">
            <LineChart
              labels={performanceTrend.map((p) => p.date)}
              yMax={10}
              series={[
                { name: 'Overall', color: '#3385ff', values: performanceTrend.map((p) => p.overall) },
                { name: 'Accuracy', color: '#06cf87', values: performanceTrend.map((p) => p.accuracy) },
                { name: 'Relevance', color: '#f79009', values: performanceTrend.map((p) => p.relevance) },
                { name: 'Hallucination', color: '#12b767', values: performanceTrend.map((p) => p.hallucination) },
                { name: 'Completeness', color: '#a855f7', values: performanceTrend.map((p) => p.completeness) },
              ]}
            />
            <div className="mt-3 flex flex-wrap gap-4">
              {[
                { n: 'Overall', c: '#3385ff' }, { n: 'Accuracy', c: '#06cf87' }, { n: 'Relevance', c: '#f79009' },
                { n: 'Hallucination', c: '#12b767' }, { n: 'Completeness', c: '#a855f7' },
              ].map((l) => (
                <div key={l.n} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <span className="h-2 w-2 rounded-full" style={{ background: l.c }} />{l.n}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Verdict Distribution" subtitle="All evaluations" icon={<FileCheck2 className="h-4 w-4" />} />
          <div className="flex items-center justify-center p-6">
            <DonutChart data={verdictDistribution.map((v) => ({ label: v.verdict, value: v.count, color: v.color }))} />
          </div>
        </Card>
      </div>

      {/* Dimensions + Recent */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Evaluation Dimensions" subtitle="Average scores by dimension" icon={<Target className="h-4 w-4" />} />
          <div className="p-5">
            <BarChart data={dimData} yMax={10} />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent Evaluations"
            subtitle="Latest AI response evaluations"
            icon={<History className="h-4 w-4" />}
            action={<Button variant="ghost" size="sm" onClick={() => onNavigate('history')}>View all <ArrowRight className="h-3.5 w-3.5" /></Button>}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-400 dark:border-slate-800">
                  <th className="px-5 py-2.5 font-medium">ID</th>
                  <th className="px-5 py-2.5 font-medium">Question</th>
                  <th className="px-5 py-2.5 font-medium">Score</th>
                  <th className="px-5 py-2.5 font-medium">Verdict</th>
                  <th className="px-5 py-2.5 font-medium">Hallucination</th>
                  <th className="px-5 py-2.5 font-medium">Date</th>
                  <th className="px-5 py-2.5 font-medium" />
                </tr>
              </thead>
              <tbody>
                {evaluations.slice(0, 6).map((e) => {
                  const meta = VERDICT_META[e.verdict];
                  return (
                    <tr key={e.id} className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/30">
                      <td className="px-5 py-3 font-mono text-xs text-slate-500">{e.id.split('-').pop()}</td>
                      <td className="max-w-[200px] truncate px-5 py-3 text-slate-700 dark:text-slate-300">{e.question}</td>
                      <td className="px-5 py-3">
                        <span className={cn('font-semibold', e.scores.overall >= 8 ? 'text-success-600' : e.scores.overall >= 6.5 ? 'text-brand-600' : 'text-warning-600')}>
                          {e.scores.overall.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3"><Badge color={meta.color as any}>{e.verdict}</Badge></td>
                      <td className="px-5 py-3">
                        {e.hallucination ? (
                          <Badge color="error" dot>Detected</Badge>
                        ) : (
                          <Badge color="success" dot>None</Badge>
                        )}
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-400">{fmtDate(e.date)}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => onView(e.id)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/30">
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Dimension quick cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {dimData.map((d) => (
          <Card key={d.label} hover className="flex items-center gap-4 p-4">
            <ScoreRing score={d.value} size={64} stroke={6} />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{d.label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{d.value.toFixed(1)}<span className="text-xs text-slate-400">/10</span></p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
