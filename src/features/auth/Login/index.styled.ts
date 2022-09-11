import styled from 'styled-components';
import { PageContentWrapper } from '../../../components/Containers';
import { TextLink } from '../../../components/Link';
import { TextRegular } from '../../../components/Text';

export const ContentWrapper = styled(PageContentWrapper)`
  padding-top: 120px;
  padding-bottom: 24px;
  flex: 1;
`;

export const RequiredText = styled(TextRegular)`
  & span {
    color: ${props => props.theme.colors.primary};
    padding-right: 4px;
  }
`;

export const ForgotPasswordLink = styled(TextLink)`
  margin-top: 32px;
`;

export const NoAccountLink = styled(TextLink)`
  margin-top: 15px;
`;
