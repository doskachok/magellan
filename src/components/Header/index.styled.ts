import styled from 'styled-components';

import { Row } from '../Containers';
import { TextHeader } from '../Text';

export const Wrapper = styled(Row)`
  height: 60px;
  width: 100%;
  padding: 0px 20px;
  gap: 20px;
  background: ${props => props.theme.colors.primary};
`;

export const HeaderTextWrapper = styled(TextHeader)`
  display: inline-flex;
  flex: 1;
  justify-content: left;
`

export const LeftActionWrapper = styled.div`
  display: inline-flex;
  justify-content: start;
`

export const RightActionWrapper = styled.div`
  display: inline-flex;
  justify-content: flex-end;
`