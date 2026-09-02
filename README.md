# 전투력 티어표

React + TypeScript + Vite로 만든 전투력 티어표 제작 사이트입니다. 캐릭터를 검색하고 SS부터 C까지
직접 배치한 뒤, 나만의 티어표를 로컬에 저장할 수 있습니다. 현재는 주술회전 캐릭터 데이터가 샘플로
들어 있습니다.

## 주요 기능

- 전투력 기준 SS~C 티어 보드
- 드래그앤드롭 티어표 편집, 개인 배치 로컬 저장, 전체 배치 초기화
- 티어표에 넣을 캐릭터 목록, 한글/영문/초성 검색, 특성/분류/역할/즐겨찾기 필터
- 캐릭터 상세 페이지, 로컬 저장소 기반 즐겨찾기, 스킬/필살기/공식 소개 영상
- `react-router-dom` 기반 네비게이션과 404 페이지
- 라우트 전환 시 스크롤 복원, 경로별 문서 제목, 키보드 사용자를 위한 본문 건너뛰기 링크
- `styled-components` 기반 다크 테마 반응형 레이아웃

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버 기본 주소는 Vite 기본값인 `http://localhost:5173`입니다.

## 스크립트

```bash
npm run build      # TypeScript 검사 후 Vite 프로덕션 빌드
npm run typecheck  # TypeScript 검사
npm test           # Node 기반 HTTP 유틸 테스트
npm run preview    # 빌드 결과 미리보기
```

## 라우트

- `/` - 전투력 티어표 작업 공간
- `/characters` - 티어표에 넣을 캐릭터 검색 (`q`, `trait`, `category`, `role`, `sort`, `favorites` 쿼리 지원)
- `/characters/:characterId` - 캐릭터 상세
- `/series` - 작품 정보

티어표는 처음에 SS/S/A/B/C 등급 구역만 비워 둔 채 모든 캐릭터를 `미배치 캐릭터` 영역에 표시합니다.
캐릭터 카드를 원하는 등급 구역으로 드래그하면 배치되고, 변경 내용은 브라우저의 로컬 저장소에
저장됩니다. `전체 배치 초기화`로 모든 캐릭터를 다시 미배치 상태로 되돌릴 수 있습니다.

## 프로젝트 구조

```text
src
├── app          # 앱 프로바이더, 라우터, 전역 스타일
├── entities     # 캐릭터 타입, mock API, 카드 UI
├── features     # 검색/필터 컨트롤, 네비게이션
├── pages        # 라우트 단위 페이지
├── shared       # 공통 설정, API 유틸, UI 컴포넌트, 테마
└── widgets      # 페이지 조립용 복합 UI
```

## 데이터와 출처

현재 데이터는 mock API로 동작하며 `src/entities/character/api/mockData.ts`에 정의되어 있습니다. 작품 정보와 공식 링크는 아래 공식 사이트를 기준으로 요약했습니다.

- 소년점프 공식 작품 페이지: https://www.shonenjump.com/j/rensai/jujutsu/
- TV 애니메이션 공식 사이트: https://jujutsukaisen.jp/
- VIZ 공식 주술회전 페이지: https://www.viz.com/jujutsu-kaisen
- 팬텀 퍼레이드 공식 사이트: https://jujutsuphanpara.jp/

## 향후 개선 사항

- 공식 데이터 변경을 더 쉽게 반영할 수 있는 데이터 업데이트 워크플로우
- 캐릭터 비교 기능
- 반응형 화면별 시각 회귀 확인
