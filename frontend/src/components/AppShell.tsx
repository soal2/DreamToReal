import { TabBar, type TabKey } from './TabBar';

type AppShellProps = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  children: React.ReactNode;
};

export function AppShell({ activeTab, onTabChange, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#edf0f2] p-3 [html[data-theme='dark']_&]:bg-[linear-gradient(135deg,#0c1116,#1a2028)]">
      <main className="relative h-[min(860px,calc(100vh-24px))] w-[min(450px,calc(100vw-24px))] min-w-[390px] max-w-[450px] overflow-hidden rounded-[30px] border border-black/[0.04] bg-[var(--app-bg)] shadow-[0_18px_54px_rgba(31,45,61,0.1)] [&_nav]:px-8 [&_nav]:pb-2 [&_nav]:pt-1.5 [&_nav_button]:h-[52px] [&_nav_button]:gap-0.5 [&_nav_button]:text-[11.5px] [&_nav_span]:p-1.5 [&_nav_svg]:h-[18px] [&_nav_svg]:w-[18px]">
        <div className="app-scroll h-[calc(100%-78px)] overflow-y-auto px-7 pb-28 pt-5 text-[var(--text)]">{children}</div>
        <TabBar activeTab={activeTab} onTabChange={onTabChange} />
      </main>
    </div>
  );
}
