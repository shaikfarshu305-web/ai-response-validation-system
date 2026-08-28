import { useState } from 'react';
import {
  LayoutDashboard, FileCheck2, History, Database, Bot, Network,
  BarChart3, FileText, Settings, Bell, Sun, Moon, Search,
  ShieldCheck, ChevronDown, X, Menu, Check, AlertTriangle, Info, XCircle,
  LogOut, User as UserIcon,
} from 'lucide-react';
import type { PageKey, AppNotification } from '@/lib/types';
import { notifications as defaultNotifications } from '@/lib/demoData';
import { cn } from '@/lib/cn';
import { useTheme } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { Badge } from '@/components/ui';

const NAV: { key: PageKey; label: string; icon: typeof LayoutDashboard; group: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Overview' },
  { key: 'evaluate', label: 'Evaluate Response', icon: FileCheck2, group: 'Overview' },
  { key: 'history', label: 'Evaluation History', icon: History, group: 'Overview' },
  { key: 'knowledge', label: 'Knowledge Base', icon: Database, group: 'Reference' },
  { key: 'agents', label: 'Evaluation Agents', icon: Bot, group: 'Reference' },
  { key: 'architecture', label: 'Architecture', icon: Network, group: 'Reference' },
  { key: 'analytics', label: 'Analytics', icon: BarChart3, group: 'Insights' },
  { key: 'reports', label: 'Reports', icon: FileText, group: 'Insights' },
  { key: 'settings', label: 'Settings', icon: Settings, group: 'System' },
];

const NOTIF_ICONS = { success: Check, info: Info, warning: AlertTriangle, error: XCircle };
const NOTIF_COLORS = {
  success: 'text-success-600 bg-success-50 dark:bg-success-900/30 dark:text-success-400',
  info: 'text-brand-600 bg-brand-50 dark:bg-brand-900/30 dark:text-brand-400',
  warning: 'text-warning-600 bg-warning-50 dark:bg-warning-900/30 dark:text-warning-400',
  error: 'text-error-600 bg-error-50 dark:bg-error-900/30 dark:text-error-400',
};

export function Layout({
  current, onNavigate, children,
}: { current: PageKey; onNavigate: (p: PageKey) => void; children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifs, setNotifs] = useState<AppNotification[]>(defaultNotifications);
  const unread = notifs.filter((n) => !n.read).length;

  const initials = (() => {
    const email = user?.email ?? '';
    return email.slice(0, 2).toUpperCase() || 'U';
  })();

  const markAllRead = () => setNotifs((p) => p.map((n) => ({ ...n, read: true })));

  const handleNav = (p: PageKey) => {
    onNavigate(p);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar - desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex">
        <SidebarContent current={current} onNavigate={handleNav} />
      </aside>

      {/* Sidebar - mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:hidden animate-slide-in">
            <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent current={current} onNavigate={handleNav} />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden flex-1 sm:block">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search evaluations, datasets..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
              />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:flex-initial">
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error-500 px-1 text-[10px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-12 z-40 w-80 sm:w-96 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold">Notifications</h4>
                        {unread > 0 && <Badge color="error">{unread} new</Badge>}
                      </div>
                      <button onClick={markAllRead} className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">Mark all read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifs.map((n) => {
                        const Icon = NOTIF_ICONS[n.type];
                        return (
                          <div key={n.id} className={cn('flex gap-3 border-b border-slate-50 px-4 py-3 last:border-0 dark:border-slate-800/50', !n.read && 'bg-brand-50/40 dark:bg-brand-900/10')}>
                            <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', NOTIF_COLORS[n.type])}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{n.title}</p>
                              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{n.body}</p>
                              <p className="mt-1 text-[10px] text-slate-400">{n.time}</p>
                            </div>
                            {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-semibold text-white">
                  {initials}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="max-w-[120px] truncate text-xs font-semibold text-slate-900 dark:text-slate-100">{user?.email ?? 'User'}</p>
                  <p className="text-[10px] text-slate-400">Evaluator</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-12 z-40 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900 animate-fade-in">
                    <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                      <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <UserIcon className="h-3.5 w-3.5" />
                        Signed in as
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => { setProfileOpen(false); signOut(); }}
                      className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-medium text-error-600 transition-colors hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-900/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

        {/* Mobile bottom nav */}
        <MobileBottomNav current={current} onNavigate={handleNav} />
      </div>
    </div>
  );
}

function SidebarContent({ current, onNavigate }: { current: PageKey; onNavigate: (p: PageKey) => void }) {
  const groups = [...new Set(NAV.map((n) => n.group))];
  return (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5 dark:border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">AI Response Validation</h1>
          <p className="truncate text-[10px] text-slate-400">with Hallucination Detection</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((g) => (
          <div key={g} className="mb-4">
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{g}</p>
            {NAV.filter((n) => n.group === g).map((item) => {
              const Icon = item.icon;
              const active = current === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={cn(
                    'group mb-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                    active
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  )}
                >
                  <Icon className={cn('h-4.5 w-4.5 shrink-0', active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300')} style={{ width: 18, height: 18 }} />
                  <span className="truncate">{item.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <div className="rounded-xl bg-gradient-to-br from-brand-50 to-accent-50 p-3 dark:from-brand-900/20 dark:to-accent-900/20">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Project Demo</p>
          <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">Backend integration ready. UI uses sample data.</p>
        </div>
      </div>
    </>
  );
}

function MobileBottomNav({ current, onNavigate }: { current: PageKey; onNavigate: (p: PageKey) => void }) {
  const items: { key: PageKey; label: string; icon: typeof LayoutDashboard }[] = [
    { key: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { key: 'evaluate', label: 'Evaluate', icon: FileCheck2 },
    { key: 'history', label: 'History', icon: History },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];
  return (
    <nav className="sticky bottom-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white/90 px-1 py-1.5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = current === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={cn('flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium', active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400')}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
