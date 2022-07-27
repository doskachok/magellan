import styled from 'styled-components';

import { Row } from '../Containers';
import { TextHeader } from '../Text';

export const Wrapper = styled(Row)`
  height: 80px;
  width: 100%;
  padding: 12px;
  background: ${props => props.theme.colors.primary};
`;

export const HeaderTextWrapper = styled(TextHeader)`
  display: inline-flex;
  flex: 4;
  justify-content: center;
`

export const LeftActionWrapper = styled.div`
  display: inline-flex;
  justify-content: start;
  flex: 1;
`

export const RightActionWrapper = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  flex: 1;
`