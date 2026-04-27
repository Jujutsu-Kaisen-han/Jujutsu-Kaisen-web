interface CreateCharacterPosterOptions {
  name: string;
  title: string;
  accent: string;
  shadow: string;
}

export const createCharacterPoster = ({
  name,
  title,
  accent,
  shadow,
}: CreateCharacterPosterOptions): string => {
  const symbol = name.slice(0, 2);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${shadow}" />
          <stop offset="55%" stop-color="#090d18" />
          <stop offset="100%" stop-color="#111827" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="20%" r="70%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.95" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="760" rx="42" fill="url(#bg)" />
      <rect x="26" y="26" width="548" height="708" rx="32" fill="none" stroke="${accent}" stroke-opacity="0.34" />
      <circle cx="300" cy="160" r="170" fill="url(#glow)" />
      <text x="52" y="116" fill="#f8fafc" font-size="58" font-family="Pretendard, Apple SD Gothic Neo, sans-serif" font-weight="800">${symbol}</text>
      <text x="52" y="584" fill="#f8fafc" font-size="40" font-family="Pretendard, Apple SD Gothic Neo, sans-serif" font-weight="700">${name}</text>
      <text x="52" y="640" fill="${accent}" font-size="25" font-family="Pretendard, Apple SD Gothic Neo, sans-serif" font-weight="600">${title}</text>
      <text x="52" y="692" fill="#94a3b8" font-size="20" font-family="Pretendard, Apple SD Gothic Neo, sans-serif">Phantom Parade Tier Board</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
