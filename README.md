# ABE — Able English 학생 관리

영어학원에서 선생님 한 명이 여러 학생을 담당할 때, 학생별 **상담 기록**·**실력 체크**·**주간 테스트 점수**를 한곳에서 관리할 수 있는 웹 앱입니다.

## 주요 기능

- **좌측 사이드바 네비게이션**: 모든 페이지에서 고정된 사이드바로 학생을 바로 전환. 학년별로 그룹(중2, 고1, 학년 미입력 등)이 자동 구성되고, 이름 검색으로 빠르게 찾을 수 있습니다.
- **학생 관리**: 학생 등록(`/students/new`)/정보 수정/삭제 (이름, 학년, 학교, 학생/학부모 연락처, 메모)
- **상담 기록**: 상담 완료/예정 구분, 상담 내용, 다음 계획(후속 조치) 기록 및 이력 조회. 대시보드에서 예정된 상담을 한눈에 확인
- **실력 체크**: 문법 / 작문 / 독해·해석 / 어휘 / 듣기 / 말하기 카테고리별로 수준(매우 부족 ~ 우수)과 구체적인 부족 부분 메모 기록. 학생 페이지 상단에 카테고리별 최신 수준이 한눈에 표시됩니다.
- **주간 테스트**: 시험 날짜/시험명/점수/만점/메모 기록, 최근 테스트 평균(100점 환산) 자동 계산

## 기술 스택

- [Next.js](https://nextjs.org) (App Router, Server Actions)
- TypeScript, Tailwind CSS
- SQLite (`better-sqlite3`) — 별도 DB 서버 없이 로컬 파일(`data/academy.db`)에 저장

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속. 첫 실행 시 `data/academy.db` 파일과 테이블이 자동으로 생성됩니다.

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
    layout.tsx                # 전체 레이아웃: 좌측 사이드바 + 콘텐츠 영역
    page.tsx                  # 대시보드 (학생 수, 학년별 인원, 다가오는 상담)
    students/new/page.tsx     # 새 학생 등록 폼
    students/[id]/page.tsx    # 학생 상세: 정보 수정 + 상담/실력체크/테스트 탭
  components/
    Sidebar.tsx               # 학년별 그룹 + 검색이 있는 좌측 사이드바
    Tabs.tsx, ConfirmSubmitButton.tsx
  lib/
    db.ts                     # SQLite 초기화 및 스키마
    data.ts                   # DB 조회/저장 함수
    actions.ts                # Server Actions (폼 처리)
    types.ts, grade.ts        # 타입, 카테고리/레벨 상수, 학년 정렬 유틸
```
