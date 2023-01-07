import styled, {css} from 'styled-components';
import {PageContentWrapper, Column} from 'components/Containers';
import {TextRegular} from 'components/Text';

export const ContentWrapper = styled(PageContentWrapper)`
  padding-top: 60px;
  padding-bottom: 24px;
  flex: 1;
`;

export const RequiredText = styled(TextRegular)`
  & span {
    color: ${props => props.theme.colors.primary};
    padding-right: 4px;
  }
`;

export const PasswordRequirementsWrapper = styled(Column)`
  margin-top: 17px;
`;

export const PasswordRequirementsText = styled(TextRegular)<{ fulfilled?: boolean }>`
  font-size: 12px;
  
  ${props => props.fulfilled && css`
    color: ${props.theme.colors.primary};
  `};
`;

