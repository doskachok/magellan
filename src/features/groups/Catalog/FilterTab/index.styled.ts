import styled, { css } from 'styled-components';

export const FilterTabWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
`;

interface IFilterTabProps {
  active?: boolean;
};

export const FilterTabText = styled.div<IFilterTabProps>`
  display: flex;
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 21px;
  ${props => props.active && css`
    color: ${props => props.theme.colors.primary};
  `};
  ${props => !props.active && css`
    color: ${props => props.theme.colors.text.title};
  `};
`;

export const FilterTabUnderline = styled.div<IFilterTabProps>`
  margin-top: 4px;
  height: 3px;
  border-radius: 5px;
  ${props => !props.active && css`
    background: ${props => props.theme.colors.text.border.default};
  `};
  ${props => props.active && css`
    background: ${props => props.theme.colors.primary};
  `};
`;
