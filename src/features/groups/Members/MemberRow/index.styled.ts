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
    background: ${props => props.theme.colors.selectedItem};
    border-radius: 7px;
  `};
`;

export const Identification = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.8rem;
`;