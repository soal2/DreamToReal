import type { ReactNode } from "react";
import { Battery, CloudRain, FilePenLine, Heart, Menu, Mountain, Search, Signal, Sparkles, Sun, Wifi } from "lucide-react";
import { DreamCard } from "../components/DreamCard";
import { formatGroupDate, getMarkerIcon, getPaletteClass, getWeekdayLabel } from "../lib/dreamDerived";
import type { DreamListItem } from "../types/dream";

type ArchiveFallback = DreamListItem & {
  archiveWeekday?: string;
  archiveTags: string[];
  thumbnailClassName: string;
  marker: ReactNode;
};

const fallbackDreams: ArchiveFallback[] = [
  {
    id: "archive-exam",
    title: "迟到的考试",
    image_url: "",
    keywords: ["考试", "教室", "紧张"],
    emotions: ["紧张", "追赶"],
    scenes: ["教室"],
    status: "organized",
    created_at: "2026-06-28T07:32:00Z",
    archiveTags: ["考试", "教室", "紧张"],
    marker: <Sun size={15} strokeWidth={1.8} />,
    thumbnailClassName:
      "bg-[radial-gradient(circle_at_18%_25%,rgba(255,255,255,.85),transparent_23%),radial-gradient(circle_at_74%_22%,rgba(219,194,132,.72),transparent_32%),linear-gradient(135deg,#dbe6e8,#b8c7bd_52%,#718274)]",
  },
  {
    id: "archive-old-house",
    title: "在老房子里找门",
    image_url: "",
    keywords: ["走廊", "找不到门", "焦虑"],
    emotions: ["焦虑", "怀旧"],
    scenes: ["老房子"],
    status: "organized",
    created_at: "2026-06-27T06:48:00Z",
    archiveWeekday: "周四",
    archiveTags: ["走廊", "找不到门", "焦虑"],
    marker: <CloudRain size={15} strokeWidth={1.8} />,
    thumbnailClassName:
      "bg-[radial-gradient(circle_at_72%_38%,rgba(244,224,183,.86),transparent_30%),radial-gradient(circle_at_20%_56%,rgba(89,69,51,.62),transparent_34%),linear-gradient(90deg,#7a6654,#d8c7aa_48%,#aa9275)]",
  },
  {
    id: "archive-bus",
    title: "雨天的公交站",
    image_url: "",
    keywords: ["下雨", "等车", "陌生人"],
    emotions: ["安静", "等待"],
    scenes: ["公交站"],
    status: "organized",
    created_at: "2026-06-26T07:10:00Z",
    archiveWeekday: "周三",
    archiveTags: ["下雨", "等车", "陌生人"],
    marker: <CloudRain size={15} strokeWidth={1.8} />,
    thumbnailClassName:
      "bg-[radial-gradient(circle_at_76%_28%,rgba(236,222,174,.58),transparent_22%),radial-gradient(circle_at_28%_72%,rgba(65,87,96,.56),transparent_35%),linear-gradient(135deg,#c8d5d9,#758996_58%,#d5dde0)]",
  },
  {
    id: "archive-mall",
    title: "商场迷路",
    image_url: "",
    keywords: ["商场", "电梯", "寻找出口"],
    emotions: ["迷茫", "寻找"],
    scenes: ["商场"],
    status: "organized",
    created_at: "2026-06-25T06:55:00Z",
    archiveWeekday: "周二",
    archiveTags: ["商场", "电梯", "寻找出口"],
    marker: <CloudRain size={15} strokeWidth={1.8} />,
    thumbnailClassName:
      "bg-[radial-gradient(circle_at_52%_18%,rgba(181,211,214,.75),transparent_24%),radial-gradient(circle_at_18%_72%,rgba(207,180,132,.42),transparent_30%),linear-gradient(135deg,#efe4cf,#f8f2e7_48%,#d8c3a5)]",
  },
  {
    id: "archive-family",
    title: "和家人吃饭",
    image_url: "",
    keywords: ["家人", "晚餐", "温暖"],
    emotions: ["温暖", "安心"],
    scenes: ["餐桌"],
    status: "organized",
    created_at: "2026-06-24T07:05:00Z",
    archiveWeekday: "周一",
    archiveTags: ["家人", "晚餐", "温暖"],
    marker: <CloudRain size={15} strokeWidth={1.8} />,
    thumbnailClassName:
      "bg-[radial-gradient(circle_at_52%_48%,rgba(241,195,109,.88),transparent_24%),radial-gradient(circle_at_18%_32%,rgba(114,77,48,.58),transparent_28%),linear-gradient(135deg,#2f261f,#9d7041_56%,#38271c)]",
  },
];

type GroupedItem = DreamListItem & {
  archiveWeekday?: string;
  archiveTags?: string[];
  thumbnailClassName?: string;
  marker?: ReactNode;
};

export function Archive({ dreams, onSelectDream }: { dreams: DreamListItem[]; onSelectDream: (dream: DreamListItem) => void }) {
  const items: GroupedItem[] = dreams.length > 0 ? dreams : fallbackDreams;

  const groupsMap = new Map<string, GroupedItem[]>();
  for (const item of items) {
    const key = formatGroupDate(item.created_at);
    const arr = groupsMap.get(key) ?? [];
    arr.push(item);
    groupsMap.set(key, arr);
  }
  const orderedGroups = Array.from(groupsMap.entries()).sort(([, a], [, b]) => {
    return new Date(b[0].created_at).getTime() - new Date(a[0].created_at).getTime();
  });

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
          <p className="mt-1.5 text-[13px] text-[#87919d]">最近 7 天记录了 {items.length} 个梦</p>
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
            <p className="mt-1.5 text-[16px] font-semibold text-[var(--text)]">{items.length} 个梦</p>
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
            <p className="mt-1 text-[11px] text-[#8f98a4]">{items.length} 个梦境</p>
          </div>
        </div>
        <div className="mt-4 border-t border-[#eeeae6] pt-2.5 text-center text-[12.5px] font-medium text-[#7b8591]">查看洞察详情 ›</div>
      </section>

      {orderedGroups.map(([group, groupDreams]) => {
        const first = groupDreams[0];
        const weekday = first.archiveWeekday ?? (group !== "今天" && group !== "昨天" ? getWeekdayLabel(first.created_at) : "");
        return (
          <section key={group} className="space-y-2.5">
            <div className="flex items-center gap-3 px-1">
              <h2 className="text-[15px] font-semibold text-[var(--text)]">{group}</h2>
              {weekday && <span className="text-[12px] text-[#7e8997]">{weekday}</span>}
              <span className="rounded-[6px] bg-[#eef0f1] px-2 py-0.5 text-[11px] font-medium text-[#7f8995]">{groupDreams.length}</span>
            </div>
            <div className="space-y-2.5">
              {groupDreams.map((dream) => (
                <DreamCard
                  key={dream.id}
                  dream={dream}
                  onClick={() => onSelectDream(dream)}
                  tags={dream.archiveTags ?? dream.keywords}
                  thumbnailClassName={dream.thumbnailClassName ?? getPaletteClass({ keywords: dream.keywords, scenes: dream.scenes })}
                  marker={dream.marker ?? getMarkerIcon({ keywords: dream.keywords, scenes: dream.scenes })}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
