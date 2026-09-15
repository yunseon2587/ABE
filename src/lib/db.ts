import { createClient, type Client } from "@libsql/client";
import path from "path";
import fs from "fs";

// 로컬 개발 시에는 로컬 SQLite 파일을 그대로 쓰고, 배포 환경(Vercel 등)에서는
// TURSO_DATABASE_URL/TURSO_AUTH_TOKEN을 지정해 Turso(호스팅 SQLite)에 연결한다.
// Vercel 같은 서버리스 환경은 파일시스템이 요청마다/배포마다 초기화될 수 있어
// 로컬 파일에만 의존하면 데이터가 유지되지 않는다.
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

let url: string;
if (tursoUrl) {
  url = tursoUrl;
} else {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  url = `file:${path.join(dataDir, "academy.db")}`;
}

declare global {
  var __academyDb: Client | undefined;
}

const db =
  globalThis.__academyDb ??
  createClient(tursoAuthToken ? { url, authToken: tursoAuthToken } : { url });
if (process.env.NODE_ENV !== "production") {
  globalThis.__academyDb = db;
}

await db.execute("PRAGMA foreign_keys = ON");
if (!tursoUrl) {
  // 로컬 파일 모드에서는 Next.js 빌드가 여러 워커 프로세스를 동시에 띄워
  // 같은 파일에 접근하므로, WAL 모드 + busy_timeout으로 SQLITE_BUSY(락 충돌)를 방지한다.
  // Turso(원격) 연결에서는 서버가 동시성을 알아서 처리하므로 필요 없다.
  await db.execute("PRAGMA journal_mode = WAL");
  await db.execute("PRAGMA busy_timeout = 5000");
}

await db.executeMultiple(`
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
async function ensureColumn(table: string, column: string, definition: string) {
  const result = await db.execute(`PRAGMA table_info(${table})`);
  const exists = result.rows.some((row) => row.name === column);
  if (!exists) {
    await db.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}
await ensureColumn("students", "gender", "TEXT");
await ensureColumn("students", "payment_day", "INTEGER");

export default db;
