import type { ReactNode } from "react";
import { getStudents } from "@/lib/data";
import { Sidebar } from "@/components/Sidebar";

// 사이드바가 매 요청마다 최신 학생 목록을 SQLite에서 직접 읽으므로,
// 정적 캐싱으로 인해 등록/삭제 직후 목록이 낡아 보이는 일이 없도록 강제로 동적 렌더링한다.
export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: ReactNode }) {
  const students = getStudents().map((s) => ({
    id: s.id,
    name: s.name,
    grade: s.grade,
  }));

  return (
    <div className="flex h-full">
      <Sidebar students={students} />
      <main className="min-w-0 flex-1 overflow-y-auto px-6 py-8 md:px-10">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
