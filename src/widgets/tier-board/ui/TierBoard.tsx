import { useState, type DragEvent } from 'react';
import styled from 'styled-components';
import {
  tierOrder,
  type CharacterSummary,
  type CharacterTier,
  type TierGroup,
} from '@/entities/character/model/types/character';
import { CharacterCard } from '@/entities/character/ui/CharacterCard';
import { TierBadge } from '@/entities/character/ui/TierBadge';
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

const Row = styled(Panel)<{ $isDropTarget: boolean }>`
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
  border-color: ${({ $isDropTarget, theme }) => (
    $isDropTarget ? theme.colors.primary : theme.colors.border
  )};
  box-shadow: ${({ $isDropTarget, theme }) => (
    $isDropTarget ? theme.shadows.glow : theme.shadows.card
  )};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

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
  min-height: 180px;
`;

const DropHint = styled.p`
  display: grid;
  min-height: 180px;
  place-items: center;
  margin: 0;
  padding: 24px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
`;

const DragItem = styled.div<{ $isDragging: boolean }>`
  min-width: 0;
  cursor: grab;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.45 : 1)};

  &:active {
    cursor: grabbing;
  }
`;

const PlacementControl = styled.label`
  display: grid;
  gap: 6px;
  margin-top: 10px;
`;

const PlacementLabel = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
  font-weight: 700;
`;

const PlacementSelect = styled.select`
  width: 100%;
  min-height: 38px;
  padding: 0 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.input};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    box-shadow: 0 0 0 4px rgba(255, 122, 69, 0.12);
  }
`;

const EditorNotice = styled.p`
  margin: -4px 0 0;
  padding: 0 4px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
`;

const UnassignedPanel = styled(Panel)<{ $isDropTarget: boolean }>`
  display: grid;
  gap: 18px;
  border-color: ${({ $isDropTarget, theme }) => (
    $isDropTarget ? theme.colors.primary : theme.colors.borderStrong
  )};
  box-shadow: ${({ $isDropTarget, theme }) => (
    $isDropTarget ? theme.shadows.glow : theme.shadows.card
  )};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
`;

const UnassignedHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
`;

const UnassignedTitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

const UnassignedTitle = styled.h2`
  margin: 0;
  font-size: clamp(24px, 4vw, 34px);
`;

const UnassignedDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const Count = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 13px;
  font-weight: 700;
`;

const UnassignedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
  gap: 16px;
  min-height: 180px;
`;

const UnassignedDropHint = styled(DropHint)`
  grid-column: 1 / -1;
`;

interface TierBoardSection extends TierGroup {
  characters: CharacterSummary[];
}

interface TierBoardProps {
  sections: TierBoardSection[];
  unassignedCharacters: CharacterSummary[];
  hasCustomTierAssignments: boolean;
  onTierChange: (characterId: string, tier: CharacterTier | null) => void;
  onResetTierAssignments: () => void;
}

