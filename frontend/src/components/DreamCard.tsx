import type { ReactNode } from "react";
import { resolveImageUrl } from "../lib/imageUrl";
import { formatTimeLabel, getPaletteClass } from "../lib/dreamDerived";
import type { DreamListItem, DreamRecord } from "../types/dream";

type DreamCardDream = Pick<DreamRecord | DreamListItem, "id" | "title" | "image_url" | "keywords" | "created_at"> & {
  scenes?: string[];
};

type DreamCardProps = {
  dream: DreamCardDream;
  onClick: () => void;
  tags?: string[];
  thumbnailClassName?: string;
  marker?: ReactNode;
};

export function DreamCard({ dream, onClick, tags, thumbnailClassName, marker }: DreamCardProps) {
  const visibleTags = (tags ?? dream.keywords ?? []).slice(0, 3);
  const resolved = resolveImageUrl(dream.image_url);
  const fallbackClass = thumbnailClassName ?? getPaletteClass({ keywords: dream.keywords, scenes: dream.scenes });

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full grid-cols-[1fr_168px] items-center gap-3.5 rounded-[15px] border border-[#ece9e5] bg-[#fbfaf8] px-4 py-2.5 text-left shadow-[0_6px_18px_rgba(31,45,61,0.035)] transition hover:-translate-y-0.5"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[13px] font-medium text-[#718092]">
          <span>{formatTimeLabel(dream.created_at)}</span>
          {marker}
        </div>
        <h3 className="mt-2 truncate text-[17px] font-semibold leading-tight text-[var(--text)]">{dream.title}</h3>
        <div className="mt-2.5 flex flex-wrap gap-1.5 overflow-hidden">
          {visibleTags.map((tag) => (
            <span key={tag} className="rounded-[6px] bg-[#f0f1f1] px-2.5 py-0.5 text-[11px] font-medium text-[#6c7785]">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div
        className={`h-[64px] rounded-[10px] bg-cover bg-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.32)] ${resolved ? "" : fallbackClass}`}
        style={resolved ? { backgroundImage: `url("${resolved}")` } : undefined}
      />
    </button>
  );
}
