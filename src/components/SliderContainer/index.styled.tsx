import { Column, Row } from "components/Containers";
import styled, { css } from "styled-components";

interface ISliderNavItemProps {
  isActive: boolean;
}

export const SliderItemsWrapper = styled(Row)`
background: ${props => props.theme.colors.primary};
  width: 100%;
  padding: 5px;
`;

export const SliderNavItem = styled(Column) <ISliderNavItemProps>`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.secondaryFaded};
  width: auto; 
  padding: 3px;
    ${props => props.isActive && css`
    color: ${props => props.theme.colors.secondary};
  `};
`;