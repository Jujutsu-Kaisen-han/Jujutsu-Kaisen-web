import { createBrowserRouter } from 'react-router-dom';
import { CharacterDetailPage } from '@/pages/character-detail/ui/CharacterDetailPage';
import { CharacterListPage } from '@/pages/character-list/ui/CharacterListPage';
import { NotFoundPage } from '@/pages/not-found/ui/NotFoundPage';
import { TierListPage } from '@/pages/tier-list/ui/TierListPage';
import { routePatterns, routes } from '@/shared/config/routes';

export const router = createBrowserRouter([
  {
    path: routes.home,
    element: <TierListPage />,
  },
  {
    path: routes.characters,
    element: <CharacterListPage />,
  },
  {
    path: routePatterns.characterDetail,
    element: <CharacterDetailPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
