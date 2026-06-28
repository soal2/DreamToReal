import { useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';
import type { TabKey } from './components/TabBar';
import { ThemeProvider } from './context/ThemeContext';
import { fetchDreams } from './services/api';
import type { Dream } from './types/dream';
import { Archive } from './pages/Archive';
import { DreamDetail } from './pages/DreamDetail';
import { Home } from './pages/Home';
import { Insight } from './pages/Insight';
import { Profile } from './pages/Profile';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

  useEffect(() => {
    fetchDreams().then(setDreams);
  }, []);

  const openDream = (dream: Dream) => {
    setSelectedDream(dream);
    setActiveTab('archive');
  };

  const handleDreamReady = (dream: Dream) => {
    setDreams((current) => [dream, ...current]);
    setSelectedDream(dream);
    setActiveTab('archive');
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    if (tab !== 'archive') {
      setSelectedDream(null);
    }
  };

  const content = (() => {
    if (activeTab === 'home') return <Home onDreamReady={handleDreamReady} />;
    if (activeTab === 'archive') {
      return selectedDream ? <DreamDetail dream={selectedDream} /> : <Archive dreams={dreams} onSelectDream={openDream} />;
    }
    if (activeTab === 'insight') return <Insight />;
    return <Profile />;
  })();

  return (
    <AppShell activeTab={activeTab} onTabChange={handleTabChange}>
      {content}
    </AppShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
