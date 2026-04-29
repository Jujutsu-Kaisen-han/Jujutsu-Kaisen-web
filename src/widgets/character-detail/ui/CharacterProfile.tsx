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
import { Panel } from '@/shared/ui/Panel';

const Layout = styled.div`
  display: grid;
  gap: 20px;
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

const Poster = styled.img`
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
`;

const VideoEmbed = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
`;

const VideoTitle = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const EmptyText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
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
}

const skillVideoPatterns = [/スキル紹介/u, /必殺スキル紹介動画/u];

const selectOfficialSkillVideo = (character: CharacterDetail) => (
  character.officialVideos?.find((video) => skillVideoPatterns.some((pattern) => pattern.test(video.title)))
);

export const CharacterProfile = ({ character }: CharacterProfileProps) => {
  const officialSkillVideo = selectOfficialSkillVideo(character);

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
          <Poster src={character.image} alt={character.name} />
        </PosterPanel>
        <Summary>
          <Header>
            <TierBadge tier={character.tier} />
            <Variant>{character.variantName}</Variant>
            <Title>{character.name}</Title>
            <Subtitle>{character.baseName} · {character.title}</Subtitle>
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
        <Panel>
          <SectionTitle>공식 소개</SectionTitle>
          <SkillList>
            {character.officialProfile ? (
              <SkillCard>
                <SkillName>기본 캐릭터 소개</SkillName>
                <SkillDescription>{character.officialProfile.summary}</SkillDescription>
                <SourceList>
                  <SourceLink
                    href={character.officialProfile.source.url}
                    target="_blank"
                    rel="noreferrer"
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
                    rel="noreferrer"
                  >
                    {character.officialVariantSpotlight.source.label}
                  </SourceLink>
                </SourceList>
              </SkillCard>
            ) : null}
          </SkillList>
        </Panel>

        <Panel>
          <SectionTitle>공식 스킬 영상</SectionTitle>
          {officialSkillVideo ? (
            <VideoGrid>
              <VideoCard>
                <VideoFrame>
                  <VideoEmbed
                    src={officialSkillVideo.embedUrl}
                    title={officialSkillVideo.title}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </VideoFrame>
                <VideoTitle>{officialSkillVideo.title}</VideoTitle>
                <SourceList>
                  <SourceLink href={officialSkillVideo.url} target="_blank" rel="noreferrer">
                    YouTube에서 보기
                  </SourceLink>
                  <SourceLink href={officialSkillVideo.source.url} target="_blank" rel="noreferrer">
                    {officialSkillVideo.source.label}
                  </SourceLink>
                </SourceList>
              </VideoCard>
            </VideoGrid>
          ) : (
            <EmptyText>현재 연결된 공식 스킬 소개 영상이 없습니다.</EmptyText>
          )}
        </Panel>
      </SectionGrid>

      <SectionGrid>
        <Panel>
          <SectionTitle>스킬</SectionTitle>
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

        <Panel>
          <SectionTitle>필살기</SectionTitle>
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
