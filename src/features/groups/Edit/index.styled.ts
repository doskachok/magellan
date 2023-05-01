import styled  from 'styled-components';
import { Column, Row } from 'components/Containers';
import { TextRegular } from 'components';

export const ContentWrapper = styled(Column)`
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  flex: 1;
`;

export const MainInfoWrapper = styled(Column)`
  z-index: 1;
`;

export const GroupInfoWrapper = styled(Column)`
  background: ${props => props.theme.colors.primary};
  padding: 2rem 1.5rem 0;
  z-index: 1;
`;

export const GroupCurrencyText = styled(TextRegular)`
  color: ${props => props.theme.colors.text.secondary};
  width: 100%;
  margin-top: 23px;
`;

export const AddMembersButtonWrapper = styled(Row)`
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1.5rem;
  margin: 1rem 0 3rem;
`;

export const SaveButtonWrapper = styled(Row)`
  margin-top: 1rem;
  margin-bottom: 2rem;
`;
