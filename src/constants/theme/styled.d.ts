import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      reversed: string;

      button: {
        focused: string;
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

      select: {
        border: {
          default: string;
          reversed: string;
        },
        color: {
          default: string,
          reversed: string,
        },
        placeholder: {
          default: string,
          reversed: string;
        }
      },

      input: {
        border: {
          default: string;
          reversed: string;
          error: string;
        },
        color: {
          reversed: string,
        },
        placeholder: {
          reversed: string;
        }
      }
    };
  }
}
