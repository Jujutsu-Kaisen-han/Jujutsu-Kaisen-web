import styled from 'styled-components';
import { ButtonLink } from '@/shared/ui/Button';
import { PageIntro } from '@/shared/ui/PageIntro';
import { Panel } from '@/shared/ui/Panel';
import { StatPill } from '@/shared/ui/StatPill';
import { routes } from '@/shared/config/routes';
import { SiteShell } from '@/widgets/layout/ui/SiteShell';

const heroCharacters = [
  { name: '이타도리 유지', image: '/characters/yuji.png' },
  { name: '후시구로 메구미', image: '/characters/megumi.png' },
  { name: '쿠기사키 노바라', image: '/characters/nobara.png' },
  { name: '고죠 사토루', image: '/characters/gojo.png' },
  { name: '료멘 스쿠나', image: '/characters/sukuna.png' },
] as const;

const overviewStats = [
  { label: '원작자', value: '아쿠타미 게게' },
  { label: '연재 시작', value: '2018년 14호' },
  { label: '단행본', value: '30권' },
  { label: '장르', value: '다크 판타지' },
] as const;

const worldNotes = [
  {
    title: '저주와 주력',
    description:
      '사람의 부정적인 감정에서 태어난 저주가 일상을 위협하고, 주술사는 주력을 다뤄 그 균열을 막습니다.',
  },
  {
    title: '스쿠나의 손가락',
    description:
      '특급 주물의 봉인이 풀리며 이타도리 유지가 주술계에 발을 들이고, 료멘 스쿠나를 둘러싼 싸움이 시작됩니다.',
  },
  {
    title: '주술고전',
    description:
      '도쿄와 교토의 주술고전을 중심으로 학생, 교사, 주령, 주저사가 각자의 신념과 생존 방식을 부딪칩니다.',
  },
] as const;

const mediaSections = [
  {
    title: '원작 만화',
    eyebrow: 'Manga',
    description:
      '소년점프 공식 작품 페이지 기준, 주간 소년점프 2018년 14호부터 시작한 아쿠타미 게게의 작품입니다. 공식 목록에는 30권까지 정리되어 있습니다.',
  },
  {
    title: 'TV 애니메이션',
    eyebrow: 'Animation',
    description:
      'TV 애니메이션 공식 사이트는 캐릭터, 에피소드, 스태프/캐스트, 사멸회유 관련 정보를 별도 섹션으로 제공합니다.',
  },
  {
    title: '팬텀 퍼레이드',
    eyebrow: 'Game',
    description:
      '공식 스마트폰 게임 팬텀 퍼레이드는 캐릭터 변형과 속성, 역할 중심으로 팬들이 팀 편성과 티어를 비교하기 좋은 기반을 제공합니다.',
  },
] as const;

const sourceLinks = [
  {
    label: '소년점프 공식 작품 페이지',
    url: 'https://www.shonenjump.com/j/rensai/jujutsu/',
  },
  {
    label: 'TV 애니메이션 공식 사이트',
    url: 'https://jujutsukaisen.jp/',
  },
  {
    label: 'VIZ 공식 주술회전 페이지',
    url: 'https://www.viz.com/jujutsu-kaisen',
  },
  {
    label: '팬텀 퍼레이드 공식 사이트',
    url: 'https://jujutsuphanpara.jp/',
  },
] as const;

const Timeline = [
  {
    date: '2018',
    title: '원작 연재 시작',
    description: '주간 소년점프에서 본편 연재가 시작되며 이타도리 유지와 스쿠나의 이야기가 전개됩니다.',
  },
  {
    date: '2020',
    title: 'TV 애니메이션 전개',
    description: '애니메이션을 통해 주술고전, 교류회, 주요 주령과의 전투가 넓은 팬층에 소개됩니다.',
  },
  {
    date: '2026.06',
    title: '공식 애니 최신 공지',
    description: '소년점프 공식 페이지에는 TV 애니메이션 4기 사멸회유 후편을 향한 시동 소식이 게시되어 있습니다.',
  },
] as const;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const VisualBand = styled(Panel)`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.1fr);
  gap: 24px;
  align-items: center;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const VisualCopy = styled.div`
  display: grid;
  gap: 14px;
`;

const SectionEyebrow = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: clamp(26px, 4vw, 38px);
`;

