import { Check, Moon, Palette, Sun } from 'lucide-react';
import { useTheme, type ThemeMode } from '../context/ThemeContext';

const options: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: '浅色模式', icon: Sun },
  { value: 'dark', label: '深色模式', icon: Moon },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const currentLabel = theme === 'light' ? '浅色模式' : '深色模式';

  return (
    <section className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_9px_26px_rgba(31,45,61,0.045)]">
      <div className="flex items-center gap-3 px-4 pb-1 pt-4 text-[var(--text)]">
        <Palette size={21} strokeWidth={1.75} className="text-[#718296]" />
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-bold leading-none">主题设置</h2>
          <p className="mt-2 text-[12px] text-[var(--text-muted)]">当前主题：{currentLabel}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 px-4 pb-4 pt-3">
        {options.map(({ value, label, icon: Icon }) => {
          const selected = theme === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={selected}
              onClick={() => setTheme(value)}
              className={`relative flex h-[54px] items-center justify-center gap-2 rounded-[14px] border text-[14px] font-medium transition active:scale-[0.98] ${
                selected
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_7px_16px_rgba(36,55,77,0.12)]'
                  : 'border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text)]'
              }`}
            >
              <Icon size={18} strokeWidth={1.8} />
              {label}
              {selected && <Check size={14} strokeWidth={2.4} className="absolute right-2.5 top-2.5" />}
            </button>
          );
        })}
      </div>
    </section>
  );
}
