function clampDay(year: number, month0: number, day: number): number {
  const lastDayOfMonth = new Date(year, month0 + 1, 0).getDate();
  return Math.min(day, lastDayOfMonth);
}

function formatDate(year: number, month0: number, day: number): string {
  const mm = String(month0 + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

// 매월 결제일(1~31)을 기준으로, 오늘 이후의 가장 가까운 결제 예정일을 계산한다.
// 월말이 없는 날짜(예: 31일)는 해당 월의 마지막 날로 자동 조정된다.
export function getNextPaymentDate(
  paymentDay: number,
  from: Date = new Date()
): string {
  const year = from.getFullYear();
  const month = from.getMonth();
  const today = from.getDate();

  let targetYear = year;
  let targetMonth = month;
  if (today > paymentDay) {
    targetMonth += 1;
    if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    }
  }

  const day = clampDay(targetYear, targetMonth, paymentDay);
  return formatDate(targetYear, targetMonth, day);
}

// 이번 결제 주기의 결제 예정일: 오늘이거나 이미 지난 날짜 중 가장 최근 결제일.
// (다음 결제일과 반대로, 아직 오지 않은 이번 달 결제일이면 지난달로 되돌아간다.)
export function getCurrentDueDate(
  paymentDay: number,
  from: Date = new Date()
): string {
  const year = from.getFullYear();
  const month = from.getMonth();
  const today = from.getDate();

  let targetYear = year;
  let targetMonth = month;
  if (today < paymentDay) {
    targetMonth -= 1;
    if (targetMonth < 0) {
      targetMonth = 11;
      targetYear -= 1;
    }
  }

  const day = clampDay(targetYear, targetMonth, paymentDay);
  return formatDate(targetYear, targetMonth, day);
}

function daysBetween(dateStrA: string, dateStrB: string): number {
  const [ay, am, ad] = dateStrA.split("-").map(Number);
  const [by, bm, bd] = dateStrB.split("-").map(Number);
  const a = new Date(ay, am - 1, ad).getTime();
  const b = new Date(by, bm - 1, bd).getTime();
  return Math.round((a - b) / 86_400_000);
}

export type PaymentStatus = "no_schedule" | "paid" | "overdue";

export type PaymentStatusInfo = {
  status: PaymentStatus;
  /** 이번 결제 주기의 결제 예정일 (결제일이 설정되지 않았으면 null) */
  dueDate: string | null;
  /** 연체된 일수 (연체가 아니면 0) */
  overdueDays: number;
};

// 학생의 결제일과 가장 최근 결제 기록을 비교해 이번 주기 납부 여부를 판단한다.
export function getPaymentStatus(
  paymentDay: number | null,
  lastPaidDate: string | null,
  from: Date = new Date()
): PaymentStatusInfo {
  if (!paymentDay) {
    return { status: "no_schedule", dueDate: null, overdueDays: 0 };
  }

  const dueDate = getCurrentDueDate(paymentDay, from);
  if (lastPaidDate && lastPaidDate >= dueDate) {
    return { status: "paid", dueDate, overdueDays: 0 };
  }

  const todayStr = formatDate(from.getFullYear(), from.getMonth(), from.getDate());
  const overdueDays = Math.max(daysBetween(todayStr, dueDate), 0);
  return { status: "overdue", dueDate, overdueDays };
}
