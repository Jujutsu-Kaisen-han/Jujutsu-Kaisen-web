import styled from 'styled-components';
import {
  elementLabels,
  roleLabels,
  type CharacterDetail,
} from '@/entities/character/model/types/character';
import { TierBadge } from '@/entities/character/ui/TierBadge';
import { Panel } from '@/shared/ui/Panel';

const Layout = styled.div`
  display: grid;
  gap: 20px;
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
  aspect-ratio: 4 / 5;
  object-fit: cover;
`;

const Summary = styled(Panel)`
  display: grid;
  gap: 18px;
`;

const Header = styled.div`
  display: grid;
  gap: 10px;
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
    <Hero>
      <PosterPanel>
        <Poster src={character.image} alt={character.name} />
      </PosterPanel>
      <Summary>
        <Header>
          <TierBadge tier={character.tier} />
          <Title>{character.name}</Title>
          <Subtitle>{character.title}</Subtitle>
        </Header>
        <Chips>
          <Chip>{elementLabels[character.element]}</Chip>
          <Chip>{roleLabels[character.role]}</Chip>
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
