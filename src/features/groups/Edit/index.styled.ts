import styled  from 'styled-components';
import { Column, ContentWrapper } from 'components/Containers';
import { TextRegular } from 'components';

export const GroupEditContentWrapper = styled(ContentWrapper)`
  padding-bottom: 3rem;
  width: 100%;
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