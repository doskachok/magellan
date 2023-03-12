import styled, { css } from 'styled-components';
import { Row } from 'components/Containers';
import { TextRegular } from 'components';

interface IWrapperProps {
  isSelected: boolean;
}

export const Wrapper = styled(Row) <IWrapperProps>`
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
 ${props => props.isSelected && css`
    background: ${props => props.theme.colors.selectedItem};
  `};
`;

export const MemberName = styled(TextRegular)`
  flex: 1;
`;