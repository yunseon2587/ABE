import Link from "next/link";
import { getStudents, getUpcomingConsultations } from "@/lib/data";
import { UNGROUPED_GRADE_LABEL, compareGrades } from "@/lib/grade";

export default function HomePage() {
  const students = getStudents();
  const upcoming = getUpcomingConsultations(8);

  const gradeCounts = new Map<string, number>();
  for (const s of students) {
    const key = s.grade?.trim() || UNGROUPED_GRADE_LABEL;
    gradeCounts.set(key, (gradeCounts.get(key) ?? 0) + 1);
  }
  const sortedGradeCounts = Array.from(gradeCounts.entries()).sort((a, b) =>
    compareGrades(a[0], b[0])
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="mt-1 text-sm text-neutral-500">
          왼쪽 사이드바에서 학년별로 학생을 찾아 상담·실력체크·주간테스트를 관리하세요.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="text-sm text-neutral-500">전체 학생</div>
          <div className="mt-1 text-3xl font-bold">{students.length}명</div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5 sm:col-span-2">
          <div className="text-sm text-neutral-500">학년별 인원</div>
          {gradeCounts.size === 0 ? (
            <p className="mt-2 text-sm text-neutral-400">등록된 학생이 없습니다.</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {sortedGradeCounts.map(([grade, count]) => (
                <span
                  key={grade}
                  className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-900"
                >
                  {grade} {count}명
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">다가오는 상담 예정</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">
            예정된 상담이 없습니다. 학생 페이지에서 상담 예정을 등록해보세요.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-neutral-100">
            {upcoming.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2">
                <div>
                  <Link
                    href={`/students/${c.student_id}`}
                    className="font-medium text-neutral-800 hover:underline"
                  >
                    {c.student_name}
                  </Link>
                  <p className="text-sm text-neutral-500">{c.content}</p>
                </div>
                <span className="shrink-0 text-sm text-neutral-500">
                  {c.consult_date}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {students.length === 0 && (
        <Link
          href="/students/new"
          className="inline-block rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          + 첫 학생 등록하기
        </Link>
      )}
    </div>
  );
}
