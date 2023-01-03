import styled, { css } from 'styled-components';
import { Row } from '../Containers';

export interface IImageProps {
  rounded: boolean;
  framed: boolean;
  size: ImageSize
};

export enum ImageSize {
  Small = 0,
  Medium = 1,
  Large = 2,
}

export const ImageStyled = styled(Row)<IImageProps>`
  ${props => props.rounded && css`border-radius: 50%;`}
  ${props => props.framed && css`border: solid 5px white;`}

  & img {
    height: ${props => sizeTranslator(props.size)};
    width: ${props => sizeTranslator(props.size)};
    object-fit: cover;
    ${props => props.rounded && css`border-radius: 50%;`};
  }
`;

function sizeTranslator(size: ImageSize): string {
  switch(size) {
    case ImageSize.Large: return '14rem';
    case ImageSize.Medium: return '7rem';
    case ImageSize.Small: return '3rem';
    default: return '0rem';
  }
}