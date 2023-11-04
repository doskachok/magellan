import { Row } from 'components/Containers';
import styled from 'styled-components';

export const HalfCircle = styled(Row)`
  border-radius: 100%;
  background: ${props => props.theme.colors.primary};
  width: 120vw;
  min-height: 300px;
  z-index: 0;
  margin: -230px 0 0 -10vw;
`;