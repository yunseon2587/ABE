"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as data from "./data";
import type { ConsultationStatus, ProspectStatus, SkillCategory } from "./types";

function str(fd: FormData, key: string): string {
  return (fd.get(key) as string | null)?.trim() ?? "";
}

export async function createStudentAction(formData: FormData) {
  const name = str(formData, "name");
  if (!name) throw new Error("이름을 입력해주세요.");

  const id = data.createStudent({
    name,
    grade: str(formData, "grade"),
    school: str(formData, "school"),
    phone: str(formData, "phone"),
    parent_phone: str(formData, "parent_phone"),
    memo: str(formData, "memo"),
  });

  // 상담 예정/완료 문의자를 정식 학생으로 등록 전환하는 경우, 문의자 기록은 정리한다.
  const prospectId = Number(formData.get("prospect_id"));
  if (prospectId) {
    data.deleteProspect(prospectId);
  }

  revalidatePath("/", "layout");
  redirect(`/students/${id}`);
}

export async function updateStudentAction(
  studentId: number,
  formData: FormData
) {
  const name = str(formData, "name");
  if (!name) throw new Error("이름을 입력해주세요.");

  data.updateStudent(studentId, {
    name,
    grade: str(formData, "grade"),
    school: str(formData, "school"),
    phone: str(formData, "phone"),
    parent_phone: str(formData, "parent_phone"),
    memo: str(formData, "memo"),
  });

  revalidatePath("/", "layout");
  revalidatePath(`/students/${studentId}`);
}

export async function deleteStudentAction(studentId: number) {
  data.deleteStudent(studentId);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function createConsultationAction(
  studentId: number,
  formData: FormData
) {
  const content = str(formData, "content");
  const consult_date = str(formData, "consult_date");
  const status = str(formData, "status") as ConsultationStatus;
  if (!content || !consult_date) {
    throw new Error("날짜와 내용을 입력해주세요.");
  }

  data.createConsultation({
    student_id: studentId,
    consult_date,
    status: status === "planned" ? "planned" : "completed",
    content,
    next_plan: str(formData, "next_plan"),
  });

  revalidatePath(`/students/${studentId}`);
  revalidatePath("/");
}

export async function deleteConsultationAction(
  studentId: number,
  consultationId: number
) {
  data.deleteConsultation(consultationId);
  revalidatePath(`/students/${studentId}`);
  revalidatePath("/");
}

export async function createSkillCheckAction(
  studentId: number,
  formData: FormData
) {
  const category = str(formData, "category") as SkillCategory;
  const level = Number(formData.get("level"));
  const checked_date = str(formData, "checked_date");
  if (!category || !checked_date || !level) {
    throw new Error("카테고리, 날짜, 수준을 입력해주세요.");
  }

  data.createSkillCheck({
    student_id: studentId,
    category,
    level,
    note: str(formData, "note"),
    checked_date,
  });

  revalidatePath(`/students/${studentId}`);
}

export async function deleteSkillCheckAction(
  studentId: number,
  skillCheckId: number
) {
  data.deleteSkillCheck(skillCheckId);
  revalidatePath(`/students/${studentId}`);
}

export async function createWeeklyTestAction(
  studentId: number,
  formData: FormData
) {
  const test_date = str(formData, "test_date");
  const score = Number(formData.get("score"));
  const total_score = Number(formData.get("total_score")) || 100;
  if (!test_date || Number.isNaN(score)) {
    throw new Error("날짜와 점수를 입력해주세요.");
  }

  data.createWeeklyTest({
    student_id: studentId,
    test_date,
    test_name: str(formData, "test_name"),
    score,
    total_score,
    note: str(formData, "note"),
  });

  revalidatePath(`/students/${studentId}`);
}

export async function deleteWeeklyTestAction(
  studentId: number,
  weeklyTestId: number
) {
  data.deleteWeeklyTest(weeklyTestId);
  revalidatePath(`/students/${studentId}`);
}

export async function createProspectAction(formData: FormData) {
  const name = str(formData, "name");
  const consult_date = str(formData, "consult_date");
  if (!name || !consult_date) {
    throw new Error("이름과 상담 예정일을 입력해주세요.");
  }

  data.createProspect({
    name,
    grade: str(formData, "grade"),
    school: str(formData, "school"),
    phone: str(formData, "phone"),
    parent_phone: str(formData, "parent_phone"),
    consult_date,
    memo: str(formData, "memo"),
  });

  revalidatePath("/");
}

export async function setProspectStatusAction(
  prospectId: number,
  status: ProspectStatus
) {
  data.updateProspectStatus(prospectId, status);
  revalidatePath("/");
}

export async function deleteProspectAction(prospectId: number) {
  data.deleteProspect(prospectId);
  revalidatePath("/");
}
