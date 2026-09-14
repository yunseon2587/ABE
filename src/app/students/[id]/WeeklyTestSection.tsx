import { getWeeklyTests } from "@/lib/data";
import {
  createWeeklyTestAction,
  deleteWeeklyTestAction,
} from "@/lib/actions";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export async function WeeklyTestSection({
  studentId,
}: {
  studentId: number;
}) {
  const tests = getWeeklyTests(studentId);
  const action = createWeeklyTestAction.bind(null, studentId);

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
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
          최근 {tests.length}회 평균 환산 점수:{" "}
          <span className="font-semibold">{avg.toFixed(1)}점</span> (100점 기준)
        </div>
      )}

      <form
        action={action}
        className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700">
            시험 날짜
          </label>
          <input
            type="date"
            name="test_date"
            defaultValue={todayStr()}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            시험명 / 범위
          </label>
          <input
            name="test_name"
            placeholder="예: 3주차 단어시험, Unit 5 문법"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            점수 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.5"
            name="score"
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            만점
          </label>
          <input
            type="number"
            step="0.5"
            name="total_score"
            defaultValue={100}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            메모
          </label>
          <textarea
            name="note"
            rows={2}
            placeholder="틀린 유형, 특이사항 등"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            테스트 기록 추가
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
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
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  등록된 테스트 기록이 없습니다.
                </td>
              </tr>
            )}
            {tests.map((t) => (
              <tr key={t.id} className="border-t border-slate-100">
                <td className="px-4 py-2 whitespace-nowrap">{t.test_date}</td>
                <td className="px-4 py-2">{t.test_name || "-"}</td>
                <td className="px-4 py-2 whitespace-nowrap font-medium">
                  {t.score} / {t.total_score}
                </td>
                <td className="px-4 py-2 text-slate-600">{t.note || "-"}</td>
                <td className="px-4 py-2 text-right">
                  <form
                    action={deleteWeeklyTestAction.bind(null, studentId, t.id)}
                  >
                    <ConfirmSubmitButton className="text-xs text-slate-400 hover:text-red-500">
                      삭제
                    </ConfirmSubmitButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
