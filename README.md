# ABE — Able English 학생 관리

영어학원에서 선생님 한 명이 여러 학생을 담당할 때, 학생별 **상담 기록**·**실력 체크**·**주간 테스트 점수**를 한곳에서 관리할 수 있는 웹 앱입니다.

## 주요 기능

- **로그인 화면**: 공유 비밀번호 하나로 접근을 제한하는 초기 진입 화면. 로그인하면 브라우저에 30일간 세션이 유지되어 매번 다시 로그인할 필요가 없습니다.
- **좌측 사이드바 네비게이션**: 모든 페이지에서 고정된 사이드바로 학생을 바로 전환. 학년별로 그룹(중2, 고1, 학년 미입력 등)이 자동 구성되고, 이름 검색으로 빠르게 찾을 수 있습니다.
- **학생 관리**: 학생 등록(`/students/new`)/정보 수정/삭제 (이름, 학년, 학교, 성별, 학생/학부모 연락처, 결제일, 메모)
- **결제 관리**: 학생마다 다른 매월 결제일을 등록해두면 다음 결제 예정일을 자동 계산해서 보여줍니다. 결제일/금액/수강 기간/메모로 결제 이력을 기록·조회
- **미납/연체 표시**: 이번 결제 주기 안에 결제 기록이 없으면 자동으로 "연체 N일째"로 표시됩니다. 학생 상세 페이지 헤더, 사이드바(빨간 점), 대시보드의 "결제 미납·연체 학생" 목록에서 한눈에 확인할 수 있습니다.
- **상담 기록**: 상담 완료/예정 구분, 상담 내용, 다음 계획(후속 조치) 기록 및 이력 조회. 대시보드에서 예정된 상담을 한눈에 확인
- **상담 예정 문의자(신규 등록 전)**: 아직 정식 학생이 아닌 문의자의 상담 일정을 대시보드에서 바로 등록. 상담이 끝나면 "상담 완료"로 표시하고, 입력했던 이름/연락처/학년 등 정보를 그대로 이어받아 "신규 학생으로 등록" 버튼 한 번으로 정식 학생 등록까지 연결됩니다.
- **실력 체크**: 문법 / 작문 / 독해·해석 / 어휘 / 듣기 / 말하기 카테고리별로 수준(매우 부족 ~ 우수)과 구체적인 부족 부분 메모 기록. 학생 페이지 상단에 카테고리별 최신 수준이 한눈에 표시됩니다.
- **주간 테스트**: 시험 날짜/시험명/점수/만점/메모 기록, 최근 테스트 평균(100점 환산) 자동 계산
- **학교 성적**: 학원 자체 테스트와 별개로, 실제 학교 시험 성적을 기록하고 추이를 라인 그래프로 확인
- **보강 관리**: 학생이 언제 결석했고 보강을 언제 할지 기록 (결석일/보강일/메모). 보강일이 지나면 자동으로 "보강 완료"로 표시. 대시보드에는 이번 달 캘린더에 보강 예정인 학생만 표시되어 학생이 많아도 한눈에 확인 가능
- **기록 수정**: 상담/실력체크/테스트/학교성적/결제/보강 기록 모두 삭제뿐 아니라 그 자리에서 바로 수정 가능
- **전화번호 자동 포맷**: 학생/학부모 연락처 입력 시 숫자만 입력해도 010-0000-0000 형식으로 자동 정리

## 기술 스택

