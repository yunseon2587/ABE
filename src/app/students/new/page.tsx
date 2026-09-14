import { createStudentAction } from "@/lib/actions";

export default function NewStudentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">새 학생 등록</h1>
        <p className="mt-1 text-sm text-slate-500">
          학생 정보를 입력하면 왼쪽 사이드바의 학년 그룹에 자동으로 추가됩니다.
        </p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <form action={createStudentAction} className="grid gap-3 sm:grid-cols-2">
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
