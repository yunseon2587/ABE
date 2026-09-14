# ABE — Able English 학생 관리

영어학원에서 선생님 한 명이 여러 학생을 담당할 때, 학생별 **상담 기록**·**실력 체크**·**주간 테스트 점수**를 한곳에서 관리할 수 있는 웹 앱입니다.

## 주요 기능

- **로그인 화면**: 공유 비밀번호 하나로 접근을 제한하는 초기 진입 화면. 로그인하면 브라우저에 30일간 세션이 유지되어 매번 다시 로그인할 필요가 없습니다.
- **좌측 사이드바 네비게이션**: 모든 페이지에서 고정된 사이드바로 학생을 바로 전환. 학년별로 그룹(중2, 고1, 학년 미입력 등)이 자동 구성되고, 이름 검색으로 빠르게 찾을 수 있습니다.
- **학생 관리**: 학생 등록(`/students/new`)/정보 수정/삭제 (이름, 학년, 학교, 학생/학부모 연락처, 메모)
- **상담 기록**: 상담 완료/예정 구분, 상담 내용, 다음 계획(후속 조치) 기록 및 이력 조회. 대시보드에서 예정된 상담을 한눈에 확인
- **실력 체크**: 문법 / 작문 / 독해·해석 / 어휘 / 듣기 / 말하기 카테고리별로 수준(매우 부족 ~ 우수)과 구체적인 부족 부분 메모 기록. 학생 페이지 상단에 카테고리별 최신 수준이 한눈에 표시됩니다.
- **주간 테스트**: 시험 날짜/시험명/점수/만점/메모 기록, 최근 테스트 평균(100점 환산) 자동 계산

## 기술 스택

- [Next.js](https://nextjs.org) (App Router, Server Actions, Proxy)
- TypeScript, Tailwind CSS
- SQLite (`better-sqlite3`) — 별도 DB 서버 없이 로컬 파일(`data/academy.db`)에 저장

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속하면 로그인 화면이 나타납니다. 첫 실행 시 `data/academy.db` 파일과 테이블이 자동으로 생성됩니다.

### 로그인 비밀번호 설정

기본 비밀번호는 `ableenglish` 입니다. 반드시 아래처럼 나만의 비밀번호로 바꿔서 사용하세요.

```bash
cp .env.example .env.local
# .env.local 파일을 열어 ABE_ADMIN_PASSWORD 값을 원하는 비밀번호로 수정
```

> HTTPS 없이 사내망/로컬에서 그대로 접속하는 것을 기본으로 가정합니다. 리버스 프록시 등으로 HTTPS를 앞단에 두고 배포하는 경우에만 `.env.local`에 `ABE_FORCE_SECURE_COOKIE=true`를 추가하세요. HTTPS 없이 이 값을 켜면 브라우저가 로그인 쿠키 저장을 거부해 로그인이 계속 풀립니다.

프로덕션 배포:

```bash
npm run build
npm start
```

## 데이터 백업

모든 데이터는 `data/academy.db` 파일 하나에 저장됩니다(`.gitignore`에 포함되어 커밋되지 않음). 이 파일만 주기적으로 복사해두면 백업이 됩니다.

## 폴더 구조

```
src/
  app/
    layout.tsx                 # 최소 루트 레이아웃 (폰트/전역 스타일만)
    login/                     # 로그인 화면 (비밀번호 입력)
    (app)/
      layout.tsx                # 좌측 사이드바 + 콘텐츠 영역 (로그인 후 화면)
      page.tsx                  # 대시보드 (학생 수, 학년별 인원, 다가오는 상담)
      students/new/page.tsx     # 새 학생 등록 폼
      students/[id]/page.tsx    # 학생 상세: 정보 수정 + 상담/실력체크/테스트 탭
  components/
    Sidebar.tsx               # 학년별 그룹 + 검색이 있는 좌측 사이드바
    BrandLogo.tsx             # 핑크 원형 로고
    Tabs.tsx, ConfirmSubmitButton.tsx
  lib/
    db.ts                     # SQLite 초기화 및 스키마
    data.ts                   # DB 조회/저장 함수
    actions.ts                # Server Actions (폼 처리)
    auth.ts, auth-actions.ts  # 비밀번호 검증, 로그인/로그아웃 Server Actions
    types.ts, grade.ts        # 타입, 카테고리/레벨 상수, 학년 정렬 유틸
  proxy.ts                    # 로그인 여부에 따라 /login으로 리다이렉트 (구 middleware)
```
