import styled from 'styled-components';
import {
  combatTypeLabels,
  officialCategoryLabels,
  roleLabels,
  traitLabels,
  type CharacterDetail,
} from '@/entities/character/model/types/character';
import { CharacterArtwork } from '@/entities/character/ui/CharacterArtwork';
import { TierBadge } from '@/entities/character/ui/TierBadge';
import { Button } from '@/shared/ui/Button';
import { Panel } from '@/shared/ui/Panel';

const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const ShowcasePanel = styled(Panel)`
  padding: 16px;
  overflow: hidden;
`;

const ShowcaseStage = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.md};
  background:
    radial-gradient(circle at top, rgba(255, 122, 69, 0.18), transparent 42%),
    linear-gradient(180deg, rgba(8, 15, 29, 0.82) 0%, rgba(8, 15, 29, 1) 100%);
`;

const ShowcaseBackdrop = styled(CharacterArtwork)`
  position: absolute;
  inset: -10%;
  width: calc(100% + 20%);
  height: calc(100% + 20%);
  object-fit: cover;
  object-position: center top;
  filter: blur(24px);
  opacity: 0.32;
  transform: scale(1.06);
`;

const ShowcaseFrame = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px 24px 0;
`;

const Showcase = styled(CharacterArtwork)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;

  &[data-source='fallback'] {
    object-position: center bottom;
  }
`;

const Hero = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const PosterPanel = styled(Panel)`
  padding: 16px;
`;

const Poster = styled(CharacterArtwork)`
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.md};
  aspect-ratio: 15 / 22;
  object-fit: contain;
  object-position: center bottom;
  background:
    radial-gradient(circle at top, rgba(255, 122, 69, 0.16), transparent 38%),
    linear-gradient(180deg, rgba(8, 15, 29, 0.82) 0%, rgba(8, 15, 29, 1) 100%);
`;

const Summary = styled(Panel)`
  display: grid;
  gap: 18px;
`;

const Header = styled.div`
  display: grid;
  gap: 10px;
`;

const HeaderTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const FavoriteIcon = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  line-height: 1;
`;

const Variant = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(34px, 5vw, 56px);
  line-height: 0.95;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 16px;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
`;

const SourceList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SourceLink = styled.a`
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  background: rgba(15, 23, 42, 0.6);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const SkillList = styled.div`
  display: grid;
  gap: 14px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px;
  font-size: 22px;
`;

const SectionDescription = styled.p`
  margin: -6px 0 16px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const VideoPanel = styled(Panel)`
  grid-column: 1 / -1;
`;

const VideoCount = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 13px;
  font-weight: 700;
`;

const SkillCard = styled.div`
  display: grid;
  gap: 8px;
  padding: 18px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(8, 15, 29, 0.78);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SkillName = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const SkillDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const VideoGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const VideoCard = styled.div`
  display: grid;
  gap: 12px;
`;

const VideoFrame = styled.div`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  aspect-ratio: 16 / 9;
  background:
    radial-gradient(circle at top, rgba(255, 122, 69, 0.16), transparent 40%),
    rgba(8, 15, 29, 0.9);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`;

const VideoEmbed = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
`;

const VideoTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  overflow-wrap: anywhere;
`;

const VideoEyebrow = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
`;

const EmptyText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const RelatedVideoList = styled.div`
  display: grid;
  gap: 10px;
`;

const RelatedVideoTitle = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const RelatedVideoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const RelatedVideoLink = styled.a`
  display: grid;
  gap: 6px;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(8, 15, 29, 0.72);
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors.borderStrong};
    background: rgba(15, 23, 42, 0.92);
  }
`;

const RelatedVideoName = styled.span`
  font-size: 14px;
  font-weight: 700;
  overflow-wrap: anywhere;
`;

