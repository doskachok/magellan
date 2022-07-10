import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;

      button: {
        primary: string;
        disabled: string;
        shadow: string;
      },

      text: {
        primary: string;
        secondary: string;
        link: string;
        error: string;
        title: string,
        border: {
          default: string
        }
      },

      input: {
        border: {
          default: string;
          error: string;
        }
      }
    };
  }
}
