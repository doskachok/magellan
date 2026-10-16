import { createGlobalStyle } from 'styled-components';

import montserratRegular from 'assets/fonts/Montserrat-Regular.ttf';
import montserratSemiBold from 'assets/fonts/Montserrat-SemiBold.ttf';

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Montserrat';
    font-weight: 400;
    font-display: swap;
    src: local('Montserrat'), url(${montserratRegular}) format('truetype');
  }

  @font-face {
    font-family: 'Montserrat';
    font-weight: 600 700;
    font-display: swap;
    src: local('Montserrat SemiBold'), url(${montserratSemiBold}) format('truetype');
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  :root {
    color-scheme: light;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.font.family};
    font-size: ${({ theme }) => theme.font.size.md};
    line-height: ${({ theme }) => theme.font.lineHeight.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
  }

  h1, h2, h3, p {
    margin: 0;
  }

  button, input, select, textarea {
    font: inherit;
    color: inherit;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

  .visually-hidden {
    position: absolute !important;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
`;
