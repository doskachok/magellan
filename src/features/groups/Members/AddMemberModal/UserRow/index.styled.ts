import { Row } from 'components/Containers';
import { TextRegular } from 'components/Text';
import styled from 'styled-components';

export const Wrapper = styled(Row)`
  align-items: center;
  gap: 0.5rem;
`;

export const UserNameOrEmail = styled(TextRegular)`
    color: ${props => props.theme.colors.secondary};
`;