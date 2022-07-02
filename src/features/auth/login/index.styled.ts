import styled from 'styled-components';
import { PageContentWrapper } from '../../../components/Containers';
import { TextRegular } from '../../../components/Text';

export const ContentWrapper = styled(PageContentWrapper)`
  padding-top: 120px;
  padding-bottom: 24px;
  flex: 1;
`;

export const RequiredText = styled(TextRegular)`
  & span {
    color: #379970;
    padding-right: 4px;
  }
`;

const TextLink = styled.a`
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  text-decoration-line: underline;
  color: #379970;
`;

export const ForgotPasswordLink = styled(TextLink)`
  margin-top: 32px;
`

export const NoAccountLink = styled(TextLink)`
  margin-top: 15px;
`
