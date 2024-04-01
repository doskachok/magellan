import styled from 'styled-components';
import { Column } from 'components/Containers';
import { TextRegular } from 'components';

export const MainInfoWrapper = styled(Column)`
  justify-content: space-between;
  z-index: 1;
  padding-bottom: 1rem;
`;

export const GroupInfoWrapper = styled(Column)`
  width: 100vw;
  background: ${props => props.theme.colors.primary};
  padding: 2rem 1.5rem 1.5rem;
  z-index: 1;
  border-radius: 0px 0px 25px 25px;
`;

export const GroupControlWrapper = styled(Column)`
  width: 100%;
  align-items: flex-end;
  padding-right: 1rem ;
`;

export const GroupCurrencyText = styled(TextRegular)`
  color: ${props => props.theme.colors.text.secondary};
  width: 100%;
  margin-top: 23px;
`;