import Link from "next/link";
import {
  getStudents,
  getUpcomingConsultations,
  getProspects,
  getLatestPaymentDatesByStudent,
  getMakeupClassesInRange,
} from "@/lib/data";
import { UNGROUPED_GRADE_LABEL, compareGrades } from "@/lib/grade";
import { getPaymentStatus } from "@/lib/payment";
import {
  createProspectAction,
  setProspectStatusAction,
  deleteProspectAction,
} from "@/lib/actions";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { PhoneInput } from "@/components/PhoneInput";
import { MakeupCalendar } from "@/components/MakeupCalendar";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function toProspectQuery(p: {
  id: number;
  name: string;
  grade: string | null;
  school: string | null;
  phone: string | null;
  parent_phone: string | null;
  memo: string | null;
}) {
  const params = new URLSearchParams({ prospectId: String(p.id), name: p.name });
  if (p.grade) params.set("grade", p.grade);
  if (p.school) params.set("school", p.school);
  if (p.phone) params.set("phone", p.phone);
  if (p.parent_phone) params.set("parent_phone", p.parent_phone);
  if (p.memo) params.set("memo", p.memo);
  return `/students/new?${params.toString()}`;
}

export default async function HomePage() {
  const students = await getStudents();
  const upcomingConsultations = await getUpcomingConsultations(8);
  const plannedProspects = await getProspects("planned");
  const doneProspects = await getProspects("done");

  const gradeCounts = new Map<string, number>();
  for (const s of students) {
    const key = s.grade?.trim() || UNGROUPED_GRADE_LABEL;
    gradeCounts.set(key, (gradeCounts.get(key) ?? 0) + 1);
  }
  const sortedGradeCounts = Array.from(gradeCounts.entries()).sort((a, b) =>
    compareGrades(a[0], b[0])
  );

  const latestPaymentDates = await getLatestPaymentDatesByStudent();
  const overdueStudents = students
    .map((s) => ({
      student: s,
      status: getPaymentStatus(s.payment_day, latestPaymentDates[s.id] ?? null),
    }))
    .filter((x) => x.status.status === "overdue")
    .sort((a, b) => b.status.overdueDays - a.status.overdueDays);

  const now = new Date();
  const calendarYear = now.getFullYear();
  const calendarMonth = now.getMonth() + 1;
  const monthStart = `${calendarYear}-${String(calendarMonth).padStart(2, "0")}-01`;
  const monthEnd = `${calendarYear}-${String(calendarMonth).padStart(2, "0")}-31`;
  const makeupItems = await getMakeupClassesInRange(monthStart, monthEnd);

  type UpcomingItem =
    | {
        kind: "student";
        key: string;
        date: string;
        name: string;
        studentId: number;
        content: string;
      }
    | {
        kind: "prospect";
        key: string;
        date: string;
        name: string;
        prospectId: number;
        content: string;
      };

  const upcoming: UpcomingItem[] = [
    ...upcomingConsultations.map((c): UpcomingItem => ({
      kind: "student",
      key: `student-${c.id}`,
      date: c.consult_date,
      name: c.student_name,
      studentId: c.student_id,
      content: c.content,
    })),
    ...plannedProspects.map((p): UpcomingItem => ({
      kind: "prospect",
      key: `prospect-${p.id}`,
      date: p.consult_date,
      name: p.name,
      prospectId: p.id,
      content: p.memo || "신규 문의 상담",
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));

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

      {overdueStudents.length > 0 && (
        <section className="rounded-lg border border-red-200 bg-red-50 p-5">
          <h2 className="text-lg font-semibold text-red-900">
            결제 미납 · 연체 학생 ({overdueStudents.length}명)
          </h2>
          <ul className="mt-3 divide-y divide-red-100">
            {overdueStudents.map(({ student: s, status }) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2"
              >
                <Link
                  href={`/students/${s.id}`}
                  className="font-medium text-neutral-800 hover:underline"
                >
                  {s.name}
                </Link>
                <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                  {status.overdueDays > 0
                    ? `연체 ${status.overdueDays}일째`
                    : "결제일 (오늘)"}
                  {status.dueDate && ` · 결제일 ${status.dueDate}`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <MakeupCalendar year={calendarYear} month={calendarMonth} items={makeupItems} />

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">다가오는 상담 예정</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">
            예정된 상담이 없습니다. 아래에서 상담 예정을 등록해보세요.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-neutral-100">
            {upcoming.map((item) => (
              <li
                key={item.key}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    {item.kind === "student" ? (
                      <Link
                        href={`/students/${item.studentId}`}
                        className="font-medium text-neutral-800 hover:underline"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <span className="font-medium text-neutral-800">
                        {item.name}
                      </span>
                    )}
                    {item.kind === "prospect" && (
                      <span className="rounded bg-pink-100 px-1.5 py-0.5 text-[11px] font-medium text-pink-900">
                        신규 문의
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">{item.content}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="shrink-0 text-sm text-neutral-500">
                    {item.date}
                  </span>
                  {item.kind === "prospect" && (
                    <>
                      <form
                        action={setProspectStatusAction.bind(
                          null,
                          item.prospectId,
                          "done"
                        )}
                      >
                        <button
                          type="submit"
                          className="rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-white hover:bg-neutral-700"
                        >
                          상담 완료
                        </button>
                      </form>
                      <form action={deleteProspectAction.bind(null, item.prospectId)}>
                        <ConfirmSubmitButton
                          message="이 문의 상담 예정을 삭제하시겠습니까?"
                          className="text-xs text-neutral-400 hover:text-red-500"
                        >
                          삭제
                        </ConfirmSubmitButton>
                      </form>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {doneProspects.length > 0 && (
        <section className="rounded-lg border border-neutral-200 bg-white p-5">
          <h2 className="text-lg font-semibold">상담 완료 · 등록 대기</h2>
          <p className="mt-1 text-sm text-neutral-500">
            상담이 끝난 문의자입니다. 입력했던 정보 그대로 학생 등록으로 이어갈 수 있어요.
          </p>
          <ul className="mt-3 divide-y divide-neutral-100">
            {doneProspects.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <div>
                  <div className="font-medium text-neutral-800">{p.name}</div>
                  <p className="text-sm text-neutral-500">
                    {[p.grade, p.school].filter(Boolean).join(" · ") || "정보 없음"}
                    {p.memo && ` · ${p.memo}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={toProspectQuery(p)}
                    className="rounded-md bg-pink-300 px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-pink-400"
                  >
                    신규 학생으로 등록
                  </Link>
                  <form action={deleteProspectAction.bind(null, p.id)}>
                    <ConfirmSubmitButton
                      message="이 문의자 기록을 삭제하시겠습니까?"
                      className="text-xs text-neutral-400 hover:text-red-500"
                    >
                      삭제
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">상담 예정 추가</h2>
        <p className="mt-1 text-sm text-neutral-500">
          아직 정식 등록하지 않은 문의자의 상담 일정을 등록합니다. 상담이 끝나면
          위 목록에서 바로 신규 학생으로 등록할 수 있어요.
        </p>
        <form
          action={createProspectAction}
          className="mt-4 grid gap-3 sm:grid-cols-2"
        >
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              required
              name="name"
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              상담 예정일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="consult_date"
              defaultValue={todayStr()}
              required
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              학년
            </label>
            <input
              name="grade"
              placeholder="예: 중2"
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              학교
            </label>
            <input
              name="school"
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              학생 연락처
            </label>
            <PhoneInput
              name="phone"
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              학부모 연락처
            </label>
            <PhoneInput
              name="parent_phone"
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
              placeholder="문의 경로, 상담 시 다룰 내용 등"
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
            >
              상담 예정 등록
            </button>
          </div>
        </form>
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
