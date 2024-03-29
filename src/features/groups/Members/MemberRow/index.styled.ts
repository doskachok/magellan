import styled, { css } from 'styled-components';
import { Row } from 'components/Containers';

interface IWrapperProps {
  isSelected: boolean;
}

export const Wrapper = styled(Row) <IWrapperProps>`
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  ${props => props.isSelected && css`
    outline: solid 1px ${props => props.theme.colors.primary};
    border-radius: 7px;
  `};
`;

export const Actions = styled.div`
  text-align: right;
  align-items: center;
  display: flex;
  gap: 0.8rem;
`;