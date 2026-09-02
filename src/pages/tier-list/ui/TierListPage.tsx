import styled from 'styled-components';
import { groupCharactersByTier } from '@/entities/character/lib/character-selectors';
import { useCharacterStore } from '@/entities/character/model/store/character-store';
import { ButtonLink } from '@/shared/ui/Button';
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

export const TierListPage = () => {
  const characters = useCharacterStore((state) => state.characters);
  const tiers = useCharacterStore((state) => state.tiers);
  const catalogStatus = useCharacterStore((state) => state.catalogStatus);
  const catalogError = useCharacterStore((state) => state.catalogError);
  const tierAssignments = useCharacterStore((state) => state.tierAssignments);
  const loadCatalog = useCharacterStore((state) => state.loadCatalog);
  const setCharacterTier = useCharacterStore((state) => state.setCharacterTier);
  const resetTierAssignments = useCharacterStore((state) => state.resetTierAssignments);

  const sections = groupCharactersByTier(tiers, characters);
  const assignedCharacterIds = new Set(Object.keys(tierAssignments));
  const unassignedCharacters = characters.filter((character) => !assignedCharacterIds.has(character.id));

  return (
    <SiteShell>
      <PageIntro
        eyebrow="전투력 티어표"
        title="나만의 전투력 티어표"
        description="캐릭터를 전투력 기준으로 SS부터 C까지 직접 배치하고, 나만의 티어표를 저장하세요."
        meta={(
          <Meta>
            <StatPill label="총 캐릭터" value={`${characters.length}명`} />
            <StatPill label="티어 구간" value={`${tiers.length}단계`} />
            <StatPill
              label="배치 완료"
              value={`${characters.length - unassignedCharacters.length}명`}
            />
            <StatPill label="미배치" value={`${unassignedCharacters.length}명`} />
          </Meta>
        )}
        actions={<ButtonLink to={routes.characters}>캐릭터 목록 보기</ButtonLink>}
      />

      {catalogStatus === 'loading' && characters.length === 0 ? (
        <LoadingState label="티어표 데이터를 불러오는 중입니다." />
      ) : null}

      {catalogStatus === 'error' ? (
        <ErrorState
          title={characters.length > 0 ? '최신 티어표를 갱신하지 못했어요.' : '티어표를 불러오지 못했어요.'}
          description={catalogError ?? '잠시 후 다시 시도해주세요.'}
          actionLabel="다시 시도"
          onAction={() => {
            void loadCatalog(true);
          }}
        />
      ) : null}

      {characters.length > 0 ? (
        <TierBoard
          sections={sections}
          unassignedCharacters={unassignedCharacters}
          hasCustomTierAssignments={Object.keys(tierAssignments).length > 0}
          onTierChange={setCharacterTier}
          onResetTierAssignments={resetTierAssignments}
        />
      ) : null}
    </SiteShell>
  );
};
