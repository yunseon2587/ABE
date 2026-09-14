"use client";

import { useState } from "react";
import { SKILL_CATEGORIES, SKILL_LEVELS, type SkillCategory } from "@/lib/types";
import { levelLabel, levelColor } from "@/lib/skill";

export function SkillCheckForm({
  latestLevels,
  todayStr,
  action,
}: {
  latestLevels: Partial<Record<SkillCategory, number>>;
  todayStr: string;
  action: (formData: FormData) => void;
}) {
  const [category, setCategory] = useState<SkillCategory>(
    SKILL_CATEGORIES[0].key
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SKILL_CATEGORIES.map((cat) => {
          const level = latestLevels[cat.key];
          const selected = cat.key === category;
          return (
            <button
              type="button"
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              aria-pressed={selected}
              className={`rounded-lg border p-3 text-center transition ${
                selected
                  ? "border-pink-400 bg-pink-50 ring-1 ring-pink-400"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <div className="text-xs font-medium text-neutral-500">
                {cat.label}
              </div>
              <div
                className={`mt-1 inline-block rounded px-2 py-0.5 text-sm font-semibold ${
                  level != null
                    ? levelColor(level)
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {level != null ? levelLabel(level) : "미체크"}
              </div>
            </button>
          );
        })}
      </div>

      <form
        action={action}
        className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-2"
      >
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            카테고리
          </label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as SkillCategory)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {SKILL_CATEGORIES.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            체크 날짜
          </label>
          <input
            type="date"
            name="checked_date"
            defaultValue={todayStr}
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-700">
            수준
          </label>
          <div className="mt-1 flex flex-wrap gap-3">
            {SKILL_LEVELS.map((lvl) => (
              <label key={lvl.value} className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="level"
                  value={lvl.value}
                  defaultChecked={lvl.value === 3}
                  required
                />
                {lvl.label}
              </label>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-700">
            메모 (구체적인 부족한 부분)
          </label>
          <textarea
            name="note"
            rows={2}
            placeholder="예: 관계대명사 활용 미숙, 시제 일치 오류 잦음"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            실력 체크 기록
          </button>
        </div>
      </form>
    </div>
  );
}
