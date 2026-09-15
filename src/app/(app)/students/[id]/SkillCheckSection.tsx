import { getSkillChecks, getLatestSkillLevels } from "@/lib/data";
import { SKILL_CATEGORIES, SKILL_LEVELS, type SkillCategory } from "@/lib/types";
import {
  createSkillCheckAction,
  updateSkillCheckAction,
  deleteSkillCheckAction,
} from "@/lib/actions";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import {
  EditableItem,
  EditTrigger,
  CancelEditButton,
} from "@/components/EditableItem";
import { levelLabel, levelColor } from "@/lib/skill";
import { SkillCheckForm } from "./SkillCheckForm";
import type { SkillCheck } from "@/lib/types";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function SkillCheckEditFields({ check }: { check: SkillCheck }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          카테고리
        </label>
        <select
          name="category"
          defaultValue={check.category}
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
          defaultValue={check.checked_date}
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
                defaultChecked={lvl.value === check.level}
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
          defaultValue={check.note ?? ""}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
    </>
  );
}

export async function SkillCheckSection({
  studentId,
}: {
  studentId: number;
}) {
  const checks = await getSkillChecks(studentId);
  const latest = await getLatestSkillLevels(studentId);
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
          <EditableItem
            key={c.id}
            view={
              <li className="rounded-lg border border-neutral-200 bg-white p-4">
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
                  <div className="flex items-center gap-2">
                    <EditTrigger className="text-xs text-neutral-400 hover:text-neutral-700">
                      수정
                    </EditTrigger>
                    <form
                      action={deleteSkillCheckAction.bind(null, studentId, c.id)}
                    >
                      <ConfirmSubmitButton className="text-xs text-neutral-400 hover:text-red-500">
                        삭제
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </div>
                {c.note && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">
                    {c.note}
                  </p>
                )}
              </li>
            }
            editForm={
              <li className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <form
                  action={updateSkillCheckAction.bind(null, studentId, c.id)}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  <SkillCheckEditFields check={c} />
                  <div className="flex gap-2 sm:col-span-2">
                    <button
                      type="submit"
                      className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
                    >
                      저장
                    </button>
                    <CancelEditButton className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                      취소
                    </CancelEditButton>
                  </div>
                </form>
              </li>
            }
          />
        ))}
      </ul>
    </div>
  );
}
