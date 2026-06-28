import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, FileText, Image, Loader2, MoreHorizontal, Pencil, RefreshCcw, Sparkles } from "lucide-react";
import { AudioFileCard } from "../components/AudioFileCard";
import { generateDreamImage, reorganizeDream } from "../services/api";
import { ApiError } from "../services/http";
import { resolveImageUrl } from "../lib/imageUrl";
import { formatTimeLabel, formatDateLabel, getPaletteClass } from "../lib/dreamDerived";
import type { Dream } from "../types/dream";

function heroGradientClass(dream: Dream) {
  return getPaletteClass({ keywords: dream.keywords, scenes: dream.scenes });
}

export function DreamDetail({ dream }: { dream: Dream }) {
  const [current, setCurrent] = useState<Dream>(dream);
  const [isReorganizing, setIsReorganizing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrent(dream);
    setError(null);
  }, [dream]);

  const resolved = resolveImageUrl(current.image_url);
  const tags = current.keywords.length > 0 ? current.keywords : current.scenes;
  const detailText = current.organized_text || current.raw_text || "暂无整理结果，请尝试重新整理。";

  const handleReorganize = async () => {
    if (isReorganizing) return;
    setIsReorganizing(true);
    setError(null);
    try {
      const updated = await reorganizeDream(current.id);
      setCurrent((prev) => ({ ...updated, audio: prev.audio }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "重新整理失败，请稍后重试");
    } finally {
      setIsReorganizing(false);
    }
  };

  const handleGenerateImage = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setError(null);
    try {
      const updated = await generateDreamImage(current.id, false);
      setCurrent((prev) => ({ ...prev, image_url: updated.image_url, status: updated.status }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "生成画面失败，请稍后重试");
    } finally {
      setIsGenerating(false);
    }
  };

  const heroLabel = useMemo(() => {
    const date = formatDateLabel(current.created_at);
    const time = formatTimeLabel(current.created_at);
    return `${date} ${time}`.trim();
  }, [current.created_at]);

  return (
    <article className="-mx-7 -mt-5 pb-32">
      <section className={`relative h-[252px] overflow-hidden rounded-b-[26px] bg-cover bg-center text-white ${resolved ? "" : heroGradientClass(current)}`}
        style={resolved ? { backgroundImage: `url("${resolved}")` } : undefined}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.42),rgba(0,0,0,.08)_45%,rgba(0,0,0,.58))]" />
        <div className="relative z-10 flex items-center justify-between px-7 pt-6">
          <span className="text-[16px] font-semibold">9:41</span>
          <div className="flex items-center gap-2 text-white">
            <span className="h-4 w-5 rounded-sm border-2 border-current" />
            <span className="h-4 w-4 rounded-full border-2 border-current" />
            <span className="h-4 w-6 rounded-sm border-2 border-current" />
          </div>
        </div>
        <div className="relative z-10 mt-5 flex items-center justify-between px-5">
          <button type="button" aria-label="返回" className="flex h-10 w-10 items-center justify-center rounded-full bg-black/24 text-white backdrop-blur">
            <ArrowLeft size={24} />
          </button>
          <button type="button" aria-label="更多" className="flex h-10 w-10 items-center justify-center rounded-full bg-black/24 text-white backdrop-blur">
            <MoreHorizontal size={25} />
          </button>
        </div>
        <div className="absolute inset-x-6 bottom-5 z-10">
          <p className="text-[14px] font-medium text-white/88">{heroLabel}</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h1 className="text-[27px] font-bold leading-tight text-white">{current.title}</h1>
            <button type="button" className="rounded-[13px] bg-white/22 px-4 py-2.5 text-[14px] font-semibold text-white backdrop-blur">
              编辑
            </button>
          </div>
        </div>
        {current.status === "image_generated" && resolved && (
          <div className="absolute right-6 top-24 z-10 rounded-full bg-white/24 px-3 py-1 text-[12px] font-medium text-white backdrop-blur">画面已生成</div>
        )}
      </section>

      <section className="relative -mt-4 space-y-3.5 rounded-t-[26px] bg-[var(--app-bg)] px-5 pb-8 pt-4.5">
        {error && (
          <div className="rounded-[10px] bg-[#fef2f2] px-3 py-2 text-[12px] text-[#b91c1c]">{error}</div>
        )}
        <section>
          <div className="mb-2.5 flex items-center gap-2.5 text-[var(--text)]">
            <Sparkles size={19} className="text-[#6f7f92]" fill="currentColor" />
            <h2 className="text-[16px] font-semibold">整理后的梦境</h2>
          </div>
          <div className="rounded-[18px] border border-[#ebe8e4] bg-[#fbfaf7] p-3.5 shadow-[0_7px_18px_rgba(31,45,61,0.032)]">
            {isReorganizing ? (
              <div className="flex items-center gap-2 py-7 text-[14px] text-[#7d8793]">
                <Loader2 className="animate-spin" size={18} />
                正在重新整理梦境...
              </div>
            ) : (
              <p className="whitespace-pre-line text-[14.2px] leading-6 text-[#2f3742]">{detailText}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#f0f1ef] px-3.5 py-1.5 text-[12.5px] font-medium text-[#536175]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-2.5 flex items-center gap-2.5 text-[var(--text)]">
            <FileText size={18} className="text-[#6f7f92]" />
            <h2 className="text-[15.5px] font-semibold">原始记录</h2>
          </div>
          <div className="rounded-[18px] bg-[#f7f6f2] p-3 text-[13.2px] leading-5 text-[#7d7f83] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
            <p className="whitespace-pre-line">{current.raw_text || "（暂无原始记录）"}</p>
          </div>
        </section>

        <div className="pt-1">
          <AudioFileCard audio={current.audio} />
        </div>
      </section>

      <div className="absolute inset-x-5 bottom-[104px] z-30 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={handleReorganize}
          disabled={isReorganizing}
          className="flex h-12 items-center justify-center gap-2.5 rounded-[14px] border border-[var(--accent)] bg-[#fbfaf7] text-[14px] font-semibold text-[var(--accent)] shadow-[0_8px_18px_rgba(31,45,61,0.08)] disabled:opacity-65"
        >
          {isReorganizing ? <Loader2 className="animate-spin" size={20} /> : <RefreshCcw size={20} />}
          {isReorganizing ? "整理中" : "重新整理"}
        </button>
        <button
          type="button"
          onClick={handleGenerateImage}
          disabled={isGenerating}
          className="flex h-12 items-center justify-center gap-2.5 rounded-[14px] bg-[var(--accent)] text-[14px] font-semibold text-white shadow-[0_10px_20px_rgba(36,55,77,0.14)] disabled:opacity-75"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={19} /> : resolved ? <Pencil size={19} /> : <Image size={19} />}
          {isGenerating ? "生成中" : resolved ? "已生成" : "生成画面"}
        </button>
      </div>
    </article>
  );
}
