import { useState, useMemo } from 'react';
import {
  Search, Eye, Download, Trash2, Filter, ArrowUpDown, History as HistoryIcon,
  FileX, X,
} from 'lucide-react';
import { Card, Button, Input, Select, Badge, EmptyState, ErrorState } from '@/components/ui';
import { evaluations } from '@/lib/demoData';
import { VERDICT_META } from '@/lib/types';
import { useToast } from '@/lib/toast';
import type { Verdict } from '@/lib/types';
import { cn } from '@/lib/cn';

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export function HistoryPage({ onView }: { onView: (id: string) => void }) {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('all');
  const [hallucinationFilter, setHallucinationFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [loading] = useState(false);
  const [error] = useState(false);
  const [rows, setRows] = useState(evaluations);

  const filtered = useMemo(() => {
    let r = [...rows];
    if (search) r = r.filter((e) => e.question.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()));
    if (verdictFilter !== 'all') r = r.filter((e) => e.verdict === verdictFilter);
    if (hallucinationFilter !== 'all') r = r.filter((e) => e.hallucination === (hallucinationFilter === 'yes'));
    if (scoreFilter !== 'all') {
      r = r.filter((e) => {
        const s = e.scores.overall;
        if (scoreFilter === 'high') return s >= 8;
        if (scoreFilter === 'medium') return s >= 6.5 && s < 8;
        return s < 6.5;
      });
    }
    if (dateFilter !== 'all') {
      const now = new Date('2026-08-26');
      r = r.filter((e) => {
        const diff = (now.getTime() - new Date(e.date).getTime()) / 86400000;
        if (dateFilter === '7d') return diff <= 7;
        if (dateFilter === '30d') return diff <= 30;
        return true;
      });
    }
    r.sort((a, b) => {
      let cmp: number;
      if (sortBy === 'date') cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      else cmp = a.scores.overall - b.scores.overall;
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return r;
  }, [rows, search, verdictFilter, hallucinationFilter, scoreFilter, dateFilter, sortBy, sortDir]);

  const toggleSort = (col: 'date' | 'score') => {
    if (sortBy === col) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    else { setSortBy(col); setSortDir('desc'); }
  };

  const handleDelete = (id: string) => {
    setRows((p) => p.filter((e) => e.id !== id));
    toast({ title: 'Evaluation deleted', body: `${id} has been removed from history.`, type: 'info' });
  };

  const handleDownload = (id: string) => {
    toast({ title: 'Report downloading', body: `PDF report for ${id} is being generated.`, type: 'success' });
  };

  const clearFilters = () => {
    setSearch(''); setVerdictFilter('all'); setHallucinationFilter('all'); setScoreFilter('all'); setDateFilter('all');
  };

  const hasFilters = search || verdictFilter !== 'all' || hallucinationFilter !== 'all' || scoreFilter !== 'all' || dateFilter !== 'all';

  if (error) return <Card><ErrorState description="We couldn't load evaluation history. Please try again." onRetry={() => location.reload()} /></Card>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Evaluation History</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Browse, search, and manage all past AI response evaluations.</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by question or evaluation ID..." className="pl-9" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex">
            <Select value={verdictFilter} onChange={(e) => setVerdictFilter(e.target.value)} className="lg:w-40">
              <option value="all">All Verdicts</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Acceptable">Acceptable</option>
              <option value="Needs Improvement">Needs Improvement</option>
              <option value="Poor">Poor</option>
            </Select>
            <Select value={hallucinationFilter} onChange={(e) => setHallucinationFilter(e.target.value)} className="lg:w-40">
              <option value="all">Hallucination: All</option>
              <option value="yes">Detected</option>
              <option value="no">None</option>
            </Select>
            <Select value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)} className="lg:w-36">
              <option value="all">All Scores</option>
              <option value="high">High (8+)</option>
              <option value="medium">Medium (6.5-8)</option>
              <option value="low">Low (&lt;6.5)</option>
            </Select>
            <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="lg:w-36">
              <option value="all">All Time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </Select>
          </div>
          {hasFilters && (
            <Button variant="ghost" size="md" icon={<X className="h-4 w-4" />} onClick={clearFilters}>Clear</Button>
          )}
        </div>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{filtered.length}</span> evaluation{filtered.length !== 1 ? 's' : ''}
          {hasFilters && ' (filtered)'}
        </p>
        <Button variant="ghost" size="sm" icon={<Filter className="h-4 w-4" />}>Advanced</Button>
      </div>

      {/* Table / states */}
      <Card>
        {loading ? (
          <div className="space-y-3 p-5">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-14 w-full rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FileX className="h-7 w-7" />}
            title="No evaluations found"
            description={hasFilters ? "No evaluations match your current filters. Try adjusting or clearing them." : "No evaluations have been recorded yet."}
            action={hasFilters ? <Button variant="outline" onClick={clearFilters}>Clear filters</Button> : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-400 dark:border-slate-800">
                  <th className="px-5 py-3 font-medium">ID</th>
                  <th className="px-5 py-3 font-medium">Question</th>
                  <th className="px-5 py-3 font-medium">
                    <button onClick={() => toggleSort('score')} className="inline-flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-200">
                      Score <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-5 py-3 font-medium">Accuracy</th>
                  <th className="px-5 py-3 font-medium">Hallucination</th>
                  <th className="px-5 py-3 font-medium">Verdict</th>
                  <th className="px-5 py-3 font-medium">
                    <button onClick={() => toggleSort('date')} className="inline-flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-200">
                      Date <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => {
                  const meta = VERDICT_META[e.verdict as Verdict];
                  return (
                    <tr key={e.id} className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/30">
                      <td className="px-5 py-3 font-mono text-xs text-slate-500">{e.id}</td>
                      <td className="max-w-[280px] truncate px-5 py-3 text-slate-700 dark:text-slate-300" title={e.question}>{e.question}</td>
                      <td className="px-5 py-3">
                        <span className={cn('font-semibold', e.scores.overall >= 8 ? 'text-success-600' : e.scores.overall >= 6.5 ? 'text-brand-600' : 'text-warning-600')}>
                          {e.scores.overall.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{e.scores.accuracy.toFixed(1)}</td>
                      <td className="px-5 py-3">
                        {e.hallucination ? <Badge color="error" dot>Yes</Badge> : <Badge color="success" dot>No</Badge>}
                      </td>
                      <td className="px-5 py-3"><Badge color={meta.color as any}>{e.verdict}</Badge></td>
                      <td className="px-5 py-3 text-xs text-slate-400">{fmtDate(e.date)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => onView(e.id)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/30" title="View">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDownload(e.id)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-success-50 hover:text-success-600 dark:hover:bg-success-900/30" title="Download">
                            <Download className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(e.id)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-900/30" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
