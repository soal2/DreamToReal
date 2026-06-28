import { Archive, ChartNoAxesCombined, Home, type LucideIcon, UserRound } from 'lucide-react';

export type TabKey = 'home' | 'archive' | 'insight' | 'profile';

const tabs: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'archive', label: '档案', icon: Archive },
  { key: 'insight', label: '洞察', icon: ChartNoAxesCombined },
  { key: 'profile', label: '我的', icon: UserRound },
];

export function TabBar({ activeTab, onTabChange }: { activeTab: TabKey; onTabChange: (tab: TabKey) => void }) {
  return (
    <nav className="absolute inset-x-0 bottom-0 border-t border-[#ece9e5] bg-[rgba(250,249,246,0.93)] px-8 pb-3 pt-2 backdrop-blur-xl">
      <div className="grid grid-cols-4 gap-2">
        {tabs.map(({ key, label, icon: Icon }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onTabChange(key)}
              className={`flex h-[58px] flex-col items-center justify-center gap-1 rounded-[13px] text-[12px] font-medium transition ${
                active ? 'text-[var(--accent)]' : 'text-[#7f858c]'
              }`}
            >
              <span className={active ? 'rounded-[9px] bg-[var(--accent)] p-1.5 text-white shadow-[0_4px_10px_rgba(36,55,77,0.12)]' : 'p-1.5 text-[#7f858c]'}>
                <Icon size={20} fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 2.2 : 2} />
              </span>
              {label}
            </button>
          );
        })}
      </div>
      <div className="mx-auto mt-1 h-1.5 w-[150px] rounded-full bg-black" />
    </nav>
  );
}
