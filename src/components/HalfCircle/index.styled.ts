import { Row } from 'components/Containers';
import styled from 'styled-components';

export const HalfCircle = styled(Row)`
  border-radius: 50% / 100%;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background: ${props => props.theme.colors.primary};
  width: 100vw;
  min-height: 60px;
  z-index: 0;
`;