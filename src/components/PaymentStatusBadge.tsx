import type { PaymentStatusInfo } from "@/lib/payment";

export function PaymentStatusBadge({ status }: { status: PaymentStatusInfo }) {
  if (status.status === "no_schedule") {
    return null;
  }

  if (status.status === "paid") {
    return (
      <span className="inline-block rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
        이번 달 결제 완료
      </span>
    );
  }

  if (status.overdueDays > 0) {
    return (
      <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
        연체 {status.overdueDays}일째
      </span>
    );
  }

  return (
    <span className="inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
      결제일 (오늘)
    </span>
  );
}
