# Jujutsu Kaisen Fan Archive

React + TypeScript + Vite로 만든 주술회전 팬 웹 서비스입니다. 팬텀 퍼레이드 캐릭터 티어표, 캐릭터 도감, 상세 프로필, 검색/필터링, 작품 정보 페이지를 반응형 UI로 제공합니다.

## 주요 기능

- 티어별 캐릭터 보드
- 캐릭터 목록, 한글/영문/초성 검색, 특성/분류/역할 필터, 공유 가능한 URL 필터
- 캐릭터 상세 페이지, 이전/다음 캐릭터 이동, 스킬/필살기/공식 소개 영상
- 원작, 애니메이션, 팬텀 퍼레이드 정보를 정리한 작품 정보 페이지
- `react-router-dom` 기반 네비게이션과 404 페이지
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

- `/` - 팬텀 퍼레이드 티어표
- `/characters` - 캐릭터 도감과 검색/필터 (`q`, `trait`, `category`, `role`, `sort` 쿼리 지원)
- `/characters/:characterId` - 캐릭터 상세
- `/series` - 작품 정보

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
- 캐릭터 즐겨찾기와 비교 기능
- 반응형 화면별 시각 회귀 확인
