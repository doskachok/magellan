import {DefaultTheme} from 'styled-components';

const PRIMARY_COLOR = '#379970';

const defaultTheme: DefaultTheme = {
  colors: {
    primary: PRIMARY_COLOR,

    button: {
      primary: '#00A862',
      disabled: '#C4C4C4',
      shadow: 'rgba(0, 0, 0, 0.25)',
    },

    text: {
      primary: '#000000',
      secondary: '#FFFFFF',
      link: PRIMARY_COLOR,
      error: '#FF2121',
    },

    input: {
      border: {
        default: 'rgba(0, 0, 0, 0.5)',
        error: 'rgba(255, 0, 0, 0.75)',
      }
    },
  }
};

export default defaultTheme;
