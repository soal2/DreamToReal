import { CloudRain, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { createElement } from "react";

const PALETTE_BY_KEYWORD: Record<string, string> = {
  "老房子":
    "bg-[radial-gradient(circle_at_72%_38%,rgba(244,224,183,.86),transparent_30%),radial-gradient(circle_at_20%_56%,rgba(89,69,51,.62),transparent_34%),linear-gradient(90deg,#7a6654,#d8c7aa_48%,#aa9275)]",
  "走廊":
    "bg-[radial-gradient(circle_at_72%_38%,rgba(244,224,183,.86),transparent_30%),radial-gradient(circle_at_20%_56%,rgba(89,69,51,.62),transparent_34%),linear-gradient(90deg,#7a6654,#d8c7aa_48%,#aa9275)]",
  "考试":
    "bg-[radial-gradient(circle_at_18%_25%,rgba(255,255,255,.85),transparent_23%),radial-gradient(circle_at_74%_22%,rgba(219,194,132,.72),transparent_32%),linear-gradient(135deg,#dbe6e8,#b8c7bd_52%,#718274)]",
  "下雨":
    "bg-[radial-gradient(circle_at_76%_28%,rgba(236,222,174,.58),transparent_22%),radial-gradient(circle_at_28%_72%,rgba(65,87,96,.56),transparent_35%),linear-gradient(135deg,#c8d5d9,#758996_58%,#d5dde0)]",
  "公交站":
    "bg-[radial-gradient(circle_at_76%_28%,rgba(236,222,174,.58),transparent_22%),radial-gradient(circle_at_28%_72%,rgba(65,87,96,.56),transparent_35%),linear-gradient(135deg,#c8d5d9,#758996_58%,#d5dde0)]",
  "商场":
    "bg-[radial-gradient(circle_at_52%_18%,rgba(181,211,214,.75),transparent_24%),radial-gradient(circle_at_18%_72%,rgba(207,180,132,.42),transparent_30%),linear-gradient(135deg,#efe4cf,#f8f2e7_48%,#d8c3a5)]",
  "电梯":
    "bg-[radial-gradient(circle_at_52%_18%,rgba(181,211,214,.75),transparent_24%),radial-gradient(circle_at_18%_72%,rgba(207,180,132,.42),transparent_30%),linear-gradient(135deg,#efe4cf,#f8f2e7_48%,#d8c3a5)]",
  "家人":
    "bg-[radial-gradient(circle_at_52%_48%,rgba(241,195,109,.88),transparent_24%),radial-gradient(circle_at_18%_32%,rgba(114,77,48,.58),transparent_28%),linear-gradient(135deg,#2f261f,#9d7041_56%,#38271c)]",
  "晚餐":
    "bg-[radial-gradient(circle_at_52%_48%,rgba(241,195,109,.88),transparent_24%),radial-gradient(circle_at_18%_32%,rgba(114,77,48,.58),transparent_28%),linear-gradient(135deg,#2f261f,#9d7041_56%,#38271c)]",
};

const DEFAULT_PALETTE =
  "bg-[radial-gradient(circle_at_72%_28%,rgba(250,232,186,.85),transparent_25%),radial-gradient(circle_at_48%_70%,rgba(220,206,180,.72),transparent_30%),linear-gradient(90deg,#352d25,#806b53_42%,#e9d4aa_68%,#4d4035)]";

export function getPaletteClass(input: { keywords?: string[]; scenes?: string[] }): string {
  const haystack = [...(input.keywords ?? []), ...(input.scenes ?? [])];
  for (const kw of haystack) {
    if (PALETTE_BY_KEYWORD[kw]) return PALETTE_BY_KEYWORD[kw];
  }
  return DEFAULT_PALETTE;
}

export function getMarkerIcon(input: { keywords?: string[]; scenes?: string[] }): ReactNode {
  const haystack = [...(input.keywords ?? []), ...(input.scenes ?? [])];
  const rainy = haystack.some((k) => ["下雨", "公交站", "雨天", "走廊", "老房子"].includes(k));
  if (rainy) return createElement(CloudRain, { size: 15, strokeWidth: 1.8 });
  return createElement(Sun, { size: 15, strokeWidth: 1.8 });
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function formatTimeLabel(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatDateLabel(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export function formatFullDateLabel(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function formatGroupDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.floor((startOfDay(now) - startOfDay(d)) / 86400000);
  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export function getWeekdayLabel(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const names = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return names[d.getDay()];
}