- [Next.js](https://nextjs.org) (App Router, Server Actions, Proxy)
- TypeScript, Tailwind CSS
- SQLite 호환 DB (`@libsql/client`) — 로컬 개발 시에는 로컬 파일(`data/academy.db`), 배포 시에는 [Turso](https://turso.tech)(무료 호스팅 SQLite)에 연결. 코드는 동일하고 환경 변수만 다릅니다.

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

## Vercel + Turso로 무료 배포하기

Vercel은 요청마다 서버가 새로 뜨는 서버리스 방식이라 로컬 파일에 저장하는 방식이 안 맞습니다. 그래서 데이터는 [Turso](https://turso.tech)(무료 티어가 있는 SQLite 호환 클라우드 DB)에 저장하고, 앱 자체만 Vercel에 올립니다.

### 1. Turso 데이터베이스 만들기

```bash
# Turso CLI 설치
curl -sSfL https://get.tur.so/install.sh | bash

# 계정 생성/로그인 (브라우저가 열립니다)
turso auth signup

# 데이터베이스 생성 (이름은 원하는 대로)
turso db create abe-academy

# 연결 주소 확인 (libsql://... 형태)
turso db show abe-academy --url

# 인증 토큰 발급
turso db tokens create abe-academy
```

`turso db show ... --url`로 나온 값은 `TURSO_DATABASE_URL`에, `turso db tokens create`로 나온 토큰은 `TURSO_AUTH_TOKEN`에 사용합니다. (CLI 설치가 부담스러우면 [turso.tech](https://turso.tech) 웹사이트에서 가입 후 대시보드로 데이터베이스를 만들어도 동일합니다.)

### 2. GitHub에 코드 올리기

```bash
git push origin main
```

### 3. Vercel에 배포

1. [vercel.com](https://vercel.com)에서 GitHub 계정으로 로그인
2. "Add New... → Project"에서 이 저장소(GitHub repo)를 선택 (Next.js 프로젝트는 자동으로 인식됩니다)
3. 배포 전에 **Environment Variables**에 아래 값을 추가:

   | Key | Value |
   |---|---|
   | `TURSO_DATABASE_URL` | 1단계에서 확인한 `libsql://...` 주소 |
   | `TURSO_AUTH_TOKEN` | 1단계에서 발급한 토큰 |
   | `ABE_ADMIN_PASSWORD` | 선생님께 알려드릴 로그인 비밀번호 (기본값 `ableenglish`를 꼭 바꾸세요) |
   | `ABE_FORCE_SECURE_COOKIE` | `true` (Vercel은 HTTPS로 서비스되므로 반드시 true) |

4. "Deploy" 클릭 → 완료되면 `https://프로젝트이름.vercel.app` 같은 주소가 생성됩니다.

이후 이 주소와 `ABE_ADMIN_PASSWORD`로 설정한 비밀번호만 선생님께 문자/카톡으로 보내드리면, 선생님은 설치 없이 브라우저에서 접속해 로그인만 하면 됩니다. 코드를 수정해서 다시 `git push`하면 Vercel이 자동으로 재배포합니다.

## 데이터 백업

- **로컬에서만 실행하는 경우**: 모든 데이터는 `data/academy.db` 파일 하나에 저장됩니다(`.gitignore`에 포함되어 커밋되지 않음). 이 파일만 주기적으로 복사해두면 백업이 됩니다.
- **Turso에 배포한 경우**: `turso db dump abe-academy > backup.sql` 명령으로 언제든 전체 데이터를 백업할 수 있습니다.

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
    Sidebar.tsx               # 학년별 그룹 + 검색 + 연체 학생 표시가 있는 좌측 사이드바
    BrandLogo.tsx             # 핑크 원형 로고
    PaymentStatusBadge.tsx    # 미납/연체/완료 상태 배지
    MakeupStatusBadge.tsx     # 보강 미정/예정/완료 상태 배지
    MakeupCalendar.tsx        # 대시보드 이번 달 보강 캘린더
    ScoreLineChart.tsx        # 학교 성적 추이 SVG 라인 차트
    PhoneInput.tsx            # 000-0000-0000 자동 포맷 전화번호 입력
    EditableItem.tsx          # 목록 항목 보기/수정 모드 토글 공용 컴포넌트
    Tabs.tsx, ConfirmSubmitButton.tsx
  lib/
    db.ts                     # SQLite 초기화 및 스키마
    data.ts                   # DB 조회/저장 함수
    actions.ts                # Server Actions (폼 처리)
    auth.ts, auth-actions.ts  # 비밀번호 검증, 로그인/로그아웃 Server Actions
    payment.ts                # 결제 예정일/미납·연체 상태 계산
    makeup.ts                 # 보강 미정/예정/완료 상태 계산
    types.ts, grade.ts, skill.ts # 타입, 카테고리/레벨 상수, 학년 정렬 유틸
  proxy.ts                    # 로그인 여부에 따라 /login으로 리다이렉트 (구 middleware)
```
