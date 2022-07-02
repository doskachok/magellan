import styled from 'styled-components';
import {PageContentWrapper} from '../../../components/Containers';
import {TextRegular} from '../../../components/Text';

export const ContentWrapper = styled(PageContentWrapper)`
  padding-top: 60px;
  padding-bottom: 24px;
  flex: 1;
`;

export const RequiredText = styled(TextRegular)`
  & span {
    color: ${props => props.theme.colors.primary};
    padding-right: 4px;
  }
`;
