"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as data from "./data";
import type {
  ConsultationStatus,
  Gender,
  ProspectStatus,
  SkillCategory,
} from "./types";
import { GENDER_OPTIONS } from "./types";

function str(fd: FormData, key: string): string {
  return (fd.get(key) as string | null)?.trim() ?? "";
}

function parseGender(fd: FormData): Gender | "" {
  const value = str(fd, "gender");
  return GENDER_OPTIONS.some((g) => g.value === value) ? (value as Gender) : "";
}

function parsePaymentDay(fd: FormData): number | null {
  const value = Number(fd.get("payment_day"));
  return Number.isInteger(value) && value >= 1 && value <= 31 ? value : null;
}

export async function createStudentAction(formData: FormData) {
  const name = str(formData, "name");
  if (!name) throw new Error("이름을 입력해주세요.");

  const id = await data.createStudent({
    name,
    grade: str(formData, "grade"),
    school: str(formData, "school"),
    phone: str(formData, "phone"),
    parent_phone: str(formData, "parent_phone"),
    gender: parseGender(formData),
    payment_day: parsePaymentDay(formData),
    memo: str(formData, "memo"),
  });

  // 상담 예정/완료 문의자를 정식 학생으로 등록 전환하는 경우, 문의자 기록은 정리한다.
  const prospectId = Number(formData.get("prospect_id"));
  if (prospectId) {
    await data.deleteProspect(prospectId);
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

  await data.updateStudent(studentId, {
    name,
    grade: str(formData, "grade"),
    school: str(formData, "school"),
    phone: str(formData, "phone"),
    parent_phone: str(formData, "parent_phone"),
    gender: parseGender(formData),
    payment_day: parsePaymentDay(formData),
    memo: str(formData, "memo"),
  });

  revalidatePath("/", "layout");
  revalidatePath(`/students/${studentId}`);
}

export async function deleteStudentAction(studentId: number) {
  await data.deleteStudent(studentId);
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

  await data.createConsultation({
    student_id: studentId,
    consult_date,
    status: status === "planned" ? "planned" : "completed",
    content,
    next_plan: str(formData, "next_plan"),
  });

  revalidatePath(`/students/${studentId}`);
  revalidatePath("/");
}

export async function updateConsultationAction(
  studentId: number,
  consultationId: number,
  formData: FormData
) {
  const content = str(formData, "content");
  const consult_date = str(formData, "consult_date");
  const status = str(formData, "status") as ConsultationStatus;
  if (!content || !consult_date) {
    throw new Error("날짜와 내용을 입력해주세요.");
  }

  await data.updateConsultation(consultationId, {
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
  await data.deleteConsultation(consultationId);
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

  await data.createSkillCheck({
    student_id: studentId,
    category,
    level,
    note: str(formData, "note"),
    checked_date,
  });

  revalidatePath(`/students/${studentId}`);
}

export async function updateSkillCheckAction(
  studentId: number,
  skillCheckId: number,
  formData: FormData
) {
  const category = str(formData, "category") as SkillCategory;
  const level = Number(formData.get("level"));
  const checked_date = str(formData, "checked_date");
  if (!category || !checked_date || !level) {
    throw new Error("카테고리, 날짜, 수준을 입력해주세요.");
  }

  await data.updateSkillCheck(skillCheckId, {
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
  await data.deleteSkillCheck(skillCheckId);
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

  await data.createWeeklyTest({
    student_id: studentId,
    test_date,
    test_name: str(formData, "test_name"),
    score,
    total_score,
    note: str(formData, "note"),
  });

  revalidatePath(`/students/${studentId}`);
}

export async function updateWeeklyTestAction(
  studentId: number,
  weeklyTestId: number,
  formData: FormData
) {
  const test_date = str(formData, "test_date");
  const score = Number(formData.get("score"));
  const total_score = Number(formData.get("total_score")) || 100;
  if (!test_date || Number.isNaN(score)) {
    throw new Error("날짜와 점수를 입력해주세요.");
  }

  await data.updateWeeklyTest(weeklyTestId, {
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
  await data.deleteWeeklyTest(weeklyTestId);
  revalidatePath(`/students/${studentId}`);
}

export async function createProspectAction(formData: FormData) {
  const name = str(formData, "name");
  const consult_date = str(formData, "consult_date");
  if (!name || !consult_date) {
    throw new Error("이름과 상담 예정일을 입력해주세요.");
  }

  await data.createProspect({
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
  await data.updateProspectStatus(prospectId, status);
  revalidatePath("/");
}

export async function deleteProspectAction(prospectId: number) {
  await data.deleteProspect(prospectId);
  revalidatePath("/");
}

export async function createPaymentAction(
  studentId: number,
  formData: FormData
) {
  const paid_date = str(formData, "paid_date");
  const amount = Number(formData.get("amount"));
  if (!paid_date || !amount) {
    throw new Error("결제일과 금액을 입력해주세요.");
  }

  await data.createPayment({
    student_id: studentId,
    paid_date,
    amount,
    period: str(formData, "period"),
    memo: str(formData, "memo"),
  });

  revalidatePath(`/students/${studentId}`);
}

export async function updatePaymentAction(
  studentId: number,
  paymentId: number,
  formData: FormData
) {
  const paid_date = str(formData, "paid_date");
  const amount = Number(formData.get("amount"));
  if (!paid_date || !amount) {
    throw new Error("결제일과 금액을 입력해주세요.");
  }

  await data.updatePayment(paymentId, {
    paid_date,
    amount,
    period: str(formData, "period"),
    memo: str(formData, "memo"),
  });

  revalidatePath(`/students/${studentId}`);
}

export async function deletePaymentAction(
  studentId: number,
  paymentId: number
) {
  await data.deletePayment(paymentId);
  revalidatePath(`/students/${studentId}`);
}

export async function createSchoolExamAction(
  studentId: number,
  formData: FormData
) {
  const exam_date = str(formData, "exam_date");
  const score = Number(formData.get("score"));
  const total_score = Number(formData.get("total_score")) || 100;
  if (!exam_date || Number.isNaN(score)) {
    throw new Error("날짜와 점수를 입력해주세요.");
  }

  await data.createSchoolExam({
    student_id: studentId,
    exam_date,
    exam_name: str(formData, "exam_name"),
    score,
    total_score,
    note: str(formData, "note"),
  });

  revalidatePath(`/students/${studentId}`);
}

export async function updateSchoolExamAction(
  studentId: number,
  examId: number,
  formData: FormData
) {
  const exam_date = str(formData, "exam_date");
  const score = Number(formData.get("score"));
  const total_score = Number(formData.get("total_score")) || 100;
  if (!exam_date || Number.isNaN(score)) {
    throw new Error("날짜와 점수를 입력해주세요.");
  }

  await data.updateSchoolExam(examId, {
    exam_date,
    exam_name: str(formData, "exam_name"),
    score,
    total_score,
    note: str(formData, "note"),
  });

  revalidatePath(`/students/${studentId}`);
}

export async function deleteSchoolExamAction(studentId: number, examId: number) {
  await data.deleteSchoolExam(examId);
  revalidatePath(`/students/${studentId}`);
}

export async function createMakeupClassAction(
  studentId: number,
  formData: FormData
) {
  const absence_date = str(formData, "absence_date");
  if (!absence_date) {
    throw new Error("결석일을 입력해주세요.");
  }

  await data.createMakeupClass({
    student_id: studentId,
    absence_date,
    makeup_date: str(formData, "makeup_date"),
    memo: str(formData, "memo"),
  });

  revalidatePath(`/students/${studentId}`);
  revalidatePath("/");
}

export async function updateMakeupClassAction(
  studentId: number,
  makeupClassId: number,
  formData: FormData
) {
  const absence_date = str(formData, "absence_date");
  if (!absence_date) {
    throw new Error("결석일을 입력해주세요.");
  }

  await data.updateMakeupClass(makeupClassId, {
    absence_date,
    makeup_date: str(formData, "makeup_date"),
    memo: str(formData, "memo"),
  });

  revalidatePath(`/students/${studentId}`);
  revalidatePath("/");
}

export async function deleteMakeupClassAction(
  studentId: number,
  makeupClassId: number
) {
  await data.deleteMakeupClass(makeupClassId);
  revalidatePath(`/students/${studentId}`);
  revalidatePath("/");
}
