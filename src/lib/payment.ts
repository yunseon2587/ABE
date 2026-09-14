function clampDay(year: number, month0: number, day: number): number {
  const lastDayOfMonth = new Date(year, month0 + 1, 0).getDate();
  return Math.min(day, lastDayOfMonth);
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
  const mm = String(targetMonth + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${targetYear}-${mm}-${dd}`;
}
