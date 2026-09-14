# ABE — Able English 학생 관리

영어학원에서 선생님 한 명이 여러 학생을 담당할 때, 학생별 **상담 기록**·**실력 체크**·**주간 테스트 점수**를 한곳에서 관리할 수 있는 웹 앱입니다.

## 주요 기능

- **학생 관리**: 학생 등록/검색/정보 수정/삭제 (이름, 학년, 학교, 학생/학부모 연락처, 메모)
- **상담 기록**: 상담 완료/예정 구분, 상담 내용, 다음 계획(후속 조치) 기록 및 이력 조회
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
    page.tsx                 # 학생 목록 + 등록 폼 (대시보드)
    students/[id]/page.tsx   # 학생 상세: 정보 수정 + 상담/실력체크/테스트 탭
  components/                # 공용 UI (탭, 삭제 확인 버튼)
  lib/
    db.ts                    # SQLite 초기화 및 스키마
    data.ts                  # DB 조회/저장 함수
    actions.ts               # Server Actions (폼 처리)
    types.ts                 # 타입 및 카테고리/레벨 상수
```
