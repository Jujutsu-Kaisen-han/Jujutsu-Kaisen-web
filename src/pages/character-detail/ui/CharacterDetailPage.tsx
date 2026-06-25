import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCharacterStore } from '@/entities/character/model/store/character-store';
import { ButtonLink } from '@/shared/ui/Button';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageIntro } from '@/shared/ui/PageIntro';
import { routes } from '@/shared/config/routes';
import { SiteShell } from '@/widgets/layout/ui/SiteShell';
import { CharacterProfile } from '@/widgets/character-detail/ui/CharacterProfile';

export const CharacterDetailPage = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const characters = useCharacterStore((state) => state.characters);
  const characterDetails = useCharacterStore((state) => state.characterDetails);
  const detailStatusById = useCharacterStore((state) => state.detailStatusById);
  const detailErrorById = useCharacterStore((state) => state.detailErrorById);
  const loadCharacterById = useCharacterStore((state) => state.loadCharacterById);

  useEffect(() => {
    if (!characterId) {
      return;
    }

    void loadCharacterById(characterId);
  }, [characterId, loadCharacterById]);

  if (!characterId) {
    return null;
  }

  const character = characterDetails[characterId];
  const summary = characters.find((item) => item.id === characterId);
  const detailStatus = detailStatusById[characterId] ?? 'idle';
  const detailError = detailErrorById[characterId] ?? null;

  return (
    <SiteShell>
      <ButtonLink to={routes.characters} variant="ghost">
        캐릭터 목록으로
      </ButtonLink>

      {character ? (
        <CharacterProfile character={character} />
      ) : null}

      {!character && (detailStatus === 'idle' || detailStatus === 'loading') ? (
        <>
          <PageIntro
            eyebrow="Character Detail"
            title={summary?.name ?? '캐릭터 정보'}
            description="상세 정보를 불러오고 있습니다."
          />
          <LoadingState label="스킬과 티어 정보를 불러오는 중입니다." />
        </>
      ) : null}

      {!character && detailStatus === 'error' ? (
        <ErrorState
          title="상세 정보를 불러오지 못했어요."
          description={detailError ?? '잠시 후 다시 시도해주세요.'}
          actionLabel="다시 시도"
          onAction={() => {
            void loadCharacterById(characterId, true);
          }}
        />
      ) : null}

      {!character && detailStatus === 'success' ? (
        <ErrorState
          title="캐릭터를 찾을 수 없어요."
          description="목록으로 돌아가 다른 캐릭터를 선택해보세요."
          actionLabel="목록으로 이동"
          onAction={() => {
            navigate(routes.characters);
          }}
        />
      ) : null}
    </SiteShell>
  );
};
