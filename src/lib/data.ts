import db from "./db";
import type {
  Student,
  Consultation,
  SkillCheck,
  WeeklyTest,
  ConsultationStatus,
  SkillCategory,
  Prospect,
  ProspectStatus,
  Gender,
  Payment,
} from "./types";

// ---- Students ----

export function getStudents(search?: string): Student[] {
  if (search && search.trim()) {
    const like = `%${search.trim()}%`;
    return db
      .prepare(
        `SELECT * FROM students WHERE name LIKE ? OR school LIKE ? ORDER BY created_at DESC`
      )
      .all(like, like) as Student[];
  }
  return db
    .prepare(`SELECT * FROM students ORDER BY created_at DESC`)
    .all() as Student[];
}

export function getUpcomingConsultations(
  limit = 5
): (Consultation & { student_name: string })[] {
  return db
    .prepare(
      `SELECT c.*, s.name AS student_name
       FROM consultations c
       JOIN students s ON s.id = c.student_id
       WHERE c.status = 'planned'
       ORDER BY c.consult_date ASC
       LIMIT ?`
    )
    .all(limit) as (Consultation & { student_name: string })[];
}

export function getStudent(id: number): Student | undefined {
  return db.prepare(`SELECT * FROM students WHERE id = ?`).get(id) as
    | Student
    | undefined;
}

export function createStudent(input: {
  name: string;
  grade?: string;
  school?: string;
  phone?: string;
  parent_phone?: string;
  gender?: Gender | "";
  payment_day?: number | null;
  memo?: string;
}): number {
  const result = db
    .prepare(
      `INSERT INTO students (name, grade, school, phone, parent_phone, gender, payment_day, memo)
       VALUES (@name, @grade, @school, @phone, @parent_phone, @gender, @payment_day, @memo)`
    )
    .run({
      name: input.name,
      grade: input.grade || null,
      school: input.school || null,
      phone: input.phone || null,
      parent_phone: input.parent_phone || null,
      gender: input.gender || null,
      payment_day: input.payment_day || null,
      memo: input.memo || null,
    });
  return Number(result.lastInsertRowid);
}

export function updateStudent(
  id: number,
  input: {
    name: string;
    grade?: string;
    school?: string;
    phone?: string;
    parent_phone?: string;
    gender?: Gender | "";
    payment_day?: number | null;
    memo?: string;
  }
): void {
  db.prepare(
    `UPDATE students SET name=@name, grade=@grade, school=@school, phone=@phone,
     parent_phone=@parent_phone, gender=@gender, payment_day=@payment_day, memo=@memo WHERE id=@id`
  ).run({
    id,
    name: input.name,
    grade: input.grade || null,
    school: input.school || null,
    phone: input.phone || null,
    parent_phone: input.parent_phone || null,
    gender: input.gender || null,
    payment_day: input.payment_day || null,
    memo: input.memo || null,
  });
}

export function deleteStudent(id: number): void {
  db.prepare(`DELETE FROM students WHERE id = ?`).run(id);
}

// ---- Consultations ----

export function getConsultations(studentId: number): Consultation[] {
  return db
    .prepare(
      `SELECT * FROM consultations WHERE student_id = ? ORDER BY consult_date DESC, id DESC`
    )
    .all(studentId) as Consultation[];
}

export function createConsultation(input: {
  student_id: number;
  consult_date: string;
  status: ConsultationStatus;
  content: string;
  next_plan?: string;
}): void {
  db.prepare(
    `INSERT INTO consultations (student_id, consult_date, status, content, next_plan)
     VALUES (@student_id, @consult_date, @status, @content, @next_plan)`
  ).run({
    student_id: input.student_id,
    consult_date: input.consult_date,
    status: input.status,
    content: input.content,
    next_plan: input.next_plan || null,
  });
}

export function deleteConsultation(id: number): void {
  db.prepare(`DELETE FROM consultations WHERE id = ?`).run(id);
}

// ---- Skill checks ----

export function getSkillChecks(studentId: number): SkillCheck[] {
  return db
    .prepare(
      `SELECT * FROM skill_checks WHERE student_id = ? ORDER BY checked_date DESC, id DESC`
    )
    .all(studentId) as SkillCheck[];
}

export function getLatestSkillLevels(
  studentId: number
): Record<string, SkillCheck | undefined> {
  const rows = getSkillChecks(studentId);
  const latest: Record<string, SkillCheck> = {};
  for (const row of rows) {
    if (!latest[row.category]) {
      latest[row.category] = row;
    }
  }
  return latest;
}

export function createSkillCheck(input: {
  student_id: number;
  category: SkillCategory;
  level: number;
  note?: string;
  checked_date: string;
}): void {
  db.prepare(
    `INSERT INTO skill_checks (student_id, category, level, note, checked_date)
     VALUES (@student_id, @category, @level, @note, @checked_date)`
  ).run({
    student_id: input.student_id,
    category: input.category,
    level: input.level,
    note: input.note || null,
    checked_date: input.checked_date,
  });
}

