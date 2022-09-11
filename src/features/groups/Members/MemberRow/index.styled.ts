import styled, { css } from 'styled-components';
import { Row } from '../../../../components/Containers';

interface IWrapperProps {
  isSelected: boolean;
}

export const Wrapper = styled(Row) <IWrapperProps>`
  padding: 0.5rem;
 ${props => props.isSelected && css`
    background: ${props => props.theme.colors.selectedItem};
  `};
`;
