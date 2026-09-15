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
  SchoolExam,
  MakeupClass,
} from "./types";

// ---- Students ----

export async function getStudents(search?: string): Promise<Student[]> {
  if (search && search.trim()) {
    const like = `%${search.trim()}%`;
    const result = await db.execute({
      sql: `SELECT * FROM students WHERE name LIKE ? OR school LIKE ? ORDER BY created_at DESC`,
      args: [like, like],
    });
    return result.rows as unknown as Student[];
  }
  const result = await db.execute(
    `SELECT * FROM students ORDER BY created_at DESC`
  );
  return result.rows as unknown as Student[];
}

export async function getUpcomingConsultations(
  limit = 5
): Promise<(Consultation & { student_name: string })[]> {
  const result = await db.execute({
    sql: `SELECT c.*, s.name AS student_name
          FROM consultations c
          JOIN students s ON s.id = c.student_id
          WHERE c.status = 'planned'
          ORDER BY c.consult_date ASC
          LIMIT ?`,
    args: [limit],
  });
  return result.rows as unknown as (Consultation & { student_name: string })[];
}

export async function getStudent(id: number): Promise<Student | undefined> {
  const result = await db.execute({
    sql: `SELECT * FROM students WHERE id = ?`,
    args: [id],
  });
  return result.rows[0] as unknown as Student | undefined;
}

export async function createStudent(input: {
  name: string;
  grade?: string;
  school?: string;
  phone?: string;
  parent_phone?: string;
  gender?: Gender | "";
  payment_day?: number | null;
  memo?: string;
}): Promise<number> {
  const result = await db.execute({
    sql: `INSERT INTO students (name, grade, school, phone, parent_phone, gender, payment_day, memo)
          VALUES (@name, @grade, @school, @phone, @parent_phone, @gender, @payment_day, @memo)`,
    args: {
      name: input.name,
      grade: input.grade || null,
      school: input.school || null,
      phone: input.phone || null,
      parent_phone: input.parent_phone || null,
      gender: input.gender || null,
      payment_day: input.payment_day || null,
      memo: input.memo || null,
    },
  });
  return Number(result.lastInsertRowid);
}

export async function updateStudent(
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
): Promise<void> {
  await db.execute({
    sql: `UPDATE students SET name=@name, grade=@grade, school=@school, phone=@phone,
          parent_phone=@parent_phone, gender=@gender, payment_day=@payment_day, memo=@memo WHERE id=@id`,
    args: {
      id,
      name: input.name,
      grade: input.grade || null,
      school: input.school || null,
      phone: input.phone || null,
      parent_phone: input.parent_phone || null,
      gender: input.gender || null,
      payment_day: input.payment_day || null,
      memo: input.memo || null,
    },
  });
}

export async function deleteStudent(id: number): Promise<void> {
  await db.execute({ sql: `DELETE FROM students WHERE id = ?`, args: [id] });
}

// ---- Consultations ----

export async function getConsultations(
  studentId: number
): Promise<Consultation[]> {
  const result = await db.execute({
    sql: `SELECT * FROM consultations WHERE student_id = ? ORDER BY consult_date DESC, id DESC`,
    args: [studentId],
  });
  return result.rows as unknown as Consultation[];
}

export async function createConsultation(input: {
  student_id: number;
  consult_date: string;
  status: ConsultationStatus;
  content: string;
  next_plan?: string;
}): Promise<void> {
  await db.execute({
    sql: `INSERT INTO consultations (student_id, consult_date, status, content, next_plan)
          VALUES (@student_id, @consult_date, @status, @content, @next_plan)`,
    args: {
      student_id: input.student_id,
      consult_date: input.consult_date,
      status: input.status,
      content: input.content,
      next_plan: input.next_plan || null,
    },
  });
}

export async function updateConsultation(
  id: number,
  input: {
    consult_date: string;
    status: ConsultationStatus;
    content: string;
    next_plan?: string;
  }
): Promise<void> {
  await db.execute({
    sql: `UPDATE consultations SET consult_date=@consult_date, status=@status,
          content=@content, next_plan=@next_plan WHERE id=@id`,
    args: {
      id,
      consult_date: input.consult_date,
      status: input.status,
      content: input.content,
      next_plan: input.next_plan || null,
    },
  });
}

