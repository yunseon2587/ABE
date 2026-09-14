import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "academy.db");

declare global {
  var __academyDb: Database.Database | undefined;
}

const db = globalThis.__academyDb ?? new Database(dbPath);
if (process.env.NODE_ENV !== "production") {
  globalThis.__academyDb = db;
}

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    grade TEXT,
    school TEXT,
    phone TEXT,
    parent_phone TEXT,
    gender TEXT,
    payment_day INTEGER,
    memo TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    consult_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed', -- completed | planned
    content TEXT NOT NULL,
    next_plan TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS skill_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- grammar | writing | reading | vocabulary | listening | speaking
    level INTEGER NOT NULL, -- 1(매우 부족) ~ 5(우수)
    note TEXT,
    checked_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS weekly_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    test_date TEXT NOT NULL,
    test_name TEXT,
    score REAL NOT NULL,
    total_score REAL NOT NULL DEFAULT 100,
    note TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS prospects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    grade TEXT,
    school TEXT,
    phone TEXT,
    parent_phone TEXT,
    consult_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'planned', -- planned | done
    memo TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    paid_date TEXT NOT NULL,
    amount REAL NOT NULL,
    period TEXT,
    memo TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS school_exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    exam_date TEXT NOT NULL,
    exam_name TEXT,
    score REAL NOT NULL,
    total_score REAL NOT NULL DEFAULT 100,
    note TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS makeup_classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    absence_date TEXT NOT NULL,
    makeup_date TEXT,
    memo TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_consultations_student ON consultations(student_id);
  CREATE INDEX IF NOT EXISTS idx_skill_checks_student ON skill_checks(student_id);
  CREATE INDEX IF NOT EXISTS idx_weekly_tests_student ON weekly_tests(student_id);
  CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
  CREATE INDEX IF NOT EXISTS idx_school_exams_student ON school_exams(student_id);
  CREATE INDEX IF NOT EXISTS idx_makeup_classes_student ON makeup_classes(student_id);
  CREATE INDEX IF NOT EXISTS idx_makeup_classes_makeup_date ON makeup_classes(makeup_date);
`);

// students 테이블이 gender/payment_day 컬럼 없이 먼저 만들어졌던 기존 DB를 위한 마이그레이션.
function ensureColumn(table: string, column: string, definition: string) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as {
    name: string;
  }[];
  if (!columns.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}
ensureColumn("students", "gender", "TEXT");
ensureColumn("students", "payment_day", "INTEGER");

export default db;
