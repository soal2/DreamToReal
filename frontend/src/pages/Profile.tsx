import { useState } from 'react';
import {
  Battery,
  Bell,
  ChevronRight,
  CircleHelp,
  Cloud,
  Download,
  FileLock2,
  Info,
  Radio,
  Rocket,
  Settings,
  Signal,
  UserRound,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

type LaunchMode = 'smart' | 'home' | 'archive';

type SettingRowProps = {
  icon?: LucideIcon;
  label: string;
  description?: string;
  value?: string;
  onClick?: () => void;
};

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-1 text-[var(--text)]">
      <span className="text-[16px] font-semibold leading-none">9:41</span>
      <div className="flex items-center gap-2">
        <Signal size={17} strokeWidth={3} />
        <Wifi size={17} strokeWidth={3} />
        <Battery size={23} strokeWidth={2.2} />
      </div>
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-[20px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_9px_26px_rgba(31,45,61,0.045)] ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeading({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 pb-1 pt-4 text-[var(--text)]">
      <Icon size={21} strokeWidth={1.75} className="text-[#718296]" />
      <h2 className="text-[17px] font-bold leading-none">{children}</h2>
    </div>
  );
}

function SettingRow({ icon: Icon, label, description, value, onClick }: SettingRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[56px] w-full items-center gap-3 border-b border-[var(--border)] px-4 py-3 text-left last:border-b-0 active:bg-[var(--surface-muted)]"
    >
      {Icon && <Icon size={19} strokeWidth={1.75} className="shrink-0 text-[#78889a]" />}
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium leading-5 text-[var(--text)]">{label}</span>
        {description && <span className="mt-0.5 block text-[12px] leading-5 text-[var(--text-muted)]">{description}</span>}
      </span>
      {value && <span className="shrink-0 text-[13px] text-[var(--text-muted)]">{value}</span>}
      <ChevronRight size={18} strokeWidth={1.8} className="shrink-0 text-[#aab0b6]" />
    </button>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-7 w-[50px] shrink-0 rounded-full transition-colors ${checked ? 'bg-[var(--accent)]' : 'bg-[#c9ced3]'}`}
    >
      <span
        className={`absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-[0_2px_5px_rgba(31,45,61,0.2)] transition-transform ${
          checked ? 'translate-x-[25px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  );
}

export function Profile() {
  const [launchMode, setLaunchMode] = useState<LaunchMode>('smart');
  const [morningReminder, setMorningReminder] = useState(true);
  const [pushReminder, setPushReminder] = useState(true);

  const launchOptions: { key: LaunchMode; label: string; description: string }[] = [
    { key: 'smart', label: '智能判断', description: '根据上次使用场景，自动选择最合适的启动页' },
    { key: 'home', label: '首页记录', description: '每次打开应用，直接进入记录页面' },
    { key: 'archive', label: '梦境档案', description: '每次打开应用，直接进入档案页面' },
  ];

  return (
    <div className="space-y-4 pb-8">
      <StatusBar />

      <header className="pt-5">
        <h1 className="text-[32px] font-bold leading-none text-[var(--text)]">我的</h1>
      </header>

      <Card className="flex items-center gap-4 px-5 py-5">
        <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-full bg-[#e8edf0] text-[#60778e] ring-4 ring-white/55">
          <UserRound size={31} strokeWidth={1.55} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[20px] font-bold leading-tight text-[var(--text)]">晚风与旧巷</h2>
          <p className="mt-2 text-[13px] text-[var(--text-muted)]">已连续记录 5 天梦境</p>
        </div>
        <ChevronRight size={21} strokeWidth={1.8} className="text-[#aab0b6]" />
      </Card>

      <Card>
        <SectionHeading icon={Rocket}>启动方式</SectionHeading>
        <div className="px-4 pb-2">
          {launchOptions.map((option) => {
            const selected = launchMode === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setLaunchMode(option.key)}
                className="flex w-full items-start gap-3 border-b border-[var(--border)] py-3.5 text-left last:border-b-0"
              >
                <span
                  className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border ${
                    selected ? 'border-[var(--accent)]' : 'border-[#bec4ca]'
                  }`}
                >
                  {selected && <span className="h-[10px] w-[10px] rounded-full bg-[var(--accent)]" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-medium leading-5 text-[var(--text)]">{option.label}</span>
                  <span className="mt-0.5 block text-[12px] leading-5 text-[var(--text-muted)]">{option.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <SectionHeading icon={Bell}>提醒设置</SectionHeading>
        <div className="px-4 pb-2">
          <div className="flex min-h-[66px] items-center gap-3 border-b border-[var(--border)] py-3">
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-[var(--text)]">早晨提醒记录梦境</p>
              <p className="mt-1 text-[12px] text-[var(--text-muted)]">每天 07:30</p>
            </div>
            <Toggle checked={morningReminder} onChange={() => setMorningReminder((value) => !value)} label="早晨提醒记录梦境" />
          </div>
          <div className="flex min-h-[54px] items-center gap-3 py-2.5">
            <span className="flex-1 text-[15px] font-medium text-[var(--text)]">推送提醒</span>
            <Toggle checked={pushReminder} onChange={() => setPushReminder((value) => !value)} label="推送提醒" />
          </div>
        </div>
      </Card>

      <ThemeSwitcher />

      <Card>
        <SectionHeading icon={Cloud}>数据与同步</SectionHeading>
        <div className="px-4 pb-2">
          <SettingRow icon={Cloud} label="云端同步" value="已开启" />
          <SettingRow icon={Download} label="导出梦境记录" />
          <SettingRow icon={FileLock2} label="数据与隐私" />
        </div>
      </Card>

      <Card>
        <SectionHeading icon={Settings}>其他设置</SectionHeading>
        <div className="px-4 pb-2">
          <SettingRow icon={CircleHelp} label="帮助与反馈" />
          <SettingRow icon={Info} label="关于产品" />
          <SettingRow icon={Radio} label="版本信息" value="1.2.0" />
        </div>
      </Card>
    </div>
  );
}