export async function deleteConsultation(id: number): Promise<void> {
  await db.execute({
    sql: `DELETE FROM consultations WHERE id = ?`,
    args: [id],
  });
}

// ---- Skill checks ----

export async function getSkillChecks(
  studentId: number
): Promise<SkillCheck[]> {
  const result = await db.execute({
    sql: `SELECT * FROM skill_checks WHERE student_id = ? ORDER BY checked_date DESC, id DESC`,
    args: [studentId],
  });
  return result.rows as unknown as SkillCheck[];
}

export async function getLatestSkillLevels(
  studentId: number
): Promise<Record<string, SkillCheck | undefined>> {
  const rows = await getSkillChecks(studentId);
  const latest: Record<string, SkillCheck> = {};
  for (const row of rows) {
    if (!latest[row.category]) {
      latest[row.category] = row;
    }
  }
  return latest;
}

export async function createSkillCheck(input: {
  student_id: number;
  category: SkillCategory;
  level: number;
  note?: string;
  checked_date: string;
}): Promise<void> {
  await db.execute({
    sql: `INSERT INTO skill_checks (student_id, category, level, note, checked_date)
          VALUES (@student_id, @category, @level, @note, @checked_date)`,
    args: {
      student_id: input.student_id,
      category: input.category,
      level: input.level,
      note: input.note || null,
      checked_date: input.checked_date,
    },
  });
}

export async function updateSkillCheck(
  id: number,
  input: {
    category: SkillCategory;
    level: number;
    note?: string;
    checked_date: string;
  }
): Promise<void> {
  await db.execute({
    sql: `UPDATE skill_checks SET category=@category, level=@level, note=@note,
          checked_date=@checked_date WHERE id=@id`,
    args: {
      id,
      category: input.category,
      level: input.level,
      note: input.note || null,
      checked_date: input.checked_date,
    },
  });
}

export async function deleteSkillCheck(id: number): Promise<void> {
  await db.execute({
    sql: `DELETE FROM skill_checks WHERE id = ?`,
    args: [id],
  });
}

// ---- Weekly tests ----

export async function getWeeklyTests(
  studentId: number
): Promise<WeeklyTest[]> {
  const result = await db.execute({
    sql: `SELECT * FROM weekly_tests WHERE student_id = ? ORDER BY test_date DESC, id DESC`,
    args: [studentId],
  });
  return result.rows as unknown as WeeklyTest[];
}

export async function createWeeklyTest(input: {
  student_id: number;
  test_date: string;
  test_name?: string;
  score: number;
  total_score: number;
  note?: string;
}): Promise<void> {
  await db.execute({
    sql: `INSERT INTO weekly_tests (student_id, test_date, test_name, score, total_score, note)
          VALUES (@student_id, @test_date, @test_name, @score, @total_score, @note)`,
    args: {
      student_id: input.student_id,
      test_date: input.test_date,
      test_name: input.test_name || null,
      score: input.score,
      total_score: input.total_score,
      note: input.note || null,
    },
  });
}

export async function updateWeeklyTest(
  id: number,
  input: {
    test_date: string;
    test_name?: string;
    score: number;
    total_score: number;
    note?: string;
  }
): Promise<void> {
  await db.execute({
    sql: `UPDATE weekly_tests SET test_date=@test_date, test_name=@test_name,
          score=@score, total_score=@total_score, note=@note WHERE id=@id`,
    args: {
      id,
      test_date: input.test_date,
      test_name: input.test_name || null,
      score: input.score,
      total_score: input.total_score,
      note: input.note || null,
    },
  });
}

export async function deleteWeeklyTest(id: number): Promise<void> {
  await db.execute({
    sql: `DELETE FROM weekly_tests WHERE id = ?`,
    args: [id],
  });
}

// ---- Prospects (아직 정식 등록 전, 상담 예정/완료 문의자) ----

