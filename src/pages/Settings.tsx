import { useState } from 'react';
import {
  Settings, Sliders, Cpu, Database, Palette, Sun, Moon, Monitor,
  ShieldAlert, Save, Gauge,
} from 'lucide-react';
import { Card, CardHeader, Button, Toggle, Select, Input, Badge } from '@/components/ui';
import { useTheme } from '@/lib/theme';
import { useToast } from '@/lib/toast';
import { cn } from '@/lib/cn';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [scoringScale, setScoringScale] = useState('10');
  const [hallucinationSensitivity, setHallucinationSensitivity] = useState(70);
  const [retrievalTopK, setRetrievalTopK] = useState(5);
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [weights, setWeights] = useState({ relevance: 25, accuracy: 30, hallucination: 25, completeness: 15, verdict: 5 });
  const [llmModel, setLlmModel] = useState('gpt-4o');
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-3-small');
  const [chunkSize, setChunkSize] = useState(512);
  const [chunkOverlap, setChunkOverlap] = useState(64);
  const [retrievalCount, setRetrievalCount] = useState(5);
  const [autoSave, setAutoSave] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  const handleSave = () => {
    toast({ title: 'Settings saved', body: 'Your configuration has been updated successfully.', type: 'success' });
  };

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun, desc: 'Clean professional' },
    { value: 'dark' as const, label: 'Dark', icon: Moon, desc: 'Modern tech' },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Configure evaluation, model, and appearance preferences.</p>
        </div>
        <Button icon={<Save className="h-4 w-4" />} onClick={handleSave}>Save Changes</Button>
      </div>

      {/* Evaluation Settings */}
      <Card>
        <CardHeader title="Evaluation Settings" subtitle="Scoring and evaluation parameters" icon={<Sliders className="h-4 w-4" />} />
        <div className="space-y-5 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Scoring Scale" hint="Maximum score for each dimension">
              <Select value={scoringScale} onChange={(e) => setScoringScale(e.target.value)}>
                <option value="10">1–10 (default)</option>
                <option value="5">1–5</option>
                <option value="100">0–100</option>
              </Select>
            </Field>
            <Field label="Retrieval Top-K" hint="Number of chunks to retrieve per query">
              <Input type="number" min={1} max={20} value={retrievalTopK} onChange={(e) => setRetrievalTopK(Number(e.target.value))} />
            </Field>
          </div>

          <Field label="Hallucination Sensitivity" hint={`Current: ${hallucinationSensitivity}% — higher means more sensitive detection`}>
            <input type="range" min={0} max={100} value={hallucinationSensitivity} onChange={(e) => setHallucinationSensitivity(Number(e.target.value))} className="w-full accent-brand-500" />
          </Field>

          <Field label="Confidence Threshold" hint={`Claims below ${confidenceThreshold}% confidence are flagged`}>
            <input type="range" min={0} max={100} value={confidenceThreshold} onChange={(e) => setConfidenceThreshold(Number(e.target.value))} className="w-full accent-brand-500" />
          </Field>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Evaluation Weights</p>
            <p className="mb-3 text-xs text-slate-400">Relative importance of each dimension (should sum to 100%)</p>
            <div className="space-y-3">
              {Object.entries(weights).map(([key, val]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-28 text-xs font-medium capitalize text-slate-600 dark:text-slate-300">{key}</span>
                  <input type="range" min={0} max={50} value={val} onChange={(e) => setWeights((p) => ({ ...p, [key]: Number(e.target.value) }))} className="flex-1 accent-brand-500" />
                  <span className="w-12 text-right text-sm font-semibold text-slate-700 dark:text-slate-200">{val}%</span>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/40">
                <span className="text-xs font-medium text-slate-500">Total</span>
                <span className={cn('text-sm font-bold', Object.values(weights).reduce((a, b) => a + b, 0) === 100 ? 'text-success-600' : 'text-warning-600')}>
                  {Object.values(weights).reduce((a, b) => a + b, 0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Model Settings */}
      <Card>
        <CardHeader title="Model Settings" subtitle="LLM and embedding model configuration" icon={<Cpu className="h-4 w-4" />} />
        <div className="space-y-5 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="LLM Model" hint="Used by judge agents for evaluation">
              <Select value={llmModel} onChange={(e) => setLlmModel(e.target.value)}>
                <option value="gpt-4o">GPT-4o (recommended)</option>
                <option value="gpt-4o-mini">GPT-4o mini (faster)</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
              </Select>
            </Field>
            <Field label="Embedding Model" hint="Used for knowledge base vectorization">
              <Select value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)}>
                <option value="text-embedding-3-small">text-embedding-3-small</option>
                <option value="text-embedding-3-large">text-embedding-3-large</option>
                <option value="text-embedding-ada-002">text-embedding-ada-002</option>
              </Select>
            </Field>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/40">
            <ShieldAlert className="h-4 w-4 text-slate-400" />
            <p className="text-xs text-slate-500">API keys are managed securely on the backend and are not exposed in the UI.</p>
          </div>
        </div>
      </Card>

      {/* Knowledge Base Settings */}
      <Card>
        <CardHeader title="Knowledge Base Settings" subtitle="Chunking and retrieval parameters" icon={<Database className="h-4 w-4" />} />
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
          <Field label="Chunk Size" hint="Tokens per chunk">
            <Input type="number" min={128} max={2048} step={64} value={chunkSize} onChange={(e) => setChunkSize(Number(e.target.value))} />
          </Field>
          <Field label="Chunk Overlap" hint="Overlapping tokens between chunks">
            <Input type="number" min={0} max={256} step={16} value={chunkOverlap} onChange={(e) => setChunkOverlap(Number(e.target.value))} />
          </Field>
          <Field label="Retrieval Count" hint="Chunks returned per search">
            <Input type="number" min={1} max={20} value={retrievalCount} onChange={(e) => setRetrievalCount(Number(e.target.value))} />
          </Field>
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader title="Appearance" subtitle="Choose your preferred theme" icon={<Palette className="h-4 w-4" />} />
        <div className="space-y-5 p-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {themeOptions.map((t) => {
              const Icon = t.icon;
              const active = theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all',
                    active ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                  )}
                >
                  <Icon className={cn('h-6 w-6', active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400')} />
                  <span className={cn('text-sm font-semibold', active ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-200')}>{t.label}</span>
                  <span className="text-xs text-slate-400">{t.desc}</span>
                </button>
              );
            })}
            <button
              onClick={() => {
                const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setTheme(sysDark ? 'dark' : 'light');
              }}
              className="flex flex-col items-center gap-2 rounded-xl border-2 border-slate-200 p-5 transition-all hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
            >
              <Monitor className="h-6 w-6 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">System</span>
              <span className="text-xs text-slate-400">Auto detect</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader title="Preferences" subtitle="Application behavior" icon={<Gauge className="h-4 w-4" />} />
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Auto-save evaluations</p>
              <p className="text-xs text-slate-400">Automatically save completed evaluations to history</p>
            </div>
            <Toggle checked={autoSave} onChange={setAutoSave} />
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Email alerts for high-risk hallucinations</p>
              <p className="text-xs text-slate-400">Get notified when a high-risk response is detected</p>
            </div>
            <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
          </div>
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="border-error-200 dark:border-error-800/50">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error-50 text-error-500 dark:bg-error-900/30">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Reset all settings</p>
              <p className="text-xs text-slate-400">Restore all configuration to defaults</p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={() => toast({ title: 'Settings reset', body: 'All settings restored to defaults.', type: 'warning' })}>Reset</Button>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button icon={<Save className="h-4 w-4" />} onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
