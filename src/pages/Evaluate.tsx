import { useRef, useState } from 'react';
import {
  FileCheck2, Upload, X, FileText, Database, Sparkles, Loader2,
  CheckCircle2, Circle, Search, ShieldCheck, Target, ListChecks, Gavel,
} from 'lucide-react';
import { Card, CardHeader, Button, Textarea, Toggle, Badge, ProgressBar } from '@/components/ui';
import { useToast } from '@/lib/toast';
import { cn } from '@/lib/cn';
import type { PageKey } from '@/lib/types';

const PIPELINE_STEPS = [
  { label: 'Processing input', icon: FileText },
  { label: 'Retrieving reference information', icon: Database },
  { label: 'Checking relevance', icon: Target },
  { label: 'Checking accuracy', icon: ShieldCheck },
  { label: 'Detecting hallucinations', icon: Search },
  { label: 'Checking completeness', icon: ListChecks },
  { label: 'Generating final verdict', icon: Gavel },
];

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  progress: number;
}

const ACCEPTED = ['.pdf', '.docx', '.txt'];

export function EvaluatePage({ onResult }: { onResult: (id: string) => void }) {
  const { toast } = useToast();
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [reference, setReference] = useState('');
  const [useKB, setUseKB] = useState(true);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [evaluating, setEvaluating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const formatSize = (b: number) => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = [];
    Array.from(fileList).forEach((f) => {
      const ext = '.' + f.name.split('.').pop()?.toLowerCase();
      if (!ACCEPTED.includes(ext)) {
        toast({ title: 'Unsupported file type', body: `${f.name} — only PDF, DOCX, TXT allowed.`, type: 'warning' });
        return;
      }
      newFiles.push({ name: f.name, size: f.size, type: ext.toUpperCase().replace('.', ''), progress: 0 });
    });
    setFiles((p) => [...p, ...newFiles]);
    // Simulate upload progress
    newFiles.forEach((nf) => {
      let prog = 0;
      const interval = setInterval(() => {
        prog += Math.random() * 30;
        if (prog >= 100) {
          prog = 100;
          clearInterval(interval);
        }
        setFiles((p) => p.map((f) => (f.name === nf.name ? { ...f, progress: prog } : f)));
      }, 200);
    });
  };

  const removeFile = (name: string) => setFiles((p) => p.filter((f) => f.name !== name));

  const canEvaluate = question.trim() && response.trim() && !evaluating;

  const handleEvaluate = async () => {
    if (!question.trim() || !response.trim()) {
      toast({ title: 'Missing required fields', body: 'Question and AI response are required.', type: 'warning' });
      return;
    }
    setEvaluating(true);
    setCurrentStep(0);
    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));
    }
    setEvaluating(false);
    setCurrentStep(-1);
    toast({ title: 'Evaluation completed', body: 'Response analyzed successfully. View detailed results.', type: 'success' });
    onResult('EVAL-2026-0417');
  };

  const fillExample = () => {
    setQuestion('Explain the difference between supervised and unsupervised learning.');
    setResponse('Supervised learning uses labeled data to train models to predict outputs, while unsupervised learning finds patterns in unlabeled data without predefined outputs. Common supervised algorithms include linear regression and decision trees; unsupervised examples include k-means clustering and PCA.');
    setReference('Supervised learning trains on labeled input-output pairs; unsupervised learning discovers structure in unlabeled data.');
    toast({ title: 'Example loaded', body: 'Sample question and response filled for demonstration.', type: 'info' });
  };

  if (evaluating || currentStep >= 0) {
    return <PipelineProgress currentStep={currentStep} question={question} />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Evaluate AI Response</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Submit an AI-generated response to analyze its quality and detect potential hallucinations.</p>
        </div>
        <Button variant="outline" size="sm" icon={<Sparkles className="h-4 w-4" />} onClick={fillExample}>Load example</Button>
      </div>

      <Card>
        <CardHeader title="Input" subtitle="Provide the question and the AI-generated response to evaluate" icon={<FileText className="h-4 w-4" />} />
        <div className="space-y-5 p-5">
          {/* Question */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Question <span className="text-error-500">*</span></label>
              <span className="text-xs text-slate-400">{question.length} chars</span>
            </div>
            <Textarea rows={3} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter the question that was asked to the AI..." />
          </div>

          {/* AI Response */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">AI Generated Response <span className="text-error-500">*</span></label>
              <span className="text-xs text-slate-400">{response.length} chars</span>
            </div>
            <Textarea rows={6} value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Paste the AI-generated response here..." />
          </div>

          {/* Reference Answer */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Reference Answer <span className="text-slate-400">(Optional)</span></label>
            </div>
            <Textarea rows={3} value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Enter a known correct answer for comparison (optional)..." />
          </div>
        </div>
      </Card>

      {/* Source material */}
      <Card>
        <CardHeader title="Source / Reference Material" subtitle="Upload documents for RAG-grounded evaluation (PDF, DOCX, TXT)" icon={<Upload className="h-4 w-4" />} />
        <div className="space-y-4 p-5">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
              dragOver ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-300 hover:border-brand-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50'
            )}
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-900/30">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Drag and drop files here, or click to browse</p>
            <p className="mt-1 text-xs text-slate-400">Supports PDF, DOCX, TXT — up to 10 MB each</p>
            <input ref={fileInputRef} type="file" multiple accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => addFiles(e.target.files)} />
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((f) => (
                <div key={f.name} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                    <FileText className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{f.name}</p>
                      <Badge color="slate">{f.type}</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <ProgressBar value={f.progress} className="h-1.5" />
                      <span className="shrink-0 text-[10px] text-slate-400">{Math.round(f.progress)}% · {formatSize(f.size)}</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeFile(f.name); }} className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-error-500 dark:hover:bg-slate-700">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Use Knowledge Base</p>
                <p className="text-xs text-slate-400">Retrieve from TruthfulQA, SQuAD, FEVER datasets</p>
              </div>
            </div>
            <Toggle checked={useKB} onChange={setUseKB} />
          </div>
        </div>
      </Card>

      {/* Evaluate button */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={() => { setQuestion(''); setResponse(''); setReference(''); setFiles([]); }}>Clear form</Button>
        <Button size="lg" icon={<FileCheck2 className="h-5 w-5" />} onClick={handleEvaluate} disabled={!canEvaluate} loading={evaluating}>
          Evaluate Response
        </Button>
      </div>
    </div>
  );
}