export async function getProspects(
  status?: ProspectStatus
): Promise<Prospect[]> {
  if (status) {
    const result = await db.execute({
      sql: `SELECT * FROM prospects WHERE status = ? ORDER BY consult_date ASC, id ASC`,
      args: [status],
    });
    return result.rows as unknown as Prospect[];
  }
  const result = await db.execute(
    `SELECT * FROM prospects ORDER BY consult_date ASC, id ASC`
  );
  return result.rows as unknown as Prospect[];
}

export async function getProspect(id: number): Promise<Prospect | undefined> {
  const result = await db.execute({
    sql: `SELECT * FROM prospects WHERE id = ?`,
    args: [id],
  });
  return result.rows[0] as unknown as Prospect | undefined;
}

export async function createProspect(input: {
  name: string;
  grade?: string;
  school?: string;
  phone?: string;
  parent_phone?: string;
  consult_date: string;
  memo?: string;
}): Promise<void> {
  await db.execute({
    sql: `INSERT INTO prospects (name, grade, school, phone, parent_phone, consult_date, memo)
          VALUES (@name, @grade, @school, @phone, @parent_phone, @consult_date, @memo)`,
    args: {
      name: input.name,
      grade: input.grade || null,
      school: input.school || null,
      phone: input.phone || null,
      parent_phone: input.parent_phone || null,
      consult_date: input.consult_date,
      memo: input.memo || null,
    },
  });
}

export async function updateProspectStatus(
  id: number,
  status: ProspectStatus
): Promise<void> {
  await db.execute({
    sql: `UPDATE prospects SET status = ? WHERE id = ?`,
    args: [status, id],
  });
}

export async function deleteProspect(id: number): Promise<void> {
  await db.execute({ sql: `DELETE FROM prospects WHERE id = ?`, args: [id] });
}

// ---- Payments ----

export async function getPayments(studentId: number): Promise<Payment[]> {
  const result = await db.execute({
    sql: `SELECT * FROM payments WHERE student_id = ? ORDER BY paid_date DESC, id DESC`,
    args: [studentId],
  });
  return result.rows as unknown as Payment[];
}

export async function createPayment(input: {
  student_id: number;
  paid_date: string;
  amount: number;
  period?: string;
  memo?: string;
}): Promise<void> {
  await db.execute({
    sql: `INSERT INTO payments (student_id, paid_date, amount, period, memo)
          VALUES (@student_id, @paid_date, @amount, @period, @memo)`,
    args: {
      student_id: input.student_id,
      paid_date: input.paid_date,
      amount: input.amount,
      period: input.period || null,
      memo: input.memo || null,
    },
  });
}

export async function updatePayment(
  id: number,
  input: {
    paid_date: string;
    amount: number;
    period?: string;
    memo?: string;
  }
): Promise<void> {
  await db.execute({
    sql: `UPDATE payments SET paid_date=@paid_date, amount=@amount,
          period=@period, memo=@memo WHERE id=@id`,
    args: {
      id,
      paid_date: input.paid_date,
      amount: input.amount,
      period: input.period || null,
      memo: input.memo || null,
    },
  });
}

export async function deletePayment(id: number): Promise<void> {
  await db.execute({ sql: `DELETE FROM payments WHERE id = ?`, args: [id] });
}

export async function getLatestPaymentDate(
  studentId: number
): Promise<string | null> {
  const result = await db.execute({
    sql: `SELECT MAX(paid_date) AS last_paid FROM payments WHERE student_id = ?`,
    args: [studentId],
  });
  const row = result.rows[0] as unknown as { last_paid: string | null } | undefined;
  return row?.last_paid ?? null;
}

// 학생 id별 가장 최근 결제일. 사이드바/대시보드에서 여러 학생의 연체 여부를
// 한 번에 계산할 때 학생 수만큼 쿼리하지 않도록 한 번의 쿼리로 가져온다.
export async function getLatestPaymentDatesByStudent(): Promise<
  Record<number, string>
> {
  const result = await db.execute(
    `SELECT student_id, MAX(paid_date) AS last_paid FROM payments GROUP BY student_id`
  );
  const rows = result.rows as unknown as {
    student_id: number;
    last_paid: string;
  }[];
  const map: Record<number, string> = {};
  for (const row of rows) {
    map[row.student_id] = row.last_paid;
  }
  return map;
}

