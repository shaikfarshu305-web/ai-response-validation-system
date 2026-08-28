import {
  BarChart3, TrendingUp, Target, ShieldCheck, Search, ListChecks,
  PieChart, AlertTriangle, FileCheck2,
} from 'lucide-react';
import { Card, CardHeader, Badge, ScoreRing, ProgressBar } from '@/components/ui';
import { LineChart, BarChart, DonutChart, RadialBar } from '@/components/charts';
import { performanceTrend, verdictDistribution, hallucinationStats } from '@/lib/demoData';

export function AnalyticsPage() {
  const total = hallucinationStats.total;
  const detectedPct = Math.round((hallucinationStats.detected / total) * 100);
  const freePct = Math.round((hallucinationStats.free / total) * 100);
  const highRiskPct = Math.round((hallucinationStats.highRisk / total) * 100);

  const dimAvg = [
    { label: 'Relevance', value: 8.4, color: '#3385ff' },
    { label: 'Accuracy', value: 7.8, color: '#06cf87' },
    { label: 'Hallucination', value: 8.6, color: '#12b767' },
    { label: 'Completeness', value: 7.9, color: '#f79009' },
  ];

  const hallucinationCards = [
    { label: 'Total Evaluated', value: total, icon: FileCheck2, color: '#3385ff', pct: 100 },
    { label: 'Hallucinations Detected', value: hallucinationStats.detected, icon: AlertTriangle, color: '#f04438', pct: detectedPct },
    { label: 'Hallucination-Free', value: hallucinationStats.free, icon: ShieldCheck, color: '#12b767', pct: freePct },
    { label: 'High-Risk Responses', value: hallucinationStats.highRisk, icon: AlertTriangle, color: '#f79009', pct: highRiskPct },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Analytics</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Advanced insights into evaluation trends and hallucination patterns.</p>
      </div>

      {/* Hallucination stats */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Hallucination Statistics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hallucinationCards.map((c) => {
            const Icon = c.icon;
            return (
              <Card key={c.label} hover className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${c.color}1a`, color: c.color }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{c.label}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{c.value}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Share of total</span>
                    <span className="font-semibold">{c.pct}%</span>
                  </div>
                  <ProgressBar value={c.pct} color={c.pct >= 75 ? 'success' : c.pct >= 40 ? 'warning' : 'error'} className="mt-1" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Trends */}
      <Card>
        <CardHeader title="Overall Evaluation Trends" subtitle="Average scores over the last 14 days" icon={<TrendingUp className="h-4 w-4" />} action={<Badge color="brand" dot>Demo data</Badge>} />
        <div className="p-5">
          <LineChart
            labels={performanceTrend.map((p) => p.date)}
            height={280}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Dimension comparison */}
        <Card>
          <CardHeader title="Dimension Averages" subtitle="Mean scores across all evaluations" icon={<BarChart3 className="h-4 w-4" />} />
          <div className="p-5">
            <BarChart data={dimAvg} yMax={10} height={240} />
          </div>
        </Card>

        {/* Quality distribution */}
        <Card>
          <CardHeader title="Quality Distribution" subtitle="Responses by verdict classification" icon={<PieChart className="h-4 w-4" />} />
          <div className="flex items-center justify-center p-6">
            <DonutChart data={verdictDistribution.map((v) => ({ label: v.verdict, value: v.count, color: v.color }))} />
          </div>
        </Card>
      </div>

      {/* Individual dimension trends */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Individual Dimension Trends</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader title="Accuracy Trend" icon={<Target className="h-4 w-4" />} />
            <div className="p-5">
              <LineChart labels={performanceTrend.map((p) => p.date)} yMax={10} height={180} series={[{ name: 'Accuracy', color: '#06cf87', values: performanceTrend.map((p) => p.accuracy) }]} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Relevance Trend" icon={<Target className="h-4 w-4" />} />
            <div className="p-5">
              <LineChart labels={performanceTrend.map((p) => p.date)} yMax={10} height={180} series={[{ name: 'Relevance', color: '#3385ff', values: performanceTrend.map((p) => p.relevance) }]} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Hallucination Score Trend" icon={<Search className="h-4 w-4" />} />
            <div className="p-5">
              <LineChart labels={performanceTrend.map((p) => p.date)} yMax={10} height={180} series={[{ name: 'Hallucination', color: '#12b767', values: performanceTrend.map((p) => p.hallucination) }]} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Completeness Trend" icon={<ListChecks className="h-4 w-4" />} />
            <div className="p-5">
              <LineChart labels={performanceTrend.map((p) => p.date)} yMax={10} height={180} series={[{ name: 'Completeness', color: '#f79009', values: performanceTrend.map((p) => p.completeness) }]} />
            </div>
          </Card>
        </div>
      </div>

      {/* Radial summary */}
      <Card>
        <CardHeader title="Dimension Score Radial" subtitle="At-a-glance dimension performance" icon={<ShieldCheck className="h-4 w-4" />} />
        <div className="flex flex-wrap items-center justify-around gap-6 p-6">
          {dimAvg.map((d) => (
            <div key={d.label} className="flex flex-col items-center gap-2">
              <RadialBar value={d.value} max={10} size={110} color={d.color} label={d.value.toFixed(1)} />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{d.label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
