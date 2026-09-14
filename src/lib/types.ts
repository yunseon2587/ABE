export const GENDER_OPTIONS = [
  { value: "male", label: "남" },
  { value: "female", label: "여" },
] as const;

export type Gender = (typeof GENDER_OPTIONS)[number]["value"];

export type Student = {
  id: number;
  name: string;
  grade: string | null;
  school: string | null;
  phone: string | null;
  parent_phone: string | null;
  gender: Gender | null;
  payment_day: number | null;
  memo: string | null;
  created_at: string;
};

export type ConsultationStatus = "completed" | "planned";

export type Consultation = {
  id: number;
  student_id: number;
  consult_date: string;
  status: ConsultationStatus;
  content: string;
  next_plan: string | null;
  created_at: string;
};

export type ProspectStatus = "planned" | "done";

// 아직 정식 학생으로 등록하지 않은, 상담 예정/진행 중인 문의자.
export type Prospect = {
  id: number;
  name: string;
  grade: string | null;
  school: string | null;
  phone: string | null;
  parent_phone: string | null;
  consult_date: string;
  status: ProspectStatus;
  memo: string | null;
  created_at: string;
};

export const SKILL_CATEGORIES = [
  { key: "grammar", label: "문법" },
  { key: "writing", label: "작문" },
  { key: "reading", label: "독해/해석" },
  { key: "vocabulary", label: "어휘" },
  { key: "listening", label: "듣기" },
  { key: "speaking", label: "말하기" },
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number]["key"];

export const SKILL_LEVELS = [
  { value: 1, label: "매우 부족" },
  { value: 2, label: "부족" },
  { value: 3, label: "보통" },
  { value: 4, label: "양호" },
  { value: 5, label: "우수" },
] as const;

export type SkillCheck = {
  id: number;
  student_id: number;
  category: SkillCategory;
  level: number;
  note: string | null;
  checked_date: string;
  created_at: string;
};

export type WeeklyTest = {
  id: number;
  student_id: number;
  test_date: string;
  test_name: string | null;
  score: number;
  total_score: number;
  note: string | null;
  created_at: string;
};

export type Payment = {
  id: number;
  student_id: number;
  paid_date: string;
  amount: number;
  period: string | null;
  memo: string | null;
  created_at: string;
};

// 학원 자체 테스트(WeeklyTest)와 별개로, 실제 학교에서 본 시험 성적.
export type SchoolExam = {
  id: number;
  student_id: number;
  exam_date: string;
  exam_name: string | null;
  score: number;
  total_score: number;
  note: string | null;
  created_at: string;
};

// 결석/보강 기록. makeup_date가 비어 있으면 보강 일정이 아직 미정인 상태.
export type MakeupClass = {
  id: number;
  student_id: number;
  absence_date: string;
  makeup_date: string | null;
  memo: string | null;
  created_at: string;
};
