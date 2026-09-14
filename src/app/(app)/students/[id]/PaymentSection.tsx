import { getPayments } from "@/lib/data";
import { createPaymentAction, deletePaymentAction } from "@/lib/actions";
import { getNextPaymentDate } from "@/lib/payment";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export async function PaymentSection({
  studentId,
  paymentDay,
}: {
  studentId: number;
  paymentDay: number | null;
}) {
  const payments = getPayments(studentId);
  const action = createPaymentAction.bind(null, studentId);
  const nextDue = paymentDay ? getNextPaymentDate(paymentDay) : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
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
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            결제일 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="paid_date"
            defaultValue={todayStr()}
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
            placeholder="결제 방법, 특이사항 등"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
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
              <tr key={p.id} className="border-t border-neutral-100">
                <td className="px-4 py-2 whitespace-nowrap">{p.paid_date}</td>
                <td className="px-4 py-2 whitespace-nowrap font-medium">
                  {p.amount.toLocaleString()}원
                </td>
                <td className="px-4 py-2">{p.period || "-"}</td>
                <td className="px-4 py-2 text-neutral-600">{p.memo || "-"}</td>
                <td className="px-4 py-2 text-right">
                  <form action={deletePaymentAction.bind(null, studentId, p.id)}>
                    <ConfirmSubmitButton className="text-xs text-neutral-400 hover:text-red-500">
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
