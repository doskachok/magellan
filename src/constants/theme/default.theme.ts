import { DefaultTheme } from 'styled-components';

const PRIMARY_GREEN = '#379970';

const WHITE = '#FFFFFF';
const WHITE_FADED = 'rgba(255, 255, 255, 0.5)';

const BLACK = '#000000';
const BLACK_FADED = 'rgba(0, 0, 0, 0.5)';

const SUCCESS_GREEN = '#28a745';
const ERROR_RED = '#FF2121';

const defaultTheme: DefaultTheme = {
  colors: {
    primary: PRIMARY_GREEN,
    secondary: WHITE,
    secondaryFaded: WHITE_FADED,
    selectedItem: '#AEE8E4',

    loader: {
      background: '#d3d3d370',
    },

    button: {
      focused: '#00854D',
      primary: '#00A862',
      disabled: '#C4C4C4',
      shadow: 'rgba(0, 0, 0, 0.25)',
      remove: 'rgba(255, 0, 0, 0.5)',
      removeFocused: 'rgba(255, 0, 0, 0.7)',
    },

    text: {
      primary: BLACK,
      secondary: WHITE,
      link: PRIMARY_GREEN,
      error: ERROR_RED,
      title: BLACK_FADED,
      border: {
        default: BLACK_FADED,
      },
      notification: {
        success: SUCCESS_GREEN,
      },
    },

    select: {
      border: {
        default: BLACK_FADED,
        reversed: WHITE_FADED
      },
      color: {
        default: BLACK,
        reversed: WHITE,
      },
      placeholder: {
        default: BLACK,
        reversed: WHITE_FADED,
      }
    },

    input: {
      border: {
        default: BLACK_FADED,
        reversed: WHITE_FADED,
        error: 'rgba(255, 0, 0, 0.75)',
      },
      color: {
        reversed: WHITE,
      },
      placeholder: {
        reversed: WHITE_FADED,
      }
    },
    modal: {
      background: {
        default: WHITE
      }
    }
  }
};

export default defaultTheme;
