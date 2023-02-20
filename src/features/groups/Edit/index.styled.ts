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
`;

export const GroupEditBackground = styled(Row)`
  border-radius: 100%;
  background: ${props => props.theme.colors.primary};
  width: 120vw;
  height: 80vw;
  z-index: 0;
  margin-top: -55vw;
  margin-left: -10vw;
`;

export const AddMembersWrapper = styled(Row)`
  margin: 1rem 0 3rem;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const SaveButtonWrapper = styled(Row)`
  margin-top: 1rem;
  margin-bottom: 2rem;
`;
