import { useState } from 'react';
import styled from 'styled-components';
import type {
  CharacterSummary,
  CharacterTier,
  TierGroup,
} from '@/entities/character/model/types/character';
import { CharacterCard } from '@/entities/character/ui/CharacterCard';
import { TierBadge } from '@/entities/character/ui/TierBadge';
import { tierOrder } from '@/entities/character/model/types/character';
import { Button } from '@/shared/ui/Button';
import { Panel } from '@/shared/ui/Panel';

const Board = styled.div`
  display: grid;
  gap: 18px;
`;

const Toolbar = styled(Panel)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const ToolbarCopy = styled.div`
  display: grid;
  gap: 6px;
`;

const ToolbarTitle = styled.h2`
  margin: 0;
  font-size: 20px;
`;

const ToolbarDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;

const ToolbarActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const EditorNotice = styled.p`
  margin: -4px 0 0;
  padding: 0 4px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
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
  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
  gap: 16px;
`;

const EditorList = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 2px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const EditorItem = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(120px, 160px);
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(8, 15, 29, 0.58);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const EditorName = styled.span`
  min-width: 0;
  overflow-wrap: anywhere;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 700;
`;

const TierSelect = styled.select`
  width: 100%;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.input};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    box-shadow: 0 0 0 4px rgba(255, 122, 69, 0.12);
  }
`;

interface TierBoardSection extends TierGroup {
  characters: CharacterSummary[];
}

interface TierBoardProps {
  sections: TierBoardSection[];
  hasCustomTierAssignments: boolean;
  onTierChange: (characterId: string, tier: CharacterTier) => void;
  onResetTierAssignments: () => void;
}

export const TierBoard = ({
  sections,
  hasCustomTierAssignments,
  onTierChange,
  onResetTierAssignments,
}: TierBoardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Board>
      <Toolbar>
        <ToolbarCopy>
          <ToolbarTitle>티어표 조정</ToolbarTitle>
          <ToolbarDescription>
            원하는 캐릭터의 티어를 바꾸고 나만의 티어표를 저장할 수 있습니다.
          </ToolbarDescription>
        </ToolbarCopy>
        <ToolbarActions>
          <Button
            variant={isEditing ? 'primary' : 'ghost'}
            aria-pressed={isEditing}
            onClick={() => setIsEditing((current) => !current)}
          >
            {isEditing ? '편집 닫기' : '티어 편집'}
          </Button>
          {hasCustomTierAssignments ? (
            <Button variant="ghost" onClick={onResetTierAssignments}>
              기본 티어 복원
            </Button>
          ) : null}
        </ToolbarActions>
      </Toolbar>
      {isEditing ? (
        <EditorNotice role="status">
          각 캐릭터의 티어를 선택하면 즉시 저장되고, 카드도 새 티어 구역으로 이동합니다.
        </EditorNotice>
      ) : null}
      {sections.map((section) => (
        <Row key={section.tier}>
          <Side>
            <TierBadge tier={section.tier} />
            <Headline>{section.headline}</Headline>
          </Side>
          <div>
            <CardGrid>
              {section.characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </CardGrid>
            {isEditing ? (
              <EditorList aria-label={`${section.tier} 티어 캐릭터 조정`}>
                {section.characters.map((character) => (
                  <EditorItem key={character.id}>
                    <EditorName>
                      {character.name}
                      {character.variantName !== '기본형' ? ` · ${character.variantName}` : ''}
                    </EditorName>
                    <TierSelect
                      value={section.tier}
                      aria-label={`${character.name} ${character.variantName} 티어`}
                      onChange={(event) => onTierChange(character.id, event.target.value as CharacterTier)}
                    >
                      {tierOrder.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier} 티어
                        </option>
                      ))}
                    </TierSelect>
                  </EditorItem>
                ))}
              </EditorList>
            ) : null}
          </div>
        </Row>
      ))}
    </Board>
  );
};
