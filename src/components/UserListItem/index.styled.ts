import { Row } from 'components/Containers';
import { TextRegular } from 'components/Text';
import styled, { css } from 'styled-components';

export interface IUserNameOrEmailProps {
  underlined?: boolean;
};

export const Wrapper = styled(Row)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const UserNameOrEmail = styled(TextRegular)<IUserNameOrEmailProps>`
  color: ${props => props.theme.colors.secondary};

  ${props => props.underlined && css`
    text-decoration: underline;
  `}
`;