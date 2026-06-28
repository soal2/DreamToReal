import { useEffect, useState } from "react";
import { AppShell } from "./components/AppShell";
import type { TabKey } from "./components/TabBar";
import { ThemeProvider } from "./context/ThemeContext";
import { fetchDreamById, listDreams } from "./services/api";
import { ApiError } from "./services/http";
import type { Dream, DreamListItem } from "./types/dream";
import { Archive } from "./pages/Archive";
import { DreamDetail } from "./pages/DreamDetail";
import { Home } from "./pages/Home";
import { Insight } from "./pages/Insight";
import { Profile } from "./pages/Profile";

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [dreams, setDreams] = useState<DreamListItem[]>([]);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  useEffect(() => {
    listDreams({ limit: 20, offset: 0 })
      .then((response) => setDreams(response.items))
      .catch((err) => {
        const msg = err instanceof ApiError ? err.message : "无法加载档案列表";
        setErrorBanner(msg);
      });
  }, []);

  useEffect(() => {
    if (!errorBanner) return;
    const timer = window.setTimeout(() => setErrorBanner(null), 4000);
    return () => window.clearTimeout(timer);
  }, [errorBanner]);

  const openDream = async (item: DreamListItem) => {
    try {
      const full = await fetchDreamById(item.id);
      setSelectedDream(full);
      setActiveTab("archive");
    } catch (err) {
      setErrorBanner(err instanceof ApiError ? err.message : "打开梦境失败");
    }
  };

  const handleDreamReady = (dream: Dream) => {
    const listItem: DreamListItem = {
      id: dream.id,
      title: dream.title,
      image_url: dream.image_url,
      keywords: dream.keywords,
      emotions: dream.emotions,
      scenes: dream.scenes,
      status: dream.status,
      created_at: dream.created_at,
    };
    setDreams((current) => [listItem, ...current.filter((d) => d.id !== dream.id)]);
    setSelectedDream(dream);
    setActiveTab("archive");
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    if (tab !== "archive") {
      setSelectedDream(null);
    }
  };

  const content = (() => {
    if (activeTab === "home") return <Home onDreamReady={handleDreamReady} />;
    if (activeTab === "archive") {
      return selectedDream ? <DreamDetail dream={selectedDream} /> : <Archive dreams={dreams} onSelectDream={openDream} />;
    }
    if (activeTab === "insight") return <Insight />;
    return <Profile />;
  })();

  return (
    <AppShell activeTab={activeTab} onTabChange={handleTabChange} errorMessage={errorBanner}>
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
