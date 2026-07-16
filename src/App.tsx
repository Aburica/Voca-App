import { useState } from 'react';
import { AppProvider, useApp } from './store';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ToastStack } from './components/ToastStack';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Lessons } from './pages/Lessons';
import { Flashcards } from './pages/Flashcards';
import { WordsInContext } from './pages/WordsInContext';
import { Chat } from './pages/Chat';
import { CefrTest } from './pages/CefrTest';
import { Settings } from './pages/Settings';
import { Subscriptions } from './pages/Subscriptions';

function Shell() {
  const { state, view } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!state.user) return <Login />;

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-900">
      {/* Sidebar is a layout-level wrapper - always rendered, never unmounted */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* TopBar with clickable Voca Bird logo to toggle sidebar */}
        <TopBar onMenu={() => setSidebarOpen((o) => !o)} />

        <main className="flex-1 overflow-x-hidden p-4 lg:p-6">
          {view === 'dashboard' && <Dashboard />}
          {view === 'lessons' && <Lessons />}
          {view === 'flashcards' && <Flashcards />}
          {view === 'context' && <WordsInContext />}
          {view === 'chat' && <Chat />}
          {view === 'cefr-test' && <CefrTest />}
          {view === 'settings' && <Settings />}
          {view === 'subscriptions' && <Subscriptions />}
        </main>
      </div>

      <ToastStack />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}