import styled from 'styled-components';
import type { CharacterSummary, TierGroup } from '@/entities/character/model/types/character';
import { CharacterCard } from '@/entities/character/ui/CharacterCard';
import { TierBadge } from '@/entities/character/ui/TierBadge';
import { Panel } from '@/shared/ui/Panel';

const Board = styled.div`
  display: grid;
  gap: 18px;
`;

const Row = styled(Panel)`
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 22px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Side = styled.div`
  display: grid;
  gap: 14px;
`;

const Headline = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

interface TierBoardSection extends TierGroup {
  characters: CharacterSummary[];
}

interface TierBoardProps {
  sections: TierBoardSection[];
}

export const TierBoard = ({ sections }: TierBoardProps) => (
  <Board>
    {sections.map((section) => (
      <Row key={section.tier}>
        <Side>
          <TierBadge tier={section.tier} />
          <Headline>{section.headline}</Headline>
        </Side>
        <CardGrid>
          {section.characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </CardGrid>
      </Row>
    ))}
  </Board>
);
