import Link from "next/link";

type MakeupCalendarItem = {
  id: number;
  student_id: number;
  student_name: string;
  makeup_date: string | null;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function MakeupCalendar({
  year,
  month,
  items,
}: {
  year: number;
  month: number; // 1-12
  items: MakeupCalendarItem[];
}) {
  const startWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const byDate = new Map<string, MakeupCalendarItem[]>();
  for (const item of items) {
    if (!item.makeup_date) continue;
    if (!byDate.has(item.makeup_date)) byDate.set(item.makeup_date, []);
    byDate.get(item.makeup_date)!.push(item);
  }

  const cells: { day: number | null; key: string | null }[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ day: null, key: null });
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, key: `${year}-${pad(month)}-${pad(d)}` });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, key: null });

  const todayKey = new Date().toISOString().slice(0, 10);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <div className="mb-3 text-sm font-semibold text-neutral-700">
        {year}년 {month}월 보강 일정
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-neutral-400">
        {WEEKDAY_LABELS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          const dayItems = cell.key ? byDate.get(cell.key) ?? [] : [];
          const isToday = cell.key === todayKey;
          return (
            <div
              key={i}
              className={`min-h-16 rounded-md border p-1 text-left ${
                cell.day == null
                  ? "border-transparent"
                  : isToday
                    ? "border-pink-300 bg-pink-50"
                    : "border-neutral-100"
              }`}
            >
              {cell.day != null && (
                <>
                  <div
                    className={`text-[11px] ${
                      isToday ? "font-bold text-pink-700" : "text-neutral-400"
                    }`}
                  >
                    {cell.day}
                  </div>
                  <div className="mt-0.5 space-y-0.5">
                    {dayItems.slice(0, 2).map((it) => (
                      <Link
                        key={it.id}
                        href={`/students/${it.student_id}`}
                        title={it.student_name}
                        className="block truncate rounded bg-amber-100 px-1 py-0.5 text-[10px] text-amber-800 hover:bg-amber-200"
                      >
                        {it.student_name}
                      </Link>
                    ))}
                    {dayItems.length > 2 && (
                      <div className="text-[10px] text-neutral-400">
                        +{dayItems.length - 2}명
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      {items.length === 0 && (
        <p className="mt-3 text-xs text-neutral-400">
          이번 달 예정된 보강이 없습니다.
        </p>
      )}
    </div>
  );
}
