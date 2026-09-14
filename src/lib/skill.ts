import { SKILL_LEVELS } from "./types";

export function levelLabel(level: number): string {
  return SKILL_LEVELS.find((l) => l.value === level)?.label ?? String(level);
}

export function levelColor(level: number): string {
  if (level <= 2) return "bg-red-100 text-red-700";
  if (level === 3) return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}
