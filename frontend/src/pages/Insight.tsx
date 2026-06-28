import {
  Activity,
  Battery,
  BookOpen,
  Bus,
  Clock3,
  Compass,
  Download,
  FileText,
  Heart,
  Home,
  Leaf,
  LineChart,
  LocateFixed,
  Search,
  ShoppingBag,
  Signal,
  Sparkles,
  Sun,
  Tags,
  Waves,
  Wifi,
  type LucideIcon,
} from 'lucide-react';

type StatItem = {
  icon: LucideIcon;
  label: string;
  value: string;
};

type InsightTile = {
  label: string;
  icon: LucideIcon;
  tone: string;
  iconTone: string;
};

const stats: StatItem[] = [
  { icon: FileText, label: '记录数量', value: '5 个梦' },
  { icon: Activity, label: '平均频率', value: '0.7 次/天' },
  { icon: Sparkles, label: 'AI 已整理', value: '5 个梦' },
  { icon: Clock3, label: '最近记录', value: '今天 06:48' },
];

const emotions: InsightTile[] = [
  { label: '焦虑', icon: LocateFixed, tone: 'bg-[#fbf1ef]', iconTone: 'text-[#bd766d]' },
  { label: '温暖', icon: Sun, tone: 'bg-[#fbf4e9]', iconTone: 'text-[#c58b49]' },
  { label: '迷失', icon: Compass, tone: 'bg-[#f1f2f7]', iconTone: 'text-[#71839c]' },
  { label: '紧张', icon: Waves, tone: 'bg-[#eef4f8]', iconTone: 'text-[#6c879a]' },
  { label: '怀旧', icon: Leaf, tone: 'bg-[#eff6f1]', iconTone: 'text-[#6f9a83]' },
];

const scenes: InsightTile[] = [
  { label: '老房子', icon: Home, tone: 'bg-[#f6f4ee]', iconTone: 'text-[#7790a0]' },
  { label: '走廊', icon: Search, tone: 'bg-[#f3f4f3]', iconTone: 'text-[#8b98a2]' },
  { label: '公交站', icon: Bus, tone: 'bg-[#f6f3ed]', iconTone: 'text-[#758d96]' },
  { label: '教室', icon: BookOpen, tone: 'bg-[#f1f5ef]', iconTone: 'text-[#788f78]' },
  { label: '商场', icon: ShoppingBag, tone: 'bg-[#f5f3f1]', iconTone: 'text-[#82909a]' },
];

const keywords = ['寻找', '门', '迟到', '回家', '下雨', '陌生人', '走廊', '教室'];

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-1 text-[#111820]">
      <span className="text-[16px] font-semibold leading-none">9:41</span>
      <div className="flex items-center gap-2">
        <Signal size={17} strokeWidth={3} />
        <Wifi size={17} strokeWidth={3} />
        <Battery size={23} strokeWidth={2.2} />
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3 text-[var(--text)]">
      <Icon size={20} strokeWidth={1.85} className="text-[#697889]" />
      <h2 className="text-[20px] font-bold leading-none tracking-[0]">{title}</h2>
    </div>
  );
}

function InsightCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[19px] border border-[#edeae6] bg-[#fbfaf8] shadow-[0_9px_24px_rgba(31,45,61,0.045)] ${className}`}>
      {children}
    </section>
  );
}

function TileGrid({ items }: { items: InsightTile[] }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {items.map(({ label, icon: Icon, tone, iconTone }) => (
        <button
          key={label}
          type="button"
          className={`flex h-[76px] min-w-0 flex-col items-center justify-center rounded-[10px] border border-[#ece9e5] ${tone} text-[#253244] transition active:scale-[0.98]`}
        >
          <Icon size={22} strokeWidth={1.75} className={iconTone} />
          <span className="mt-2.5 text-[13px] font-medium leading-none">{label}</span>
        </button>
      ))}
    </div>
  );
}

export function Insight() {
  return (
    <div className="space-y-5 pb-8">
      <StatusBar />

      <header className="pt-6">
        <h1 className="text-[34px] font-bold leading-tight tracking-[0] text-[var(--text)]">梦境洞察</h1>
        <p className="mt-2 text-[15px] font-medium leading-none text-[#7e8998]">最近 7 天的梦境记录趋势</p>
      </header>

      <InsightCard className="px-2.5 py-5">
        <div className="grid grid-cols-4 divide-x divide-[#e9e5e0] text-center">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="px-1">
              <Icon className="mx-auto text-[#6f7e8f]" size={25} strokeWidth={1.75} />
              <p className="mt-3.5 text-[12px] font-medium leading-none text-[#7d8795]">{label}</p>
              <p className="mt-3 whitespace-nowrap text-[16px] font-bold leading-none text-[var(--text)]">{value}</p>
            </div>
          ))}
        </div>
      </InsightCard>

      <InsightCard className="p-4">
        <SectionTitle icon={Heart} title="高频情绪" />
        <TileGrid items={emotions} />
      </InsightCard>

      <InsightCard className="p-4">
        <SectionTitle icon={LineChart} title="常见场景" />
        <TileGrid items={scenes} />
      </InsightCard>

      <InsightCard className="p-4">
        <SectionTitle icon={Tags} title="高频关键词" />
        <div className="flex flex-wrap gap-x-4 gap-y-3">
          {keywords.map((keyword) => (
            <button
              key={keyword}
              type="button"
              className="min-w-[64px] rounded-full border border-[#e7e5e2] bg-[#f3f3f1] px-5 py-2 text-center text-[15px] font-medium leading-none text-[#314052] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition active:scale-[0.98]"
            >
              {keyword}
            </button>
          ))}
        </div>
      </InsightCard>

      <InsightCard className="p-4">
        <SectionTitle icon={Sparkles} title="一周梦境小结" />
        <div className="rounded-[16px] bg-[#f4f4f2] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
          <p className="text-[15px] leading-8 text-[#4b5868]">
            这一周的梦境经常围绕寻找方向、赶时间和旧空间展开，情绪上带有轻微焦虑，但也有回到熟悉环境的安全感。
          </p>
        </div>
      </InsightCard>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          className="flex h-12 items-center justify-center rounded-[14px] border border-[#d8dde1] bg-[#fbfaf8] text-[14px] font-semibold text-[#314052] shadow-[0_7px_18px_rgba(31,45,61,0.04)] transition active:scale-[0.98]"
        >
          查看详细分析
        </button>
        <button
          type="button"
          className="flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[var(--accent)] text-[14px] font-semibold text-white shadow-[0_9px_20px_rgba(36,55,77,0.13)] transition active:scale-[0.98]"
        >
          <Download size={17} strokeWidth={1.9} />
          导出洞察报告
        </button>
      </div>
    </div>
  );
}
