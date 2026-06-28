import { Battery, CloudRain, FilePenLine, Heart, Menu, Mountain, Search, Signal, Sparkles, Sun, Wifi } from 'lucide-react';
import { DreamCard } from '../components/DreamCard';
import type { Dream } from '../types/dream';

type ArchiveDream = Dream & {
  archiveDateLabel: string;
  archiveWeekday?: string;
  archiveTags: string[];
  thumbnailClassName: string;
  marker: React.ReactNode;
};

const archiveDreams: ArchiveDream[] = [
  {
    id: 'archive-exam',
    title: '迟到的考试',
    date: '2026年6月28日',
    time: '07:32',
    groupDate: '今天',
    archiveDateLabel: '今天',
    summary: '你赶到一间陌生教室，考试已经开始。窗边的阳光很亮，桌面上却找不到自己的试卷。',
    originalText: '梦见考试迟到，教室很大，我一直找不到位置。',
    tags: ['情绪', '场景', '动作'],
    archiveTags: ['考试', '教室', '紧张'],
    mood: '紧张、追赶',
    palette: 'from-slate-200 to-sky-100',
    imageTone: '清晨教室',
    marker: <Sun size={15} strokeWidth={1.8} />,
    thumbnailClassName:
      'bg-[radial-gradient(circle_at_18%_25%,rgba(255,255,255,.85),transparent_23%),radial-gradient(circle_at_74%_22%,rgba(219,194,132,.72),transparent_32%),linear-gradient(135deg,#dbe6e8,#b8c7bd_52%,#718274)]',
  },
  {
    id: 'archive-old-house',
    title: '在老房子里找门',
    date: '2026年6月27日',
    time: '06:48',
    groupDate: '6月27日',
    archiveDateLabel: '6月27日',
    archiveWeekday: '周四',
    summary: '老房子的走廊很长，你沿着墙边摸索，门像被藏起来一样。尽头有一束暖光，但你一直绕回原处。',
    originalText: '在老房子里找门，走廊很窄，感觉有点焦虑。',
    tags: ['场景', '情绪', '动作'],
    archiveTags: ['走廊', '找不到门', '焦虑'],
    mood: '焦虑、怀旧',
    palette: 'from-stone-200 to-amber-100',
    imageTone: '老房走廊',
    marker: <CloudRain size={15} strokeWidth={1.8} />,
    thumbnailClassName:
      'bg-[radial-gradient(circle_at_72%_38%,rgba(244,224,183,.86),transparent_30%),radial-gradient(circle_at_20%_56%,rgba(89,69,51,.62),transparent_34%),linear-gradient(90deg,#7a6654,#d8c7aa_48%,#aa9275)]',
  },
  {
    id: 'archive-bus',
    title: '雨天的公交站',
    date: '2026年6月26日',
    time: '07:10',
    groupDate: '6月26日',
    archiveDateLabel: '6月26日',
    archiveWeekday: '周三',
    summary: '雨水把街道变得模糊，你站在公交站台等一辆没有线路号的车。身边的人都很安静。',
    originalText: '雨天公交站，等车，旁边很多陌生人。',
    tags: ['场景', '人物', '情绪'],
    archiveTags: ['下雨', '等车', '陌生人'],
    mood: '安静、等待',
    palette: 'from-slate-300 to-cyan-100',
    imageTone: '雨中站台',
    marker: <CloudRain size={15} strokeWidth={1.8} />,
    thumbnailClassName:
      'bg-[radial-gradient(circle_at_76%_28%,rgba(236,222,174,.58),transparent_22%),radial-gradient(circle_at_28%_72%,rgba(65,87,96,.56),transparent_35%),linear-gradient(135deg,#c8d5d9,#758996_58%,#d5dde0)]',
  },
  {
    id: 'archive-mall',
    title: '商场迷路',
    date: '2026年6月25日',
    time: '06:55',
    groupDate: '6月25日',
    archiveDateLabel: '6月25日',
    archiveWeekday: '周二',
    summary: '商场的灯很亮，你从一层走到另一层，出口标识不断变化。电梯门打开后还是同一条走廊。',
    originalText: '在商场里迷路，找不到出口，一直坐电梯。',
    tags: ['场景', '动作', '情绪'],
    archiveTags: ['商场', '电梯', '寻找出口'],
    mood: '迷茫、寻找',
    palette: 'from-amber-100 to-slate-100',
    imageTone: '商场中庭',
    marker: <CloudRain size={15} strokeWidth={1.8} />,
    thumbnailClassName:
      'bg-[radial-gradient(circle_at_52%_18%,rgba(181,211,214,.75),transparent_24%),radial-gradient(circle_at_18%_72%,rgba(207,180,132,.42),transparent_30%),linear-gradient(135deg,#efe4cf,#f8f2e7_48%,#d8c3a5)]',
  },
  {
    id: 'archive-family',
    title: '和家人吃饭',
    date: '2026年6月24日',
    time: '07:05',
    groupDate: '6月24日',
    archiveDateLabel: '6月24日',
    archiveWeekday: '周一',
    summary: '一家人围坐在餐桌旁，灯光很暖。你听见很多笑声，却记不清具体说了什么。',
    originalText: '和家人吃饭，饭桌很热闹，灯光暖暖的。',
    tags: ['人物', '情绪', '场景'],
    archiveTags: ['家人', '晚餐', '温暖'],
    mood: '温暖、安心',
    palette: 'from-orange-100 to-stone-200',
    imageTone: '家庭晚餐',
    marker: <CloudRain size={15} strokeWidth={1.8} />,
    thumbnailClassName:
      'bg-[radial-gradient(circle_at_52%_48%,rgba(241,195,109,.88),transparent_24%),radial-gradient(circle_at_18%_32%,rgba(114,77,48,.58),transparent_28%),linear-gradient(135deg,#2f261f,#9d7041_56%,#38271c)]',
  },
];

