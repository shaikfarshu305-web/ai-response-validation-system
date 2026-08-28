import { useState } from 'react';
import {
  Database, Search, Upload, RefreshCw, Eye, FileText, Layers,
  Hash, Box, Clock, CheckCircle2, Loader2, X, Filter,
} from 'lucide-react';
import { Card, CardHeader, Button, Badge, Input, Select, ProgressBar } from '@/components/ui';
import { datasets, kbStats, KB_SEARCH_RESULTS } from '@/lib/demoData';
import { useToast } from '@/lib/toast';
import { cn } from '@/lib/cn';

const PIPELINE_STAGES = ['Upload', 'Cleaning', 'Chunking', 'Embedding', 'Indexing'];

export function KnowledgePage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof KB_SEARCH_RESULTS | null>(null);
  const [datasetFilter, setDatasetFilter] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadStage, setUploadStage] = useState(-1);
  const [minSimilarity, setMinSimilarity] = useState(0);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({ title: 'Enter a search query', body: 'Type something to search the knowledge base.', type: 'warning' });
      return;
    }
    setSearching(true);
    setSearchResults(null);
    await new Promise((r) => setTimeout(r, 900));
    setSearching(false);
    setSearchResults(KB_SEARCH_RESULTS);
    toast({ title: 'Search complete', body: `${KB_SEARCH_RESULTS.length} relevant chunks retrieved.`, type: 'success' });
  };

  const handleUpload = async () => {
    setShowUpload(true);
    setUploadStage(0);
    for (let i = 0; i < PIPELINE_STAGES.length; i++) {
      setUploadStage(i);
      await new Promise((r) => setTimeout(r, 800));
    }
    setUploadStage(-1);
    toast({ title: 'Document indexed', body: 'Reference material processed and added to knowledge base.', type: 'success' });
    setTimeout(() => setShowUpload(false), 1500);
  };

  const statsCards = [
    { label: 'Total Documents', value: kbStats.totalDocuments.toLocaleString(), icon: FileText, color: '#3385ff' },
    { label: 'Total Chunks', value: kbStats.totalChunks.toLocaleString(), icon: Layers, color: '#06cf87' },
    { label: 'Total Embeddings', value: kbStats.totalEmbeddings.toLocaleString(), icon: Box, color: '#f79009' },
    { label: 'Datasets', value: kbStats.datasets, icon: Database, color: '#12b767' },
  ];

  const filteredResults = searchResults?.filter((r) => {
    if (datasetFilter !== 'all' && r.dataset !== datasetFilter) return false;
    if (r.similarity * 100 < minSimilarity) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reference Knowledge Base</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage datasets and reference material for RAG-grounded evaluation.</p>
        </div>
        <Button icon={<Upload className="h-4 w-4" />} onClick={() => setShowUpload(true)}>Add Reference Material</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statsCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} hover className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${s.color}1a`, color: s.color }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{s.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Last updated */}
      <Card className="flex items-center gap-3 p-4">
        <Clock className="h-4 w-4 text-slate-400" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: <span className="font-medium text-slate-700 dark:text-slate-200">{new Date(kbStats.lastUpdated).toLocaleString()}</span></p>
        <Badge color="success" dot>Operational</Badge>
      </Card>

      {/* Dataset cards */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Datasets</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {datasets.map((d) => (
            <Card key={d.id} hover className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{d.name}</h4>
                    <p className="text-xs text-slate-400">{d.records.toLocaleString()} records</p>
                  </div>
                </div>
                <Badge color={d.status === 'Active' ? 'success' : d.status === 'Indexing' ? 'warning' : 'slate'} dot>{d.status}</Badge>
              </div>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{d.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/40">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{d.chunks.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">Chunks</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/40">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{d.embeddings.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">Embeddings</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/40">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{new Date(d.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p className="text-[10px] text-slate-400">Updated</p>
                </div>
              </div>
              {d.status === 'Indexing' && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Indexing progress</span>
                    <span>{Math.round((d.embeddings / d.chunks) * 100)}%</span>
                  </div>
                  <ProgressBar value={d.embeddings} max={d.chunks} color="warning" className="mt-1" />
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" icon={<Eye className="h-3.5 w-3.5" />}>View Dataset</Button>
                <Button variant="ghost" size="sm" icon={<Search className="h-3.5 w-3.5" />}>Search</Button>
                {d.status !== 'Indexing' && <Button variant="ghost" size="sm" icon={<RefreshCw className="h-3.5 w-3.5" />} onClick={() => toast({ title: 'Update queued', body: `${d.name} will be re-indexed.`, type: 'info' })}>Update</Button>}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Semantic Search */}
      <Card>
        <CardHeader title="Semantic Search" subtitle="Search the reference knowledge base using natural language" icon={<Search className="h-4 w-4" />} />
        <div className="space-y-4 p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search reference knowledge..." className="pl-9" />
            </div>
            <Button icon={<Search className="h-4 w-4" />} onClick={handleSearch} loading={searching}>Search</Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="h-4 w-4 text-slate-400" />
            <Select value={datasetFilter} onChange={(e) => setDatasetFilter(e.target.value)} className="h-9 w-40 text-xs">
              <option value="all">All Datasets</option>
              {datasets.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
            </Select>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Min similarity:</span>
              <input type="range" min={0} max={100} value={minSimilarity} onChange={(e) => setMinSimilarity(Number(e.target.value))} className="w-24 accent-brand-500" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{minSimilarity}%</span>
            </div>
          </div>

          {/* Results */}
          {searching ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 w-full rounded-xl" />)}
            </div>
          ) : filteredResults && filteredResults.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">{filteredResults.length} results retrieved</p>
              {filteredResults.map((r) => (
                <div key={r.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge color="brand">{r.source}</Badge>
                      <Badge color="accent">{r.dataset}</Badge>
                      <Badge color="slate">{r.docType}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Similarity</span>
                      <span className={cn('text-sm font-bold', r.similarity >= 0.85 ? 'text-success-600' : 'text-warning-600')}>{(r.similarity * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{r.text}</p>
                  <p className="mt-2 font-mono text-[10px] text-slate-400">Chunk {r.chunkId}</p>
                </div>
              ))}
            </div>
          ) : searchResults ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-700">
              <p className="text-sm text-slate-400">No results match your filters.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-700">
              <Search className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
              <p className="mt-2 text-sm text-slate-400">Enter a query above to search the knowledge base.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Upload modal */}
      {showUpload && (
        <UploadModal stage={uploadStage} onClose={() => setShowUpload(false)} onStart={handleUpload} />
      )}
    </div>
  );
}

function UploadModal({ stage, onClose, onStart }: { stage: number; onClose: () => void; onStart: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={stage < 0 ? onClose : undefined} />
      <Card className="relative z-10 w-full max-w-lg animate-fade-in">
        <CardHeader title="Add Reference Material" subtitle="Upload documents to expand the knowledge base" icon={<Upload className="h-4 w-4" />} action={stage < 0 && <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button>} />
        <div className="p-5">
          {stage < 0 ? (
            <>
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-700">
                <Upload className="mb-2 h-8 w-8 text-slate-400" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Drop files here or click to browse</p>
                <p className="mt-1 text-xs text-slate-400">PDF, DOCX, TXT — processed through the full pipeline</p>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button icon={<Upload className="h-4 w-4" />} onClick={onStart}>Start Processing</Button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {PIPELINE_STAGES.map((s, i) => {
                const done = i < stage;
                const active = i === stage;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', done ? 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400' : active ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400' : 'bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600')}>
                      {done ? <CheckCircle2 className="h-5 w-5" /> : active ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    <span className={cn('text-sm font-medium', done ? 'text-slate-500 dark:text-slate-400' : active ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400')}>{s}</span>
                    {active && <span className="ml-auto text-xs text-brand-500 animate-pulse-soft">Processing...</span>}
                    {done && <CheckCircle2 className="ml-auto h-4 w-4 text-success-400" />}
                  </div>
                );
              })}
              <ProgressBar value={((stage + 1) / PIPELINE_STAGES.length) * 100} className="mt-4" />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
