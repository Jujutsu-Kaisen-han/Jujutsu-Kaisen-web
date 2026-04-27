export interface StackItem {
  name: string;
  description: string;
}

export const stackItems: StackItem[] = [
  {
    name: 'React',
    description: '컴포넌트 기반 UI를 만드는 기본 런타임입니다.',
  },
  {
    name: 'Vite',
    description: '빠른 개발 서버와 빌드 환경을 담당합니다.',
  },
  {
    name: 'React Router',
    description: '페이지 라우팅과 404 처리를 맡습니다.',
  },
  {
    name: 'styled-components',
    description: '전역 스타일, 테마, 컴포넌트 스타일링을 담당합니다.',
  },
];
