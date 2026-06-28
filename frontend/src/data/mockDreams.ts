import type { Dream } from '../types/dream';

export const mockDreams: Dream[] = [
  {
    id: 'dream-0648',
    title: '玻璃电梯里的海',
    date: '2026年6月28日',
    time: '06:48',
    groupDate: '今天',
    summary:
      '你站在一座很高的玻璃电梯里，城市慢慢沉入一片安静的海。电梯没有下坠，反而像灯塔一样缓慢上升。你看见旧朋友在对岸挥手，却听不见声音，只能从水面的倒影里读懂他们想说的话。',
    originalText:
      '梦见自己在透明电梯里，外面全是海，楼很高。好像有朋友在远处叫我，但声音被水隔开了。我有点紧张，也觉得很漂亮。',
    tags: ['场景', '人物', '情绪', '对话'],
    mood: '安静、悬浮、轻微不安',
    palette: 'from-cyan-200 via-slate-200 to-indigo-300',
    imageTone: '海面、玻璃、电梯光影',
    audio: {
      name: '梦境录音_06-48.webm',
      duration: '00:18',
      size: '248 KB',
      storage: '本地保存',
    },
  },
  {
    id: 'dream-2316',
    title: '会发光的旧车站',
    date: '2026年6月27日',
    time: '23:16',
    groupDate: '昨天',
    summary:
      '一座废弃车站在夜里亮起暖黄色的灯，月台上停着没有编号的列车。你拿着一张被雨水打湿的票，忽然发现目的地写着小时候住过的街道。',
    originalText:
      '旧车站，像小时候回家的那个地方。有列车但没人，票上写着老家的街名。',
    tags: ['场景', '童年', '情绪'],
    mood: '怀旧、温暖、潮湿',
    palette: 'from-amber-200 via-stone-200 to-teal-200',
    imageTone: '旧车站、暖灯、雨后月台',
  },
  {
    id: 'dream-0812',
    title: '纸鸟穿过会议室',
    date: '2026年6月25日',
    time: '08:12',
    groupDate: '本周',
    summary:
      '会议室的白板变成天空，许多纸折的鸟从投影幕里飞出来。每只鸟翅膀上都有一句你没有说出口的话，它们绕着天花板飞，最后落在你的掌心。',
    originalText:
      '开会时白板变成天空，纸鸟飞出来，像很多没说的话。',
    tags: ['对话', '动作', '情绪'],
    mood: '压抑后的释放',
    palette: 'from-rose-200 via-sky-100 to-violet-200',
    imageTone: '纸鸟、白板、室内天空',
  },
];