export const TierBoard = ({
  sections,
  unassignedCharacters,
  hasCustomTierAssignments,
  onTierChange,
  onResetTierAssignments,
}: TierBoardProps) => {
  const [draggedCharacterId, setDraggedCharacterId] = useState<string | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<CharacterTier | 'unassigned' | null>(null);
  const [dragStatus, setDragStatus] = useState('캐릭터 카드를 등급 구역으로 끌어다 놓으세요.');
  const charactersById = new Map(
    [...sections.flatMap((section) => section.characters), ...unassignedCharacters]
      .map((character) => [character.id, character]),
  );

  const handleDragStart = (event: DragEvent<HTMLDivElement>, characterId: string) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', characterId);
    setDraggedCharacterId(characterId);
    const character = charactersById.get(characterId);
    setDragStatus(`${character?.name ?? '캐릭터'} 카드를 선택했습니다. 원하는 등급 구역에 놓으세요.`);
  };

  const handleDragEnd = () => {
    setDraggedCharacterId(null);
    setDragOverTarget(null);
  };

  const handleDragOver = (
    event: DragEvent<HTMLElement>,
    destination: CharacterTier | 'unassigned',
  ) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDragOverTarget(destination);
  };

  const handleDrop = (
    event: DragEvent<HTMLElement>,
    destination: CharacterTier | null,
  ) => {
    event.preventDefault();
    const characterId = event.dataTransfer.getData('text/plain');

    if (characterId) {
      onTierChange(characterId, destination);
      const character = charactersById.get(characterId);
      const destinationLabel = destination ? `${destination} 등급` : '미배치 영역';
      setDragStatus(`${character?.name ?? '캐릭터'} 카드를 ${destinationLabel}에 배치했습니다.`);
    }

    handleDragEnd();
  };

  const renderDraggableCard = (character: CharacterSummary, displayTier?: CharacterTier) => (
    <DragItem
      key={character.id}
      draggable
      $isDragging={draggedCharacterId === character.id}
      onDragStart={(event) => handleDragStart(event, character.id)}
      onDragEnd={handleDragEnd}
    >
      <CharacterCard character={character} />
      <PlacementControl>
        <PlacementLabel>빠른 배치</PlacementLabel>
        <PlacementSelect
          value={displayTier ?? ''}
          aria-label={`${character.name} 티어 빠른 배치`}
          onChange={(event) => onTierChange(
            character.id,
            event.target.value === '' ? null : event.target.value as CharacterTier,
          )}
        >
          <option value="">미배치</option>
          {tierOrder.map((tier) => (
            <option key={tier} value={tier}>
              {tier} 등급
            </option>
          ))}
        </PlacementSelect>
      </PlacementControl>
    </DragItem>
  );

  return (
    <Board>
      <Toolbar>
        <ToolbarCopy>
          <ToolbarTitle>나만의 티어표</ToolbarTitle>
          <ToolbarDescription>
            아래 미배치 캐릭터를 원하는 등급으로 끌어다 놓으세요.
          </ToolbarDescription>
        </ToolbarCopy>
        <ToolbarActions>
          {hasCustomTierAssignments ? (
            <Button variant="ghost" onClick={onResetTierAssignments}>
              전체 배치 초기화
            </Button>
          ) : null}
        </ToolbarActions>
      </Toolbar>
      <EditorNotice role="status" aria-live="polite">
        {dragStatus}
      </EditorNotice>
      {sections.map((section) => (
        <Row
          key={section.tier}
          $isDropTarget={dragOverTarget === section.tier}
          aria-label={`${section.tier} 등급 배치 구역`}
          onDragOver={(event) => handleDragOver(event, section.tier)}
          onDragLeave={() => setDragOverTarget(null)}
          onDrop={(event) => handleDrop(event, section.tier)}
        >
          <Side>
            <TierBadge tier={section.tier} />
            <Headline>{section.headline}</Headline>
          </Side>
          <CardGrid>
            {section.characters.length > 0 ? section.characters.map((character) => (
              renderDraggableCard(character, section.tier)
            )) : (
              <DropHint>이곳으로 캐릭터를 끌어다 놓으세요.</DropHint>
            )}
          </CardGrid>
        </Row>
      ))}
      <UnassignedPanel
        $isDropTarget={dragOverTarget === 'unassigned'}
        aria-label="미배치 캐릭터 이동 구역"
        onDragOver={(event) => handleDragOver(event, 'unassigned')}
        onDragLeave={() => setDragOverTarget(null)}
        onDrop={(event) => handleDrop(event, null)}
      >
        <UnassignedHeader>
          <UnassignedTitleGroup>
            <UnassignedTitle>미배치 캐릭터</UnassignedTitle>
            <UnassignedDescription>
              아직 등급을 정하지 않은 캐릭터입니다. 카드를 원하는 등급으로 옮겨보세요.
            </UnassignedDescription>
          </UnassignedTitleGroup>
          <Count>{unassignedCharacters.length}명</Count>
        </UnassignedHeader>
        <UnassignedGrid>
          {unassignedCharacters.length > 0 ? unassignedCharacters.map((character) => (
            renderDraggableCard(character)
          )) : (
            <UnassignedDropHint>
              모든 캐릭터가 티어에 배치되었습니다. 카드를 이곳으로 끌어오면 다시 미배치할 수 있습니다.
            </UnassignedDropHint>
          )}
        </UnassignedGrid>
      </UnassignedPanel>
    </Board>
  );
};