const RelatedVideoSource = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
`;

const Cooldown = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

interface CharacterProfileProps {
  character: CharacterDetail;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

type OfficialVideo = NonNullable<CharacterDetail['officialVideos']>[number];

const getOfficialVideoEmbedTitle = (
  character: CharacterDetail,
  video: OfficialVideo,
) => `${character.name} 공식 영상: ${video.title}`;

export const CharacterProfile = ({
  character,
  isFavorite,
  onToggleFavorite,
}: CharacterProfileProps) => {
  const officialVideos = character.officialVideos ?? [];
  const featuredOfficialVideo = officialVideos[0];
  const relatedOfficialVideos = officialVideos.slice(1);
  const hasVariant = character.variantName.trim().length > 0 && character.variantName !== '기본형';
  const hasOfficialProfileContent = Boolean(
    character.officialProfile || character.officialVariantSpotlight,
  );

  return (
    <Layout>
      <ShowcasePanel>
        <ShowcaseStage>
          <ShowcaseBackdrop
            src={character.variantImage}
            fallbackSrc={character.image}
            alt=""
            aria-hidden="true"
          />
          <ShowcaseFrame>
            <Showcase
              src={character.variantImage}
              fallbackSrc={character.image}
              alt={`${character.name} 변형 이미지`}
            />
          </ShowcaseFrame>
        </ShowcaseStage>
      </ShowcasePanel>

      <Hero>
        <PosterPanel>
          <Poster
            src={character.image}
            fallbackSrc="/characters/placeholder-character.svg"
            alt={character.name}
          />
        </PosterPanel>
        <Summary>
          <Header>
            <HeaderTop>
              <TierBadge tier={character.tier} />
              <Button
                variant="ghost"
                aria-pressed={isFavorite}
                onClick={onToggleFavorite}
                title={isFavorite ? '즐겨찾기에서 제거' : '즐겨찾기에 추가'}
              >
                <FavoriteIcon aria-hidden="true">{isFavorite ? '★' : '☆'}</FavoriteIcon>
                {isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              </Button>
            </HeaderTop>
            {hasVariant ? <Variant>{character.variantName}</Variant> : null}
            <Title>{character.name}</Title>
            <Subtitle>{character.title}</Subtitle>
          </Header>
          <Chips>
            <Chip>{traitLabels[character.trait]}</Chip>
            <Chip>{combatTypeLabels[character.combatType]}</Chip>
            <Chip>{roleLabels[character.role]}</Chip>
            <Chip>{officialCategoryLabels[character.officialCategory]}</Chip>
            <Chip>{character.rarity}</Chip>
            <Chip>{character.releaseType}</Chip>
          </Chips>
          <Description>{character.description}</Description>
          <SkillCard>
            <SkillName>패시브</SkillName>
            <SkillDescription>{character.passive}</SkillDescription>
          </SkillCard>
        </Summary>
      </Hero>

      <SectionGrid>
        <Panel aria-labelledby="official-profile-title">
          <SectionTitle id="official-profile-title">공식 소개</SectionTitle>
          {hasOfficialProfileContent ? (
            <SkillList>
              {character.officialProfile ? (
                <SkillCard>
                  <SkillName>기본 캐릭터 소개</SkillName>
                  <SkillDescription>{character.officialProfile.summary}</SkillDescription>
                  <SourceList>
                    <SourceLink
                      href={character.officialProfile.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {character.officialProfile.source.label}
                    </SourceLink>
                  </SourceList>
                </SkillCard>
              ) : null}

              {character.officialVariantSpotlight ? (
                <SkillCard>
                  <SkillName>공식 변형 스포트라이트</SkillName>
                  <SkillDescription>{character.officialVariantSpotlight.summary}</SkillDescription>
                  <SourceList>
                    <SourceLink
                      href={character.officialVariantSpotlight.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {character.officialVariantSpotlight.source.label}
                    </SourceLink>
                  </SourceList>
                </SkillCard>
              ) : null}
            </SkillList>
          ) : (
            <EmptyText>
              현재 연결된 공식 소개 요약은 없습니다. 연결된 공식 영상과 출처 링크를 기준으로 확인해 주세요.
            </EmptyText>
          )}
        </Panel>

        <VideoPanel aria-labelledby="official-video-title">
          <SectionHeader>
            <SectionTitle id="official-video-title">공식 영상</SectionTitle>
            <VideoCount>{officialVideos.length}개</VideoCount>
          </SectionHeader>
          <SectionDescription>
            공식 채널에 등록된 대표 영상과 관련 영상을 확인할 수 있습니다.
          </SectionDescription>
          {featuredOfficialVideo ? (
            <VideoGrid>
              <VideoCard>
                <VideoFrame>
                  <VideoEmbed
                    src={featuredOfficialVideo.embedUrl}
                    title={getOfficialVideoEmbedTitle(character, featuredOfficialVideo)}
                    loading="eager"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </VideoFrame>
                <VideoEyebrow>대표 공식 영상</VideoEyebrow>
                <VideoTitle>{featuredOfficialVideo.title}</VideoTitle>
                <SourceList>
                  <SourceLink
                    href={featuredOfficialVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${featuredOfficialVideo.title} YouTube에서 보기`}
                  >
                    YouTube에서 보기
                  </SourceLink>
                  <SourceLink
                    href={featuredOfficialVideo.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${featuredOfficialVideo.source.label} 출처 열기`}
                  >
                    {featuredOfficialVideo.source.label}
                  </SourceLink>
                </SourceList>
              </VideoCard>
              {relatedOfficialVideos.length > 0 ? (
                <RelatedVideoList aria-label="관련 공식 영상">
                  <RelatedVideoHeader>
                    <RelatedVideoTitle>관련 공식 영상</RelatedVideoTitle>
                    <VideoCount>{relatedOfficialVideos.length}개</VideoCount>
                  </RelatedVideoHeader>
                  {relatedOfficialVideos.map((video) => (
                    <RelatedVideoLink
                      key={video.url}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${video.title} 공식 영상 열기`}
                    >
                      <RelatedVideoName>{video.title}</RelatedVideoName>
                      <RelatedVideoSource>{video.source.label}</RelatedVideoSource>
                    </RelatedVideoLink>
                  ))}
                </RelatedVideoList>
              ) : null}
            </VideoGrid>
          ) : (
            <EmptyText>현재 연결된 공식 영상이 없습니다.</EmptyText>
          )}
        </VideoPanel>
      </SectionGrid>

      <SectionGrid>
        <Panel aria-labelledby="skills-title">
          <SectionTitle id="skills-title">스킬</SectionTitle>
          <SkillList>
            {character.skills.map((skill) => (
              <SkillCard key={skill.name}>
                <SkillName>{skill.name}</SkillName>
                {skill.cooldown ? <Cooldown>{skill.cooldown}</Cooldown> : null}
                <SkillDescription>{skill.description}</SkillDescription>
              </SkillCard>
            ))}
          </SkillList>
        </Panel>

        <Panel aria-labelledby="ultimate-title">
          <SectionTitle id="ultimate-title">필살기</SectionTitle>
          <SkillCard>
            <SkillName>{character.ultimate.name}</SkillName>
            {character.ultimate.cooldown ? <Cooldown>{character.ultimate.cooldown}</Cooldown> : null}
            <SkillDescription>{character.ultimate.description}</SkillDescription>
          </SkillCard>
        </Panel>
      </SectionGrid>
    </Layout>
  );
};
