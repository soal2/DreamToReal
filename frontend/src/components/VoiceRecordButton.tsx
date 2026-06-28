import { Mic } from 'lucide-react';

type VoiceRecordButtonProps = {
  isRecording?: boolean;
  onClick?: () => void;
};

export function VoiceRecordButton({ isRecording = false, onClick }: VoiceRecordButtonProps) {
  const leftBars = [6, 13, 20, 11, 27, 16, 8, 23, 32, 14, 7];
  const rightBars = [6, 12, 21, 10, 25, 15, 7, 22, 31, 13, 6];

  return (
    <div className="relative mx-auto flex h-[154px] w-full items-center justify-center">
      <div className="absolute left-7 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[#cbd2da]">
        {leftBars.map((height, index) => (
          <span key={index} className="w-[3px] rounded-full bg-current" style={{ height }} />
        ))}
      </div>
      <div className="absolute right-7 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[#cbd2da]">
        {rightBars.map((height, index) => (
          <span key={index} className="w-[3px] rounded-full bg-current" style={{ height }} />
        ))}
      </div>
      <button
        type="button"
        aria-label={isRecording ? '停止录音' : '开始录音'}
        onClick={onClick}
        className="relative flex h-[96px] w-[96px] items-center justify-center rounded-full text-white transition hover:scale-[1.01]"
      >
        <span className="absolute -inset-[43px] rounded-full bg-[#eef3f7]/45" />
        <span className="absolute -inset-[26px] rounded-full bg-[#f7f9fa]" />
        <span className="absolute -inset-[12px] rounded-full border border-[#e5e9ee] bg-[#fdfdfb] shadow-[0_5px_14px_rgba(42,63,86,0.035)]" />
        <span
          className={`relative flex h-[96px] w-[96px] items-center justify-center rounded-full shadow-[inset_0_7px_18px_rgba(255,255,255,0.11),0_12px_24px_rgba(60,82,108,0.18)] ${
            isRecording ? 'bg-[#7b5865]' : 'bg-[#566d89]'
          }`}
        >
          <Mic size={40} strokeWidth={2.05} />
        </span>
      </button>
    </div>
  );
}
