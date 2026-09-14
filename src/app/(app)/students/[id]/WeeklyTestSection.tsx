import { getWeeklyTests } from "@/lib/data";
import {
  createWeeklyTestAction,
  updateWeeklyTestAction,
  deleteWeeklyTestAction,
} from "@/lib/actions";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import {
  EditableItem,
  EditTrigger,
  CancelEditButton,
} from "@/components/EditableItem";
import type { WeeklyTest } from "@/lib/types";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function TestFields({ test }: { test?: WeeklyTest }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          시험 날짜
        </label>
        <input
          type="date"
          name="test_date"
          defaultValue={test?.test_date ?? todayStr()}
          required
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          시험명 / 범위
        </label>
        <input
          name="test_name"
          defaultValue={test?.test_name ?? ""}
          placeholder="예: 3주차 단어시험, Unit 5 문법"
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          점수 <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="0.5"
          name="score"
          defaultValue={test?.score}
          required
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          만점
        </label>
        <input
          type="number"
          step="0.5"
          name="total_score"
          defaultValue={test?.total_score ?? 100}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-neutral-700">
          메모
        </label>
        <textarea
          name="note"
          rows={2}
          defaultValue={test?.note ?? ""}
          placeholder="틀린 유형, 특이사항 등"
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
    </>
  );
}

export async function WeeklyTestSection({
  studentId,
}: {
  studentId: number;
}) {
  const tests = getWeeklyTests(studentId);
  const createAction = createWeeklyTestAction.bind(null, studentId);

  const avg =
    tests.length > 0
      ? (
          tests.reduce((sum, t) => sum + t.score / t.total_score, 0) /
          tests.length
        ) * 100
      : null;

  return (
    <div className="space-y-6">
      {avg !== null && (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
          최근 {tests.length}회 평균 환산 점수:{" "}
          <span className="font-semibold">{avg.toFixed(1)}점</span> (100점 기준)
        </div>
      )}

      <form
        action={createAction}
        className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-2"
      >
        <TestFields />
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            테스트 기록 추가
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-2">날짜</th>
              <th className="px-4 py-2">시험명</th>
              <th className="px-4 py-2">점수</th>
              <th className="px-4 py-2">메모</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {tests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                  등록된 테스트 기록이 없습니다.
                </td>
              </tr>
            )}
            {tests.map((t) => (
              <EditableItem
                key={t.id}
                view={
                  <tr className="border-t border-neutral-100">
                    <td className="px-4 py-2 whitespace-nowrap">{t.test_date}</td>
                    <td className="px-4 py-2">{t.test_name || "-"}</td>
                    <td className="px-4 py-2 whitespace-nowrap font-medium">
                      {t.score} / {t.total_score}
                    </td>
                    <td className="px-4 py-2 text-neutral-600">{t.note || "-"}</td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <EditTrigger className="mr-2 text-xs text-neutral-400 hover:text-neutral-700">
                        수정
                      </EditTrigger>
                      <form
                        className="inline"
                        action={deleteWeeklyTestAction.bind(null, studentId, t.id)}
                      >
                        <ConfirmSubmitButton className="text-xs text-neutral-400 hover:text-red-500">
                          삭제
                        </ConfirmSubmitButton>
                      </form>
                    </td>
                  </tr>
                }
                editForm={
                  <tr className="border-t border-neutral-100 bg-neutral-50">
                    <td colSpan={5} className="p-4">
                      <form
                        action={updateWeeklyTestAction.bind(null, studentId, t.id)}
                        className="grid gap-3 sm:grid-cols-2"
                      >
                        <TestFields test={t} />
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
                    </td>
                  </tr>
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
