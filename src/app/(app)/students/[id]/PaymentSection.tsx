import { getPayments, getLatestPaymentDate } from "@/lib/data";
import {
  createPaymentAction,
  updatePaymentAction,
  deletePaymentAction,
} from "@/lib/actions";
import { getNextPaymentDate, getPaymentStatus } from "@/lib/payment";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import {
  EditableItem,
  EditTrigger,
  CancelEditButton,
} from "@/components/EditableItem";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import type { Payment } from "@/lib/types";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function PaymentFields({ payment }: { payment?: Payment }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          결제일 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="paid_date"
          defaultValue={payment?.paid_date ?? todayStr()}
          required
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          금액 <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="1000"
          name="amount"
          defaultValue={payment?.amount}
          required
          placeholder="예: 300000"
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-neutral-700">
          수강 기간 / 몇월분
        </label>
        <input
          name="period"
          defaultValue={payment?.period ?? ""}
          placeholder="예: 2026년 9월"
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
          defaultValue={payment?.memo ?? ""}
          placeholder="결제 방법, 특이사항 등"
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
    </>
  );
}

export async function PaymentSection({
  studentId,
  paymentDay,
}: {
  studentId: number;
  paymentDay: number | null;
}) {
  const payments = await getPayments(studentId);
  const action = createPaymentAction.bind(null, studentId);
  const nextDue = paymentDay ? getNextPaymentDate(paymentDay) : null;
  const lastPaidDate = await getLatestPaymentDate(studentId);
  const paymentStatus = getPaymentStatus(paymentDay, lastPaidDate);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <div className="text-xs font-medium text-neutral-500">결제일</div>
          <div className="mt-1 text-lg font-semibold">
            {paymentDay ? `매월 ${paymentDay}일` : "미설정"}
          </div>
          {!paymentDay && (
            <p className="mt-1 text-xs text-neutral-400">
              위 &quot;학생 정보 수정&quot;에서 결제일을 등록해보세요.
            </p>
          )}
        </div>
        <div
          className={`rounded-lg border p-4 ${
            paymentStatus.status === "overdue"
              ? "border-red-200 bg-red-50"
              : "border-neutral-200 bg-white"
          }`}
        >
          <div className="text-xs font-medium text-neutral-500">납부 상태</div>
          <div className="mt-1">
            {paymentStatus.status === "no_schedule" ? (
              <span className="text-sm text-neutral-400">-</span>
            ) : (
              <PaymentStatusBadge status={paymentStatus} />
            )}
          </div>
        </div>
        <div className="rounded-lg border border-pink-200 bg-pink-50 p-4">
          <div className="text-xs font-medium text-pink-900">다음 결제 예정일</div>
          <div className="mt-1 text-lg font-semibold text-pink-900">
            {nextDue ?? "-"}
          </div>
        </div>
      </div>

      <form
        action={action}
        className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-2"
      >
        <PaymentFields />
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            결제 기록 추가
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-2">결제일</th>
              <th className="px-4 py-2">금액</th>
              <th className="px-4 py-2">수강 기간</th>
              <th className="px-4 py-2">메모</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                  등록된 결제 기록이 없습니다.
                </td>
              </tr>
            )}
            {payments.map((p) => (
              <EditableItem
                key={p.id}
                view={
                  <tr className="border-t border-neutral-100">
                    <td className="px-4 py-2 whitespace-nowrap">{p.paid_date}</td>
                    <td className="px-4 py-2 whitespace-nowrap font-medium">
                      {p.amount.toLocaleString()}원
                    </td>
                    <td className="px-4 py-2">{p.period || "-"}</td>
                    <td className="px-4 py-2 text-neutral-600">{p.memo || "-"}</td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <EditTrigger className="mr-2 text-xs text-neutral-400 hover:text-neutral-700">
                        수정
                      </EditTrigger>
                      <form
                        className="inline"
                        action={deletePaymentAction.bind(null, studentId, p.id)}
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
                        action={updatePaymentAction.bind(null, studentId, p.id)}
                        className="grid gap-3 sm:grid-cols-2"
                      >
                        <PaymentFields payment={p} />
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
