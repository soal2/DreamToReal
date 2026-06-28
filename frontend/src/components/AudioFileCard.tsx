import { Play } from 'lucide-react';
import type { AudioFile } from '../types/dream';

export function AudioFileCard({ audio }: { audio?: AudioFile }) {
  return (
    <section className="rounded-[18px] bg-[#f7f6f2] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
      <h3 className="text-[14.5px] font-semibold text-[var(--text)]">本地录音文件</h3>
      {audio ? (
        <div className="mt-2.5 flex items-center gap-3 rounded-[15px] bg-[#fbfaf7] p-2.5">
          <button
            type="button"
            aria-label="播放录音"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_6px_14px_rgba(36,55,77,0.16)]"
          >
            <Play size={15} fill="currentColor" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-[var(--text)]">{audio.name}</p>
            <p className="mt-1 text-[12px] text-[#8993a0]">
              {audio.duration} · {audio.size} · {audio.storage}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-[13px] text-[#8a939e]">本次记录没有录音文件</p>
      )}
    </section>
  );
}
