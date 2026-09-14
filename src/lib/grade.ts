export const UNGROUPED_GRADE_LABEL = "학년 미입력";

// 흔한 학년 표기를 학원에서 보기 좋은 순서로 정렬하기 위한 우선순위 목록.
const GRADE_ORDER = [
  "초1", "초2", "초3", "초4", "초5", "초6",
  "중1", "중2", "중3",
  "고1", "고2", "고3",
];

export function gradeSortKey(grade: string): number {
  const idx = GRADE_ORDER.indexOf(grade);
  return idx === -1 ? GRADE_ORDER.length : idx;
}

export function compareGrades(a: string, b: string): number {
  if (a === UNGROUPED_GRADE_LABEL) return 1;
  if (b === UNGROUPED_GRADE_LABEL) return -1;
  return gradeSortKey(a) - gradeSortKey(b) || a.localeCompare(b);
}
