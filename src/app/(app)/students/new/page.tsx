import { createStudentAction } from "@/lib/actions";

type SearchParams = {
  prospectId?: string;
  name?: string;
  grade?: string;
  school?: string;
  phone?: string;
  parent_phone?: string;
  memo?: string;
};

export default async function NewStudentPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const fromProspect = Boolean(sp.prospectId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">새 학생 등록</h1>
        <p className="mt-1 text-sm text-neutral-500">
          학생 정보를 입력하면 왼쪽 사이드바의 학년 그룹에 자동으로 추가됩니다.
        </p>
      </div>

      {fromProspect && (
        <p className="rounded-md bg-pink-50 px-4 py-2 text-sm text-pink-900">
          상담 완료된 문의자 정보를 불러왔습니다. 확인 후 등록해주세요.
        </p>
      )}

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <form action={createStudentAction} className="grid gap-3 sm:grid-cols-2">
          {fromProspect && (
            <input type="hidden" name="prospect_id" value={sp.prospectId} />
          )}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-neutral-700">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              required
              name="name"
              defaultValue={sp.name ?? ""}
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
              defaultValue={sp.grade ?? ""}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              학교
            </label>
            <input
              name="school"
              defaultValue={sp.school ?? ""}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              학생 연락처
            </label>
            <input
              name="phone"
              defaultValue={sp.phone ?? ""}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              학부모 연락처
            </label>
            <input
              name="parent_phone"
              defaultValue={sp.parent_phone ?? ""}
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
              defaultValue={sp.memo ?? ""}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
            >
              학생 등록
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
