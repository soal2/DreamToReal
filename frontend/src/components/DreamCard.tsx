import type { Dream } from '../types/dream';

type DreamCardProps = {
  dream: Dream;
  onClick: () => void;
  tags?: string[];
  thumbnailClassName?: string;
  marker?: React.ReactNode;
};

export function DreamCard({ dream, onClick, tags, thumbnailClassName, marker }: DreamCardProps) {
  const visibleTags = tags ?? dream.tags.slice(0, 3);

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full grid-cols-[1fr_168px] items-center gap-3.5 rounded-[15px] border border-[#ece9e5] bg-[#fbfaf8] px-4 py-2.5 text-left shadow-[0_6px_18px_rgba(31,45,61,0.035)] transition hover:-translate-y-0.5"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[13px] font-medium text-[#718092]">
          <span>{dream.time}</span>
          {marker}
        </div>
        <h3 className="mt-2 truncate text-[17px] font-semibold leading-tight text-[var(--text)]">{dream.title}</h3>
        <div className="mt-2.5 flex flex-wrap gap-1.5 overflow-hidden">
          {visibleTags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-[6px] bg-[#f0f1f1] px-2.5 py-0.5 text-[11px] font-medium text-[#6c7785]">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div
        className={`h-[64px] rounded-[10px] bg-cover bg-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.32)] ${
          thumbnailClassName ?? `bg-gradient-to-br ${dream.palette}`
        }`}
      />
    </button>
  );
}
