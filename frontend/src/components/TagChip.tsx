type TagChipProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

export function TagChip({ label, active = false, onClick, className = '' }: TagChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center whitespace-nowrap rounded-full border px-4 py-1.5 text-[14px] leading-none transition ${
        active
          ? 'border-[#dfe3e7] bg-[#f1f3f4] text-[#394b61] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]'
          : 'border-[#e4e6e8] bg-[#f8f8f6] text-[#546173] shadow-[inset_0_1px_1px_rgba(255,255,255,0.72)]'
      } ${className}`}
    >
      {label}
    </button>
  );
}