const BodyText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const CharacterStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(72px, 1fr));
  gap: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(5, minmax(54px, 1fr));
    gap: 8px;
  }
`;

const CharacterFrame = styled.div`
  display: flex;
  align-items: end;
  justify-content: center;
  min-height: 260px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(circle at top, rgba(103, 232, 249, 0.16), transparent 38%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(8, 15, 29, 0.96));

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: 180px;
  }
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const InfoPanel = styled(Panel)`
  display: grid;
  gap: 12px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 20px;
`;

const TimelinePanel = styled(Panel)`
  display: grid;
  gap: 18px;
`;

const TimelineList = styled.div`
  display: grid;
  gap: 14px;
`;

const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  gap: 16px;
  padding: 18px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(8, 15, 29, 0.72);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const TimelineDate = styled.strong`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
`;

const LinkPanel = styled(Panel)`
  display: grid;
  gap: 18px;
`;

const SourceList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SourceLink = styled.a`
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(15, 23, 42, 0.72);
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

export const WorkInfoPage = () => (
  <SiteShell>
    <PageIntro
      eyebrow="Series Guide"
      title="작품 정보"
      description="원작, 애니메이션, 팬텀 퍼레이드로 이어지는 주술회전의 핵심 정보를 팬 사이트 안에서 빠르게 확인할 수 있도록 정리했습니다."
      meta={(
        <Meta>
          {overviewStats.map((stat) => (
            <StatPill key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </Meta>
      )}
      actions={<ButtonLink to={routes.characters}>캐릭터 도감 보기</ButtonLink>}
    />

    <VisualBand>
      <VisualCopy>
        <SectionEyebrow>World View</SectionEyebrow>
        <SectionTitle>저주를 둘러싼 전투와 성장의 기록</SectionTitle>
        <BodyText>
          주술회전은 일상에 스며든 저주, 이를 처리하는 주술사, 그리고 특급 주물 료멘 스쿠나를
          중심으로 벌어지는 충돌을 다룹니다. 이 사이트는 작품 이해와 팬텀 퍼레이드 캐릭터 탐색이
          자연스럽게 이어지도록 구성했습니다.
        </BodyText>
      </VisualCopy>
      <CharacterStrip aria-label="주요 캐릭터 이미지">
        {heroCharacters.map((character) => (
          <CharacterFrame key={character.name}>
            <CharacterImage src={character.image} alt={character.name} />
          </CharacterFrame>
        ))}
      </CharacterStrip>
    </VisualBand>

    <Grid>
      {worldNotes.map((note) => (
        <InfoPanel key={note.title}>
          <SectionEyebrow>Concept</SectionEyebrow>
          <CardTitle>{note.title}</CardTitle>
          <BodyText>{note.description}</BodyText>
        </InfoPanel>
      ))}
    </Grid>

    <Grid>
      {mediaSections.map((section) => (
        <InfoPanel key={section.title}>
          <SectionEyebrow>{section.eyebrow}</SectionEyebrow>
          <CardTitle>{section.title}</CardTitle>
          <BodyText>{section.description}</BodyText>
        </InfoPanel>
      ))}
    </Grid>

    <TimelinePanel>
      <div>
        <SectionEyebrow>Official Milestones</SectionEyebrow>
        <SectionTitle>공식 흐름</SectionTitle>
      </div>
      <TimelineList>
        {Timeline.map((item) => (
          <TimelineItem key={`${item.date}-${item.title}`}>
            <TimelineDate>{item.date}</TimelineDate>
            <div>
              <CardTitle>{item.title}</CardTitle>
              <BodyText>{item.description}</BodyText>
            </div>
          </TimelineItem>
        ))}
      </TimelineList>
    </TimelinePanel>

    <LinkPanel>
      <div>
        <SectionEyebrow>Sources</SectionEyebrow>
        <SectionTitle>공식 링크</SectionTitle>
      </div>
      <BodyText>
        작품 정보는 공식 작품 페이지와 공식 사이트를 기준으로 요약했습니다. 상세한 공지, 에피소드,
        상품 정보는 아래 링크에서 직접 확인할 수 있습니다.
      </BodyText>
      <SourceList>
        {sourceLinks.map((source) => (
          <SourceLink key={source.url} href={source.url} target="_blank" rel="noreferrer">
            {source.label}
          </SourceLink>
        ))}
      </SourceList>
    </LinkPanel>
  </SiteShell>
);