export function deleteSkillCheck(id: number): void {
  db.prepare(`DELETE FROM skill_checks WHERE id = ?`).run(id);
}

// ---- Weekly tests ----

export function getWeeklyTests(studentId: number): WeeklyTest[] {
  return db
    .prepare(
      `SELECT * FROM weekly_tests WHERE student_id = ? ORDER BY test_date DESC, id DESC`
    )
    .all(studentId) as WeeklyTest[];
}

export function createWeeklyTest(input: {
  student_id: number;
  test_date: string;
  test_name?: string;
  score: number;
  total_score: number;
  note?: string;
}): void {
  db.prepare(
    `INSERT INTO weekly_tests (student_id, test_date, test_name, score, total_score, note)
     VALUES (@student_id, @test_date, @test_name, @score, @total_score, @note)`
  ).run({
    student_id: input.student_id,
    test_date: input.test_date,
    test_name: input.test_name || null,
    score: input.score,
    total_score: input.total_score,
    note: input.note || null,
  });
}

export function deleteWeeklyTest(id: number): void {
  db.prepare(`DELETE FROM weekly_tests WHERE id = ?`).run(id);
}

// ---- Prospects (아직 정식 등록 전, 상담 예정/완료 문의자) ----

export function getProspects(status?: ProspectStatus): Prospect[] {
  if (status) {
    return db
      .prepare(
        `SELECT * FROM prospects WHERE status = ? ORDER BY consult_date ASC, id ASC`
      )
      .all(status) as Prospect[];
  }
  return db
    .prepare(`SELECT * FROM prospects ORDER BY consult_date ASC, id ASC`)
    .all() as Prospect[];
}

export function getProspect(id: number): Prospect | undefined {
  return db.prepare(`SELECT * FROM prospects WHERE id = ?`).get(id) as
    | Prospect
    | undefined;
}

export function createProspect(input: {
  name: string;
  grade?: string;
  school?: string;
  phone?: string;
  parent_phone?: string;
  consult_date: string;
  memo?: string;
}): void {
  db.prepare(
    `INSERT INTO prospects (name, grade, school, phone, parent_phone, consult_date, memo)
     VALUES (@name, @grade, @school, @phone, @parent_phone, @consult_date, @memo)`
  ).run({
    name: input.name,
    grade: input.grade || null,
    school: input.school || null,
    phone: input.phone || null,
    parent_phone: input.parent_phone || null,
    consult_date: input.consult_date,
    memo: input.memo || null,
  });
}

export function updateProspectStatus(id: number, status: ProspectStatus): void {
  db.prepare(`UPDATE prospects SET status = ? WHERE id = ?`).run(status, id);
}

export function deleteProspect(id: number): void {
  db.prepare(`DELETE FROM prospects WHERE id = ?`).run(id);
}

// ---- Payments ----

export function getPayments(studentId: number): Payment[] {
  return db
    .prepare(
      `SELECT * FROM payments WHERE student_id = ? ORDER BY paid_date DESC, id DESC`
    )
    .all(studentId) as Payment[];
}

export function createPayment(input: {
  student_id: number;
  paid_date: string;
  amount: number;
  period?: string;
  memo?: string;
}): void {
  db.prepare(
    `INSERT INTO payments (student_id, paid_date, amount, period, memo)
     VALUES (@student_id, @paid_date, @amount, @period, @memo)`
  ).run({
    student_id: input.student_id,
    paid_date: input.paid_date,
    amount: input.amount,
    period: input.period || null,
    memo: input.memo || null,
  });
}

export function deletePayment(id: number): void {
  db.prepare(`DELETE FROM payments WHERE id = ?`).run(id);
}

export function getLatestPaymentDate(studentId: number): string | null {
  const row = db
    .prepare(
      `SELECT MAX(paid_date) AS last_paid FROM payments WHERE student_id = ?`
    )
    .get(studentId) as { last_paid: string | null };
  return row?.last_paid ?? null;
}

// 학생 id별 가장 최근 결제일. 사이드바/대시보드에서 여러 학생의 연체 여부를
// 한 번에 계산할 때 학생 수만큼 쿼리하지 않도록 한 번의 쿼리로 가져온다.
export function getLatestPaymentDatesByStudent(): Record<number, string> {
  const rows = db
    .prepare(
      `SELECT student_id, MAX(paid_date) AS last_paid FROM payments GROUP BY student_id`
    )
    .all() as { student_id: number; last_paid: string }[];
  const map: Record<number, string> = {};
  for (const row of rows) {
    map[row.student_id] = row.last_paid;
  }
  return map;
}
