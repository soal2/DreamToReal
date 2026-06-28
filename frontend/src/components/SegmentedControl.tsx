type SegmentedControlProps<T extends string> = {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div
      className="grid h-11 rounded-full bg-[#efefed]/90 p-0.5 shadow-[inset_0_1px_3px_rgba(38,57,79,0.035)]"
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full px-4 text-[16px] font-medium transition ${
            value === option.value
              ? 'bg-[#fffefd] text-[var(--text)] shadow-[0_2px_8px_rgba(31,45,61,0.07)] ring-1 ring-black/[0.025]'
              : 'text-[#858b92]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
