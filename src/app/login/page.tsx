import type { Metadata } from "next";
import { BrandLogo } from "@/components/BrandLogo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "로그인 — ABLE ENGLISH",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-8 px-4 py-16">
      <BrandLogo size="lg" />
      <div className="text-center">
        <p className="text-sm text-neutral-500">학생 관리 시스템</p>
      </div>
      <LoginForm />
    </div>
  );
}
