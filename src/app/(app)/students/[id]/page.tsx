import { notFound } from "next/navigation";
import { getStudent, getLatestPaymentDate } from "@/lib/data";
import { updateStudentAction, deleteStudentAction } from "@/lib/actions";
import { GENDER_OPTIONS } from "@/lib/types";
import { getPaymentStatus } from "@/lib/payment";
import { Tabs } from "@/components/Tabs";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { PhoneInput } from "@/components/PhoneInput";
import { ConsultationSection } from "./ConsultationSection";
import { SkillCheckSection } from "./SkillCheckSection";
import { WeeklyTestSection } from "./WeeklyTestSection";
import { PaymentSection } from "./PaymentSection";
import { SchoolExamSection } from "./SchoolExamSection";
import { MakeupClassSection } from "./MakeupClassSection";

export default async function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studentId = Number(id);
  const student = await getStudent(studentId);
  if (!student) notFound();

  const updateAction = updateStudentAction.bind(null, studentId);
  const deleteAction = deleteStudentAction.bind(null, studentId);
  const genderLabel = GENDER_OPTIONS.find((g) => g.value === student.gender)?.label;
  const paymentStatus = getPaymentStatus(
    student.payment_day,
    await getLatestPaymentDate(studentId)
  );

  return (
    <div className="space-y-6">
      <details className="rounded-lg border border-neutral-200 bg-white">
        <summary className="cursor-pointer list-none p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{student.name}</h1>
                <PaymentStatusBadge status={paymentStatus} />
              </div>
              <p className="mt-1 text-sm text-neutral-500">
                {[genderLabel, student.grade, student.school]
                  .filter(Boolean)
                  .join(" · ") || "정보 없음"}
                {student.phone && ` · 학생 ${student.phone}`}
                {student.parent_phone && ` · 학부모 ${student.parent_phone}`}
                {student.payment_day && ` · 매월 ${student.payment_day}일 결제`}
              </p>
            </div>
            <span className="text-xs text-neutral-400">학생 정보 수정 ▾</span>
          </div>
        </summary>
        <div className="border-t border-neutral-100 p-5">
          <form action={updateAction} className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="name"
                defaultValue={student.name}
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                학년
              </label>
              <input
                name="grade"
                defaultValue={student.grade ?? ""}
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                학교
              </label>
              <input
                name="school"
                defaultValue={student.school ?? ""}
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                성별
              </label>
              <select
                name="gender"
                defaultValue={student.gender ?? ""}
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              >
                <option value="">선택 안함</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                결제일
              </label>
              <input
                type="number"
                name="payment_day"
                min={1}
                max={31}
                placeholder="예: 15 (매월)"
                defaultValue={student.payment_day ?? ""}
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                학생 연락처
              </label>
              <PhoneInput
                name="phone"
                defaultValue={student.phone}
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                학부모 연락처
              </label>
              <PhoneInput
                name="parent_phone"
                defaultValue={student.parent_phone}
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
                defaultValue={student.memo ?? ""}
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center justify-between sm:col-span-2">
              <button
                type="submit"
                className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
              >
                정보 저장
              </button>
            </div>
          </form>
          <form action={deleteAction} className="mt-3 border-t border-neutral-100 pt-3">
            <ConfirmSubmitButton
              message="학생을 삭제하면 관련된 상담/실력체크/테스트 기록이 모두 삭제됩니다. 계속하시겠습니까?"
              className="text-xs text-red-500 hover:underline"
            >
              학생 삭제
            </ConfirmSubmitButton>
          </form>
        </div>
      </details>

      <Tabs
        tabs={[
          {
            key: "consultations",
            label: "상담 기록",
            content: <ConsultationSection studentId={studentId} />,
          },
          {
            key: "skills",
            label: "실력 체크",
            content: <SkillCheckSection studentId={studentId} />,
          },
          {
            key: "tests",
            label: "주간 테스트",
            content: <WeeklyTestSection studentId={studentId} />,
          },
          {
            key: "school-exams",
            label: "학교 성적",
            content: <SchoolExamSection studentId={studentId} />,
          },
          {
            key: "makeup",
            label: "보강 관리",
            content: <MakeupClassSection studentId={studentId} />,
          },
          {
            key: "payments",
            label: "결제 관리",
            content: (
              <PaymentSection studentId={studentId} paymentDay={student.payment_day} />
            ),
          },
        ]}
      />
    </div>
  );
}
