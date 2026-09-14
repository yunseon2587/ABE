import { getMakeupClasses } from "@/lib/data";
import {
  createMakeupClassAction,
  updateMakeupClassAction,
  deleteMakeupClassAction,
} from "@/lib/actions";
import { getMakeupStatus } from "@/lib/makeup";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import {
  EditableItem,
  EditTrigger,
  CancelEditButton,
} from "@/components/EditableItem";
import { MakeupStatusBadge } from "@/components/MakeupStatusBadge";
import type { MakeupClass } from "@/lib/types";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function MakeupFields({ item }: { item?: MakeupClass }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          결석일 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="absence_date"
          defaultValue={item?.absence_date ?? todayStr()}
          required
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          보강일 (미정이면 비워두기)
        </label>
        <input
          type="date"
          name="makeup_date"
          defaultValue={item?.makeup_date ?? ""}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-neutral-700">
          메모
        </label>
        <textarea
          name="memo"
          rows={2}
          defaultValue={item?.memo ?? ""}
          placeholder="결석 사유, 보강 시간/내용 등"
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
    </>
  );
}

export async function MakeupClassSection({ studentId }: { studentId: number }) {
  const items = getMakeupClasses(studentId);
  const createAction = createMakeupClassAction.bind(null, studentId);
  const today = todayStr();

  return (
    <div className="space-y-6">
      <form
        action={createAction}
        className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-2"
      >
        <MakeupFields />
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            결석/보강 기록 추가
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-neutral-500">등록된 결석/보강 기록이 없습니다.</p>
        )}
        {items.map((item) => {
          const status = getMakeupStatus(item.makeup_date, today);
          return (
            <EditableItem
              key={item.id}
              view={
                <li className="rounded-lg border border-neutral-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        결석 {item.absence_date}
                      </span>
                      <span className="text-sm text-neutral-500">
                        → 보강 {item.makeup_date ?? "미정"}
                      </span>
                      <MakeupStatusBadge status={status} />
                    </div>
                    <div className="flex items-center gap-2">
                      <EditTrigger className="text-xs text-neutral-400 hover:text-neutral-700">
                        수정
                      </EditTrigger>
                      <form
                        action={deleteMakeupClassAction.bind(null, studentId, item.id)}
                      >
                        <ConfirmSubmitButton className="text-xs text-neutral-400 hover:text-red-500">
                          삭제
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </div>
                  {item.memo && (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">
                      {item.memo}
                    </p>
                  )}
                </li>
              }
              editForm={
                <li className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                  <form
                    action={updateMakeupClassAction.bind(null, studentId, item.id)}
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    <MakeupFields item={item} />
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
          );
        })}
      </ul>
    </div>
  );
}
