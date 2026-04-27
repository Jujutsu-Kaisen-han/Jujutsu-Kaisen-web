import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.typography.body};
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
      radial-gradient(circle at top, rgba(255, 122, 69, 0.22), transparent 32%),
      radial-gradient(circle at 85% 20%, rgba(103, 232, 249, 0.14), transparent 28%),
      linear-gradient(180deg, #040612 0%, #08101f 48%, #040813 100%);
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: -0.01em;
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

  button,
  input,
  select {
    border: 0;
    outline: 0;
  }

  button {
    cursor: pointer;
  }

  img {
    display: block;
    max-width: 100%;
  }

  ::selection {
    background: rgba(255, 122, 69, 0.3);
  }

  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.75);
  }

  ::-webkit-scrollbar-thumb {
    border: 3px solid rgba(15, 23, 42, 0.75);
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.35);
  }
`;
