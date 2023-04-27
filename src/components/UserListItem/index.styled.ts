import { TextRegular } from 'components/Text';
import styled, { css } from 'styled-components';

export interface IUserNameOrEmailProps {
  underlined?: boolean;
};

export const UserNameOrEmail = styled(TextRegular)<IUserNameOrEmailProps>`
  color: ${props => props.theme.colors.secondary};

  ${props => props.underlined && css`
    text-decoration: underline;
  `}
`;