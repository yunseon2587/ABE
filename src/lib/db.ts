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

  CREATE INDEX IF NOT EXISTS idx_consultations_student ON consultations(student_id);
  CREATE INDEX IF NOT EXISTS idx_skill_checks_student ON skill_checks(student_id);
  CREATE INDEX IF NOT EXISTS idx_weekly_tests_student ON weekly_tests(student_id);
`);

export default db;
