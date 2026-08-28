import { useState } from 'react';
import { ThemeProvider } from '@/lib/theme';
import { ToastProvider } from '@/lib/toast';
import { AuthProvider, useAuth } from '@/lib/auth';
import { Layout } from '@/components/Layout';
import { AuthPage } from '@/pages/Auth';
import { DashboardPage } from '@/pages/Dashboard';
import { EvaluatePage } from '@/pages/Evaluate';
import { ResultPage } from '@/pages/Result';
import { HistoryPage } from '@/pages/History';
import { KnowledgePage } from '@/pages/KnowledgeBase';
import { AgentsPage } from '@/pages/Agents';
import { ArchitecturePage } from '@/pages/Architecture';
import { AnalyticsPage } from '@/pages/Analytics';
import { ReportsPage } from '@/pages/Reports';
import { SettingsPage } from '@/pages/Settings';
import { evaluations } from '@/lib/demoData';
import type { PageKey } from '@/lib/types';

function AppContent() {
  const { session, loading } = useAuth();
  const [page, setPage] = useState<PageKey>('dashboard');
  const [resultId, setResultId] = useState<string | null>(null);

  const navigate = (p: PageKey) => {
    setResultId(null);
    setPage(p);
  };

  const viewResult = (id: string) => {
    setResultId(id);
    setPage('evaluate');
  };

  const evaluation = resultId ? evaluations.find((e) => e.id === resultId) : null;

  const renderPage = () => {
    if (page === 'evaluate' && evaluation) {
      return <ResultPage evaluation={evaluation} onBack={() => { setResultId(null); setPage('evaluate'); }} />;
    }
    switch (page) {
      case 'dashboard': return <DashboardPage onNavigate={navigate} onView={viewResult} />;
      case 'evaluate': return <EvaluatePage onResult={viewResult} />;
      case 'history': return <HistoryPage onView={viewResult} />;
      case 'knowledge': return <KnowledgePage />;
      case 'agents': return <AgentsPage />;
      case 'architecture': return <ArchitecturePage />;
      case 'analytics': return <AnalyticsPage />;
      case 'reports': return <ReportsPage onView={viewResult} />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage onNavigate={navigate} onView={viewResult} />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  return (
    <Layout current={page} onNavigate={navigate}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
