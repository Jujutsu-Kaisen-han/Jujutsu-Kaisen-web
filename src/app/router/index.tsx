import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { routePatterns, routes } from '@/shared/config/routes';
import { LoadingState } from '@/shared/ui/LoadingState';

const TierListPage = lazy(async () => {
  const module = await import('@/pages/tier-list/ui/TierListPage');

  return { default: module.TierListPage };
});

const CharacterListPage = lazy(async () => {
  const module = await import('@/pages/character-list/ui/CharacterListPage');

  return { default: module.CharacterListPage };
});

const CharacterDetailPage = lazy(async () => {
  const module = await import('@/pages/character-detail/ui/CharacterDetailPage');

  return { default: module.CharacterDetailPage };
});

const NotFoundPage = lazy(async () => {
  const module = await import('@/pages/not-found/ui/NotFoundPage');

  return { default: module.NotFoundPage };
});

const withPageLoader = (Component: LazyExoticComponent<ComponentType>) => (
  <Suspense fallback={<LoadingState label="페이지를 불러오는 중입니다." />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: routes.home,
    element: withPageLoader(TierListPage),
  },
  {
    path: routes.characters,
    element: withPageLoader(CharacterListPage),
  },
  {
    path: routePatterns.characterDetail,
    element: withPageLoader(CharacterDetailPage),
  },
  {
    path: '*',
    element: withPageLoader(NotFoundPage),
  },
]);
