export type Student = {
  id: number;
  name: string;
  grade: string | null;
  school: string | null;
  phone: string | null;
  parent_phone: string | null;
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
