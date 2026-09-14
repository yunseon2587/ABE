"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { UNGROUPED_GRADE_LABEL, compareGrades } from "@/lib/grade";

type SidebarStudent = {
  id: number;
  name: string;
  grade: string | null;
};

export function Sidebar({ students }: { students: SidebarStudent[] }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const activeStudentId = useMemo(() => {
    const m = pathname?.match(/^\/students\/(\d+)/);
    return m ? Number(m[1]) : null;
  }, [pathname]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.name.toLowerCase().includes(q));
  }, [students, query]);

  const groups = useMemo(() => {
    const map = new Map<string, SidebarStudent[]>();
    for (const s of filtered) {
      const key = s.grade?.trim() || UNGROUPED_GRADE_LABEL;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return Array.from(map.entries())
      .sort((a, b) => compareGrades(a[0], b[0]))
      .map(([grade, list]) => ({
        grade,
        students: list.sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [filtered]);

  // 모든 학년 그룹은 기본적으로 펼쳐진 상태이며, 사용자가 직접 접은 경우에만 숨긴다.
  // 검색 중에는 결과를 바로 볼 수 있도록 항상 펼쳐둔다.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function isOpen(grade: string) {
    if (query.trim() !== "") return true;
    return collapsed[grade] !== true;
  }

  function toggle(grade: string) {
    setCollapsed((prev) => ({ ...prev, [grade]: isOpen(grade) }));
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-slate-700 text-slate-200">
      <div className="px-5 pt-6 pb-4">
        <Link href="/" className="block text-xl font-bold tracking-tight text-teal-400">
          ABE
        </Link>
        <p className="mt-0.5 text-xs text-slate-400">학생 관리</p>
      </div>

      <div className="px-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="학생 이름 검색"
          className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400 focus:outline-none"
        />
      </div>

      <nav className="mt-4 flex-1 overflow-y-auto px-3 pb-4">
        <div className="rounded-md bg-slate-800/60 p-2">
          <div className="flex items-center justify-between px-2 py-1 text-sm font-semibold text-slate-100">
            학생관리
          </div>

          <div className="mt-1 space-y-1">
            {groups.length === 0 && (
              <p className="px-3 py-2 text-xs text-slate-400">
                검색 결과가 없습니다.
              </p>
            )}
            {groups.map(({ grade, students: list }) => {
              const open = isOpen(grade);
              return (
                <div key={grade}>
                  <button
                    type="button"
                    onClick={() => toggle(grade)}
                    className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    <span>
                      {grade} <span className="text-slate-500">({list.length})</span>
                    </span>
                    <span className="text-slate-500">{open ? "▲" : "▼"}</span>
                  </button>
                  {open && (
                    <ul className="ml-2 border-l border-slate-600 pl-2">
                      {list.map((s) => {
                        const active = s.id === activeStudentId;
                        return (
                          <li key={s.id}>
                            <Link
                              href={`/students/${s.id}`}
                              className={`block rounded px-3 py-1.5 text-sm transition ${
                                active
                                  ? "bg-white font-semibold text-teal-600"
                                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
                              }`}
                            >
                              {s.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Link
          href="/students/new"
          className="mt-3 block rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          + 새 학생 등록
        </Link>
      </nav>

      <div className="border-t border-slate-600 px-5 py-3 text-xs text-slate-400">
        Able English Academy
      </div>
    </aside>
  );
}