function PipelineProgress({ currentStep, question }: { currentStep: number; question: string }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Evaluating Response</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Running evaluation agents and detecting hallucinations...</p>
      </div>

      {question && (
        <Card className="p-4">
          <p className="text-xs text-slate-400">Analyzing question:</p>
          <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">{question}</p>
        </Card>
      )}

      <Card className="p-6">
        <div className="space-y-1">
          {PIPELINE_STEPS.map((step, i) => {
            const Icon = step.icon;
            const done = i < currentStep;
            const active = i === currentStep;
            const pending = i > currentStep;
            return (
              <div key={step.label} className="flex items-center gap-4">
                <div className="relative flex flex-col items-center">
                  <div className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300',
                    done && 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400',
                    active && 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400 scale-110 shadow-glow',
                    pending && 'bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600'
                  )}>
                    {done ? <CheckCircle2 className="h-5 w-5" /> : active ? <Loader2 className="h-5 w-5 animate-spin" /> : <Icon className="h-5 w-5" />}
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className={cn('absolute top-10 h-8 w-0.5', done ? 'bg-success-400' : 'bg-slate-200 dark:bg-slate-700')} />
                  )}
                </div>
                <div className="pb-8">
                  <p className={cn('text-sm font-medium transition-colors', done && 'text-slate-500 dark:text-slate-400', active && 'text-slate-900 dark:text-slate-100', pending && 'text-slate-400')}>
                    {step.label}
                  </p>
                  {active && <p className="mt-0.5 text-xs text-brand-500 animate-pulse-soft">Processing...</p>}
                  {done && <p className="mt-0.5 text-xs text-success-500">Completed</p>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="text-center">
        <ProgressBar value={((currentStep + 1) / PIPELINE_STEPS.length) * 100} />
        <p className="mt-2 text-xs text-slate-400">{Math.round(((currentStep + 1) / PIPELINE_STEPS.length) * 100)}% complete · {currentStep + 1} of {PIPELINE_STEPS.length} steps</p>
      </div>
    </div>
  );
}
