import { DefaultTheme } from 'styled-components';

const PRIMARY_COLOR = '#379970';
const REVERSED_COLOR = 'rgba(255, 255, 255, 0.5)';

const defaultTheme: DefaultTheme = {
  colors: {
    primary: PRIMARY_COLOR,
    reversed: REVERSED_COLOR,

    loader: {
      background: '#d3d3d370',
    },

    button: {
      focused: '#00854D',
      primary: '#00A862',
      disabled: '#C4C4C4',
      shadow: 'rgba(0, 0, 0, 0.25)',
    },

    text: {
      primary: '#000000',
      secondary: '#FFFFFF',
      link: PRIMARY_COLOR,
      error: '#FF2121',
      title: 'rgba(0, 0, 0, 0.5)',
      border: {
        default: 'rgba(0, 0, 0, 0.5)',
      },
      notification: {
        success: '#28a745',
      },
    },

    select: {
      border: {
        default: 'rgba(0, 0, 0, 0.5)',
        reversed: REVERSED_COLOR
      },
      color: {
        default: '#000000',
        reversed: '#FFFFFF',
      },
      placeholder: {
        default: '#000000',
        reversed: REVERSED_COLOR,
      }
    },

    input: {
      border: {
        default: 'rgba(0, 0, 0, 0.5)',
        reversed: REVERSED_COLOR,
        error: 'rgba(255, 0, 0, 0.75)',
      },
      color: {
        reversed: '#FFFFFF',
      },
      placeholder: {
        reversed: REVERSED_COLOR,
      }
    },
    modal: {
      background: {
        default: '#FFFFFF'
      }
    }
  }
};

export default defaultTheme;
