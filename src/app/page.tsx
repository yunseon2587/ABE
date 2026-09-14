import Link from "next/link";
import { getStudents } from "@/lib/data";
import { createStudentAction } from "@/lib/actions";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const students = getStudents(q);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold">학생 목록</h1>
        <p className="mt-1 text-sm text-slate-500">
          담당 학생들의 상담·실력체크·주간테스트를 한곳에서 관리하세요.
        </p>

        <form className="mt-4 flex gap-2" action="/">
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="이름 또는 학교로 검색"
            className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            검색
          </button>
        </form>

        {students.length === 0 ? (
          <p className="mt-6 rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            등록된 학생이 없습니다. 아래에서 새 학생을 등록해보세요.
          </p>
        ) : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {students.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/students/${s.id}`}
                  className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-400 hover:shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{s.name}</span>
                    {s.grade && (
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {s.grade}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {s.school || "학교 미입력"}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">새 학생 등록</h2>
        <form action={createStudentAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              required
              name="name"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              학년
            </label>
            <input
              name="grade"
              placeholder="예: 중2"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              학교
            </label>
            <input
              name="school"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              학생 연락처
            </label>
            <input
              name="phone"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              학부모 연락처
            </label>
            <input
              name="parent_phone"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              메모
            </label>
            <textarea
              name="memo"
              rows={2}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              학생 등록
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
