import styled from 'styled-components';
import { Column } from 'components/Containers';
import { ButtonStyled } from 'components/Button/index.styled';

export const ContentWrapper = styled(Column)`
  padding: 1rem;
  flex: 1;
`;

export const RemoveBtn = styled(ButtonStyled)`
  background: ${props => props.theme.colors.button.remove};
  &:active {
    background: ${props => props.theme.colors.button.removeFocused};
  }
`;
