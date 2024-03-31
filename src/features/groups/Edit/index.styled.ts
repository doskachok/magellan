import styled, { css } from 'styled-components';
import { Column, ContentWrapper, Row } from 'components/Containers';
import { TextRegular } from 'components';

export const GroupEditContentWrapper = styled(ContentWrapper)`
  padding-bottom: 3rem;
  width: 100%;
`;

export const MainInfoWrapper = styled(Column)`
  z-index: 1;
  scroll-snap-align: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const GroupInfoWrapper = styled(Column)`
  width: 100vw;
  background: ${props => props.theme.colors.primary};
  padding: 2rem 1.5rem 0;
  z-index: 1;
`;

export const GroupControlWrapper = styled(Column)`
  width: 100%;
  align-items: flex-end;
  padding-right: 1rem ;
`;

export const DoubleContainer = styled(Row)`
  flex: 1;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
`;

export const GroupCurrencyText = styled(TextRegular)`
  color: ${props => props.theme.colors.text.secondary};
  width: 100%;
  margin-top: 23px;
`;

export const SliderItemsWrapper = styled(Row)`
background: ${props => props.theme.colors.primary};
  width: 100%;
  padding: 5px;
`;

interface ISliderNavItemProps {
  isActive: boolean;
}

export const SliderNavItem = styled(Column) <ISliderNavItemProps>`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.secondaryFaded};
  width: auto; 
  padding: 3px;
    ${props => props.isActive && css`
    color: ${props => props.theme.colors.secondary};
  `};
`;