import { useMemo, useState } from 'react';
import { ArrowLeft, FileText, Image, Loader2, MoreHorizontal, Pencil, RefreshCcw, Sparkles } from 'lucide-react';
import { AudioFileCard } from '../components/AudioFileCard';
import type { Dream } from '../types/dream';

const fallbackSummary =
  '我在一个很旧的空间里，光线昏暗，墙皮有些脱落。我想出去，却发现怎么也找不到门。楼道很长，拐了好几次弯，遇到一个陌生的老太太，她指了指一个方向，我走过去却又回到了原来的地方。后来我有点着急，醒来的时候心跳得很快。';

const originalBullets = ['老房子 楼道 很长 很暗', '找门 找不到', '老太太 指了方向', '走过去 又回到原地', '心跳很快 醒了'];
const visibleOriginalBullets = originalBullets.slice(0, 2);

function heroSceneClass(dream: Dream, generated: boolean) {
  if (generated) {
    return 'bg-[radial-gradient(circle_at_72%_28%,rgba(255,236,188,.95),transparent_24%),radial-gradient(circle_at_50%_72%,rgba(207,190,160,.65),transparent_35%),linear-gradient(90deg,#3d332b,#91795f_42%,#ead8b3_66%,#5b4b3e)]';
  }
  if (dream.title.includes('考试')) {
    return 'bg-[radial-gradient(circle_at_18%_24%,rgba(255,255,255,.72),transparent_18%),radial-gradient(circle_at_72%_34%,rgba(215,191,125,.62),transparent_28%),linear-gradient(135deg,#405249,#b7c5bb_48%,#e1c98f)]';
  }
  return 'bg-[radial-gradient(circle_at_72%_28%,rgba(250,232,186,.85),transparent_25%),radial-gradient(circle_at_48%_70%,rgba(220,206,180,.72),transparent_30%),linear-gradient(90deg,#352d25,#806b53_42%,#e9d4aa_68%,#4d4035)]';
}

export function DreamDetail({ dream }: { dream: Dream }) {
  const [isReorganizing, setIsReorganizing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [revision, setRevision] = useState(0);
  const [generatedImage, setGeneratedImage] = useState(false);

  const detailText = useMemo(() => {
    const base = dream.summary.length > 80 ? dream.summary : fallbackSummary;
    if (!revision) return base;
    return `${base} 重新整理后，梦里的空间感更清楚：它像一条反复折返的走廊，焦虑来自“明明看见出口，却始终走不到那里”。`;
  }, [dream.summary, revision]);

  const handleReorganize = async () => {
    if (isReorganizing) return;
    setIsReorganizing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    setRevision((current) => current + 1);
    setIsReorganizing(false);
  };

  const handleGenerateImage = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    setGeneratedImage(true);
    setIsGenerating(false);
  };

  const tags = dream.title.includes('老房子') ? ['走廊', '下雨', '找不到门', '陌生人', '焦虑'] : dream.tags;

  return (
    <article className="-mx-7 -mt-5 pb-32">
      <section className={`relative h-[252px] overflow-hidden rounded-b-[26px] ${heroSceneClass(dream, generatedImage)} bg-cover bg-center text-white`}>
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
          <p className="text-[14px] font-medium text-white/88">
            {dream.date.replace('2026年', '')} {dream.time}
          </p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h1 className="text-[27px] font-bold leading-tight text-white">{dream.title}</h1>
            <button type="button" className="rounded-[13px] bg-white/22 px-4 py-2.5 text-[14px] font-semibold text-white backdrop-blur">
              编辑
            </button>
          </div>
        </div>
        {generatedImage && (
          <div className="absolute right-6 top-24 z-10 rounded-full bg-white/24 px-3 py-1 text-[12px] font-medium text-white backdrop-blur">画面已生成</div>
        )}
      </section>

      <section className="relative -mt-4 space-y-3.5 rounded-t-[26px] bg-[var(--app-bg)] px-5 pb-8 pt-4.5">
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
            {visibleOriginalBullets.map((item) => (
              <p key={item}>· {dream.originalText.length > 35 ? item : item}</p>
            ))}
          </div>
        </section>

        <div className="pt-1">
          <AudioFileCard audio={dream.audio} />
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
          {isReorganizing ? '整理中' : '重新整理'}
        </button>
        <button
          type="button"
          onClick={handleGenerateImage}
          disabled={isGenerating}
          className="flex h-12 items-center justify-center gap-2.5 rounded-[14px] bg-[var(--accent)] text-[14px] font-semibold text-white shadow-[0_10px_20px_rgba(36,55,77,0.14)] disabled:opacity-75"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={19} /> : generatedImage ? <Pencil size={19} /> : <Image size={19} />}
          {isGenerating ? '生成中' : generatedImage ? '已生成' : '生成画面'}
        </button>
      </div>
    </article>
  );
}
