"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as data from "./data";
import type { ConsultationStatus, SkillCategory } from "./types";

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

  revalidatePath("/");
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

  revalidatePath("/");
  revalidatePath(`/students/${studentId}`);
}

export async function deleteStudentAction(studentId: number) {
  data.deleteStudent(studentId);
  revalidatePath("/");
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
}

export async function deleteConsultationAction(
  studentId: number,
  consultationId: number
) {
  data.deleteConsultation(consultationId);
  revalidatePath(`/students/${studentId}`);
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
