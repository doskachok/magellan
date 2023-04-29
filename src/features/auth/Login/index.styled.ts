import styled from 'styled-components';
import { Column } from 'components/Containers';
import { TextLink, TextRegular } from 'components';

export const ContentWrapperLogin = styled(Column)`
  padding: 120px 20px 24px; // top, horizontal, bottom
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
`

export const NoAccountLink = styled(TextLink)`
  margin-top: 15px;
`
