import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getStudents } from "@/lib/data";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ABE 학생 관리",
  description: "영어학원 학생 상담·실력체크·주간테스트 관리 시스템",
};

// 사이드바가 매 요청마다 최신 학생 목록을 SQLite에서 직접 읽으므로,
// 정적 캐싱으로 인해 등록/삭제 직후 목록이 낡아 보이는 일이 없도록 강제로 동적 렌더링한다.
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: LayoutProps<"/">) {
  const students = getStudents().map((s) => ({
    id: s.id,
    name: s.name,
    grade: s.grade,
  }));

  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-full bg-slate-50 text-slate-900">
        <Sidebar students={students} />
        <main className="min-w-0 flex-1 overflow-y-auto px-6 py-8 md:px-10">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </body>
    </html>
  );
}