// ---- School exams (학원 자체 테스트가 아닌, 학교 본 시험 성적) ----

export async function getSchoolExams(
  studentId: number
): Promise<SchoolExam[]> {
  const result = await db.execute({
    sql: `SELECT * FROM school_exams WHERE student_id = ? ORDER BY exam_date ASC, id ASC`,
    args: [studentId],
  });
  return result.rows as unknown as SchoolExam[];
}

export async function createSchoolExam(input: {
  student_id: number;
  exam_date: string;
  exam_name?: string;
  score: number;
  total_score: number;
  note?: string;
}): Promise<void> {
  await db.execute({
    sql: `INSERT INTO school_exams (student_id, exam_date, exam_name, score, total_score, note)
          VALUES (@student_id, @exam_date, @exam_name, @score, @total_score, @note)`,
    args: {
      student_id: input.student_id,
      exam_date: input.exam_date,
      exam_name: input.exam_name || null,
      score: input.score,
      total_score: input.total_score,
      note: input.note || null,
    },
  });
}

export async function updateSchoolExam(
  id: number,
  input: {
    exam_date: string;
    exam_name?: string;
    score: number;
    total_score: number;
    note?: string;
  }
): Promise<void> {
  await db.execute({
    sql: `UPDATE school_exams SET exam_date=@exam_date, exam_name=@exam_name,
          score=@score, total_score=@total_score, note=@note WHERE id=@id`,
    args: {
      id,
      exam_date: input.exam_date,
      exam_name: input.exam_name || null,
      score: input.score,
      total_score: input.total_score,
      note: input.note || null,
    },
  });
}

export async function deleteSchoolExam(id: number): Promise<void> {
  await db.execute({
    sql: `DELETE FROM school_exams WHERE id = ?`,
    args: [id],
  });
}

// ---- Makeup classes (결석/보강) ----

export async function getMakeupClasses(
  studentId: number
): Promise<MakeupClass[]> {
  const result = await db.execute({
    sql: `SELECT * FROM makeup_classes WHERE student_id = ? ORDER BY absence_date DESC, id DESC`,
    args: [studentId],
  });
  return result.rows as unknown as MakeupClass[];
}

export async function createMakeupClass(input: {
  student_id: number;
  absence_date: string;
  makeup_date?: string;
  memo?: string;
}): Promise<void> {
  await db.execute({
    sql: `INSERT INTO makeup_classes (student_id, absence_date, makeup_date, memo)
          VALUES (@student_id, @absence_date, @makeup_date, @memo)`,
    args: {
      student_id: input.student_id,
      absence_date: input.absence_date,
      makeup_date: input.makeup_date || null,
      memo: input.memo || null,
    },
  });
}

export async function updateMakeupClass(
  id: number,
  input: {
    absence_date: string;
    makeup_date?: string;
    memo?: string;
  }
): Promise<void> {
  await db.execute({
    sql: `UPDATE makeup_classes SET absence_date=@absence_date, makeup_date=@makeup_date,
          memo=@memo WHERE id=@id`,
    args: {
      id,
      absence_date: input.absence_date,
      makeup_date: input.makeup_date || null,
      memo: input.memo || null,
    },
  });
}

export async function deleteMakeupClass(id: number): Promise<void> {
  await db.execute({
    sql: `DELETE FROM makeup_classes WHERE id = ?`,
    args: [id],
  });
}

// 대시보드 캘린더용: makeup_date가 주어진 범위(YYYY-MM-DD, 양끝 포함) 안에 있는
// 모든 학생의 보강 일정을 학생 이름과 함께 가져온다.
export async function getMakeupClassesInRange(
  startDate: string,
  endDate: string
): Promise<(MakeupClass & { student_name: string })[]> {
  const result = await db.execute({
    sql: `SELECT m.*, s.name AS student_name
          FROM makeup_classes m
          JOIN students s ON s.id = m.student_id
          WHERE m.makeup_date IS NOT NULL AND m.makeup_date BETWEEN ? AND ?
          ORDER BY m.makeup_date ASC`,
    args: [startDate, endDate],
  });
  return result.rows as unknown as (MakeupClass & { student_name: string })[];
}
