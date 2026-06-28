import type { Dream } from "../types/dream";

export const mockDreams: Dream[] = [
  {
    id: "dream-0648",
    title: "玻璃电梯里的海",
    raw_text:
      "梦见自己在透明电梯里，外面全是海，楼很高。好像有朋友在远处叫我，但声音被水隔开了。我有点紧张，也觉得很漂亮。",
    organized_text:
      "你站在一座很高的玻璃电梯里，城市慢慢沉入一片安静的海。电梯没有下坠，反而像灯塔一样缓慢上升。你看见旧朋友在对岸挥手，却听不见声音，只能从水面的倒影里读懂他们想说的话。",
    image_prompt: "一座透明玻璃电梯漂浮在静谧的海面之上，城市轮廓沉入水下，柔和清晨光线，写实电影感。",
    image_url: "",
    keywords: ["玻璃电梯", "海", "朋友"],
    emotions: ["安静", "悬浮", "轻微不安"],
    scenes: ["电梯", "海面"],
    source: "voice",
    status: "organized",
    created_at: "2026-06-28T06:48:00Z",
    updated_at: "2026-06-28T06:48:00Z",
    audio: {
      name: "梦境录音_06-48.webm",
      duration: "00:18",
      size: "248 KB",
      storage: "本地保存",
    },
  },
  {
    id: "dream-2316",
    title: "会发光的旧车站",
    raw_text: "旧车站，像小时候回家的那个地方。有列车但没人，票上写着老家的街名。",
    organized_text:
      "一座废弃车站在夜里亮起暖黄色的灯，月台上停着没有编号的列车。你拿着一张被雨水打湿的票，忽然发现目的地写着小时候住过的街道。",
    image_prompt: "废弃旧车站夜景，暖黄灯光，无人月台，潮湿雨后氛围，怀旧色调。",
    image_url: "",
    keywords: ["旧车站", "列车", "童年"],
    emotions: ["怀旧", "温暖", "潮湿"],
    scenes: ["车站", "月台"],
    source: "text",
    status: "organized",
    created_at: "2026-06-27T23:16:00Z",
    updated_at: "2026-06-27T23:16:00Z",
  },
  {
    id: "dream-0812",
    title: "纸鸟穿过会议室",
    raw_text: "开会时白板变成天空，纸鸟飞出来，像很多没说的话。",
    organized_text:
      "会议室的白板变成天空，许多纸折的鸟从投影幕里飞出来。每只鸟翅膀上都有一句你没有说出口的话，它们绕着天花板飞，最后落在你的掌心。",
    image_prompt: "会议室白板变成天空，纸折的鸟从屏幕飞出，柔和明亮室内光线，超现实风格。",
    image_url: "",
    keywords: ["会议室", "纸鸟", "对话"],
    emotions: ["压抑后的释放"],
    scenes: ["会议室", "室内天空"],
    source: "text",
    status: "organized",
    created_at: "2026-06-25T08:12:00Z",
    updated_at: "2026-06-25T08:12:00Z",
  },
];