export function Archive({ dreams, onSelectDream }: { dreams: Dream[]; onSelectDream: (dream: Dream) => void }) {
  const generatedDreams = dreams.filter((dream) => dream.id.startsWith('draft-'));
  const displayDreams: Array<Dream | ArchiveDream> = [...generatedDreams, ...archiveDreams].slice(0, 5);
  const groups = displayDreams.reduce<Record<string, (Dream | ArchiveDream)[]>>((acc, dream) => {
    const key: string = 'archiveDateLabel' in dream ? dream.archiveDateLabel : dream.groupDate;
    acc[key] = acc[key] ? [...acc[key], dream] : [dream];
    return acc;
  }, {});
  const groupOrder = ['今天', '6月27日', '6月26日', '6月25日', '6月24日'];
  const orderedGroups = groupOrder.map((group) => [group, groups[group]] as const).filter(([, groupDreams]) => groupDreams?.length);

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center justify-between px-1 text-black">
        <span className="text-[16px] font-semibold leading-none">9:41</span>
        <div className="flex items-center gap-2">
          <Signal size={17} strokeWidth={3} />
          <Wifi size={17} strokeWidth={3} />
          <Battery size={23} strokeWidth={2.2} />
        </div>
      </div>

      <header className="flex items-start justify-between pt-3">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-[var(--text)]">梦境档案</h1>
          <p className="mt-1.5 text-[13px] text-[#87919d]">最近 7 天记录了 5 个梦</p>
        </div>
        <div className="flex items-center gap-5 pt-2 text-[#242d37]">
          <Search size={22} strokeWidth={1.9} />
          <Menu size={23} strokeWidth={1.9} />
        </div>
      </header>

      <section className="rounded-[18px] border border-[#f0ede9] bg-[#fbfaf8] px-4 py-4 shadow-[0_8px_20px_rgba(31,45,61,0.035)]">
        <div className="grid grid-cols-4 divide-x divide-[#ece8e3] text-center">
          <div className="px-1">
            <div className="mx-auto flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#c8d1db] text-white shadow-[0_8px_18px_rgba(58,78,98,0.13)]">
              <FilePenLine size={24} />
            </div>
            <p className="mt-2.5 text-[11.5px] text-[#758291]">本周记录</p>
            <p className="mt-1.5 text-[16px] font-semibold text-[var(--text)]">5 个梦</p>
          </div>
          <div className="px-1">
            <Heart className="mx-auto text-[#758291]" size={20} strokeWidth={1.7} />
            <p className="mt-3.5 text-[11.5px] text-[#758291]">常见情绪</p>
            <p className="mt-1.5 text-[15px] font-semibold text-[var(--text)]">怀旧</p>
            <p className="mt-1 text-[11px] text-[#8f98a4]">温暖、安心</p>
          </div>
          <div className="px-1">
            <Mountain className="mx-auto text-[#758291]" size={20} strokeWidth={1.7} />
            <p className="mt-3.5 text-[11.5px] text-[#758291]">常见场景</p>
            <p className="mt-1.5 text-[15px] font-semibold text-[var(--text)]">家 / 老房子</p>
            <p className="mt-1 text-[11px] text-[#8f98a4]">走廊、房间</p>
          </div>
          <div className="px-1">
            <Sparkles className="mx-auto text-[#758291]" size={20} strokeWidth={1.7} />
            <p className="mt-3.5 text-[11.5px] text-[#758291]">AI整理状态</p>
            <p className="mt-1.5 text-[15px] font-semibold text-[var(--text)]">已更新</p>
            <p className="mt-1 text-[11px] text-[#8f98a4]">5 个梦境</p>
          </div>
        </div>
        <div className="mt-4 border-t border-[#eeeae6] pt-2.5 text-center text-[12.5px] font-medium text-[#7b8591]">查看洞察详情 ›</div>
      </section>

      {orderedGroups.map(([group, groupDreams]) => {
        const first = groupDreams[0] as ArchiveDream;
        return (
          <section key={group} className="space-y-2.5">
            <div className="flex items-center gap-3 px-1">
              <h2 className="text-[15px] font-semibold text-[var(--text)]">{group}</h2>
              {'archiveWeekday' in first && first.archiveWeekday && <span className="text-[12px] text-[#7e8997]">{first.archiveWeekday}</span>}
              <span className="rounded-[6px] bg-[#eef0f1] px-2 py-0.5 text-[11px] font-medium text-[#7f8995]">{groupDreams.length}</span>
            </div>
            <div className="space-y-2.5">
              {groupDreams.map((dream) => (
                <DreamCard
                  key={dream.id}
                  dream={dream}
                  onClick={() => onSelectDream(dream)}
                  tags={'archiveTags' in dream ? dream.archiveTags : undefined}
                  thumbnailClassName={'thumbnailClassName' in dream ? dream.thumbnailClassName : undefined}
                  marker={'marker' in dream ? dream.marker : undefined}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
