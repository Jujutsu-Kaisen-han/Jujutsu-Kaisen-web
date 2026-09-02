import { useEffect, useMemo } from 'react';
import { useLocation, useMatch } from 'react-router-dom';
import { useCharacterStore } from '@/entities/character/model/store/character-store';
import { routePatterns, routes } from '@/shared/config/routes';

const appTitle = '전투력 티어표';

export const RouteMetadata = () => {
  const location = useLocation();
  const detailMatch = useMatch(routePatterns.characterDetail);
  const characterId = detailMatch?.params.characterId;
  const characterName = useCharacterStore((state) => {
    if (!characterId) {
      return undefined;
    }

    return state.characterDetails[characterId]?.name
      ?? state.characters.find((character) => character.id === characterId)?.name;
  });

  const pageTitle = useMemo(() => {
    if (location.pathname === routes.home) {
      return '전투력 티어표 만들기';
    }

    if (location.pathname === routes.characters) {
      return '캐릭터 도감';
    }

    if (location.pathname === routes.series) {
      return '작품 정보';
    }

    if (detailMatch) {
      return characterName ? `${characterName} 상세` : '캐릭터 상세';
    }

    return '페이지를 찾을 수 없음';
  }, [characterName, detailMatch, location.pathname]);

  useEffect(() => {
    document.title = `${pageTitle} | ${appTitle}`;
  }, [pageTitle]);

  return null;
};
