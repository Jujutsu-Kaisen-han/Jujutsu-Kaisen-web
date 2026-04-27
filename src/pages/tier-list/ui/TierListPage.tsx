import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { groupCharactersByTier } from '@/entities/character/lib/character-selectors';
import { useCharacterStore } from '@/entities/character/model/store/character-store';
import { Button } from '@/shared/ui/Button';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageIntro } from '@/shared/ui/PageIntro';
import { StatPill } from '@/shared/ui/StatPill';
import { routes } from '@/shared/config/routes';
import { SiteShell } from '@/widgets/layout/ui/SiteShell';
import { TierBoard } from '@/widgets/tier-board/ui/TierBoard';

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ActionLink = styled(Link)`
  display: inline-flex;
`;

export const TierListPage = () => {
  const characters = useCharacterStore((state) => state.characters);
  const tiers = useCharacterStore((state) => state.tiers);
  const catalogStatus = useCharacterStore((state) => state.catalogStatus);
  const catalogError = useCharacterStore((state) => state.catalogError);
  const loadCatalog = useCharacterStore((state) => state.loadCatalog);

  const sections = groupCharactersByTier(tiers, characters);

  return (
    <SiteShell>
      <PageIntro
        eyebrow="Tier Board"
        title="주술회전 팬텀 퍼레이드 티어표"
        description="메타 기준으로 SS부터 C까지 캐릭터를 빠르게 비교하고, 카드 hover와 상세 페이지로 바로 이어지는 팬 사이트 구조입니다."
        meta={(
          <Meta>
            <StatPill label="총 캐릭터" value={`${characters.length}명`} />
            <StatPill label="티어 구간" value={`${tiers.length}단계`} />
          </Meta>
        )}
        actions={(
          <ActionLink to={routes.characters}>
            <Button>캐릭터 도감 보기</Button>
          </ActionLink>
        )}
      />

      {catalogStatus === 'loading' && characters.length === 0 ? (
        <LoadingState label="티어표 데이터를 불러오는 중입니다." />
      ) : null}

      {catalogStatus === 'error' && characters.length === 0 ? (
        <ErrorState
          title="티어표를 불러오지 못했어요."
          description={catalogError ?? '잠시 후 다시 시도해주세요.'}
          actionLabel="다시 시도"
          onAction={() => {
            void loadCatalog(true);
          }}
        />
      ) : null}

      {characters.length > 0 ? <TierBoard sections={sections} /> : null}
    </SiteShell>
  );
};
