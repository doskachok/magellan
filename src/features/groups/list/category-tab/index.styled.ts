import styled, { css } from 'styled-components';

export const CategoryTabWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
`;

interface ICategoryTabProps {
  active?: boolean;
}

export const CategoryText = styled.div<ICategoryTabProps>`
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

export const CategoryUnderline = styled.div<ICategoryTabProps>`
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
