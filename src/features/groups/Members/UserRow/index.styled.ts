import styled, { css } from 'styled-components';
import { Row } from '../../../../components/Containers';
import { TextRegular } from '../../../../components/Text';

export const Wrapper = styled(Row)`
  align-items: center;
`;

export const Avatar = styled.img`
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

interface IUserNameOrEmailProps {
  reversedTheme?: boolean;
}

export const UserNameOrEmail = styled(TextRegular) <IUserNameOrEmailProps>`
  ${props => props.reversedTheme && css`
    color: ${props => props.theme.colors.secondary};
  `};
`;
