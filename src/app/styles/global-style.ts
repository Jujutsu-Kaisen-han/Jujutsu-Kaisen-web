import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    color: ${({ theme }) => theme.colors.text};
    font-family: "Pretendard", "Apple SD Gothic Neo", sans-serif;
    line-height: 1.5;
    font-weight: 400;
    background: ${({ theme }) => theme.colors.background};
    color-scheme: dark;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background:
      radial-gradient(circle at top, rgba(248, 113, 113, 0.2), transparent 35%),
      linear-gradient(180deg, #050816 0%, #0f172a 100%);
    color: ${({ theme }) => theme.colors.text};
  }

  body,
  button,
  input,
  textarea {
    font: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
