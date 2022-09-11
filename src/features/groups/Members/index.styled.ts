import styled from 'styled-components';
import { ButtonStyled } from '../../../components/Button/index.styled';
import { Column } from '../../../components/Containers';

export const Wrapper = styled(Column)`
  height: 88vh;
`;

export const ContentWrapper = styled(Column)`
  width: 100%;
  padding: 1rem;
`;

export const RemoveBtn = styled(ButtonStyled)`
  background: ${props => props.theme.colors.button.remove};

  &:active {
      background: ${props => props.theme.colors.button.removeFocused};
  }
`;
