import { useEffect, useRef, useState } from "react";
import { Battery, ChevronRight, Lightbulb, Play, RotateCcw, Signal, Wifi } from "lucide-react";
import { createDream } from "../services/api";
import { ApiError } from "../services/http";
import type { AudioFile, Dream } from "../types/dream";
import { LoadingState } from "../components/LoadingState";
import { TagChip } from "../components/TagChip";
import { VoiceRecordButton } from "../components/VoiceRecordButton";

type RecordState = "idle" | "recording" | "recorded" | "processing";

const promptTags = ["场景", "人物", "情绪", "对话", "动作"];

function getSpeechRecognition(): any {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

export function Home({ onDreamReady }: { onDreamReady: (dream: Dream) => void }) {
  const [recordState, setRecordState] = useState<RecordState>("idle");
  const [draftText, setDraftText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [pendingAudio, setPendingAudio] = useState<AudioFile | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const usedSttRef = useRef(false);
  const canConfirm = draftText.trim().length > 0 || Boolean(pendingAudio);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  };

  const toggleRecording = () => {
    if (recordState === "processing") return;

    if (recordState === "recording") {
      recognitionRef.current?.stop();
      return;
    }

    const SR = getSpeechRecognition();
    if (!SR) {
      setError(
        window.isSecureContext
          ? "当前浏览器不支持语音识别，建议使用 Chrome / Edge / Safari"
          : "语音识别需要 HTTPS 或 localhost 环境（当前页面非安全上下文）",
      );
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "zh-CN";

    recognition.onresult = (event: any) => {
      let finalChunk = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) finalChunk += transcript;
        else interim += transcript;
      }
      if (finalChunk) {
        usedSttRef.current = true;
        setDraftText((prev) => prev + finalChunk);
      }
      setInterimText(interim);
    };

    recognition.onerror = (event: any) => {
      const code = event?.error;
      if (code === "not-allowed" || code === "service-not-allowed") {
        setError("麦克风权限被拒绝，请在浏览器设置中开启");
      } else if (code === "network") {
        setError("语音识别需要联网（部分浏览器依赖 Google 服务），请检查网络或更换浏览器");
      } else if (code === "language-not-supported") {
        setError("当前浏览器不支持中文识别，请尝试 Chrome 或 Edge");
      } else if (code === "audio-capture") {
        setError("未检测到麦克风设备");
      } else if (code !== "aborted" && code !== "no-speech") {
        setError(`语音识别失败：${code || "未知错误"}`);
      }
    };

    recognition.onend = () => {
      setInterimText("");
      setRecordState((prev) => (prev === "recording" ? "idle" : prev));
      recognitionRef.current = null;
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setError(null);
      setRecordState("recording");
    } catch (err) {
      setError(`无法启动语音识别：${(err as Error)?.message ?? "未知错误"}`);
    }
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden && recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const resetRecording = () => {
    setPendingAudio(undefined);
    setRecordState("idle");
  };

  const submit = async () => {
    if (!canConfirm || recordState === "processing") return;
    recognitionRef.current?.stop();
    setError(null);
    setRecordState("processing");
    try {
      const dream = await createDream({
        raw_text: draftText.trim() || "（语音记录待识别）",
        source: usedSttRef.current ? "voice" : pendingAudio ? "voice" : "text",
        generate_image: false,
      });
      const enriched: Dream = pendingAudio ? { ...dream, audio: pendingAudio } : dream;
      onDreamReady(enriched);
      setDraftText("");
      setPendingAudio(undefined);
      setSelectedTags([]);
      usedSttRef.current = false;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "请求失败，请稍后重试");
    } finally {
      setRecordState("idle");
    }
  };

  return (
    <div className="min-h-full pb-24">
      <div className="mb-7 flex items-center justify-between px-1 text-black">
        <span className="text-[16px] font-semibold leading-none">9:41</span>
        <div className="flex items-center gap-2">
          <Signal size={17} strokeWidth={3} />
          <Wifi size={17} strokeWidth={3} />
          <Battery size={23} strokeWidth={2.2} />
        </div>
      </div>

      <header>
        <h1 className="text-[26px] font-bold leading-[1.16] tracking-normal text-[var(--text)]">趁还记得，先记下来</h1>
        <p className="mt-2 whitespace-nowrap text-[12.5px] leading-5 text-[#7d8895]">哪怕只是一个场景、一句对话、一个人，我也能帮你慢慢整理。</p>
      </header>

      {recordState === "processing" ? (
        <div className="mt-10">
          <LoadingState text="正在整理梦境碎片..." />
        </div>
      ) : (
        <section className="mt-7">
          <div className="relative">
            <textarea
              value={draftText}
              onChange={(event) => setDraftText(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  void submit();
                }
              }}
              placeholder={"把你刚记得的片段、场景、对话先写下来，\n不用在意顺序。"}
              maxLength={2000}
              className="mt-5 h-[172px] w-full resize-none rounded-[28px] border border-[#e7e6e3] bg-[#fbfbf9] px-5 py-5 pb-10 text-[15px] leading-7 text-[var(--text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] outline-none placeholder:text-[#9aa1a9] focus:border-[#dbdee1]"
            />
            <span className="absolute bottom-4 right-6 text-xs text-[#b0b5ba]">{draftText.length}/2000</span>
            {interimText && (
              <span className="absolute bottom-4 left-6 max-w-[60%] truncate text-xs text-[#9aa1a9]">
                {interimText}
              </span>
            )}
          </div>

          <div className="mt-5 text-center">
            <VoiceRecordButton isRecording={recordState === "recording"} onClick={toggleRecording} />
            <p className="-mt-1 text-[15.5px] font-medium text-[var(--text)]">
              {recordState === "recording" ? "正在录音，点击停止" : "点击录音，再次点击停止"}
            </p>
            <p className="mt-2 text-[12.5px] leading-5 text-[#8a939e]">录完后我会帮你整理成更完整的梦境叙述</p>
          </div>

          {pendingAudio && (
            <section className="mt-4 rounded-[18px] border border-[#e5e3df] bg-[#fbfaf7] px-4 py-3 shadow-[0_5px_14px_rgba(31,45,61,0.026)]">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-[var(--text)]">本次录音</p>
                  <p className="mt-1 truncate text-[12.5px] text-[#596679]">{pendingAudio.name}</p>
                  <p className="mt-0.5 text-[11.5px] text-[#8c95a0]">
                    {pendingAudio.duration} · {pendingAudio.storage}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    className="flex h-9 items-center justify-center gap-1 rounded-full border border-[#e0e4e8] bg-[#f8f8f6] px-3 text-[12px] text-[#51657d]"
                    aria-label="播放"
                  >
                    <Play size={15} fill="currentColor" />
                    播放
                  </button>
                  <button
                    type="button"
                    onClick={resetRecording}
                    className="flex h-9 items-center justify-center gap-1 rounded-full border border-[#e0e4e8] bg-[#f8f8f6] px-3 text-[12px] text-[#51657d]"
                    aria-label="重新录制"
                  >
                    <RotateCcw size={15} />
                    重新录制
                  </button>
                </div>
              </div>
            </section>
          )}

          <section className="mt-5 rounded-[20px] border border-[#e7e5e1] bg-[#fbfaf7] px-4 py-3 shadow-[0_6px_16px_rgba(31,45,61,0.028)]">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--text)]">
                <Lightbulb size={19} strokeWidth={1.9} />
                <h2 className="text-[15.5px] font-medium">回忆提示</h2>
              </div>
              <ChevronRight size={19} className="text-[#989fa7]" />
            </div>
            <div className="grid grid-cols-5 gap-2.5">
              {promptTags.map((tag) => (
                <TagChip key={tag} label={tag} active={selectedTags.includes(tag)} onClick={() => toggleTag(tag)} className="w-full px-0" />
              ))}
            </div>
          </section>
        </section>
      )}

      {error && (
        <div className="absolute inset-x-7 bottom-[150px] z-20 rounded-[10px] bg-[#fef2f2] px-3 py-2 text-[12px] text-[#b91c1c]">
          {error}
        </div>
      )}

      <div className="absolute inset-x-7 bottom-[101px] z-20">
        <button
          type="button"
          onClick={submit}
          disabled={!canConfirm || recordState === "processing"}
          className="w-full rounded-full bg-[var(--accent)] px-4 py-3 text-[14px] font-medium text-white shadow-[0_8px_18px_rgba(36,55,77,0.12)] transition disabled:cursor-not-allowed disabled:bg-[#d9dde1] disabled:text-[#8d96a0] disabled:shadow-none"
        >
          {recordState === "processing" ? "正在整理梦境碎片..." : "确认整理梦境"}
        </button>
      </div>
    </div>
  );
}
