import { getSchoolExams } from "@/lib/data";
import {
  createSchoolExamAction,
  updateSchoolExamAction,
  deleteSchoolExamAction,
} from "@/lib/actions";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import {
  EditableItem,
  EditTrigger,
  CancelEditButton,
} from "@/components/EditableItem";
import { ScoreLineChart } from "@/components/ScoreLineChart";
import type { SchoolExam } from "@/lib/types";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function ExamFields({ exam }: { exam?: SchoolExam }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          시험 날짜 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="exam_date"
          defaultValue={exam?.exam_date ?? todayStr()}
          required
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          시험명
        </label>
        <input
          name="exam_name"
          defaultValue={exam?.exam_name ?? ""}
          placeholder="예: 중간고사 영어, 기말고사 영어"
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
          defaultValue={exam?.score}
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
          defaultValue={exam?.total_score ?? 100}
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
          defaultValue={exam?.note ?? ""}
          placeholder="틀린 유형, 등급/석차 등"
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
    </>
  );
}

export async function SchoolExamSection({ studentId }: { studentId: number }) {
  const exams = getSchoolExams(studentId);
  const createAction = createSchoolExamAction.bind(null, studentId);

  const chartPoints = exams
    .slice()
    .sort((a, b) => a.exam_date.localeCompare(b.exam_date))
    .map((e) => ({
      date: e.exam_date,
      percent: (e.score / e.total_score) * 100,
      label: `${e.exam_date} ${e.exam_name || ""} ${e.score}/${e.total_score}점`.trim(),
    }));

  return (
    <div className="space-y-6">
      <p className="text-sm text-neutral-500">
        학원 자체 테스트가 아닌, 실제 학교에서 본 시험 성적을 기록하고 추이를 그래프로 확인하세요.
      </p>

      <ScoreLineChart points={chartPoints} />

      <form
        action={createAction}
        className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-2"
      >
        <ExamFields />
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            시험 성적 추가
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
            {exams.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                  등록된 학교 시험 성적이 없습니다.
                </td>
              </tr>
            )}
            {exams
              .slice()
              .sort((a, b) => b.exam_date.localeCompare(a.exam_date))
              .map((e) => (
                <EditableItem
                  key={e.id}
                  view={
                    <tr className="border-t border-neutral-100">
                      <td className="px-4 py-2 whitespace-nowrap">{e.exam_date}</td>
                      <td className="px-4 py-2">{e.exam_name || "-"}</td>
                      <td className="px-4 py-2 whitespace-nowrap font-medium">
                        {e.score} / {e.total_score}
                      </td>
                      <td className="px-4 py-2 text-neutral-600">{e.note || "-"}</td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">
                        <EditTrigger className="mr-2 text-xs text-neutral-400 hover:text-neutral-700">
                          수정
                        </EditTrigger>
                        <form
                          className="inline"
                          action={deleteSchoolExamAction.bind(null, studentId, e.id)}
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
                          action={updateSchoolExamAction.bind(null, studentId, e.id)}
                          className="grid gap-3 sm:grid-cols-2"
                        >
                          <ExamFields exam={e} />
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
