"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { UNGROUPED_GRADE_LABEL, compareGrades } from "@/lib/grade";
import { logoutAction } from "@/lib/auth-actions";
import { BrandLogo } from "@/components/BrandLogo";

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
    <aside className="flex h-full w-64 shrink-0 flex-col bg-neutral-900 text-neutral-300">
      <Link href="/" className="flex items-center gap-3 px-5 pt-6 pb-4">
        <BrandLogo size="sm" />
        <div>
          <div className="text-sm font-bold leading-tight tracking-tight text-white">
            ABLE ENGLISH
          </div>
          <p className="text-xs text-neutral-500">학생 관리</p>
        </div>
      </Link>

      <div className="px-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="학생 이름 검색"
          className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-pink-300 focus:outline-none"
        />
      </div>

      <nav className="mt-4 flex-1 overflow-y-auto px-3 pb-4">
        <div className="rounded-md bg-neutral-800/60 p-2">
          <div className="flex items-center justify-between px-2 py-1 text-sm font-semibold text-neutral-100">
            학생관리
          </div>

          <div className="mt-1 space-y-1">
            {groups.length === 0 && (
              <p className="px-3 py-2 text-xs text-neutral-500">
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
                    className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs font-semibold text-neutral-400 hover:bg-neutral-800"
                  >
                    <span>
                      {grade} <span className="text-neutral-600">({list.length})</span>
                    </span>
                    <span className="text-neutral-600">{open ? "▲" : "▼"}</span>
                  </button>
                  {open && (
                    <ul className="ml-2 border-l border-neutral-700 pl-2">
                      {list.map((s) => {
                        const active = s.id === activeStudentId;
                        return (
                          <li key={s.id}>
                            <Link
                              href={`/students/${s.id}`}
                              className={`block rounded px-3 py-1.5 text-sm transition ${
                                active
                                  ? "bg-pink-300 font-semibold text-neutral-900"
                                  : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
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
          className="mt-3 block rounded-md px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
        >
          + 새 학생 등록
        </Link>
      </nav>

      <div className="border-t border-neutral-800 px-5 py-3">
        <p className="text-xs text-neutral-500">Able English Academy</p>
        <form action={logoutAction} className="mt-1">
          <button
            type="submit"
            className="text-xs text-neutral-400 hover:text-pink-300 hover:underline"
          >
            로그아웃
          </button>
        </form>
      </div>
    </aside>
  );
}
