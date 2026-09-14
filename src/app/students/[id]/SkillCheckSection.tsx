import {
  getSkillChecks,
  getLatestSkillLevels,
} from "@/lib/data";
import { SKILL_CATEGORIES, SKILL_LEVELS } from "@/lib/types";
import {
  createSkillCheckAction,
  deleteSkillCheckAction,
} from "@/lib/actions";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function levelLabel(level: number) {
  return SKILL_LEVELS.find((l) => l.value === level)?.label ?? String(level);
}

function levelColor(level: number) {
  if (level <= 2) return "bg-red-100 text-red-700";
  if (level === 3) return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export async function SkillCheckSection({
  studentId,
}: {
  studentId: number;
}) {
  const checks = getSkillChecks(studentId);
  const latest = getLatestSkillLevels(studentId);
  const action = createSkillCheckAction.bind(null, studentId);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SKILL_CATEGORIES.map((cat) => {
          const check = latest[cat.key];
          return (
            <div
              key={cat.key}
              className="rounded-lg border border-slate-200 bg-white p-3 text-center"
            >
              <div className="text-xs font-medium text-slate-500">
                {cat.label}
              </div>
              <div
                className={`mt-1 inline-block rounded px-2 py-0.5 text-sm font-semibold ${
                  check ? levelColor(check.level) : "bg-slate-100 text-slate-400"
                }`}
              >
                {check ? levelLabel(check.level) : "미체크"}
              </div>
            </div>
          );
        })}
      </div>

      <form
        action={action}
        className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700">
            카테고리
          </label>
          <select
            name="category"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {SKILL_CATEGORIES.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            체크 날짜
          </label>
          <input
            type="date"
            name="checked_date"
            defaultValue={todayStr()}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
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
          <label className="block text-sm font-medium text-slate-700">
            메모 (구체적인 부족한 부분)
          </label>
          <textarea
            name="note"
            rows={2}
            placeholder="예: 관계대명사 활용 미숙, 시제 일치 오류 잦음"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            실력 체크 기록
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {checks.length === 0 && (
          <p className="text-sm text-slate-500">등록된 실력 체크 기록이 없습니다.</p>
        )}
        {checks.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{c.checked_date}</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
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
                <ConfirmSubmitButton className="text-xs text-slate-400 hover:text-red-500">
                  삭제
                </ConfirmSubmitButton>
              </form>
            </div>
            {c.note && (
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                {c.note}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
