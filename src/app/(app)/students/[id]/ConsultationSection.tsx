import { getConsultations } from "@/lib/data";
import {
  createConsultationAction,
  updateConsultationAction,
  deleteConsultationAction,
} from "@/lib/actions";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import {
  EditableItem,
  EditTrigger,
  CancelEditButton,
} from "@/components/EditableItem";
import type { Consultation } from "@/lib/types";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function ConsultationFields({ consultation }: { consultation?: Consultation }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          날짜
        </label>
        <input
          type="date"
          name="consult_date"
          defaultValue={consultation?.consult_date ?? todayStr()}
          required
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          구분
        </label>
        <select
          name="status"
          defaultValue={consultation?.status ?? "completed"}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="completed">상담 완료</option>
          <option value="planned">상담 예정</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-neutral-700">
          상담 내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          required
          rows={3}
          defaultValue={consultation?.content ?? ""}
          placeholder="상담 내용 또는 상담 예정 안건을 적어주세요."
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-neutral-700">
          다음 계획 / 후속 조치
        </label>
        <textarea
          name="next_plan"
          rows={2}
          defaultValue={consultation?.next_plan ?? ""}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
    </>
  );
}

export async function ConsultationSection({
  studentId,
}: {
  studentId: number;
}) {
  const consultations = await getConsultations(studentId);
  const createAction = createConsultationAction.bind(null, studentId);

  return (
    <div className="space-y-6">
      <form
        action={createAction}
        className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-2"
      >
        <ConsultationFields />
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            상담 기록 추가
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {consultations.length === 0 && (
          <p className="text-sm text-neutral-500">등록된 상담 기록이 없습니다.</p>
        )}
        {consultations.map((c) => (
          <EditableItem
            key={c.id}
            view={
              <li className="rounded-lg border border-neutral-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{c.consult_date}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        c.status === "planned"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {c.status === "planned" ? "상담 예정" : "상담 완료"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EditTrigger className="text-xs text-neutral-400 hover:text-neutral-700">
                      수정
                    </EditTrigger>
                    <form
                      action={deleteConsultationAction.bind(null, studentId, c.id)}
                    >
                      <ConfirmSubmitButton className="text-xs text-neutral-400 hover:text-red-500">
                        삭제
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">
                  {c.content}
                </p>
                {c.next_plan && (
                  <p className="mt-2 whitespace-pre-wrap rounded bg-neutral-50 p-2 text-xs text-neutral-600">
                    다음 계획: {c.next_plan}
                  </p>
                )}
              </li>
            }
            editForm={
              <li className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <form
                  action={updateConsultationAction.bind(null, studentId, c.id)}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  <ConsultationFields consultation={c} />
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
