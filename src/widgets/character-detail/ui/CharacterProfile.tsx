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

const Showcase = styled(CharacterArtwork)`
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.md};
  aspect-ratio: 16 / 9;
  object-fit: cover;
  object-position: center top;
  background:
    radial-gradient(circle at top, rgba(255, 122, 69, 0.18), transparent 42%),
    linear-gradient(180deg, rgba(8, 15, 29, 0.82) 0%, rgba(8, 15, 29, 1) 100%);

  &[data-source='fallback'] {
    padding-top: 28px;
    object-fit: contain;
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

export const CharacterProfile = ({ character }: CharacterProfileProps) => (
  <Layout>
    <ShowcasePanel>
      <Showcase
        src={character.variantImage}
        fallbackSrc={character.image}
        alt={`${character.name} 변형 이미지`}
      />
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
