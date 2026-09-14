import { getSkillChecks, getLatestSkillLevels } from "@/lib/data";
import { SKILL_CATEGORIES, type SkillCategory } from "@/lib/types";
import { createSkillCheckAction, deleteSkillCheckAction } from "@/lib/actions";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { levelLabel, levelColor } from "@/lib/skill";
import { SkillCheckForm } from "./SkillCheckForm";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export async function SkillCheckSection({
  studentId,
}: {
  studentId: number;
}) {
  const checks = getSkillChecks(studentId);
  const latest = getLatestSkillLevels(studentId);
  const action = createSkillCheckAction.bind(null, studentId);

  const latestLevels: Partial<Record<SkillCategory, number>> = {};
  for (const cat of SKILL_CATEGORIES) {
    const check = latest[cat.key];
    if (check) latestLevels[cat.key] = check.level;
  }

  return (
    <div className="space-y-6">
      <SkillCheckForm
        latestLevels={latestLevels}
        todayStr={todayStr()}
        action={action}
      />

      <ul className="space-y-3">
        {checks.length === 0 && (
          <p className="text-sm text-neutral-500">등록된 실력 체크 기록이 없습니다.</p>
        )}
        {checks.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-neutral-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{c.checked_date}</span>
                <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                  {SKILL_CATEGORIES.find((x) => x.key === c.category)?.label}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${levelColor(
                    c.level
                  )}`}
                >
                  {levelLabel(c.level)}
                </span>
              </div>
              <form
                action={deleteSkillCheckAction.bind(null, studentId, c.id)}
              >
                <ConfirmSubmitButton className="text-xs text-neutral-400 hover:text-red-500">
                  삭제
                </ConfirmSubmitButton>
              </form>
            </div>
            {c.note && (
              <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">
                {c.note}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
